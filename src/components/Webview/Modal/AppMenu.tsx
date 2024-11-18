import {
  deleteCookies,
  deleteLocalStorage,
  getCookies,
  getLocalStorage,
} from "@/libs/Electron"
import { setReloadPinSidebarApp } from "@/redux/reducers/tabsBrowser"
import { ITabsBrowserTab } from "@/types/tabsBrowser"
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
} from "@mui/material"
import { WebviewTag } from "electron"
import { memo, MouseEvent, MutableRefObject } from "react"
import { useDispatch } from "react-redux"

const AppMenu = ({
  anchorEl,
  tab,
  webviewRef,
  setAnchor,
  setAnchorMenuInMiniApp,
}: {
  anchorEl: null | HTMLElement
  tab: ITabsBrowserTab
  webviewRef: MutableRefObject<Record<string, WebviewTag>> // Cambiado aquí
  setAnchor: (anchor: null | HTMLElement) => void
  setAnchorMenuInMiniApp?: null | ((anchor: null | HTMLElement) => void)
}) => {
  const dispatch = useDispatch()

  const reloadWebview = (e?: MouseEvent<HTMLDivElement>) => {
    if (e) {
      e?.preventDefault()
    }
    setAnchor(null)
    if (setAnchorMenuInMiniApp) {
      setAnchorMenuInMiniApp(null)
    }
    dispatch(setReloadPinSidebarApp({ TabId: tab?.TabId, IsReloading: true }))
    setTimeout(() => {
      dispatch(
        setReloadPinSidebarApp({ TabId: tab?.TabId, IsReloading: false })
      )
    }, 1200)
  }

  const getLocalData = async (
    e: MouseEvent<HTMLDivElement>,
    type: "LOCALSTORAGE" | "COOKIE"
  ) => {
    e?.preventDefault()
    setAnchor(null)
    if (setAnchorMenuInMiniApp) {
      setAnchorMenuInMiniApp(null)
    }
    const webv = webviewRef.current[tab?.TabId]

    if (webv) {
      if (type === "LOCALSTORAGE") {
        const ls = await getLocalStorage({
          webContentsId: webv?.getWebContentsId(),
        })
        console.log("ls: ", ls)
      } else {
        const cookies = await getCookies({
          webContentsId: webv?.getWebContentsId(),
        })
        console.log("cookies: ", cookies)
      }
    }
  }

  const deleteLocalData = async (
    e: MouseEvent<HTMLDivElement>,
    type: "LOCALSTORAGE" | "COOKIE"
  ) => {
    e?.preventDefault()
    setAnchor(null)
    if (setAnchorMenuInMiniApp) {
      setAnchorMenuInMiniApp(null)
    }
    const webv = webviewRef.current[tab?.TabId]

    if (webv) {
      if (type === "LOCALSTORAGE") {
        const ls = await deleteLocalStorage({
          webContentsId: webv?.getWebContentsId(),
        })
        console.log("ls: ", ls)
      } else {
        const cookies = await deleteCookies({
          webContentsId: webv?.getWebContentsId(),
        })
        console.log("cookies: ", cookies)
      }
    }
    reloadWebview()
  }

  const closeMenu = () => {
    setAnchor(null)
    setAnchorMenuInMiniApp && setAnchorMenuInMiniApp(null)
  }

  return (
    <>
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{
          zIndex: ({ zIndex }) => zIndex?.drawer + 1,
        }}
      >
        <List dense disablePadding>
          <ListItem disableGutters disablePadding>
            <ListItemButton dense onClick={reloadWebview}>
              <ListItemText
                primary="Reload"
                sx={{ color: ({ palette }) => palette.text.secondary }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disableGutters disablePadding>
            <ListItemButton dense onClick={(e) => getLocalData(e, "COOKIE")}>
              <ListItemText
                primary="Get Cookies Data"
                sx={{ color: ({ palette }) => palette.text.secondary }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disableGutters disablePadding>
            <ListItemButton
              dense
              onClick={(e) => getLocalData(e, "LOCALSTORAGE")}
            >
              <ListItemText
                primary="Get LocalStore Data"
                sx={{ color: ({ palette }) => palette.text.secondary }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disableGutters disablePadding>
            <ListItemButton dense onClick={(e) => deleteLocalData(e, "COOKIE")}>
              <ListItemText
                primary="Clean Coookies"
                sx={{ color: ({ palette }) => palette.text.secondary }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disableGutters disablePadding>
            <ListItemButton
              dense
              onClick={(e) => deleteLocalData(e, "LOCALSTORAGE")}
            >
              <ListItemText
                primary="Clean LocalStore"
                sx={{ color: ({ palette }) => palette.text.secondary }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disableGutters disablePadding>
            <ListItemButton dense>
              <ListItemText
                primary="About this"
                sx={{ color: ({ palette }) => palette.text.secondary }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Popover>
    </>
  )
}

export default memo(AppMenu)
