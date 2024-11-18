import { IWorkspaceSlot } from "@/types/workspace"

export const loadAllWorkspaces = async (): Promise<{
  success: boolean
  workspaces?: IWorkspaceSlot[]
  error?: unknown
}> => {
  try {
    const { workspaces } = await window.electronAPI.getAllWorkspaces()
    // Mapear los workspaces para convertir IsActive de 1/0 a true/false
    const formattedWorkspaces: IWorkspaceSlot[] = workspaces?.map(
      (workspace) => ({
        ...workspace,
        IsActive: workspace.IsActive === 1 ? true : false, // Convertir 1/0 a true/false
      })
    )

    return { success: true, workspaces: formattedWorkspaces }
  } catch (error) {
    console.error("Error al obtener los workspaces:", error)
    return { success: false, error }
  }
}

export const saveNewWorkspace = async (workspace: IWorkspaceSlot[]) => {
  try {
    await window.electronAPI.saveWorkspace(workspace)
    return { success: true }
  } catch (error) {
    console.error("Error al guardar el workspace:", error)
    return { success: false, error }
  }
}

export const editWorkspace = async (
  workspace: IWorkspaceSlot
): Promise<{
  success: boolean
  changes?: number
  error?: unknown
}> => {
  try {
    const result = await window.electronAPI.editWorkspace(workspace)
    return { success: true, changes: result.changes }
  } catch (error) {
    console.error("Error al editar el workspace:", error)
    return { success: false, error }
  }
}
