export interface IWorkspace {
  openModal: boolean
  workspaces: IWorkspaceSlot[]
}

export interface IWorkspaceSlot {
  WorkspaceId: string
  Position: number
  Icon: string | null
  Title: string
  Color:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "inherit"
    | "dark"
  IsActive: boolean | number
}
