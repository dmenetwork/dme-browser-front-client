import { IHistory } from "./allHistory"
import { Favorites } from "./tabsBrowser"
import { IWorkspaceSlot } from "./workspace"
import { ITabsBrowserTab } from "./tabsBrowser"

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ElectronAPI {
  closeWindow: () => void
  minimizeWindow: () => void
  maximizeWindow: () => void
  isWindowMaximized: () => Promise<boolean>
  reloadPage: () => void
  osPlatform: string
  getCookies: ({
    webContentsId,
    url,
    cookieName,
  }: {
    webContentsId?: number
    url?: string
    cookieName?: string
  }) => Promise<any>
  getLocalStorage: ({
    webContentsId,
    url,
    key,
  }: {
    webContentsId?: number
    url?: string
    key?: string
  }) => Promise<any>
  deleteCookies: ({
    webContentsId,
    url,
    cookieName,
  }: {
    webContentsId?: number
    url?: string
    cookieName?: string
  }) => Promise<any>
  deleteLocalStorage: ({
    webContentsId,
    key,
  }: {
    webContentsId?: number
    key?: string
  }) => Promise<any>
  ipcRenderer: {
    send(channel: string, ...args: any[]): void
    on: (
      channel: string,
      listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
    ) => void
    removeAllListeners: (channel: string) => void
  }
  getDbPath: () => string
  saveBookmark: (bookmarkData: {
    bookmarkId: string
    url: string
    icon: string | null
    title: string
    isBookmark: boolean
  }) => Promise<{
    success: boolean
    id?: number
    bookmarkId?: string
    error?: Error
  }>
  editBookmark: (
    bookmarkId: string,
    newTitle: string
  ) => Promise<{ success: boolean; message?: string; error?: Error }>
  deleteBookmark: (
    bookmarkId: string
  ) => Promise<{ success: boolean; error?: Error }>
  getAllBookmarks: () => Promise<{
    success: boolean
    bookmarks?: Favorites[]
    error?: Error
  }>
  saveHistory: ({
    tabId: string,
    workspaceId: string,
    icon: string,
    url: string,
    title: string,
  }) => Promise<{
    success: boolean
    lastID?: number
    error?: Error
  }>
  getAllHistory: () => Promise<{
    success: boolean
    allHistory?: IHistory[]
    error?: Error
  }>
  deleteAllHistory: () => Promise<{
    success: boolean
    error?: Error
  }>
  updateHistory: (tabId: string) => Promise<{
    success: boolean
    message?: string
    error?: Error
  }>
  getAllWorkspaces: () => Promise<{
    success: boolean
    workspaces: IWorkspaceSlot[]
    error?: Error
  }>
  saveWorkspace: (workspace: IWorkspaceSlot[]) => Promise<{
    success: boolean
    workspaceId?: string
    error?: Error
  }>
  editWorkspace: (workspace: IWorkspaceSlot) => Promise<{
    success: boolean
    changes?: number
    error?: Error
  }>
  restoreLastSession: () => Promise<{
    // workspaces: IWorkspaceSlot[]
    tabs: ITabsBrowserTab[]
  }>
  saveSession: (tabs: ITabsBrowserTab[]) => void

  // onUpdateStatus: (callback: (status: string) => void) => void
  // checkForUpdates: () => Promise<void>
  // quitAndInstall: () => Promise<void>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}
