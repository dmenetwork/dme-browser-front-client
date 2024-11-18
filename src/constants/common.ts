import { Feature, ICommonConflictingUrl } from "@/types/common"
import {
  IMAGE_TEAMS,
  IMAGE_TELEGRAM,
  IMAGE_WHITEBOARD,
  IMAGE_X,
  IMAGE_YOUTUBE,
} from "@/constants/img"
import { Favorites } from "@/types/tabsBrowser"

export const COMMON_APP_NAME = "dME Browser"
export const COMMON_LIGHT_THEME = "light"
export const COMMON_DARK_THEME = "dark"
export const COMMON_DEFAULT_BROWSER_URL = "https://dme.network/"
export const COMMON_NEW_TAB_TITLE = "Home "
export const COMMON_IGNORE_CLICK_AWAY = "ignore-click-away"

// DONT CHANGE THIS!!! IF U CHANGE, U MUST CHANGE API TOO
export const COMMON_ENCRYPT_KEY = "a5ac3c2025fcbc1ee29b3f94ee45f074"

export const COMMON_CONFLICTING_URL: ICommonConflictingUrl[] = [
  {
    matchUrl: "https://teams.microsoft.com/_",
    redirectUrl: "https://teams.microsoft.com/v2",
  },
]

export const features: Feature[] = [
  {
    name: "Telegram",
    url: "https://web.telegram.org/a/",
    icon: IMAGE_TELEGRAM,
  },
  {
    name: "X",
    url: "https://x.com/?lang=es",
    icon: IMAGE_X,
  },
  {
    name: "GitHub",
    url: "https://www.github.com",
    icon: "https://github.githubassets.com/favicons/favicon.png",
  },
  {
    name: "Vercel",
    url: "https://vercel.com/",
    icon: "https://seeklogo.com/images/V/vercel-logo-F748E39008-seeklogo.com.png",
  },
  {
    name: "Stack Overflow",
    url: "https://www.stackoverflow.com",
    icon: "https://cdn.sstatic.net/Sites/stackoverflow/img/favicon.ico",
  },
]

export const favoritesToShow: Favorites[] = [
  {
    bookmarkId: "22BB",
    url: "https://www.youtube.com",
    icon: IMAGE_YOUTUBE,
    title: "YouTube",
    IsBookmark: true,
  },
  {
    bookmarkId: "44DD",
    url: "https://www.linkedin.com",
    icon: "https://www.linkedin.com/favicon.ico",
    title: "LinkedIn",
    IsBookmark: false,
  },
]

export const NotificationColors: { [key: string]: string } = {
  info: "#17a2b8",
  warning: "#ffc107",
  success: "#28a745",
  error: "#dc3545",
}

export const microsoftApps: Feature[] = [
  {
    name: "Microsoft 365",
    url: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=4765445b-32c6-49b0-83e6-1d93765276ca&redirect_uri=https%3A%2F%2Fwww.microsoft365.com%2Flandingv2&response_type=code%20id_token&scope=openid%20profile%20https%3A%2F%2Fwww.office.com%2Fv2%2FOfficeHome.All&response_mode=form_post&nonce=638657300402346632.NzI0NWY5NTktNDk1Zi00MmZmLThlZTQtYjY1OTMwMDZjZmQ4MDM0NDUzZjYtMWU3Mi00NTMyLWIwZDUtZjk2NTI0YjM3N2Rj&ui_locales=es-419&mkt=es-419&client-request-id=13fdbb56-5570-4db6-84fb-d23759ac7880&state=B2oZ7NYhV-rVz678Nxx5U_v3A2lOivS9sgP0zn2vfhg3u85QsmBd2ic_eSmDqXbFTOxpEL8tp12eVapCqjXosmHxqRheRbKStnEVnrurN-UpzkVQsPIeGMFQkjuWoms3fDd-XidP838JoLfzpba9TYQFHTyuCkEE3pntj9HxvrfkGhpvNq9VhUrGrEoi5k96XVFt-7w3hxcbitblxuCV0rBq1KgfJBv8O2C4OGJlh7n3KfB5BpjeHD4VHrXBRtel8_6mVzEVKgrjAj7hLBkk-oSjfDmbUiib23KYXzY_8bCOx1IMDbWUxrRFY9RxBIT-&x-client-SKU=ID_NET8_0&x-client-ver=7.5.1.0",
    icon: "https://res.cdn.office.net/officehub/images/content/images/favicon_m365-31d62b976c.ico",
  },
  {
    name: "Teams",
    url: "https://teams.microsoft.com/",
    icon: IMAGE_TEAMS,
  },
  {
    name: "Word",
    url: "https://word.cloud.microsoft/",
    icon: "https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/svg/word_48x1.svg",
  },
  {
    name: "Excel",
    url: "https://excel.cloud.microsoft/",
    icon: "https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/svg/excel_48x1.svg",
  },
  {
    name: "PowerPoint",
    url: "https://powerpoint.cloud.microsoft/",
    icon: "https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/svg/powerpoint_48x1.svg",
  },
  {
    name: "OneDrive",
    url: "https://www.microsoft.com/en-us/microsoft-365/onedrive",
    icon: "https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/svg/onedrive_48x1.svg",
  },
  {
    name: "Whiteboard",
    url: "https://app.whiteboard.microsoft.com/",
    icon: IMAGE_WHITEBOARD,
  },
  {
    name: "GitHub",
    url: "https://github.com",
    icon: "https://github.githubassets.com/favicons/favicon.svg",
  },
  {
    name: "AWS",
    url: "https://aws.amazon.com",
    icon: "https://a0.awsstatic.com/libra-css/images/site/touch-icon-iphone-114-smile.png",
  },
  {
    name: "Vercel",
    url: "https://vercel.com",
    icon: "https://assets.vercel.com/image/upload/q_auto/front/favicon/vercel/favicon.ico",
  },
]
