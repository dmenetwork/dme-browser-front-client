import { Favorites } from "@/types/tabsBrowser"

export const getAllBookmarks = async (): Promise<{
  success: boolean
  bookmarks?: Favorites[]
  error?: Error
}> => {
  try {
    if (window?.electronAPI && window?.electronAPI?.getAllBookmarks) {
      const result = await window.electronAPI.getAllBookmarks()
      return result
    } else {
      throw new Error("La API de Electron no está disponible.")
    }
  } catch (error) {
    console.error("Error en getAllBookmarks:", error)
    return { success: false, error: error as Error }
  }
}

export const saveBookmark = async (bookmarkData: {
  bookmarkId: string
  url: string
  icon: string
  title: string
  isBookmark: boolean
}) => {
  try {
    if (window?.electronAPI) {
      const result = await window.electronAPI.saveBookmark(bookmarkData)
      return result
    } else {
      throw new Error("La API de Electron no está disponible.")
    }
  } catch (error) {
    console.error("Error en saveBookmark:", error)
    return { success: false, error: error }
  }
}

export const handleEditBookmarkInDb = async (
  bookmarkId: string,
  newTitle: string
) => {
  try {
    if (window?.electronAPI) {
      const result = await window.electronAPI.editBookmark(bookmarkId, newTitle)
      if (result.success) {
        return result
      } else {
        throw new Error("Error desconocido al editar el bookmark.")
      }
    } else {
      throw new Error("La API de Electron no está disponible.")
    }
  } catch (error) {
    console.error("Error en handleEditBookmarkInDb:", error)
    throw error
  }
}

export const handleDeleteBookmarkInDb = async (bookmarkId: string) => {
  try {
    if (window?.electronAPI) {
      const result = await window.electronAPI.deleteBookmark(bookmarkId)
      if (result.success) {
        return result
      } else {
        throw new Error("Error desconocido al eliminar el bookmark.")
      }
    } else {
      throw new Error("La API de Electron no está disponible.")
    }
  } catch (error) {
    console.error("Error en handleDeleteBookmarkInDb:", error)
    throw error
  }
}
