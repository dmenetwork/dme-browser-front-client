export interface ITabsBrowser {
  tabs: ITabsBrowserTab[]
  // splitView: boolean
}

export interface ITabsBrowserTab {
  TabId: string
  WorkspaceId: string | null
  Position: number
  Icon: string | null
  Title: string
  URL: string | null
  NavigateURL: string | null
  IsBookmark: boolean
  IsSecure: boolean
  IsActive: boolean
  IsMiniApp: boolean
  IsMiniAppPinned: boolean
  MiniAppDefaultUrl: string | null
  IsLoading: boolean
  IsReloading: boolean
  Protocol: string | null
  Host: string | null
  BgColor: string | null
  SplitView: ITabsBrowserSplitView | null
  history: ITabsBrowserHistory
  IsLoaded?: boolean
}

export interface ITabsBrowserHistory {
  past: string[]
  present: string
  future: string[]
}

export interface ITabsBrowserSplitView {
  IsMain: boolean
  Position: number
}

export interface Favorites {
  id?: number
  bookmarkId: string
  url: string
  icon: string
  title: string
  IsBookmark: boolean
}

export interface IFavorites {
  favorites: Favorites[]
  bookmarkVisible: boolean
}

export interface IWebViewErrorCodes {
  // Connection Errors (-1 to -10)
  ERR_IO_PENDING: {
    code: -1
    description: string
    category: "CONNECTION"
  }
  ERR_FAILED: {
    code: -2
    description: string
    category: "CONNECTION"
  }
  ERR_ABORTED: {
    code: -3
    description: string
    category: "CONNECTION"
  }
  ERR_INVALID_ARGUMENT: {
    code: -4
    description: string
    category: "CONNECTION"
  }
  ERR_FILE_NOT_FOUND: {
    code: -6
    description: string
    category: "CONNECTION"
  }
  ERR_TIMED_OUT: {
    code: -7
    description: string
    category: "CONNECTION"
  }
  ERR_FILE_TOO_BIG: {
    code: -8
    description: string
    category: "CONNECTION"
  }

  // DNS and Network Errors (-100 to -199)
  ERR_NAME_NOT_RESOLVED: {
    code: -105
    description: string
    category: "DNS"
  }
  ERR_INTERNET_DISCONNECTED: {
    code: -106
    description: string
    category: "NETWORK"
  }
  ERR_ADDRESS_UNREACHABLE: {
    code: -109
    description: string
    category: "NETWORK"
  }
  ERR_NAME_RESOLUTION_FAILED: {
    code: -137
    description: string
    category: "DNS"
  }

  // Security Errors (-200 to -299)
  ERR_CERT_COMMON_NAME_INVALID: {
    code: -200
    description: string
    category: "SECURITY"
  }
  ERR_CERT_DATE_INVALID: {
    code: -201
    description: string
    category: "SECURITY"
  }
  ERR_CERT_AUTHORITY_INVALID: {
    code: -202
    description: string
    category: "SECURITY"
  }
  ERR_BLOCKED_BY_CSP: {
    code: -30
    description: string
    category: "SECURITY"
  }

  // HTTP Errors (-300 to -399)
  ERR_INVALID_URL: {
    code: -300
    description: string
    category: "HTTP"
  }
  ERR_DISALLOWED_URL_SCHEME: {
    code: -301
    description: string
    category: "HTTP"
  }
  ERR_EMPTY_RESPONSE: {
    code: -324
    description: string
    category: "HTTP"
  }
  ERR_BAD_SSL_CLIENT_AUTH_CERT: {
    code: -400
    description: string
    category: "HTTP"
  }

  // Cache Errors (-400 to -499)
  ERR_CACHE_MISS: {
    code: -400
    description: string
    category: "CACHE"
  }
  ERR_CACHE_READ_FAILURE: {
    code: -401
    description: string
    category: "CACHE"
  }

  // Content Errors (-500 to -599)
  ERR_UNSUPPORTED_SCHEME: {
    code: -501
    description: string
    category: "CONTENT"
  }
  ERR_BAD_GATEWAY: {
    code: -502
    description: string
    category: "CONTENT"
  }
  ERR_SERVICE_UNAVAILABLE: {
    code: -503
    description: string
    category: "CONTENT"
  }
  ERR_GATEWAY_TIMEOUT: {
    code: -504
    description: string
    category: "CONTENT"
  }
}
