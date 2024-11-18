/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import GlobalProgressBar from "@/components/GlobalProgressBar/GlobalProgressBar"
import BrowserToolbar from "@/components/Layout/BrowserToolbar/BrowserToolbar"
import Sidebar from "@/components/Layout/Sidebar/Sidebar"
import PusherConnection from "@/components/PusherConnection/PusherConnection"
import SilentInit from "@/components/SilentInit/SilentInit"
import { ROUTE_SIGN_IN } from "@/constants/routes"
import {
  LOCALSTORAGE_ACCESS_TOKEN,
  LOCALSTORAGE_REFRESH_TOKEN,
} from "@/constants/storage"
import { setInitAuth } from "@/redux/reducers/auth"
import { setGlobalLoading } from "@/redux/reducers/common"
import { verifyToken } from "@/services/auth"
import { Box, Stack } from "@mui/material"
import { useRouter } from "next/navigation"
import { memo, useEffect } from "react"
import { useDispatch } from "react-redux"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch()
  const { push } = useRouter()

  useEffect(() => {
    dispatch(setGlobalLoading(false))
    validateToken()
  }, [])

  const validateToken = async () => {
    const accessToken = localStorage.getItem(LOCALSTORAGE_ACCESS_TOKEN)
    const refreshToken = localStorage.getItem(LOCALSTORAGE_REFRESH_TOKEN)

    if (accessToken) {
      await verifyToken({
        accessToken: accessToken as string,
        refreshToken,
      })
        .then((res) => {
          if (res?.token && res?.token?.accessToken) {
            localStorage.setItem(
              LOCALSTORAGE_ACCESS_TOKEN,
              res?.token?.accessToken
            )
          }
          if (res?.user) {
            dispatch(setInitAuth({ user: res?.user }))
          }
        })
        .catch((err) => {
          console.error(err)
          push(ROUTE_SIGN_IN)
        })
        .finally(() => {
          dispatch(setGlobalLoading(false))
        })
    } else {
      push(ROUTE_SIGN_IN)
    }
  }

  return (
    <>
      <Box
        sx={{
          position: "relative",
          height: "100%",
          minHeight: "100vh",
          "&::before": {
            content: '""',
            position: "absolute",
            width: "100%",
            height: "100%",
            // background: CONFIG_GLASS_MODE
            //   ? tabs.find((e: ITabsBrowserTab) => e?.IsActive && !e?.IsMiniApp)
            //       ?.BgColor || ""
            //   : "black",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
            filter: "brightness(50%)",
          },
        }}
      >
        <GlobalProgressBar />
        <Box
          sx={{
            display: "flex",
            py: 0.7,
            px: 0.5,
            height: "100vh",
            gap: 0.5,
          }}
        >
          <Box>
            <Sidebar />
          </Box>
          <Box
            sx={{
              flex: 12,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Stack sx={{ height: "100%" }}>
              <BrowserToolbar />
              <SilentInit />
              <PusherConnection />
              {children}
            </Stack>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default memo(DashboardLayout)
