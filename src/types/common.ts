import { ReactElement } from "react"

export interface ICommon {
  globalNotification: ICommonNotification[]
  globalBackdrop: ICommonBackdrop
  conflictingUrl: ICommonConflictingUrl[]
  globalLoading: boolean
  reduxTheme: "light" | "dark"
  errorUrl: IErrorUrl | undefined
}

export interface IErrorUrl {
  code?: number
  description?: string
  category?: string
}

export interface ICommonNotification {
  isOpen: boolean
  severity?: "error" | "info" | "success" | "warning"
  variant?: "standard" | "outlined" | "filled"
  message?: string | ReactElement
}

export interface ICommonBackdrop {
  isOpen: boolean
  loading: boolean
  body: string | ReactElement | null
}

export interface ICommonConflictingUrl {
  matchUrl: string
  redirectUrl: string
}

export type IPlatformOS = "WINDOWS" | "MAC" | "LINUX" | null

export type Feature = {
  name: string
  url: string
  icon: string
}

type VariantOptions =
  | "primary"
  | "secondary"
  | "error"
  | "warning"
  | "info"
  | "success"

export type INotificationsInNewTab = {
  Id: number
  Icon: string
  Title: string
  Message: string
  Variant: VariantOptions
  Cta: React.JSX.Element | undefined
}
