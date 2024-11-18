import CustomImage from "@/components/CustomImage/CustomImage"
import SearchInput from "@/components/SearchInput/SearchInput"
import SecuredWorkspacesIcon from "@/components/SecuredWorkspacesIcon/SecuredWorkspacesIcon"
import { favoritesToShow, microsoftApps } from "@/constants/common"
import { IMAGE_BG_TAB, IMAGE_DME_LOGO } from "@/constants/img"
import { NotificationsIcons } from "@/constants/notificationsHomeScreen"
// import { getRandomBgColor, getRandomWaveBg } from "@/helpers/color"
import { getDataFromUrl } from "@/helpers/url"
import { updateActiveTabWithUrlData } from "@/redux/reducers/tabsBrowser"
import { IRedux } from "@/types"
import { IAuth } from "@/types/auth"
import { Feature, INotificationsInNewTab } from "@/types/common"
import { Favorites, ITabsBrowserTab } from "@/types/tabsBrowser"
import {
  Box,
  Button,
  ButtonGroup,
  Collapse,
  Fade,
  Grid2 as Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  useTheme,
  Tooltip,
} from "@mui/material"
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar"
import { Sparkles, X } from "lucide-react"
import moment from "moment-timezone"
import { memo, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { TransitionGroup } from "react-transition-group"

const NewPage = ({ tab }: { tab: ITabsBrowserTab }) => {
  const { auth } = useSelector<IRedux, IAuth>((state) => state?.auth)
  const isSplit = tab.SplitView !== null
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const tabId = tab.TabId
  const [currentTime, setCurrentTime] = useState(moment())
  const [notificationsInBasket, setNotificationInBasket] = useState<
    INotificationsInNewTab[]
  >([])

  useEffect(() => {
    // Función que calcula cuánto tiempo falta para el próximo minuto exacto
    const calculateNextMinute = () => {
      const now = moment()
      const seconds = now.seconds()
      return (60 - seconds) * 1000 // Milisegundos hasta el próximo minuto exacto
    }

    // Función para actualizar el tiempo
    const updateCurrentTime = () => {
      setCurrentTime(moment())
    }

    // Calcular tiempo restante para el próximo minuto exacto
    const timeout = setTimeout(() => {
      // Actualizamos el tiempo en el minuto exacto
      updateCurrentTime()

      // Luego, empezamos el intervalo de cada 60 segundos
      const interval = setInterval(updateCurrentTime, 60000)

      // Limpiar el intervalo al desmontar el componente
      return () => clearInterval(interval)
    }, calculateNextMinute())

    // Limpiar el timeout si el componente se desmonta antes de que se ejecute
    return () => clearTimeout(timeout)
  }, [])

  const handleRemoveNotification = (id: number) => {
    setNotificationInBasket((prev) => [...prev.filter((i) => i.Id !== id)])
  }

  const handleUrlChange = async (FavUrl: string) => {
    try {
      const urlData = await getDataFromUrl(FavUrl)

      dispatch(
        updateActiveTabWithUrlData({ urlData, isInBookmark: false, tabId })
      )
    } catch (err) {
      console.error("Error fetching URL data:", err)
    }
  }

  type VariantOptions =
    | "primary"
    | "secondary"
    | "error"
    | "warning"
    | "info"
    | "success"

  const createNotification = (
    id: number,
    icon: string,
    title: string,
    message: string,
    variant: VariantOptions,
    cta?: React.JSX.Element
  ) => {
    return {
      Id: id,
      Icon: icon,
      Title: title,
      Message: message,
      Variant: variant,
      Cta: cta,
    }
  }

  useEffect(() => {
    const newNotifications = [
      createNotification(
        1,
        "bell",
        "New Message",
        "You have received a new message.",
        "info",
        <ButtonGroup aria-label="Basic button group" fullWidth={true}>
          <Button
            sx={{
              color: "white",
              backgroundColor: "rgba(192, 176, 215, 0.32)",
              border: "none",
            }}
          >
            Read
          </Button>
        </ButtonGroup>
      ),
      createNotification(
        2,
        "calendar",
        "Meeting Reminder",
        "You have a meeting at 3 PM.",
        "warning",
        <ButtonGroup aria-label="Basic button group" fullWidth={true}>
          <Button
            sx={{
              color: "white",
              backgroundColor: "rgba(192, 176, 215, 0.32)",
              border: "none",
            }}
          >
            Go
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: "white",
              backgroundColor: "rgba(192, 176, 215, 0.097)",
              border: "none",
            }}
          >
            Snooze
          </Button>
        </ButtonGroup>
      ),
      createNotification(
        4,
        "info",
        "System Alert",
        "Please complete this form.",
        "error",
        <ButtonGroup aria-label="Basic button group" fullWidth={true}>
          <Button
            sx={{
              color: "white",
              backgroundColor: "rgba(192, 176, 215, 0.32)",
              border: "none",
            }}
          >
            Read
          </Button>
        </ButtonGroup>
      ),
      createNotification(
        5,
        "info",
        "Information",
        "Today you can leave one hour earlier.",
        "info"
      ),
    ]
    setNotificationInBasket(newNotifications)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Fade in={tab.IsActive} key={tab.TabId} timeout={300}>
      <Box
        sx={{
          height: "100%",
          maxHeight: "calc(100vh - 85px)",
          borderRadius: "10px",
          overflowX: "auto",
          p: "1.5rem 2rem 0 2rem",
          backgroundImage: `url(${IMAGE_BG_TAB})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundColor: "rgba(0, 0, 0, 0.525)",
          backgroundBlendMode: "overlay",
          "&::-webkit-scrollbar": {
            width: "8px",
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
        <Grid
          container
          spacing={4}
          sx={{
            height: "100%",
          }}
        >
          {/* frist */}
          <Grid
            size={{
              lg: isSplit ? 12 : 9,
              md: 12,
              xs: 12,
            }}
          >
            <Box
              sx={{
                backgroundColor: "rgba(192, 176, 215, 0.32)",
                borderRadius: 2,
                p: 2,
                width: "100%",
                borderColor: "rgba(213, 205, 224, 0.64)",
                borderStyle: "solid",
                borderWidth: "0.063rem",
              }}
            >
              <Grid container spacing={4}>
                <CustomImage
                  src={IMAGE_DME_LOGO}
                  sx={{
                    width: "auto",
                    height: 80,
                    objectFit: "cover",
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      color: ({ palette }) => palette?.text?.primary,
                      // fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    dME
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ color: ({ palette }) => palette?.text?.primary }}
                  >
                    Re-engineer the browser for modern businesses.
                  </Typography>
                </Box>
              </Grid>
            </Box>

            <Box sx={{ py: 4 }}>
              <SearchInput tab={tab} isFromNewTab={true} />
            </Box>

            <Box>
              <Grid container spacing={4}>
                <Grid size={{ md: isSplit ? 12 : 6, xs: 12 }}>
                  <Box
                    sx={{
                      backgroundColor: "rgba(192, 176, 215, 0.32)",
                      borderRadius: 2,
                      px: "2rem",
                      py: "2.125rem",
                      borderColor: "rgba(213, 205, 224, 0.64)",
                      borderStyle: "solid",
                      borderWidth: "0.063rem",
                    }}
                  >
                    <Stack>
                      <Typography
                        variant="h6"
                        sx={{
                          color: ({ palette }) => palette?.text?.primary,
                        }}
                      >
                        Good Morning,{" "}
                        {auth?.preferred_username ?? auth?.given_name}
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{
                          color: ({ palette }) => palette?.text?.primary,
                          fontWeight: "bold",
                        }}
                      >
                        {currentTime.format("HH:mm A")}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: ({ palette }) => palette?.text?.primary }}
                        fontSize={16}
                      >
                        {currentTime.format("MMMM DD")},{" "}
                        {currentTime.format("YYYY")}
                      </Typography>
                    </Stack>
                  </Box>
                </Grid>
                <Grid size={{ md: isSplit ? 12 : 6, xs: 12 }}>
                  <Box
                    sx={{
                      backgroundColor: "rgba(192, 176, 215, 0.32)",
                      borderRadius: 2,
                      px: "2rem",
                      py: "2.125rem",
                      borderColor: "rgba(213, 205, 224, 0.64)",
                      borderStyle: "solid",
                      borderWidth: "0.063rem",
                    }}
                  >
                    <Grid container spacing={1} sx={{ alignItems: "center" }}>
                      <Grid size={2} sx={{ mr: isSplit ? 0 : -2 }}>
                        <Sparkles color="white" size={40} />
                      </Grid>
                      <Grid size={10}>
                        <Stack>
                          <Typography
                            variant="h6"
                            sx={{
                              color: ({ palette }) => palette?.text?.primary,
                            }}
                          >
                            North Star Metric
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{
                              color: ({ palette }) => palette?.text?.primary,
                              fontWeight: "bold",
                            }}
                          >
                            350 / 3.000
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              color: ({ palette }) => palette?.text?.primary,
                            }}
                            fontSize={16}
                          >
                            Active devices secured
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ py: 4 }}>
              <Grid container spacing={4}>
                <Grid size={{ md: 6, xs: 12 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: ({ palette }) => palette?.text?.primary,
                      pb: 2,
                    }}
                  >
                    Personal Browsing
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: "rgba(192, 176, 215, 0.32)",
                      borderRadius: 2,
                      px: "2rem",
                      py: "2.125rem",
                      borderColor: "rgba(213, 205, 224, 0.64)",
                      borderStyle: "solid",
                      borderWidth: "0.063rem",
                      maxHeight: "calc(100vh - 610px)",
                      overflowY: "auto",
                      "&::-webkit-scrollbar": {
                        width: "8px",
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
                    <Grid
                      container
                      spacing={4}
                      sx={{ alignItems: "center", justifyContent: "center" }}
                    >
                      {favoritesToShow?.map(
                        (favorites: Favorites, i: number) => {
                          return (
                            <Tooltip
                              title={favorites.title}
                              arrow
                              key={i}
                              slotProps={{
                                tooltip: { style: { color: "white" } },
                              }}
                            >
                              <Box
                                onClick={() => handleUrlChange(favorites.url)}
                                sx={{
                                  p: 1,
                                  borderRadius: 2,
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  cursor: "pointer",
                                  "&:hover": {
                                    transform: "scale(1.2)",
                                    transition: "transform 0.2s ease-in-out",
                                  },
                                }}
                              >
                                <CustomImage
                                  src={favorites.icon}
                                  sx={{
                                    height: 48,
                                    width: "auto",
                                    objectFit: "cover",
                                  }}
                                />
                              </Box>
                            </Tooltip>
                          )
                        }
                      )}
                    </Grid>
                  </Box>
                </Grid>
                <Grid size={{ md: 6, xs: 12 }}>
                  <Box
                    sx={{
                      display: "flex",
                      pb: 2,
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: ({ palette }) => palette?.text?.primary,
                      }}
                    >
                      Secured Workspace
                    </Typography>
                    <SecuredWorkspacesIcon />
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: "rgba(192, 176, 215, 0.32)",
                      borderRadius: 2,
                      px: "2rem",
                      py: "2.125rem",
                      borderColor: "rgba(213, 205, 224, 0.64)",
                      borderStyle: "solid",
                      borderWidth: "0.063rem",
                      maxHeight: "calc(100vh - 610px)",
                      overflowY: "auto",
                      "&::-webkit-scrollbar": {
                        width: "8px",
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
                    <Grid
                      container
                      spacing={4}
                      sx={{ alignItems: "center", justifyContent: "center" }}
                    >
                      {microsoftApps?.map((feature: Feature, i: number) => {
                        return (
                          <Tooltip
                            title={feature.name}
                            arrow
                            key={i}
                            slotProps={{
                              tooltip: { style: { color: "white" } },
                            }}
                          >
                            <Box
                              onClick={() => handleUrlChange(feature.url)}
                              sx={{
                                p: 1,
                                borderRadius: 2,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                                "&:hover": {
                                  transform: "scale(1.2)",
                                  transition: "transform 0.2s ease-in-out",
                                },
                              }}
                            >
                              <CustomImage
                                src={feature.icon}
                                sx={{
                                  height: "auto",
                                  width: 48,
                                  objectFit: "cover",
                                }}
                              />
                            </Box>
                          </Tooltip>
                        )
                      })}
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          {/* Second */}
          <Grid
            container
            size={{
              lg: 3,
              md: 12,
              sm: 12,
              xs: 12,
            }}
            sx={{ display: isSplit ? "none" : "block" }}
            rowSpacing={2}
          >
            <Grid
              size={{
                md: 12,
                sm: 10,
                xs: 12,
              }}
            >
              <Stack
                sx={{
                  backgroundColor: "rgba(192, 176, 215, 0.32)",
                  borderColor: "rgba(213, 205, 224, 0.64)",
                  borderStyle: "solid",
                  borderWidth: "0.063rem",
                  borderRadius: 2,
                  width: "100%",
                  px: "1.094rem",
                  py: 1,
                }}
              >
                <DateCalendar
                  views={["year", "month", "day"]}
                  onChange={(newValue) => console.log("-------", newValue)}
                  sx={{
                    width: "100%",
                    color: "white",
                    "& .MuiPickersDay-root.Mui-selected": {
                      backgroundColor: "rgba(34, 9, 42, 1)",
                    },
                    "& .MuiTypography-root, .MuiSvgIcon-root, .MuiPickersDay-root.Mui-selected, .MuiPickersDay-root, ":
                      {
                        color: "#fff",
                      },
                  }}
                />
                <Stack
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    textAlign: "center",
                    px: 3,
                    backgroundColor: "rgba(192, 176, 215, 0.32)",
                    borderColor: "rgba(213, 205, 224, 0.64)",
                    borderStyle: "solid",
                    borderWidth: "0.063rem",
                    borderRadius: 2,
                  }}
                  direction={"row"}
                  gap={1}
                >
                  <ListItemText
                    primary="Reminder: Send YC App"
                    secondary="Today at 18:30"
                    primaryTypographyProps={{
                      variant: "body1",
                      color: palette?.text?.primary,
                      width: "90%",
                    }}
                    secondaryTypographyProps={{
                      variant: "caption",
                      color: palette?.text?.primary,
                      width: "90%",
                    }}
                  />
                </Stack>
              </Stack>
            </Grid>
            <Grid
              size={{
                md: 12,
                sm: 10,
                xs: 12,
              }}
              sx={{
                marginTop: 2,
                flexGrow: 1,
                maxHeight: "calc(100vh - 580px)",
                height: "100%",
                overflowY: "auto",
                borderRadius: 2,
                "&::-webkit-scrollbar": {
                  width: "8px",
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
              <List>
                <TransitionGroup>
                  {notificationsInBasket?.map((item) => (
                    <Collapse key={item.Id}>
                      <Tooltip
                        placement="right-start"
                        title={
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            title="Delete"
                            onClick={() => handleRemoveNotification(item.Id)}
                            sx={{
                              backgroundColor: "rgba(228, 218, 242, 1)",
                              marginLeft: -7,
                              marginTop: -2.5,
                              "&:hover": {
                                backgroundColor: "rgba(228, 218, 242, 1)",
                                opacity: 1,
                              },
                            }}
                          >
                            <X size={18} color="black" />
                          </IconButton>
                        }
                        slotProps={{
                          tooltip: { style: { color: "white" } },
                        }}
                        PopperProps={{
                          sx: {
                            "& .MuiTooltip-tooltip": {
                              backgroundColor: "transparent",
                              boxShadow: "none",
                              padding: 0,
                            },
                          },
                        }}
                      >
                        <Box
                          sx={{
                            backgroundColor: "rgba(192, 176, 215, 0.32)",
                            borderColor: "rgba(213, 205, 224, 0.64)",
                            borderStyle: "solid",
                            borderWidth: "0.063rem",
                            my: 1.6,
                            mr: 0.8,
                            borderRadius: 2,
                          }}
                        >
                          <ListItem sx={{ p: 1 }}>
                            {item.Icon && (
                              <ListItemIcon
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  color: ({ palette }) =>
                                    palette?.text?.primary,
                                }}
                              >
                                {NotificationsIcons[item.Icon]}
                              </ListItemIcon>
                            )}

                            <ListItemText
                              primary={item.Title}
                              secondary={item.Message}
                              primaryTypographyProps={{
                                variant: "body1",
                                color: "white",
                                width: "90%",
                              }}
                              secondaryTypographyProps={{
                                variant: "caption",
                                color: "white",
                                width: "80%",
                              }}
                            />
                          </ListItem>
                          {item.Cta && <Box>{item.Cta}</Box>}
                        </Box>
                      </Tooltip>
                    </Collapse>
                  ))}
                </TransitionGroup>
              </List>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  )
}

export default memo(NewPage)
