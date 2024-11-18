import { IHistory } from "@/types/allHistory"

export const handleDeleteAllHistory = async () => {
  try {
    if (window?.electronAPI) {
      const result = await window.electronAPI.deleteAllHistory()
      if (result.success) {
        console.log("Historial eliminado exitosamente:", result)
        return true
      } else {
        console.error("Error al eliminar el historial:", result.error)
        return false
      }
    } else {
      throw new Error("La API de Electron no está disponible.")
    }
  } catch (error) {
    console.error("Error en handleDeleteAllHistory:", error)
    return false
  }
}

export const handleGetAllHistory = async (): Promise<{
  success: boolean
  allHistory?: IHistory[]
  error?: Error
}> => {
  try {
    if (window?.electronAPI && window?.electronAPI?.getAllHistory) {
      const result = await window.electronAPI.getAllHistory()
      if (result.success) {
        return result
      } else {
        console.error("Error al obtener el historial:", result.error)
        return {
          success: false,
          error: new Error("Error al obtener el historial"),
        }
      }
    } else {
      throw new Error("La API de Electron no está disponible.")
    }
  } catch (error) {
    console.error("Error en handleGetAllHistory:", error)
    return {
      success: false,
      error: new Error("Error al obtener el historial"),
    }
  }
}

export const handleSaveHistory = async (historyEntry: IHistory) => {
  try {
    if (window?.electronAPI) {
      await window.electronAPI.saveHistory(historyEntry)
    } else {
      throw new Error("La API de Electron no está disponible.")
    }
  } catch (error) {
    console.error("Error en saveHistoryEntry:", error)
  }
}

export const saveHistoryEntry = async (historyEntry: IHistory) => {
  try {
    await handleSaveHistory(historyEntry)
  } catch (error) {
    console.error("Error saving history entry:", error)
  }
}

export const handleUpdateCloseTabHistory = async (TabId: string) => {
  try {
    if (window?.electronAPI) {
      const result = await window.electronAPI.updateHistory(TabId)
      if (result.success) {
        console.log("Historial actualizado exitosamente:", result)
        return true
      } else {
        console.error("Error al actualizar el historial:", result.error)
        return false
      }
    } else {
      throw new Error("La API de Electron no está disponible.")
    }
  } catch (error) {
    console.error("Error en handleUpdateCloseTabHistory:", error)
    return false
  }
}
