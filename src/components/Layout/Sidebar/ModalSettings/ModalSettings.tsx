import {
  deleteCookies,
  deleteLocalStorage,
  getCookies,
  getLocalStorage,
} from "@/libs/Electron"
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
} from "@mui/material"
import { memo, MouseEvent } from "react"
import packageJson from "@/../package.json"
import { SwitchTheme } from "@/components/SwitchTheme/SwitchTheme"

const ModalSettings = ({
  anchorEl,
  setAnchor,
}: {
  anchorEl: null | HTMLElement
  setAnchor: (anchor: null | HTMLElement) => void
}) => {
  const closeMenu = () => {
    setAnchor(null)
  }

  const getLocalData = async (
    e: MouseEvent<HTMLDivElement>,
    type: "LOCALSTORAGE" | "COOKIES"
  ) => {
    e?.preventDefault()

    console.log("--------------")
    if (type === "LOCALSTORAGE") {
      const ls = await getLocalStorage()
      console.log("ALL LOCALSTORAGE: ", ls)
    } else {
      const cookies = await getCookies()
      console.log("ALL COOKIES: ", cookies)
    }
  }

  const deleteLocalData = async (
    e: MouseEvent<HTMLDivElement>,
    type: "LOCALSTORAGE" | "COOKIES"
  ) => {
    e?.preventDefault()

    console.log("--------------")
    if (type === "LOCALSTORAGE") {
      const deletedLocalStorage = await deleteLocalStorage()
      console.log("LOCALSTORAGE DELETED!", deletedLocalStorage)
      const ls = await getLocalStorage()
      console.log("ALL LOCALSTORAGE: ", ls)
    } else {
      const deletedCookies = await deleteCookies()
      console.log("COOKIES DELETED!", deletedCookies)
      const cookies = await getCookies()
      console.log("ALL COOKIES: ", cookies)
    }

    closeMenu()
  }

  return (
    <>
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        sx={{
          zIndex: ({ zIndex }) => zIndex?.drawer + 1,
        }}
      >
        <List dense disablePadding>
          <ListItem disableGutters disablePadding>
            <ListItemButton dense>
              {/* <ListItemText
                primary={`Switch to ${
                  theme?.palette?.mode === "dark" ? "Light" : "Dark"
                } Theme`}
                sx={{ color: ({ palette }) => palette?.text?.secondary }}
              /> */}
              <SwitchTheme />
            </ListItemButton>
          </ListItem>
          <ListItem disableGutters disablePadding>
            <ListItemButton dense onClick={(e) => getLocalData(e, "COOKIES")}>
              <ListItemText
                primary="Get Cookies"
                sx={{ color: ({ palette }) => palette?.text?.secondary }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disableGutters disablePadding>
            <ListItemButton
              dense
              onClick={(e) => getLocalData(e, "LOCALSTORAGE")}
            >
              <ListItemText
                primary="Get LocalStorage"
                sx={{ color: ({ palette }) => palette?.text?.secondary }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disableGutters disablePadding>
            <ListItemButton
              dense
              onClick={(e) => deleteLocalData(e, "COOKIES")}
              sx={{ color: ({ palette }) => palette?.text?.secondary }}
            >
              <ListItemText primary="Clean Coookies" />
            </ListItemButton>
          </ListItem>
          <ListItem disableGutters disablePadding>
            <ListItemButton
              dense
              onClick={(e) => deleteLocalData(e, "LOCALSTORAGE")}
              sx={{ color: ({ palette }) => palette?.text?.secondary }}
            >
              <ListItemText primary="Clean LocalStorage" />
            </ListItemButton>
          </ListItem>
          <ListItem disableGutters disablePadding>
            <ListItemButton disabled dense>
              <ListItemText
                primary={`v${packageJson?.version}`}
                sx={{
                  color: ({ palette }) => palette?.text?.secondary,
                  textAlign: "center",
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Popover>
    </>
  )
}

export default memo(ModalSettings)
