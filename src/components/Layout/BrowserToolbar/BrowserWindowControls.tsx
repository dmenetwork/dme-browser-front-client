"use client"
import {
  closeWindow,
  isWindowMaximized,
  maximizeWindow,
  minimizeWindow,
  saveSession,
} from "@/libs/Electron"
import { saveNewWorkspace } from "@/services/workspaces"
import { IRedux } from "@/types"
import { IPlatformOS } from "@/types/common"
import { ITabsBrowser } from "@/types/tabsBrowser"
import { IWorkspace } from "@/types/workspace"
import { Box, Stack, useTheme } from "@mui/material"
import {
  ChevronsLeftRight,
  ChevronsRightLeft,
  Copy,
  Minus,
  Square,
  X,
} from "lucide-react"
import { memo, useEffect, useState } from "react"
import { useSelector } from "react-redux"

const BrowserWindowControls = ({
  platformOS,
  isFromLogin,
}: {
  platformOS: IPlatformOS
  isFromLogin: boolean
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const { palette } = useTheme()
  const iconSizeWindows: number = 16
  const iconSizeMac: number = 14

  // Seleccionamos las tabs desde Redux
  const { tabs } = useSelector<IRedux, ITabsBrowser>(
    (state) => state?.tabsBrowser
  )

  const { workspaces } = useSelector<IRedux, IWorkspace>(
    (state) => state?.workspace
  )

  const tabsWithoutMiniApps = tabs?.filter((tab) => tab?.IsMiniApp === false)

  useEffect(() => {
    // Escuchar el evento de cierre de la aplicación
    window.electronAPI.ipcRenderer.on("app-closing", async () => {
      console.log("Cerrando la app, guardando sesión...")
      await saveSession(tabsWithoutMiniApps) // Guarda la sesión
    })

    return () => {
      // Limpiar el listener al desmontar el componente
      window.electronAPI.ipcRenderer.removeAllListeners("app-closing")
    }
  }, [tabsWithoutMiniApps])

  useEffect(() => {
    isWindowMaximizedElectron()
  }, [])

  const closeWindowElectron = async () => {
    // Antes de cerrar la ventana, guardamos la sesión
    await saveNewWorkspace(workspaces)
    await saveSession(tabsWithoutMiniApps)
    closeWindow()
  }

  const minimizeWindowElectron = () => {
    minimizeWindow()
  }
  const resizeWindowElectron = () => {
    maximizeWindow()
    isWindowMaximizedElectron()
  }
  const isWindowMaximizedElectron = async () => {
    const res: boolean = await isWindowMaximized()
    setIsFullscreen(res)
  }

  return (
    <>
      {platformOS === "WINDOWS" && (
        <Stack direction="row" sx={{ mr: 0.5 }}>
          <Box
            sx={{
              px: 2,
              appRegion: "drag",
            }}
          />
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              appRegion: "none",
              py: 0.5,
              my: 0.5,
              borderRadius: 2,
              cursor: "pointer",
              width: 40,
              transition: "background-color 0.5s ease",
              "&:hover": {
                transition: "background-color 0.5s ease",
                bgcolor: ({ palette }) => palette?.background?.paper,
                "& svg": {
                  color: ({ palette }) => palette?.text?.secondary,
                },
              },
              "& svg": {
                color: isFromLogin
                  ? ({ palette }) => palette?.common?.white
                  : ({ palette }) => palette?.text?.secondary,
              },
            }}
            onClick={() => minimizeWindowElectron()}
          >
            <Minus size={iconSizeWindows} />
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              appRegion: "none",
              my: 0.5,
              borderRadius: 2,
              cursor: "pointer",
              width: 40,
              transition: "background-color 0.5s ease",
              "&:hover": {
                transition: "background-color 0.5s ease",
                bgcolor: ({ palette }) => palette?.background?.paper,
                "& svg": {
                  color: ({ palette }) => palette?.text?.secondary,
                },
              },
              "& svg": {
                color: isFromLogin
                  ? ({ palette }) => palette?.common?.white
                  : ({ palette }) => palette?.text?.secondary,
              },
            }}
            onClick={() => resizeWindowElectron()}
          >
            {isFullscreen ? (
              <Copy
                size={iconSizeWindows}
                style={{
                  transform: "rotate(90deg)",
                }}
              />
            ) : (
              <Square size={iconSizeWindows} />
            )}
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              appRegion: "none",
              my: 0.5,
              borderRadius: 2,
              cursor: "pointer",
              width: 40,
              transition: "background-color 0.5s ease",
              "&:hover": {
                transition: "background-color 0.5s ease",
                bgcolor: ({ palette }) => palette?.error?.main,
                "& svg": {
                  color: ({ palette }) => palette?.text?.secondary,
                },
              },
              "& svg": {
                color: isFromLogin
                  ? ({ palette }) => palette?.common?.white
                  : ({ palette }) => palette?.text?.secondary,
              },
            }}
            onClick={() => closeWindowElectron()}
          >
            <X size={iconSizeWindows} />
          </Box>
        </Stack>
      )}

      {platformOS === "MAC" && (
        <Stack direction="row" alignItems="center" gap={0.5} sx={{ px: 1 }}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              appRegion: "none",
              borderRadius: 100,
              cursor: "pointer",
              width: 18,
              height: 18,
              transition: "background-color 0.5s ease",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
              bgcolor: ({ palette }) => palette?.error?.main,
              "&:hover": {
                transition: "background-color 0.5s ease",
                filter: "saturate(85%)",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
              },
            }}
            onClick={() => closeWindowElectron()}
          >
            <X size={iconSizeMac} style={{ color: palette?.common?.white }} />
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              appRegion: "none",
              borderRadius: 100,
              cursor: "pointer",
              width: 18,
              height: 18,
              transition: "background-color 0.5s ease",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
              bgcolor: ({ palette }) => palette?.warning?.main,
              "&:hover": {
                transition: "background-color 0.5s ease",
                filter: "saturate(85%)",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
              },
            }}
            onClick={() => minimizeWindowElectron()}
          >
            <Minus
              size={iconSizeMac}
              style={{ color: palette?.common?.black }}
            />
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              appRegion: "none",
              borderRadius: 100,
              cursor: "pointer",
              width: 18,
              height: 18,
              transition: "background-color 0.5s ease",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
              bgcolor: ({ palette }) => palette?.success?.main,
              "&:hover": {
                transition: "background-color 0.5s ease",
                filter: "saturate(85%)",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
              },
            }}
            onClick={() => resizeWindowElectron()}
          >
            {isFullscreen ? (
              <ChevronsRightLeft
                size={iconSizeMac}
                style={{
                  color: palette?.common?.black,
                  transform: "rotate(135deg)",
                }}
              />
            ) : (
              <ChevronsLeftRight
                size={iconSizeMac}
                style={{
                  color: palette?.common?.black,
                  transform: "rotate(135deg)",
                }}
              />
            )}
          </Box>
          <Box
            sx={{
              px: 2,
              appRegion: "drag",
            }}
          />
        </Stack>
      )}
    </>
  )
}

export default memo(BrowserWindowControls)
