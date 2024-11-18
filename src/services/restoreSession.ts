import { ITabsBrowserTab } from "@/types/tabsBrowser"
// import { IWorkspaceSlot } from "@/types/workspace"

export const restoreSession = async (): Promise<{
  success: boolean
  // workspaces?: IWorkspaceSlot[]
  tabs?: ITabsBrowserTab[]
  error?: Error
}> => {
  try {
    if (window?.electronAPI) {
      const { tabs } = await window.electronAPI.restoreLastSession()
      return { success: true, tabs }
    } else {
      throw new Error("La API de Electron no está disponible.")
    }
  } catch (error) {
    console.error("Error al restaurar la sesión:", error)
    return { success: false, error: error as Error }
  }
}
