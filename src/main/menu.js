const { app, Menu } = require("electron");

const { checkForUpdatesManually } = require("./updater");

function buildAppMenu() {
  const isMac = process.platform === "darwin";

  const checkForUpdatesItem = {
    label: "Check for Updates…",
    click: () => checkForUpdatesManually(),
  };

  const template = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" },
              checkForUpdatesItem,
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideOthers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
            ],
          },
        ]
      : []),
    { role: "editMenu" },
    { role: "viewMenu" },
    { role: "windowMenu" },
    {
      role: "help",
      submenu: isMac ? [] : [checkForUpdatesItem],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

module.exports = { buildAppMenu };
