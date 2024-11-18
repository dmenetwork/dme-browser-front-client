"use client"
import BrowserTabs from "@/components/Layout/BrowserToolbar/BrowserTabs"
import BrowserWindowControls from "@/components/Layout/BrowserToolbar/BrowserWindowControls"
import { CONFIG_GLASS_MODE } from "@/config/config"
import { getOsPlatform } from "@/libs/Electron"
import { IPlatformOS } from "@/types/common"
import { Box } from "@mui/material"
import { memo, useEffect, useState } from "react"

const BrowserToolbar = ({ isFromLogin = false }: { isFromLogin?: boolean }) => {
  const [platformOS, setPlatformOS] = useState<IPlatformOS>(null)

  useEffect(() => {
    setPlatformOS(getOsPlatform())
  }, [])

  return (
    <Box
      sx={{
        display: "flex",
        maxWidth: "calc(100vw - 60px)",
        gap: 1,
        justifyContent: isFromLogin
          ? platformOS === "MAC"
            ? "start"
            : "end"
          : "space-between",

        borderRadius: 2,
        backdropFilter: CONFIG_GLASS_MODE
          ? {
              md: "blur(3px) saturate(100%)",
              xs: "blur(3px) saturate(70%)",
            }
          : "none",
      }}
    >
      {platformOS === "MAC" && (
        <BrowserWindowControls platformOS="MAC" isFromLogin={isFromLogin} />
      )}

      {!isFromLogin && (
        <Box
          sx={{
            appRegion: "drag",
            maxWidth: "90%",
            flexGrow: 1,
          }}
        >
          <BrowserTabs />
        </Box>
      )}
      {platformOS === "WINDOWS" && (
        <BrowserWindowControls platformOS="WINDOWS" isFromLogin={isFromLogin} />
      )}
    </Box>
  )
}

export default memo(BrowserToolbar)
