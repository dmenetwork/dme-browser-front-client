import axios from "axios"

export const getFaviconFromWebview = async (
  currentWebview: Electron.WebviewTag
) => {
  const icon = await currentWebview
    .executeJavaScript(
      `(() => {
            // 1. Intentar obtener el favicon desde el link[rel="icon"]
            const getFaviconFromLink = () => {
              const iconLink = document.querySelector('link[rel~="icon"]') || document.querySelector('link[rel~="shortcut icon"]');
              return iconLink ? iconLink.href : null;
            };
            
            // 2. Intentar obtener el favicon del manifest.json
            const getFaviconFromManifest = () => {
              const manifestLink = document.querySelector('link[rel="manifest"]');
              if (manifestLink) {
                return fetch(manifestLink.href)
                  .then(response => response.json())
                  .then(manifest => manifest.icons ? manifest.icons[0].src : null)
                  .catch(() => null);
              }
              return Promise.resolve(null);
            };

            // 3. Fallback al /favicon.ico
            const getDefaultFavicon = () => {
              return window.location.origin + '/favicon.ico';
            };

            // Función principal para obtener el favicon
            return new Promise(async (resolve) => {
              let favicon = getFaviconFromLink();
              if (!favicon) {
                favicon = await getFaviconFromManifest();
              }
              if (!favicon) {
                favicon = getDefaultFavicon();
              }
              resolve(favicon);
            });
          })();`
    )
    .then((res: string) => {
      return res
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .catch((err) => {
      return null
    })

  return icon
}

export const getDataFromUrl = async (url: string) => {
  const normalizedUrl =
    url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `https://${url}`

  // Parse the URL to extract components
  const parsedUrl = new URL(normalizedUrl)

  // Check if the URL is same-origin (optional)
  const isSameOrigin = window.location.origin === parsedUrl.origin

  // Initialize default values
  let title = ""
  let favicon: string | null = ""

  // Only attempt to fetch content for same-origin URLs
  if (isSameOrigin) {
    try {
      const response = await axios.get(normalizedUrl)
      const html = response?.data

      // Parse the HTML to extract title and favicon
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, "text/html")

      // Get the page title
      const titleElement = doc.querySelector("title")
      title = titleElement ? titleElement.innerText : ""

      // Get the favicon
      const faviconElement = doc.querySelector("link[rel~='icon']")
      favicon = faviconElement ? faviconElement.getAttribute("href") : ""

      // If the favicon doesn't have a full URL, construct it
      if (favicon && !favicon.startsWith("http")) {
        favicon = `${parsedUrl.origin}${favicon}`
      }
    } catch (err) {
      console.error("Error fetching URL data:", err)
    }
  } else {
    // For external URLs, set default or placeholder values
    title = parsedUrl.hostname
    favicon = `${parsedUrl.origin}/favicon.ico`
  }

  return {
    title: title,
    icon: favicon || "",
    protocol: parsedUrl.protocol,
    baseUrl: parsedUrl.origin,
    fullUrl: parsedUrl.href,
    searchParams: parsedUrl.searchParams.toString(),
    host: parsedUrl.host,
  }
}

// Función para validar URLs
export const isValidUrl = (urlString: string): boolean => {
  // THIS ALLOW TO RENDERING A LOCALHOST RUNNIG ENVIROMENT
  if (urlString.includes("localhost:")) {
    return true
  } else {
    try {
      // Add 'http://' if the URL doesn't start with a protocol
      const normalizedUrl =
        urlString.startsWith("http://") || urlString.startsWith("https://")
          ? urlString
          : "http://" + urlString

      const url = new URL(normalizedUrl)

      // Check if the hostname contains at least one dot (.)
      return url.hostname.includes(".")
    } catch (err) {
      console.error(err)
      return false
    }
  }
}

export const getHostFromWebview = (webview: Electron.WebviewTag) => {
  if (webview) {
    const realHost = webview?.src
      ? new URL(webview.src)?.host
      : new URL(webview.getURL())?.host
    return realHost
  }
  return ""
}
