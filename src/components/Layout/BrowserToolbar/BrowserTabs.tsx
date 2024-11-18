import CustomImage from "@/components/CustomImage/CustomImage"
import { CONFIG_GLASS_MODE } from "@/config/config"
import { getColorWorkspace } from "@/helpers/color"
import { getAllHistory } from "@/redux/reducers/allHistory"
// import { IMAGE_DME_LOGO, IMAGE_TELEGRAM, IMAGE_X } from "@/constants/img"
import {
  setChangeSelectedTab,
  setCloseTab,
  setNewTab,
} from "@/redux/reducers/tabsBrowser"
import {
  handleGetAllHistory,
  handleUpdateCloseTabHistory,
} from "@/services/allHistory"
import { IRedux } from "@/types"
import { ITabsBrowser, ITabsBrowserTab } from "@/types/tabsBrowser"
import { IWorkspace, IWorkspaceSlot } from "@/types/workspace"
import {
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
  Zoom,
} from "@mui/material"
import { Plus, X } from "lucide-react"
import { memo, MouseEvent, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

const MAX_TAB_WIDTH = 220
const MIN_TAB_WIDTH = 25
const TAB_HEIGHT = 30

const BrowserTabs = () => {
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const theme = useTheme()
  const [tabWidth, setTabWidth] = useState(MAX_TAB_WIDTH)
  const height: number = 30
  const { workspaces } = useSelector<IRedux, IWorkspace>(
    (state) => state?.workspace
  )
  const { tabs } = useSelector<IRedux, ITabsBrowser>(
    (state) => state?.tabsBrowser
  )
  const activeWorkspace = workspaces.find((e: IWorkspaceSlot) => e?.IsActive)
  const [activeTabs, setActiveTabs] = useState<ITabsBrowserTab[]>([])
  const dispatch = useDispatch()

  useEffect(() => {
    setActiveTabs(
      tabs?.filter(
        (e: ITabsBrowserTab) =>
          e?.WorkspaceId === activeWorkspace?.WorkspaceId && !e?.IsMiniApp
      )
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs, activeWorkspace])

  useEffect(() => {
    if (activeWorkspace && workspaces.length > 1) {
      const active = tabs?.filter(
        (e: ITabsBrowserTab) =>
          e?.WorkspaceId === activeWorkspace?.WorkspaceId && !e?.IsMiniApp
      )

      if (active.length > 0) {
        setActiveTabs(active)
      } else {
        addTab()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs, activeWorkspace])

  useEffect(() => {
    const handleResize = () => {
      if (tabsContainerRef.current) {
        const containerWidth = tabsContainerRef.current.offsetWidth
        const gap = 0.5 * 8 // MUI spacing (0.5 * 8px = 4px)
        const totalGapWidth = gap * (activeTabs.length - 1)
        const addButtonWidth = 40 // Approximate width of the add tab button
        const availableWidth = containerWidth - totalGapWidth - addButtonWidth
        const calculatedWidth = availableWidth / activeTabs.length

        const newTabWidth = Math.max(
          Math.min(calculatedWidth, MAX_TAB_WIDTH),
          MIN_TAB_WIDTH
        )
        setTabWidth(newTabWidth)
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [activeTabs])

  const changeActiveTab = (TabId: string) => {
    dispatch(
      setChangeSelectedTab({ TabId, WorkspaceId: activeWorkspace?.WorkspaceId })
    )
  }

  const addTab = () => {
    dispatch(setNewTab({ WorkspaceId: activeWorkspace?.WorkspaceId }))
  }

  const closeTab = async (TabId: string) => {
    try {
      await handleUpdateCloseTabHistory(TabId)

      dispatch(
        setCloseTab({ TabId, WorkspaceId: activeWorkspace?.WorkspaceId })
      )

      const res = await handleGetAllHistory()
      if (res?.success) {
        dispatch(getAllHistory({ allHistory: res?.allHistory }))
      }
      console.log("Tab closed and history updated successfully.")
    } catch (error) {
      console.error("Error updating tab close time or closing tab:", error)
    }
  }

  const handleMouseDown = (
    event: MouseEvent<HTMLDivElement>,
    tab: ITabsBrowserTab
  ) => {
    if (event.button === 1) {
      event.preventDefault()
      closeTab(tab?.TabId)
    }
  }

  return (
    <Stack
      ref={tabsContainerRef}
      direction="row"
      gap={0.5}
      sx={{
        appRegion: "drag",
        maxWidth: "95%",
      }}
    >
      {activeTabs?.map((tab: ITabsBrowserTab, i: number) => {
        const showCloseTab = tabWidth > 45
        const showText = tabWidth > 80
        const showPadding = tabWidth > 45
        return (
          <Zoom in={!!tab.TabId} key={i} timeout={{ enter: 200, exit: 200 }}>
            <Tooltip
              title={tab?.Title}
              arrow
              slotProps={{
                tooltip: { style: { color: "white" } },
              }}
            >
              <Box
                key={i}
                onClick={() => changeActiveTab(tab?.TabId)}
                onMouseDown={(e) => handleMouseDown(e, tab)}
                sx={{
                  backdropFilter: CONFIG_GLASS_MODE
                    ? {
                        md: "blur(3px) saturate(100%)",
                        xs: "blur(3px) saturate(70%)",
                      }
                    : "none",
                  appRegion: "none",
                  width: tabWidth,
                  height: TAB_HEIGHT,
                  pl: showPadding ? 1 : 0,
                  borderRadius: 1.5,
                  display: "flex",
                  boxShadow: tab?.IsActive
                    ? "0 2px 4px rgba(0, 0, 0, 0.7)"
                    : "none",
                  position: "relative",
                  cursor: "pointer",
                  bgcolor: ({ palette }) => palette?.background?.paper,
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: 3,
                    bgcolor: ({ palette }) =>
                      getColorWorkspace({
                        palette,
                        color: activeWorkspace?.Color || "primary",
                      }),
                    transform: tab?.IsActive ? "scaleX(1)" : "scaleX(0)",
                    transition: "transform 0.5s ease",
                    borderBottomLeftRadius: "40px",
                    borderBottomRightRadius: "40px",
                  },
                  "&:hover::before": {
                    transform: "scaleX(1)",
                  },
                  "&:hover": {
                    transition: "background-color 1s ease",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.7)",
                  },
                  ".tab-title::after": {
                    background: ({ palette }) =>
                      `linear-gradient(to right, rgba(255,255,255,0), ${palette?.background?.paper})`,
                  },
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    gap={1}
                    sx={{
                      overflow: "hidden",
                      flexGrow: 1,
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        display: "grid",
                        justifyContent: "center",
                        alignItems: "center",
                        minWidth: 18,
                        minHeight: 18,
                      }}
                    >
                      {tab?.IsLoading && (
                        <CircularProgress
                          size={19}
                          color="primary"
                          sx={{
                            position: tab?.Icon ? "absolute" : "static",
                            scale: 1.2,
                            color: ({ palette }) => palette?.grey?.[400],
                          }}
                        />
                      )}
                      <CustomImage
                        src={tab?.Icon || ""}
                        sx={{
                          pl: showPadding ? 0 : "4px",
                          height: 18,
                          width: "auto",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                    {showText && (
                      <Typography
                        className="tab-title"
                        variant="caption"
                        color="textSecondary"
                        noWrap
                        sx={{
                          whiteSpace: "nowrap",
                          maxWidth: "100%",
                          flexGrow: 1,
                          position: "relative",
                          userSelect: "none",
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            right: 0,
                            top: 0,
                            bottom: 0,
                            width: "30px",
                            pointerEvents: "none",
                            background: ({ palette }) =>
                              tab?.IsActive
                                ? `linear-gradient(to right, rgba(255,255,255,0), ${palette?.common?.white})`
                                : `linear-gradient(to right, rgba(255,255,255,0), ${palette?.background?.paper})`,
                          },
                        }}
                      >
                        {tab?.Title}
                      </Typography>
                    )}
                  </Stack>
                  {showCloseTab ? (
                    <IconButton
                      onClick={(event) => {
                        event.stopPropagation()
                        closeTab(tab?.TabId)
                      }}
                      sx={{
                        p: 0.5,
                        ml: 0.5,
                      }}
                    >
                      <X
                        color={
                          theme.palette.mode === "dark"
                            ? theme.palette?.text?.secondary
                            : theme.palette?.grey?.[500]
                        }
                        size={14}
                      />
                    </IconButton>
                  ) : (
                    tab?.IsActive && (
                      <IconButton
                        onClick={(event) => {
                          event.stopPropagation()
                          closeTab(tab?.TabId)
                        }}
                      >
                        <X
                          color={
                            theme.palette.mode === "dark"
                              ? theme.palette?.text?.secondary
                              : theme.palette?.grey?.[500]
                          }
                          size={14}
                        />
                      </IconButton>
                    )
                  )}
                </Stack>
              </Box>
            </Tooltip>
          </Zoom>
        )
      })}
      <IconButton
        onClick={addTab}
        sx={{
          appRegion: "none",
          height,
          borderRadius: 1.5,
          "& svg": {
            transition: "color 0.5s ease-out",
            color: (theme) =>
              theme.palette.mode === "dark"
                ? theme.palette?.text?.secondary
                : theme.palette?.grey?.[500],
          },
          "&:hover": {
            bgcolor: ({ palette }) =>
              palette?.mode === "dark"
                ? palette?.background?.paper
                : palette?.common?.white,
            "& svg": {
              transition: "color 0.5s ease-out",
              color: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.palette?.text?.secondary
                  : theme.palette?.primary?.main,
            },
          },
        }}
      >
        <Plus size={18} />
      </IconButton>
    </Stack>
  )
}

export default memo(BrowserTabs)
