import { EventEmitter } from "node:events";
import { readdir, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DEFAULT_SERVER_URL = "https://mcp.atlassian.com/v1/mcp";

function usage() {
  return [
    "Usage:",
    "  node scripts/atlassian-mcp-tool.mjs [--server <url>] [--port <n>] [--host <host>] [--auth-timeout <s>] --list-tools",
    "  node scripts/atlassian-mcp-tool.mjs [--server <url>] [--port <n>] [--host <host>] [--auth-timeout <s>] --list-resources",
    "  node scripts/atlassian-mcp-tool.mjs [--server <url>] [--port <n>] [--host <host>] [--auth-timeout <s>] <toolName> [jsonArgs]",
    "",
    "Examples:",
    "  node scripts/atlassian-mcp-tool.mjs --list-tools",
    "  node scripts/atlassian-mcp-tool.mjs atlassianUserInfo",
    "  node scripts/atlassian-mcp-tool.mjs getConfluencePage '{\"cloudId\":\"site.atlassian.net\",\"pageId\":\"12345\"}'",
  ].join("\n");
}

function parseCli(argv) {
  const options = {
    serverUrl: DEFAULT_SERVER_URL,
    port: null,
    host: null,
    authTimeoutSeconds: null,
    action: "call-tool",
    toolName: null,
    rawArgs: null,
  };

  const positionals = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--help" || arg === "-h") {
      options.action = "help";
      return options;
    }

    if (arg === "--server") {
      options.serverUrl = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--port") {
      options.port = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--host") {
      options.host = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--auth-timeout") {
      options.authTimeoutSeconds = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--list-tools") {
      options.action = "list-tools";
      continue;
    }

    if (arg === "--list-resources") {
      options.action = "list-resources";
      continue;
    }

    positionals.push(arg);
  }

  if (options.action === "call-tool") {
    options.toolName = positionals[0] ?? null;
    options.rawArgs = positionals[1] ?? null;
  }

  return options;
}

async function resolveMcpRemoteChunk() {
  const npxRoot = path.join(os.homedir(), ".npm", "_npx");
  const cacheEntries = await readdir(npxRoot, { withFileTypes: true });
  const candidates = [];

  for (const entry of cacheEntries) {
    if (!entry.isDirectory()) continue;

    const packagePath = path.join(
      npxRoot,
      entry.name,
      "node_modules",
      "mcp-remote",
      "package.json",
    );

    try {
      const packageJson = JSON.parse(await readFile(packagePath, "utf8"));
      const distPath = path.join(path.dirname(packagePath), "dist");
      const distEntries = await readdir(distPath);
      const chunkFile = distEntries.find(
        (file) => file.startsWith("chunk-") && file.endsWith(".js"),
      );

      if (!chunkFile) continue;

      candidates.push({
        version: packageJson.version ?? "0.0.0",
        chunkPath: path.join(distPath, chunkFile),
        cacheKey: entry.name,
      });
    } catch {
      // Ignore unrelated npx cache entries.
    }
  }

  if (candidates.length === 0) {
    throw new Error("No local mcp-remote installation found under ~/.npm/_npx");
  }

  candidates.sort((left, right) => right.version.localeCompare(left.version));
  return candidates[0];
}

let mcpRemoteModulePromise;

async function loadMcpRemote() {
  if (!mcpRemoteModulePromise) {
    mcpRemoteModulePromise = (async () => {
      const resolved = await resolveMcpRemoteChunk();
      const moduleUrl = pathToFileURL(resolved.chunkPath).href;
      const module = await import(moduleUrl);
      return { ...module, resolved };
    })();
  }

  return mcpRemoteModulePromise;
}

async function createClient(options) {
  const {
    Client,
    NodeOAuthClientProvider,
    connectToRemoteServer,
    createLazyAuthCoordinator,
    discoverOAuthServerInfo,
    parseCommandLineArgs,
    version,
    resolved,
  } = await loadMcpRemote();

  const remoteArgs = [options.serverUrl];

  if (options.port) {
    remoteArgs.push(String(options.port));
  }

  if (options.host) {
    remoteArgs.push("--host", options.host);
  }

  if (options.authTimeoutSeconds) {
    remoteArgs.push("--auth-timeout", String(options.authTimeoutSeconds));
  }

  const parsed = await parseCommandLineArgs(remoteArgs, usage());
  const events = new EventEmitter();
  const authCoordinator = createLazyAuthCoordinator(
    parsed.serverUrlHash,
    parsed.callbackPort,
    events,
    parsed.authTimeoutMs,
  );
  const discoveryResult = await discoverOAuthServerInfo(
    options.serverUrl,
    parsed.headers,
  );
  const authProvider = new NodeOAuthClientProvider({
    serverUrl: discoveryResult.authorizationServerUrl,
    callbackPort: parsed.callbackPort,
    host: parsed.host,
    clientName: "Codex Atlassian MCP Client",
    staticOAuthClientMetadata: parsed.staticOAuthClientMetadata,
    staticOAuthClientInfo: parsed.staticOAuthClientInfo,
    serverUrlHash: parsed.serverUrlHash,
    authorizationServerMetadata: discoveryResult.authorizationServerMetadata,
    protectedResourceMetadata: discoveryResult.protectedResourceMetadata,
    wwwAuthenticateScope: discoveryResult.wwwAuthenticateScope,
  });

  const client = new Client(
    { name: "codex-atlassian-mcp", version },
    { capabilities: {} },
  );

  let callbackServer = null;
  const authInitializer = async () => {
    const authState = await authCoordinator.initializeAuth();
    callbackServer = authState.server;
    return {
      waitForAuthCode: authState.waitForAuthCode,
      skipBrowserAuth: authState.skipBrowserAuth,
    };
  };

  await connectToRemoteServer(
    client,
    options.serverUrl,
    authProvider,
    parsed.headers,
    authInitializer,
    parsed.transportStrategy,
  );

  return {
    client,
    resolved,
    async close() {
      await client.close();
      if (callbackServer) {
        callbackServer.close();
      }
    },
  };
}

function parseJsonArgs(rawArgs) {
  if (!rawArgs) return {};

  try {
    return JSON.parse(rawArgs);
  } catch (error) {
    throw new Error(
      `Invalid JSON arguments: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

function unwrap(result) {
  if (!result) return result;

  if (Array.isArray(result.content)) {
    if (result.content.length === 1 && result.content[0]?.type === "text") {
      const text = result.content[0].text;
      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    }

    return result.content;
  }

  return result;
}

function formatError(error) {
  if (error?.code === "EPERM" && error?.syscall === "listen") {
    return [
      `OAuth callback bind blocked on ${error.address}:${error.port}.`,
      "This usually means the process is running inside a sandbox that disallows opening local listener ports.",
      "Run the helper outside the sandbox or with elevated permissions.",
    ].join(" ");
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

async function main() {
  const options = parseCli(process.argv.slice(2));

  if (options.action === "help") {
    console.log(usage());
    return;
  }

  if (options.action === "call-tool" && !options.toolName) {
    console.error(usage());
    process.exit(1);
  }

  const { client, close, resolved } = await createClient(options);

  try {
    if (options.action === "list-tools") {
      const response = await client.listTools();
      console.log(JSON.stringify({
        serverUrl: options.serverUrl,
        mcpRemoteVersion: resolved.version,
        mcpRemoteCacheKey: resolved.cacheKey,
        tools: response.tools,
      }, null, 2));
      return;
    }

    if (options.action === "list-resources") {
      const response = await client.listResources();
      console.log(JSON.stringify({
        serverUrl: options.serverUrl,
        mcpRemoteVersion: resolved.version,
        mcpRemoteCacheKey: resolved.cacheKey,
        resources: response.resources,
      }, null, 2));
      return;
    }

    const response = await client.callTool({
      name: options.toolName,
      arguments: parseJsonArgs(options.rawArgs),
    });
    console.log(JSON.stringify(unwrap(response), null, 2));
  } finally {
    await close();
  }
}

main().catch((error) => {
  console.error(formatError(error));
  process.exit(1);
});
