import path from "node:path";
import { app, BrowserWindow } from "electron";

app.setName("Adjourn");

let win: BrowserWindow | null = null;

function createWindow() {
  const isMac = process.platform === "darwin";

  win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Adjourn",
    ...(isMac
      ? {
          titleBarStyle: "hidden",
          trafficLightPosition: { x: 21, y: 21 },
        }
      : {}),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Always load the server URL (dev or prod)
  win.loadURL("http://localhost:3000");
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  createWindow();
});
