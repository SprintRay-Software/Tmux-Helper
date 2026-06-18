const { app, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");

// Tracks whether the in-flight check was started from the menu so we only
// surface "you're up to date" / error dialogs for user-initiated checks.
let manualCheck = false;

function setupAutoUpdater() {
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on("update-not-available", () => {
    if (manualCheck) {
      dialog.showMessageBox({
        type: "info",
        message: "You're up to date",
        detail: `Tmux Helper ${app.getVersion()} is the latest version.`,
      });
    }
    manualCheck = false;
  });

  autoUpdater.on("update-downloaded", (info) => {
    dialog
      .showMessageBox({
        type: "info",
        buttons: ["Restart now", "Later"],
        defaultId: 0,
        cancelId: 1,
        message: "Update ready to install",
        detail: `Tmux Helper ${info.version} has been downloaded. Restart to apply it.`,
      })
      .then(({ response }) => {
        if (response === 0) autoUpdater.quitAndInstall();
      });
    manualCheck = false;
  });

  autoUpdater.on("error", (error) => {
    if (manualCheck) {
      dialog.showMessageBox({
        type: "error",
        message: "Update check failed",
        detail: String(error && error.message ? error.message : error),
      });
    }
    manualCheck = false;
  });
}

function checkForUpdatesOnLaunch() {
  if (!app.isPackaged) return;
  manualCheck = false;
  autoUpdater.checkForUpdates().catch(() => {});
}

function checkForUpdatesManually() {
  if (!app.isPackaged) {
    dialog.showMessageBox({
      type: "info",
      message: "Updates are unavailable in development",
      detail: "Run a packaged build to check for updates.",
    });
    return;
  }
  manualCheck = true;
  autoUpdater.checkForUpdates().catch(() => {});
}

module.exports = { setupAutoUpdater, checkForUpdatesOnLaunch, checkForUpdatesManually };
