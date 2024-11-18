export const APP_ENV =
  process?.env?.NEXT_PUBLIC_ENV === "production" ? "production" : "local"

const BASE_URL = APP_ENV === "production" ? "prod" : "dev"
export const CONFIG_API_AUTH = `https://${BASE_URL}-api.getdme.io/auth`
export const CONFIG_API_USERS = `https://${BASE_URL}-api.getdme.io/users`
export const CONFIG_API_COMPANIES = `https://${BASE_URL}-api.getdme.io/companies`

export const CONFIG_MAX_SPLIT_VIEW: number = 2
export const CONFIG_GLASS_MODE: boolean = false
export const CONFIG_RANDOM_BG: boolean = true
export const CONFIG_WIDTH_WEBVIEW = { min: 30, max: 70 }

/*** PUSHER SOCKET ***/
export const CONFIG_PUSHER_APP_ID = "1885559"
export const CONFIG_PUSHER_KEY = "b380cf526c69ad102443"
export const CONFIG_PUSHER_SECRET = "16102139ebab7c3079b2"
export const CONFIG_PUSHER_CLUSTER = "us2"
