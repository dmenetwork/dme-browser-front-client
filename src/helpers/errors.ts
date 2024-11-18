import { IWebViewErrorCodes } from "@/types/tabsBrowser"

// Implementation example
const WebViewErrors: IWebViewErrorCodes = {
  ERR_IO_PENDING: {
    code: -1,
    description: "An I/O operation is pending",
    category: "CONNECTION",
  },
  ERR_FAILED: {
    code: -2,
    description: "A generic failure occurred",
    category: "CONNECTION",
  },
  ERR_ABORTED: {
    code: -3,
    description: "Operation was aborted",
    category: "CONNECTION",
  },
  ERR_INVALID_ARGUMENT: {
    code: -4,
    description: "An invalid argument was provided",
    category: "CONNECTION",
  },
  ERR_FILE_NOT_FOUND: {
    code: -6,
    description: "The requested file was not found",
    category: "CONNECTION",
  },
  ERR_TIMED_OUT: {
    code: -7,
    description: "The operation timed out",
    category: "CONNECTION",
  },
  ERR_FILE_TOO_BIG: {
    code: -8,
    description: "The file is too large",
    category: "CONNECTION",
  },
  ERR_NAME_NOT_RESOLVED: {
    code: -105,
    description: "The host name could not be resolved",
    category: "DNS",
  },
  ERR_INTERNET_DISCONNECTED: {
    code: -106,
    description: "The Internet connection has been lost",
    category: "NETWORK",
  },
  ERR_ADDRESS_UNREACHABLE: {
    code: -109,
    description: "The IP address is unreachable",
    category: "NETWORK",
  },
  ERR_NAME_RESOLUTION_FAILED: {
    code: -137,
    description: "DNS name resolution failed",
    category: "DNS",
  },
  ERR_CERT_COMMON_NAME_INVALID: {
    code: -200,
    description: "The SSL certificate common name is invalid",
    category: "SECURITY",
  },
  ERR_CERT_DATE_INVALID: {
    code: -201,
    description: "The SSL certificate has expired or is not yet valid",
    category: "SECURITY",
  },
  ERR_CERT_AUTHORITY_INVALID: {
    code: -202,
    description: "The SSL certificate authority is invalid",
    category: "SECURITY",
  },
  ERR_BLOCKED_BY_CSP: {
    code: -30,
    description: "The request was blocked by Content Security Policy",
    category: "SECURITY",
  },
  ERR_INVALID_URL: {
    code: -300,
    description: "The URL is invalid",
    category: "HTTP",
  },
  ERR_DISALLOWED_URL_SCHEME: {
    code: -301,
    description: "The URL scheme is not allowed",
    category: "HTTP",
  },
  ERR_EMPTY_RESPONSE: {
    code: -324,
    description: "The server returned an empty response",
    category: "HTTP",
  },
  ERR_BAD_SSL_CLIENT_AUTH_CERT: {
    code: -400,
    description: "The SSL client certificate is invalid",
    category: "HTTP",
  },
  ERR_CACHE_MISS: {
    code: -400,
    description: "The resource was not found in cache",
    category: "CACHE",
  },
  ERR_CACHE_READ_FAILURE: {
    code: -401,
    description: "Error reading from cache",
    category: "CACHE",
  },
  ERR_UNSUPPORTED_SCHEME: {
    code: -501,
    description: "The URL scheme is not supported",
    category: "CONTENT",
  },
  ERR_BAD_GATEWAY: {
    code: -502,
    description: "The server returned a bad gateway error",
    category: "CONTENT",
  },
  ERR_SERVICE_UNAVAILABLE: {
    code: -503,
    description: "The service is unavailable",
    category: "CONTENT",
  },
  ERR_GATEWAY_TIMEOUT: {
    code: -504,
    description: "The gateway timed out",
    category: "CONTENT",
  },
}

// Type for error categories
type WebViewErrorCategory =
  | "CONNECTION"
  | "DNS"
  | "NETWORK"
  | "SECURITY"
  | "HTTP"
  | "CACHE"
  | "CONTENT"

// Helper function to get error by code
export const getErrorWebviewByCode = (
  code: number
): (typeof WebViewErrors)[keyof typeof WebViewErrors] => {
  return Object.values(WebViewErrors).find((error) => error.code === code)
}

// Helper function to get errors by category
export const getErrorWebviewByCategory = (
  category: WebViewErrorCategory
): (typeof WebViewErrors)[keyof typeof WebViewErrors][] => {
  return Object.values(WebViewErrors).filter(
    (error) => error.category === category
  )
}
