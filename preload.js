/* eslint-disable @typescript-eslint/no-require-imports */
const { contextBridge, ipcRenderer } = require("electron")
const os = require("os")

contextBridge.exposeInMainWorld("electronAPI", {
  closeWindow: () => ipcRenderer.send("window-control", "close"),
  minimizeWindow: () => ipcRenderer.send("window-control", "minimize"),
  maximizeWindow: () => ipcRenderer.send("window-control", "maximize"),
  isWindowMaximized: () => ipcRenderer.invoke("is-window-maximized"),
  reloadPage: () => ipcRenderer.send("reload-page"),
  osPlatform: os.platform(),
  getCookies: ({ webContentsId, url, cookieName }) =>
    ipcRenderer.invoke("get-cookies", { webContentsId, url, cookieName }),
  getLocalStorage: ({ webContentsId, url, key }) =>
    ipcRenderer.invoke("get-localstorage", { webContentsId, url, key }),
  deleteCookies: ({ webContentsId, url, cookieName }) =>
    ipcRenderer.invoke("delete-cookies", { webContentsId, url, cookieName }),
  deleteLocalStorage: ({ webContentsId, key }) =>
    ipcRenderer.invoke("delete-localstorage", { webContentsId, key }),
  ipcRenderer: {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, listener) => ipcRenderer.on(channel, listener),
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  },
  // bookmarks
  saveBookmark: (bookmarkData) =>
    ipcRenderer.invoke("save-bookmark", bookmarkData),
  deleteBookmark: (bookmarkId) =>
    ipcRenderer.invoke("delete-bookmark", bookmarkId),
  editBookmark: (bookmarkId, newTitle) =>
    ipcRenderer.invoke("edit-bookmark", { bookmarkId, newTitle }),
  getAllBookmarks: () => ipcRenderer.invoke("get-all-bookmarks"),
  // history
  saveHistory: (historyEntry) =>
    ipcRenderer.invoke("save-history", historyEntry),
  getAllHistory: () => ipcRenderer.invoke("get-all-history"),
  deleteAllHistory: () => ipcRenderer.invoke("delete-all-history"),
  updateHistory: (tabId) => ipcRenderer.invoke("update-history", tabId),
  // workspaces
  saveWorkspace: (workspace) => ipcRenderer.invoke("save-workspace", workspace),
  getAllWorkspaces: () => ipcRenderer.invoke("get-all-workspaces"),
  deleteWorkspace: (workspaceId) =>
    ipcRenderer.invoke("delete-workspace", workspaceId),
  editWorkspace: (workspace) => ipcRenderer.invoke("edit-workspace", workspace),
  setActiveWorkspace: (workspaceId) =>
    ipcRenderer.invoke("set-active-workspace", workspaceId),
  // Sessions
  restoreLastSession: () => ipcRenderer.invoke("restore-last-session"),
  saveSession: (tabs) => ipcRenderer.invoke("save-session", { tabs }),
  // onUpdateStatus: (status) => {
  //   ipcRenderer.on("update-status", status)
  // },
  // checkForUpdates: () => ipcRenderer.invoke("check-for-updates"),
  // quitAndInstall: () => ipcRenderer.invoke("quit-and-install"),
})
