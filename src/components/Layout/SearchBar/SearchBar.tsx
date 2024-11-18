import SearchInput from "@/components/SearchInput/SearchInput"
import SplitViewIcon from "@/components/SplitViewIcon/SplitViewIcon"
import { CONFIG_GLASS_MODE } from "@/config/config"
import { setVisible } from "@/redux/reducers/bookmark"
import {
  goBackNavigation,
  goForwardNavigation,
  setHomeTab,
  setSplitView,
} from "@/redux/reducers/tabsBrowser"
import { IRedux } from "@/types"
import { IAuth } from "@/types/auth"
import { IFavorites, ITabsBrowser, ITabsBrowserTab } from "@/types/tabsBrowser"
import { IWorkspace, IWorkspaceSlot } from "@/types/workspace"
import { AppBar, Avatar, Box, IconButton, Stack, useTheme } from "@mui/material"
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  House,
  RotateCw,
  User,
} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"

const SearchBar = ({
  tab,
  newPageIdFocused,
}: {
  tab: ITabsBrowserTab
  newPageIdFocused: string
}) => {
  const { palette } = useTheme()
  const iconSize: number = 20
  const height: number = 35

  const dispatch = useDispatch()
  const { auth } = useSelector<IRedux, IAuth>((state) => state?.auth)
  const { tabs } = useSelector<IRedux, ITabsBrowser>(
    (state) => state?.tabsBrowser
  )
  const { workspaces } = useSelector<IRedux, IWorkspace>(
    (state) => state?.workspace
  )
  const { bookmarkVisible } = useSelector<IRedux, IFavorites>(
    (state) => state?.bookmark
  )
  const activeWorkspace = workspaces.find((e: IWorkspaceSlot) => e?.IsActive)

  // Function to reload the active tab
  const handleReloadWebView = () => {
    // Escape the TabId to make it a valid CSS selector
    const escapedId = CSS.escape(tab.TabId)
    const webview = document.querySelector(
      `webview#${escapedId}`
    ) as Electron.WebviewTag

    if (webview && typeof webview.reload === "function") {
      webview.reload() // Reload the active webview
    } else {
      console.error(
        "Webview element not found or reload method is not available."
      )
    }
  }

  // Handle click event to set the URL of the active tab to null
  const handleHomeClick = () => {
    dispatch(setHomeTab({ tabId: tab.TabId }))
  }

  const handleBookmarkClick = () => {
    dispatch(setVisible())
  }

  const handleGoBack = () => {
    dispatch(goBackNavigation({ tabId: tab.TabId }))
    if (!tab.history.past[tab.history.past.length - 1]) {
      dispatch(
        setHomeTab({
          tabId: tab.TabId,
        })
      )
    }
  }

  const handleGoForward = () => {
    dispatch(goForwardNavigation({ tabId: tab.TabId }))
  }

  const handleSplitView = () => {
    dispatch(
      setSplitView({
        Split:
          tabs?.filter(
            (tab) =>
              tab?.SplitView &&
              tab?.WorkspaceId === activeWorkspace?.WorkspaceId &&
              !tab?.IsMiniApp
          ).length > 0
            ? false
            : true,
        WorkspaceId: activeWorkspace?.WorkspaceId,
      })
    )
  }

  const isMainSplitView =
    tabs?.filter(
      (tab) =>
        tab?.SplitView &&
        tab.SplitView.IsMain &&
        tab?.WorkspaceId === activeWorkspace?.WorkspaceId &&
        !tab?.IsMiniApp
    ).length > 0

  const [isMainView] = tabs?.filter(
    (tab) =>
      tab?.SplitView?.IsMain &&
      tab?.WorkspaceId === activeWorkspace?.WorkspaceId &&
      !tab?.IsMiniApp
  )

  return (
    <>
      <AppBar
        position="sticky"
        variant="elevation"
        elevation={0}
        sx={{
          marginBottom: "0.1rem",
          borderRadius: "10px",
          padding: "3px",
          bgcolor: CONFIG_GLASS_MODE
            ? "rgba(255, 255, 255, 0.8)"
            : ({ palette }) => palette?.background?.paper,
          backdropFilter: CONFIG_GLASS_MODE
            ? {
                md: "blur(3px) saturate(100%)",
                xs: "blur(3px) saturate(70%)",
              }
            : "none",
          boxShadow: CONFIG_GLASS_MODE
            ? "0 4px 30px rgba(0, 0, 0, 0.7)"
            : "none",
          zIndex: 10,
        }}
      >
        <Box>
          <Stack direction="row" gap={0.5}>
            <Stack
              direction="row"
              gap={0}
              sx={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IconButton
                disabled={tab?.history.past.length === 0}
                sx={{
                  borderRadius: 1.5,
                  "& svg": {
                    transition: "color 1.5s ease-out",
                    color: ({ palette }) => palette?.text?.secondary,
                  },
                  "&:hover": {
                    "& svg": {
                      transition: "color 1.5s ease-out",
                    },
                  },
                  "&.Mui-disabled": {
                    "& svg": {
                      color: ({ palette }) => palette?.grey?.[900],
                    },
                  },
                }}
                onClick={handleGoBack}
              >
                <ChevronLeft size={iconSize} />
              </IconButton>
              <IconButton
                onClick={handleGoForward}
                disabled={tab?.history.future.length === 0}
                sx={{
                  borderRadius: 1.5,
                  "& svg": {
                    transition: "color 1.5s ease-out",
                    color: ({ palette }) => palette?.text?.secondary,
                  },
                  "&:hover": {
                    "& svg": {
                      transition: "color 1.5s ease-out",
                    },
                  },
                  "&.Mui-disabled": {
                    "& svg": {
                      color: ({ palette }) => palette?.grey?.[900],
                    },
                  },
                }}
              >
                <ChevronRight size={iconSize} />
              </IconButton>
              <IconButton
                onClick={handleReloadWebView}
                disabled={!tab?.URL}
                sx={{
                  borderRadius: 1.5,
                  "& svg": {
                    transition: "color 1.5s ease-out",
                    color: ({ palette }) => palette?.text?.secondary,
                  },
                  "&:hover": {
                    "& svg": {
                      transition: "color 1.5s ease-out",
                    },
                  },
                  "&.Mui-disabled": {
                    "& svg": {
                      color: ({ palette }) => palette?.grey?.[900],
                    },
                  },
                }}
              >
                <RotateCw size={iconSize} />
              </IconButton>
              <IconButton
                onClick={handleHomeClick}
                disabled={!tab.URL}
                sx={{
                  borderRadius: 1.5,
                  "& svg": {
                    transition: "color 1.5s ease-out",
                    color: ({ palette }) => palette?.text?.secondary,
                  },
                  "&:hover": {
                    "& svg": {
                      transition: "color 1.5s ease-out",
                    },
                  },
                  "&.Mui-disabled": {
                    "& svg": {
                      color: ({ palette }) => palette?.grey?.[900],
                    },
                  },
                }}
              >
                <House size={iconSize} />
              </IconButton>
              <IconButton
                onClick={handleBookmarkClick}
                sx={{
                  borderRadius: 1.5,
                  "& svg": {
                    transition: "color 1.5s ease-out",
                    color: ({ palette }) => palette?.text?.secondary,
                  },
                  "&:hover": {
                    "& svg": {
                      transition: "color 1.5s ease-out",
                    },
                  },
                  "&.Mui-disabled": {
                    "& svg": {
                      color: ({ palette }) => palette?.grey?.[900],
                    },
                  },
                }}
              >
                {bookmarkVisible ? (
                  <Bookmark size={iconSize} color={palette?.primary?.main} />
                ) : (
                  <Bookmark size={iconSize} />
                )}
              </IconButton>
            </Stack>
            <SearchInput
              isFocusable={true}
              tab={tab}
              newPageIdFocused={newPageIdFocused}
            />
            {tab.TabId === isMainView?.TabId && isMainSplitView ? null : (
              <Stack
                direction="row"
                gap={0}
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <IconButton
                  sx={{
                    height,
                    borderRadius: 1.5,
                    "& .MuiSvgIcon-root": {
                      transition: "color 1.5s ease-out",
                      color: ({ palette }) =>
                        tabs?.filter(
                          (tab) =>
                            tab?.SplitView &&
                            tab?.WorkspaceId === activeWorkspace?.WorkspaceId &&
                            !tab?.IsMiniApp
                        ).length > 0
                          ? palette?.primary?.main
                          : palette?.text?.secondary,
                    },
                    "&:hover": {
                      bgcolor: ({ palette }) => palette?.common?.white,
                      "& .MuiSvgIcon-root": {
                        transition: "color 1.5s ease-out",
                        color: ({ palette }) => palette?.primary?.main,
                      },
                    },
                  }}
                  onClick={handleSplitView}
                >
                  <SplitViewIcon />
                </IconButton>
                {/* <IconButton
                  sx={{
                    borderRadius: 1.5,
                    "& svg": {
                      transition: "color 1.5s ease-out",
                      color: ({ palette }) => palette?.text?.secondary,
                    },
                    "&:hover": {
                      "& svg": {
                        transition: "color 1.5s ease-out",
                      },
                    },
                    "&.Mui-disabled": {
                      "& svg": {
                        color: ({ palette }) => palette?.grey?.[900],
                      },
                    },
                  }}
                >
                  <Puzzle size={iconSize} />
                </IconButton> */}
                {/* <Typography
                  variant="body1"
                  sx={{ color: ({ palette }) => palette?.text?.secondary }}
                >
                  |
                </Typography> */}
                <IconButton
                  sx={{
                    borderRadius: 1.5,
                    "& svg": {
                      transition: "color 1.5s ease-out",
                      color: ({ palette }) => palette?.text?.secondary,
                    },
                    "&:hover": {
                      "& svg": {
                        transition: "color 1.5s ease-out",
                      },
                    },
                    "&.Mui-disabled": {
                      "& svg": {
                        color: ({ palette }) => palette?.grey?.[900],
                      },
                    },
                  }}
                >
                  {auth?.picture ? (
                    <Avatar
                      src={auth?.picture}
                      sx={{
                        width: 26,
                        height: 26,
                      }}
                    />
                  ) : (
                    <User size={iconSize} />
                  )}
                </IconButton>
                <IconButton
                  sx={{
                    borderRadius: 1.5,
                    "& svg": {
                      transition: "color 1.5s ease-out",
                      color: ({ palette }) => palette?.text?.secondary,
                    },
                    "&:hover": {
                      "& svg": {
                        transition: "color 1.5s ease-out",
                      },
                    },
                    "&.Mui-disabled": {
                      "& svg": {
                        color: ({ palette }) => palette?.grey?.[900],
                      },
                    },
                  }}
                >
                  <Ellipsis size={iconSize} />
                </IconButton>
              </Stack>
            )}
          </Stack>
        </Box>
      </AppBar>
    </>
  )
}

export default SearchBar
