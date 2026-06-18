const { app, BrowserWindow } = require("electron");

const { checkOrchestratorUpdates } = require("./main/orchestrator");
const { createWindow } = require("./main/window");
const { initializeFirstStartSettings, loadSettingsIntoState } = require("./main/settings");
const { getTmuxStatus } = require("./main/tmux");
const { registerIpcHandlers } = require("./main/ipc");
const { buildAppMenu } = require("./main/menu");
const { setupAutoUpdater, checkForUpdatesOnLaunch } = require("./main/updater");

app.whenReady().then(() => {
  loadSettingsIntoState();
  initializeFirstStartSettings(getTmuxStatus);
  registerIpcHandlers();
  setupAutoUpdater();
  buildAppMenu();

  createWindow();
  checkOrchestratorUpdates();
  checkForUpdatesOnLaunch();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
      checkOrchestratorUpdates();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
