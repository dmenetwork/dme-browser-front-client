"use client"
import CustomImage from "@/components/CustomImage/CustomImage"
import MenuApps from "@/components/Layout/Sidebar/MenuApps/MenuApps"
import ModalWorkspace from "@/components/Layout/Sidebar/Workspaces/ModalWorkspace"
import { CONFIG_GLASS_MODE } from "@/config/config"
import { IMAGE_DME_LOGO } from "@/constants/img"
import { IRedux } from "@/types"
import { IWorkspace, IWorkspaceSlot } from "@/types/workspace"
import { Box, Button, Divider, Stack, useTheme } from "@mui/material"
import { Clock, Settings } from "lucide-react"
import { memo, useState } from "react"
import { useSelector } from "react-redux"
import ModalSettings from "./ModalSettings/ModalSettings"
import ModalRecentHistory from "./RecentHistory/ModalRecentHistory"
import useIconMap from "@/constants/WorkspacesIcons"

const Sidebar = () => {
  const { workspaces } = useSelector<IRedux, IWorkspace>(
    (state) => state?.workspace
  )
  const activeWorkspace = workspaces.find((e: IWorkspaceSlot) => e?.IsActive)
  const [anchorWorkspace, setAnchorWorkspace] = useState<null | HTMLElement>(
    null
  )
  const [anchorRecentHistory, setAnchorRecentHistory] =
    useState<null | HTMLElement>(null)
  const [anchorSettings, setAnchorSettings] = useState<null | HTMLElement>(null)
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === "dark"
  const iconMapToShow = useIconMap(isDarkMode)
  const openWorkspaces = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorWorkspace(e?.currentTarget)
  }
  const openRecentHistory = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorRecentHistory(e?.currentTarget)
  }

  const closeWorkspaces = () => {
    setAnchorWorkspace(null)
  }

  const closeRecentHistory = () => {
    setAnchorRecentHistory(null)
  }

  const showMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorSettings(e?.currentTarget)
  }

  return (
    <>
      <ModalWorkspace
        anchor={anchorWorkspace}
        closeWorkspaces={closeWorkspaces}
      />
      <ModalRecentHistory
        anchor={anchorRecentHistory}
        closeRecentHistory={closeRecentHistory}
      />
      <ModalSettings anchorEl={anchorSettings} setAnchor={setAnchorSettings} />
      <Box
        sx={{
          height: "100%",
          position: "relative",
          zIndex: 1,
          width: {
            xl: 45,
            lg: 45,
            md: 45,
            sm: 60,
            xs: 60,
          },
          overflowX: "hidden",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "5px",
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(192, 176, 215, 0.32)",
            borderTopRightRadius: "10px",
            borderBottomRightRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#555",
          },
        }}
      >
        <Box
          sx={{
            py: 1,
            borderRadius: 2,
            minHeight: "calc(100vh - 15px)",
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
          }}
        >
          <Stack
            justifyContent="space-between"
            alignItems="center"
            gap={1}
            sx={{ minHeight: "100%" }}
          >
            <Stack
              justifyContent="center"
              alignItems="center"
              gap={1}
              sx={{ width: "100%" }}
            >
              <Button color="inherit" onClick={openWorkspaces}>
                {activeWorkspace?.Icon ? (
                  iconMapToShow[
                    activeWorkspace?.Icon as keyof typeof iconMapToShow
                  ]
                ) : (
                  <CustomImage
                    src={IMAGE_DME_LOGO}
                    sx={{
                      width: "auto",
                      height: 30,
                      objectFit: "cover",
                    }}
                  />
                )}
              </Button>
              <Button
                onClick={openRecentHistory}
                sx={{ color: ({ palette }) => palette?.text?.secondary }}
              >
                <Clock />
              </Button>
              <Divider sx={{ width: 20 }} />
            </Stack>
            <MenuApps />
            <Stack
              justifyContent="center"
              alignItems="center"
              gap={1}
              sx={{ width: "100%" }}
            >
              <Button
                sx={{ color: ({ palette }) => palette?.text?.secondary }}
                onClick={showMenu}
              >
                <Settings />
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </>
  )
}

export default memo(Sidebar)
