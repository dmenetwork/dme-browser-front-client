import { IAuth } from "@/types/auth"
import { ICommon } from "@/types/common"
import { IFavorites, ITabsBrowser } from "@/types/tabsBrowser"
import { IWorkspace } from "@/types/workspace"
import { IAllHistory } from "@/types/allHistory"

export interface IRedux {
  auth: IAuth
  common: ICommon
  tabsBrowser: ITabsBrowser
  bookmark: IFavorites
  workspace: IWorkspace
  allHistory: IAllHistory
}
