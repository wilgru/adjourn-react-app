import crypto from "node:crypto";
import path from "node:path";
import { app, utilityProcess, type UtilityProcess } from "electron";
import log from "electron-log";
import getPort from "get-port";

export function generateSecret(): string {
  return crypto.randomBytes(32).toString("hex");
}

let nitroProcess: UtilityProcess | null = null;

export async function startServer(): Promise<number> {
  const isDev = !app.isPackaged;

  if (isDev) {
    // In development, vite runs its own dev server on port 3000
    // We don't start a server here, just return the port where the dev server is running
    return 3000;
  }

  // Get available port for production, preferring 3000
  const serverPort = await getPort({ port: 3000 });

  // Production: Start embedded Nitro server as utility process
  const workerPath = path.join(__dirname, "nitro-worker.js");
  const serverDir = path.join(process.resourcesPath, "dist-cloud", "server");

  // See Nitro Node.js Runtime docs for how to use the server built by web-ui/
  // https://nitro.build/deploy/runtimes/node
  nitroProcess = utilityProcess.fork(workerPath, [], {
    env: {
      ...process.env,
      NODE_ENV: "production",
      NITRO_PORT: serverPort.toString(),
      NITRO_HOST: "127.0.0.1",
      NITRO_SERVER_DIR: serverDir,
    },
    stdio: "pipe",
  });

  // Pipe stdout/stderr to electron-log
  nitroProcess.stdout?.on("data", (data: Buffer) => {
    const str = data.toString().trim();
    if (str) log.info("[nitro]", str);
  });

  nitroProcess.stderr?.on("data", (data: Buffer) => {
    const str = data.toString().trim();
    if (str) log.error("[nitro]", str);
  });

  nitroProcess.on("spawn", () => {
    log.info("[nitro] Utility process spawned");
  });

  nitroProcess.on("exit", (code) => {
    log.info(`[nitro] Process exited with code ${code}`);
    nitroProcess = null;
  });

  await waitForServer();

  log.info(`Nitro server started on 127.0.0.1:${serverPort}`);
  return serverPort;
}

async function waitForServer(): Promise<void> {
  // TODO: Replace with health API check (e.g., /health endpoint)
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
}

export async function stopServer(): Promise<void> {
  if (nitroProcess) {
    nitroProcess.kill();
    nitroProcess = null;
  }
}
