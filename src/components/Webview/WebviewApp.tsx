import { CONFIG_WIDTH_WEBVIEW } from "@/config/config"
import { COMMON_IGNORE_CLICK_AWAY } from "@/constants/common"
import {
  setCloseSidebarApp,
  setPinSidebarApp,
} from "@/redux/reducers/tabsBrowser"
import { ITabsBrowserTab } from "@/types/tabsBrowser"
import {
  Box,
  CircularProgress,
  ClickAwayListener,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material"
import { Ellipsis, Pin, PinOff, X } from "lucide-react"
import dynamic from "next/dynamic"
import { memo, useCallback, useRef, useState } from "react"
import { useDispatch } from "react-redux"
const Webview = dynamic(() => import("@/components/Webview/Webview"), {
  ssr: false,
})

const WebviewApps = ({ tab }: { tab: ITabsBrowserTab }) => {
  const dispatch = useDispatch()
  const appRef = useRef<HTMLWebViewElement | null>(null)
  const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null)
  const [resizing, setResizing] = useState<boolean>(false)
  const [appHoverWidth, setAppHoverWidth] = useState<number>(
    CONFIG_WIDTH_WEBVIEW?.min
  )

  const handleClickAway = useCallback(
    (event: MouseEvent | TouchEvent) => {
      // THIS ALLOWS TO CATCH THE HTML ELEMENT WITH `.${COMMON_IGNORE_CLICK_AWAY}` CLASS TO IGNORE THEM
      const clickedElement = event.target as HTMLElement
      const shouldIgnore = clickedElement.closest(
        `.${COMMON_IGNORE_CLICK_AWAY}`
      )

      if (
        !shouldIgnore &&
        tab?.IsMiniApp &&
        tab?.IsActive &&
        !tab?.IsMiniAppPinned
      ) {
        closeApp()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tab?.IsActive, tab?.IsMiniAppPinned]
  )

  const closeApp = () => {
    dispatch(setCloseSidebarApp())
  }

  const pinApp = () => {
    dispatch(setPinSidebarApp())
  }

  const showMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorMenu(e?.currentTarget)
  }

  const resizingPanel = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    setResizing(true)
    const startX = event.clientX

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.min(
        100,
        Math.max(
          0,
          appHoverWidth +
            ((moveEvent.clientX - startX) / window.innerWidth) * 100
        )
      )

      requestAnimationFrame(() => {
        setAppHoverWidth(
          newWidth <= CONFIG_WIDTH_WEBVIEW?.min
            ? CONFIG_WIDTH_WEBVIEW?.min
            : tab?.IsMiniAppPinned && newWidth > CONFIG_WIDTH_WEBVIEW?.max
            ? CONFIG_WIDTH_WEBVIEW?.max
            : newWidth
        )
      })
    }

    const handleMouseUp = () => {
      setResizing(false)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
  }

  return (
    <>
      <Box
        sx={{
          display: tab?.IsActive ? "flex" : "none",
          position: tab?.IsMiniAppPinned ? "static" : "absolute",
          top: tab?.IsMiniAppPinned ? 32 : 0,
          left: tab?.IsMiniAppPinned ? 36 : 0,
          width: tab?.IsMiniAppPinned ? `${appHoverWidth - 7}%` : "100%",
          minWidth: tab?.IsMiniAppPinned ? `${appHoverWidth - 7}%` : "100%",
          height: "100%",
          bgcolor: "rgba(0, 0, 0, 0.5)",
          boxShadow: tab?.IsMiniAppPinned
            ? "0 4px 20px rgba(0, 0, 0, 0.5)"
            : "0 4px 20px rgba(0, 0, 0, 0.7)",
          zIndex: (theme) => theme.zIndex.modal,
          borderRadius: 3,
          overflowY: "auto",
          overflowX: "auto",
        }}
      >
        <ClickAwayListener onClickAway={handleClickAway}>
          <Box
            ref={appRef}
            sx={{
              width: tab?.IsMiniAppPinned ? "100%" : `${appHoverWidth}%`,
              minWidth:
                tab?.IsActive && tab?.IsMiniAppPinned
                  ? `${appHoverWidth - 7}%`
                  : `${appHoverWidth}%`,
              bgcolor: "transparent",
              borderRadius: 3,
            }}
          >
            <Stack
              sx={{
                width: "100%",
                height: "100%",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  bgcolor: ({ palette }) => palette?.background?.default,
                  px: 1,
                  borderRadius: "10px 10px 0px 0px",
                }}
              >
                <Stack direction="row" alignItems="center" gap={1}>
                  <Typography variant="body2" color="textSecondary">
                    {tab?.Title}
                  </Typography>
                  {tab?.IsReloading && <CircularProgress size={14} />}
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <IconButton size="small" onClick={pinApp}>
                    {tab?.IsMiniAppPinned ? (
                      <PinOff size={16} style={{ rotate: "0deg" }} />
                    ) : (
                      <Pin size={16} style={{ rotate: "45deg" }} />
                    )}
                  </IconButton>
                  <IconButton size="small" onClick={showMenu}>
                    <Ellipsis size={16} />
                  </IconButton>
                  <IconButton size="small" onClick={closeApp}>
                    <X size={16} />
                  </IconButton>
                </Stack>
              </Stack>
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    bgcolor: ({ palette }) => palette?.background?.paper,
                    height: "100%",
                    // borderRadius: "0px 0px 10px 10px",
                  }}
                >
                  {tab?.IsReloading ? (
                    <Stack
                      justifyContent="center"
                      alignItems="center"
                      sx={{
                        bgcolor: ({ palette }) => palette?.background?.paper,
                        height: "100%",
                        borderRadius: "0px 0px 10px 10px",
                      }}
                    >
                      <CircularProgress />
                    </Stack>
                  ) : (
                    tab.IsLoaded && (
                      <Webview
                        tab={tab}
                        anchorMenuApp={anchorMenu}
                        setAnchorMenuInMiniApp={setAnchorMenu}
                      />
                    )
                  )}
                </Box>
                <Box
                  sx={{
                    cursor: "col-resize",
                    width: resizing ? "100%" : 0,
                    height: "100%",
                    position: "absolute",
                    zIndex: (theme) => theme?.zIndex?.modal + 2,
                    alignSelf: "center",
                  }}
                  onMouseDown={resizingPanel}
                />
                <Box
                  onMouseDown={resizingPanel}
                  sx={{
                    cursor: "col-resize",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 10,
                    bgcolor: ({ palette }) => palette?.background?.default,
                    px: 1,
                    borderRadius: "0px 0px 0px 0px",
                    "&:hover": {
                      filter: "contrast(1.2)",
                      ".MuiDivider-root": {
                        bgcolor: ({ palette }) => palette?.grey?.[700],
                      },
                    },
                  }}
                >
                  <Divider
                    sx={{
                      cursor: "col-resize",
                      width: 1.5,
                      bgcolor: ({ palette }) => palette?.grey?.[500],
                      height: 100,
                    }}
                  />
                </Box>
              </Box>
            </Stack>
          </Box>
        </ClickAwayListener>
      </Box>
    </>
  )
}

export default memo(WebviewApps)
