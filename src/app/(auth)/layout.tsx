/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import pkJson from "@/../package.json"
import CustomImage from "@/components/CustomImage/CustomImage"
import GlobalProgressBar from "@/components/GlobalProgressBar/GlobalProgressBar"
import BrowserToolbar from "@/components/Layout/BrowserToolbar/BrowserToolbar"
import { APP_ENV } from "@/config/config"
import { COMMON_APP_NAME } from "@/constants/common"
import { IMAGE_BG_TAB, IMAGE_DME_LOGO_FRAME } from "@/constants/img"
import { ROUTE_DEFAULT, ROUTE_HOME, ROUTE_SIGN_IN } from "@/constants/routes"
import {
  LOCALSTORAGE_ACCESS_TOKEN,
  LOCALSTORAGE_REFRESH_TOKEN,
} from "@/constants/storage"
import { setInitAuth } from "@/redux/reducers/auth"
import { setGlobalLoading } from "@/redux/reducers/common"
import { verifyToken } from "@/services/auth"
import { LightTheme } from "@/styles/MuiTheme"
import {
  Box,
  Chip,
  Container,
  Grid2,
  Stack,
  ThemeProvider,
  Typography,
} from "@mui/material"
import { usePathname, useRouter } from "next/navigation"
import { memo, ReactNode, useEffect, useState } from "react"
import { useDispatch } from "react-redux"

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()
  const dispatch = useDispatch()
  const delay = 2
  const [loadingScreen, setLoadingScreen] = useState<boolean>(
    [ROUTE_DEFAULT, ROUTE_SIGN_IN].includes(pathname) ? true : false
  )
  const [showSecondGrid, setShowSecondGrid] = useState<boolean>(false)
  const { push } = useRouter()

  console.log("LAYOUT pathname... ", pathname)

  useEffect(() => {
    dispatch(setGlobalLoading(true))
    validateToken()
  }, [])

  useEffect(() => {
    if (!loadingScreen) {
      const timer = setTimeout(
        () => (setShowSecondGrid(true), dispatch(setGlobalLoading(false))),
        parseInt(`${delay}000`)
      )
      return () => clearTimeout(timer)
    } else {
      setShowSecondGrid(false)
    }
  }, [loadingScreen])

  const validateToken = async () => {
    if (pathname === ROUTE_DEFAULT) {
      console.log("IF validateToken...")
      console.log("IF pathname... ", pathname)

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
            push(ROUTE_HOME)
          })
          .catch((err) => {
            console.error(err)
            setLoadingScreen(false)
          })
          .finally(() => {
            dispatch(setGlobalLoading(false))
          })
      } else {
        setLoadingScreen(false)
        push(ROUTE_SIGN_IN)
      }
    } else {
      console.log("ELSE validateToken...")
      console.log("ELSE pathname... ", pathname)

      dispatch(setGlobalLoading(false))
      setLoadingScreen(false)
    }
  }

  return (
    <ThemeProvider theme={LightTheme}>
      <Box
        sx={{
          backgroundImage: `url(${IMAGE_BG_TAB})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundColor: "rgba(0, 0, 0, 0.525)",
          backgroundBlendMode: "overlay",
          position: "relative",
        }}
      >
        <GlobalProgressBar />
        <Box position="absolute" width="100%" sx={{ display: "block" }}>
          <BrowserToolbar isFromLogin={true} />
        </Box>
        <Stack justifyContent="center" alignItems="center" height="100vh">
          <Container maxWidth="lg">
            <Box
              sx={{
                bgcolor: ({ palette }) => palette?.background?.default,
                borderRadius: 9,
              }}
            >
              <Grid2 container sx={{ minHeight: 600 }}>
                <Grid2
                  sx={{
                    transition: `width ${delay}s ease-in-out`,
                    width: loadingScreen ? "100%" : "50%",
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: ({ palette }) => palette?.common?.black,
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: loadingScreen
                        ? "30px"
                        : "30px 0px 0px 30px",
                    }}
                  >
                    <Stack gap={1}>
                      <CustomImage
                        src={IMAGE_DME_LOGO_FRAME}
                        sx={{
                          width: 200,
                          height: "auto",
                        }}
                      />
                      <Typography
                        variant="h6"
                        align="center"
                        sx={{
                          color: ({ palette }) => palette?.common?.white,
                        }}
                      >
                        {COMMON_APP_NAME}
                      </Typography>
                      {APP_ENV === "production" ? (
                        <Chip
                          color="primary"
                          label="BETA"
                          size="small"
                          sx={{
                            mx: 5,
                          }}
                        />
                      ) : (
                        <Typography
                          variant="body1"
                          align="center"
                          sx={{
                            color: ({ palette }) => palette?.common?.white,
                            opacity: 0.5,
                          }}
                        >
                          dev v{pkJson?.version}
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                </Grid2>
                <Grid2
                  size={6}
                  sx={{
                    display: showSecondGrid ? "block" : "none",
                    opacity: showSecondGrid ? 1 : 0,
                    transition: `opacity ${delay}s ease-in-out`,
                    position: "relative",
                    bgcolor: ({ palette }) => palette?.background?.paper,
                    borderRadius: "0px 30px 30px 0px",
                  }}
                >
                  <Box
                    sx={{
                      px: 5,
                      py: {
                        md: 10,
                        xs: 7,
                      },
                    }}
                  >
                    <Container
                      sx={{
                        height: "100%",
                      }}
                    >
                      {children}
                    </Container>
                  </Box>
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      width: "100%",
                    }}
                  >
                    <Typography
                      variant="body2"
                      align="center"
                      color="textDisabled"
                    >
                      v{pkJson?.version}
                    </Typography>
                  </Box>
                </Grid2>
              </Grid2>
            </Box>
          </Container>
        </Stack>
      </Box>
    </ThemeProvider>
  )
}

export default memo(AuthLayout)
