// import { editWorkspace, saveNewWorkspace } from "@/services/workspaces"
import { IWorkspace, IWorkspaceSlot } from "@/types/workspace"
import { createSlice } from "@reduxjs/toolkit"
import { v4 as uuidv4 } from "uuid"

const INIT_STATE: IWorkspace = {
  openModal: false,
  workspaces: [],
}

export const slice = createSlice({
  name: "workspace",
  initialState: INIT_STATE,
  reducers: {
    setDefaultWorkspace: (state) => {
      const newWorkpsace: IWorkspaceSlot = {
        WorkspaceId: uuidv4(),
        Position: 0,
        Icon: null,
        Title: "My Workspace",
        Color: "primary",
        IsActive: true,
      }
      state.workspaces[0] = newWorkpsace
    },
    setNewWorkspace: (state, action) => {
      if (action?.payload?.workspace) {
        if (action?.payload?.workspace?.WorkspaceId) {
          // Editing workspace
          const pos = state.workspaces.findIndex(
            (e: IWorkspaceSlot) =>
              e?.WorkspaceId === action?.payload?.workspace?.WorkspaceId
          )

          if (pos >= 0) {
            state.workspaces[pos] = {
              ...state.workspaces[pos],
              Icon: action?.payload?.workspace?.Icon,
              Title: action?.payload?.workspace?.Title,
              Color: action?.payload?.workspace?.Color,
            }

            // editWorkspace(state.workspaces[pos])
          }
        } else {
          // Creating new workspace
          const workspaceId = uuidv4()
          const newWorkpsace: IWorkspaceSlot = {
            WorkspaceId: workspaceId,
            Position: state.workspaces.length,
            Icon: action?.payload?.workspace?.Icon,
            Title: action?.payload?.workspace?.Title,
            Color: action?.payload?.workspace?.Color,
            IsActive: true,
          }
          state.workspaces.push(newWorkpsace)
          state.workspaces = changeActiveWorkspace(
            state.workspaces,
            workspaceId
          )
          // saveNewWorkspace(state.workspaces)
        }
      }
    },
    setChangeActivetWorkspace: (state, action) => {
      if (action?.payload?.workspaceId) {
        state.workspaces = changeActiveWorkspace(
          state.workspaces,
          action?.payload?.workspaceId
        )
      }
    },
    getWorkspaces: (state, action) => {
      state.workspaces = action?.payload?.workspaces
    },
    // setRestoreWorkspaces: (state, action) => {
    //   state.workspaces = action.payload.workspaces
    // },
  },
})

export const {
  setDefaultWorkspace,
  setNewWorkspace,
  setChangeActivetWorkspace,
  getWorkspaces,
  // setRestoreWorkspaces,
} = slice.actions

export default slice.reducer

const changeActiveWorkspace = (
  workspaces: IWorkspaceSlot[],
  WorkspaceId: string
) => {
  return workspaces?.map((e: IWorkspaceSlot) => ({
    ...e,
    IsActive: e?.WorkspaceId === WorkspaceId ? true : false,
  }))
}
