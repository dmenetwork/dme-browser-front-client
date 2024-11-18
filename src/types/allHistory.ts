export interface IHistory {
  tabId: string
  workspaceId: string | null
  title: string
  url: string
  icon: string | null
  date?: string
  updatedAt?: string
  createdAt?: string
}

export interface IAllHistory {
  allHistory: IHistory[]
  historyToInput: IHistory[]
}
