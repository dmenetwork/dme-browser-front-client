/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import AppMenu from "@/components/Webview/Modal/AppMenu"
import { COLOR_BG_MIST } from "@/constants/colors"
import {
  ELECTRON_CUSTOM_EVENT_NEW_TAB_URL,
  ELECTRON_CUSTOM_WEBVIEW_LOADED,
  ELECTRON_WEBVIEW_EVENT_CRASHED,
  ELECTRON_WEBVIEW_EVENT_DID_FAIL_LOAD,
  ELECTRON_WEBVIEW_EVENT_DID_FINISH_LOAD,
  ELECTRON_WEBVIEW_EVENT_DID_NAVIGATE,
  ELECTRON_WEBVIEW_EVENT_DID_NAVIGATE_IN_PAGE,
  ELECTRON_WEBVIEW_EVENT_DID_START_LOADING,
  ELECTRON_WEBVIEW_EVENT_DID_STOP_LOADING,
  ELECTRON_WEBVIEW_EVENT_DOM_READY,
} from "@/constants/electron"
import { getErrorWebviewByCode } from "@/helpers/errors"
import {
  getDataFromUrl,
  getFaviconFromWebview,
  getHostFromWebview,
} from "@/helpers/url"
import { saveAllToHistory } from "@/redux/reducers/allHistory"
import { setUrlError } from "@/redux/reducers/common"
import {
  saveToHistory,
  setCloseSidebarApp,
  setDataTab,
  setNewTabCustomUrl,
  setTabForceRedirectUrl,
  setTabHost,
  setTabIcon,
  setTabLoading,
  setTabTitle,
  setTabUrl,
} from "@/redux/reducers/tabsBrowser"
import { saveHistoryEntry } from "@/services/allHistory"
import { IRedux } from "@/types"
import { ICommon, ICommonConflictingUrl } from "@/types/common"
import { IFavorites, ITabsBrowserTab } from "@/types/tabsBrowser"
import { PostBody, Referrer, WebviewTag } from "electron"
import { memo, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

const Webview = ({
  tab,
  anchorMenuApp = null,
  setAnchorMenuInMiniApp = null,
}: {
  tab: ITabsBrowserTab
  anchorMenuApp?: null | HTMLElement
  setAnchorMenuInMiniApp?: null | ((anchor: null | HTMLElement) => void)
}) => {
  const webviewRef = useRef<Record<string, WebviewTag>>({})
  const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null)
  const dispatch = useDispatch()
  const [currentUrl, setCurrentUrl] = useState<string | null>(null)
  const [currentTitle, setCurrentTitle] = useState<string>("")
  const [currentIcon, setCurrentIcon] = useState<string | null>(null)
  const [currentHost, setCurrentHost] = useState<string | null>(null)
  const [currentLoading, setCurrentLoading] = useState<boolean>(false)
  const [forceRedirectUrl, setForceRedirectUrl] = useState<string | null>(null)
  const { favorites } = useSelector<IRedux, IFavorites>(
    (state) => state?.bookmark
  )
  const { conflictingUrl } = useSelector<IRedux, ICommon>(
    (state) => state?.common
  )

  const injectCSS = `
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: rgba(192, 176, 215, 0.32);
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
`
  useEffect(() => {
    if (anchorMenuApp) {
      setAnchorMenu(anchorMenuApp)
    } else if (tab?.IsMiniApp && !tab?.IsActive) {
      setAnchorMenu(null)
    }
  }, [tab?.IsMiniApp, tab?.IsActive, anchorMenuApp])

  useEffect(() => {
    if (currentUrl) {
      if (tab?.URL !== currentUrl) {
        dispatch(
          setTabUrl({
            data: {
              TabId: tab?.TabId,
              URL: currentUrl,
            },
          })
        )
      }

      if (!tab?.IsMiniApp) {
        dispatch(
          saveToHistory({
            TabId: tab?.TabId,
            URL: currentUrl,
          })
        )

        saveHistoryEntry({
          tabId: tab?.TabId,
          workspaceId: tab?.WorkspaceId,
          title: tab?.Title,
          icon: tab?.Icon,
          url: currentUrl,
        })
      }
    }
  }, [currentUrl])

  useEffect(() => {
    if (currentHost && tab?.Host !== currentHost && !tab?.IsMiniApp) {
      dispatch(
        setTabHost({
          data: {
            TabId: tab?.TabId,
            Host: currentHost,
          },
        })
      )
    }
  }, [currentHost])

  useEffect(() => {
    if (currentTitle && tab?.Title !== currentTitle && !tab?.IsMiniApp) {
      dispatch(
        setTabTitle({
          data: {
            TabId: tab?.TabId,
            Title: currentTitle,
          },
        })
      )
    }
  }, [currentTitle])

  useEffect(() => {
    if (currentIcon && tab?.Icon !== currentIcon && !tab?.IsMiniApp) {
      dispatch(
        setTabIcon({
          data: {
            TabId: tab?.TabId,
            Icon: currentIcon,
          },
        })
      )
    }
  }, [currentIcon])

  useEffect(() => {
    if (tab?.IsLoading !== currentLoading) {
      dispatch(
        setTabLoading({
          data: {
            TabId: tab?.TabId,
            IsLoading: currentLoading,
          },
        })
      )
    }
  }, [currentLoading])

  useEffect(() => {
    if (forceRedirectUrl) {
      dispatch(
        setTabForceRedirectUrl({
          data: {
            TabId: tab?.TabId,
            NavigateURL: forceRedirectUrl,
          },
        })
      )
      setForceRedirectUrl(null)
    }
  }, [forceRedirectUrl])

  const closeApp = () => {
    dispatch(setCloseSidebarApp())
  }

  // const openDevTools = () => {
  //   const webview = webviewRef?.current[tab?.TabId]
  //   if (webview) {
  //     webview.openDevTools()
  //   }
  // }

  useEffect(() => {
    const webview = webviewRef?.current[tab?.TabId]

    const captureTitle = () => {
      if (webview) {
        const title = webview.getTitle()
        setCurrentTitle((prev) => (prev !== title ? title : prev))
      }
    }

    const captureFavicon = async () => {
      if (webview) {
        const icon = await getFaviconFromWebview(webview)
        setCurrentIcon((prev) => (prev !== icon ? icon : prev))
      }
    }

    const saveHistoryToReduxAndDB = async () => {
      try {
        const title = webview.getTitle()
        const currentUrl = webview.getURL()
        const icon = await getFaviconFromWebview(webview)
        if (!tab.IsMiniApp) {
          dispatch(
            saveAllToHistory({
              tabId: tab?.TabId,
              workspaceId: tab?.WorkspaceId,
              title,
              icon,
              url: currentUrl,
              date: new Date().toISOString(),
            })
          )
          saveHistoryEntry({
            tabId: tab?.TabId,
            workspaceId: tab?.WorkspaceId,
            title,
            icon,
            url: currentUrl,
          })
        }
      } catch (e) {
        console.log(e)
      }
    }

    const captureUrl = async () => {
      if (webview) {
        let currentUrl = webview.getURL()
        if (!tab.IsMiniApp && tab?.NavigateURL !== currentUrl) {
          dispatch(
            setDataTab({
              data: {
                TabId: tab?.TabId,
                NavigateURL: currentUrl,
              },
            })
          )
        }
        const realHost = await getHostFromWebview(webview)
        const conflictingURL = conflictingUrl.find(
          (e: ICommonConflictingUrl) => e?.matchUrl === currentUrl
        )

        if (conflictingURL) {
          currentUrl = conflictingURL ? conflictingURL?.redirectUrl : currentUrl
          setForceRedirectUrl((prev) =>
            prev !== currentUrl ? currentUrl : prev
          )
        }
        setCurrentUrl((prev) => (prev !== currentUrl ? currentUrl : prev))
        setCurrentHost((prev) => (prev !== realHost ? realHost : prev))
      }
    }

    const captureLoading = async (loading: boolean) => {
      if (webview) {
        setCurrentLoading((prev) => (prev !== loading ? loading : prev))
      }
    }

    const captureFailLoad = async (event: Electron.DidFailLoadEvent) => {
      if (webview) {
        if (event?.errorCode) {
          const errorToShow = getErrorWebviewByCode(event?.errorCode)
          dispatch(setUrlError(errorToShow))
        }
      }
    }

    const captureCrash = async () => {
      if (webview) {
        console.log("captureCrash")
      }
    }

    const setupWebview = async () => {
      if (webview) {
        const webContentsId = webview.getWebContentsId()

        if (window?.electronAPI && window?.electronAPI?.ipcRenderer) {
          // Enviar el ID del WebContents al proceso principal
          window.electronAPI.ipcRenderer.send(ELECTRON_CUSTOM_WEBVIEW_LOADED, {
            webContentsId,
            isMiniApp: tab?.IsMiniApp,
            TabId: tab?.TabId,
          })
        }
      }
    }

    const onDidFinishLoad = () => {
      captureTitle()
      captureFavicon()
      captureUrl()
      // setupWebview()
      saveHistoryToReduxAndDB()
    }

    const onDidNavigateInPage = () => {
      captureTitle()
      captureFavicon()
      captureUrl()
    }

    const onDidNavigate = () => {
      captureTitle()
      captureFavicon()
      captureUrl()
    }

    const onDidStopLoading = () => {
      captureTitle()
      captureFavicon()
      captureUrl()
      captureLoading(false)
    }

    const onDidStartLoading = () => {
      captureLoading(true)
    }

    const onDidFailLoad = (event: Electron.DidFailLoadEvent) => {
      captureFailLoad(event)
    }

    const onCrashed = () => {
      captureCrash()
    }

    const onDomReady = () => {
      setupWebview()
      webview.insertCSS(injectCSS)
    }

    if (webview) {
      webview.addEventListener(
        ELECTRON_WEBVIEW_EVENT_DID_FINISH_LOAD,
        onDidFinishLoad
      )

      webview.addEventListener(
        ELECTRON_WEBVIEW_EVENT_DID_NAVIGATE_IN_PAGE,
        onDidNavigateInPage
      )

      webview.addEventListener(
        ELECTRON_WEBVIEW_EVENT_DID_NAVIGATE,
        onDidNavigate
      )

      webview.addEventListener(
        ELECTRON_WEBVIEW_EVENT_DID_STOP_LOADING,
        onDidStopLoading
      )

      webview.addEventListener(
        ELECTRON_WEBVIEW_EVENT_DID_START_LOADING,
        onDidStartLoading
      )

      webview.addEventListener(
        ELECTRON_WEBVIEW_EVENT_DID_FAIL_LOAD,
        onDidFailLoad
      )

      webview.addEventListener(ELECTRON_WEBVIEW_EVENT_CRASHED, onCrashed)

      webview.addEventListener(ELECTRON_WEBVIEW_EVENT_DOM_READY, onDomReady)
    }

    return () => {
      if (webview) {
        webview.removeEventListener(
          ELECTRON_WEBVIEW_EVENT_DID_FINISH_LOAD,
          onDidFinishLoad
        )

        webview.removeEventListener(
          ELECTRON_WEBVIEW_EVENT_DID_NAVIGATE_IN_PAGE,
          onDidNavigateInPage
        )

        webview.removeEventListener(
          ELECTRON_WEBVIEW_EVENT_DID_NAVIGATE,
          onDidNavigate
        )

        webview.removeEventListener(
          ELECTRON_WEBVIEW_EVENT_DID_STOP_LOADING,
          onDidStopLoading
        )

        webview.removeEventListener(
          ELECTRON_WEBVIEW_EVENT_DID_START_LOADING,
          onDidStartLoading
        )

        webview.removeEventListener(
          ELECTRON_WEBVIEW_EVENT_DID_FAIL_LOAD,
          onDidFailLoad
        )

        webview.removeEventListener(ELECTRON_WEBVIEW_EVENT_CRASHED, onCrashed)

        webview.removeEventListener(
          ELECTRON_WEBVIEW_EVENT_DOM_READY,
          onDomReady
        )
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conflictingUrl, tab?.IsMiniApp, webviewRef, tab?.TabId])

  useEffect(() => {
    if (window?.electronAPI && window?.electronAPI?.ipcRenderer) {
      const { ipcRenderer } = window.electronAPI
      const webview = webviewRef?.current[tab?.TabId]

      const newTabUrl = async (
        url: string,
        frameName: string,
        features: string,
        disposition: string,
        referrer: Referrer,
        postBody: PostBody,
        isMiniApp: boolean,
        webContentsId: number,
        TabId: string
      ) => {
        // console.log("---newTabUrl---")
        // console.log("tab?.TabId: ", tab?.TabId)
        // console.log("TabId: ", TabId)
        // console.log("URL: ", tab?.URL)
        // console.log("webContentsId: ", webContentsId)
        // console.log("getWebContentsId: ", webview.getWebContentsId())

        if (webview && tab?.TabId === TabId) {
          const urlData = await getDataFromUrl(url)

          const isInBookmark = favorites.some(
            (item) => item?.url === urlData?.baseUrl
          )

          dispatch(
            setNewTabCustomUrl({
              WorkspaceId: tab?.WorkspaceId,
              isInBookmark,
              urlData,
            })
          )

          if (isMiniApp && !tab?.IsMiniAppPinned) {
            closeApp()
          }
        } else {
          console.log("WebView ID mismatch or WebView not available")
        }
      }

      const handleDomReady = () => {
        console.log("handleDomReady...")
      }

      if (webview) {
        webview.addEventListener(
          ELECTRON_WEBVIEW_EVENT_DOM_READY,
          handleDomReady
        )
      }

      ipcRenderer.on(ELECTRON_CUSTOM_EVENT_NEW_TAB_URL, (event, payload) => {
        newTabUrl(
          payload.url,
          payload.frameName,
          payload.features,
          payload.disposition,
          payload.referrer,
          payload.postBody,
          payload.isMiniApp,
          payload.webContentsId,
          payload.TabId
        )
      })

      return () => {
        if (webview) {
          webview.removeEventListener(
            ELECTRON_WEBVIEW_EVENT_DOM_READY,
            handleDomReady
          )
        }
        ipcRenderer.removeAllListeners(ELECTRON_CUSTOM_EVENT_NEW_TAB_URL)
      }
    }
  }, [webviewRef, tab, dispatch, favorites, closeApp])

  return (
    <>
      {/* <Button variant="contained" onClick={openDevTools}>
        Abrir DevTools
      </Button> */}
      <webview
        id={tab.TabId}
        ref={(el) => {
          if (el) webviewRef.current[tab?.TabId] = el as Electron.WebviewTag
        }}
        src={tab?.NavigateURL || ""}
        allowpopups="true" /* ESTE PARAMETRO DEBE SER STRING, NO BOOLEAN */
        useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
        style={{
          width: "100%",
          height: "100%",
          overflowY: "auto",
          overflowX: "auto",
          borderRadius: tab?.IsMiniApp ? "0px 0px 10px 10px" : 10,
          backgroundColor: COLOR_BG_MIST,
        }}
      />
      <AppMenu
        anchorEl={anchorMenu}
        tab={tab}
        webviewRef={webviewRef}
        setAnchor={setAnchorMenu}
        setAnchorMenuInMiniApp={setAnchorMenuInMiniApp}
      />
    </>
  )
}

export default memo(Webview)
