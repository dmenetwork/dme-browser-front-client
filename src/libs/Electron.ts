import { ITabsBrowserTab } from "@/types/tabsBrowser"

export const closeWindow = () => {
  try {
    if (window?.electronAPI) {
      window.electronAPI.closeWindow()
    }
  } catch (err) {
    console.error(err)
  }
}

export const minimizeWindow = () => {
  try {
    if (window?.electronAPI) {
      window.electronAPI.minimizeWindow()
    }
  } catch (err) {
    console.error(err)
  }
}

export const maximizeWindow = () => {
  try {
    if (window?.electronAPI) {
      window.electronAPI.maximizeWindow()
    }
  } catch (err) {
    console.error(err)
  }
}

export const isWindowMaximized = async () => {
  try {
    if (window?.electronAPI) {
      return await window.electronAPI.isWindowMaximized()
    }
  } catch (err) {
    console.error(err)
  }
  return false
}

export const getOsPlatform = (): "WINDOWS" | "MAC" | "LINUX" | null => {
  try {
    if (window?.electronAPI) {
      const os = window.electronAPI.osPlatform
      if (os === "win32") {
        return "WINDOWS"
      } else if (os === "darwin") {
        return "MAC"
      } else {
        return "LINUX"
      }
    }
  } catch (err) {
    console.error(err)
  }
  return null
}

export const getCookies = async ({
  webContentsId,
  url,
  cookieName,
}: {
  webContentsId?: number
  url?: string
  cookieName?: string
} = {}) => {
  try {
    if (window?.electronAPI) {
      const cookies = await window.electronAPI.getCookies({
        webContentsId,
        url,
        cookieName,
      })
      return cookies
    }
  } catch (err) {
    console.error(err)
  }
}

export const getLocalStorage = async ({
  webContentsId,
  url,
  key,
}: {
  webContentsId?: number
  url?: string
  key?: string
} = {}) => {
  try {
    if (window?.electronAPI) {
      const ls = await window.electronAPI.getLocalStorage({
        webContentsId,
        url,
        key,
      })
      return ls
    }
  } catch (err) {
    console.error(err)
  }
}

export const deleteCookies = async ({
  webContentsId,
  url,
  cookieName,
}: {
  webContentsId?: number
  url?: string
  cookieName?: string
} = {}) => {
  try {
    if (window?.electronAPI) {
      const result = await window.electronAPI.deleteCookies({
        webContentsId,
        url,
        cookieName,
      })
      return result
    }
  } catch (err) {
    console.error(err)
  }
}

export const deleteLocalStorage = async ({
  webContentsId,
  key,
}: {
  webContentsId?: number
  key?: string
} = {}) => {
  try {
    if (window?.electronAPI) {
      window.electronAPI.deleteLocalStorage({ webContentsId, key })
    }
  } catch (err) {
    console.error(err)
  }
}

export const saveSession = async (tabs: ITabsBrowserTab[]) => {
  try {
    if (window?.electronAPI) {
      // Invoca el método para guardar la sesión en Electron
      window.electronAPI.saveSession(tabs)
    } else {
      throw new Error("La API de Electron no está disponible.")
    }
  } catch (err) {
    console.error("Error al guardar la sesión:", err)
  }
}
