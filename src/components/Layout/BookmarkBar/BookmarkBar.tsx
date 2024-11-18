import CustomImage from "@/components/CustomImage/CustomImage"
import { CONFIG_GLASS_MODE } from "@/config/config"
import { getDataFromUrl } from "@/helpers/url"
import { updateActiveTabWithUrlData } from "@/redux/reducers/tabsBrowser"
import { Favorites } from "@/types/tabsBrowser"
import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material"
import { ChevronDown } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"

const BookmarkBar = ({
  favorites,
  tabId,
}: {
  favorites: Favorites[]
  tabId: string
}) => {
  const height: number = 28
  const dispatch = useDispatch()
  const favsLimitNumber = 7
  const [visibleItems, setVisibleItems] = useState(favsLimitNumber)
  const [favoritesInPopover, setFavoritesInPopover] = useState<Favorites[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  useEffect(() => {
    const getItemsOutsideVisible = () => {
      return favorites.slice(visibleItems)
    }

    setFavoritesInPopover(getItemsOutsideVisible())
  }, [visibleItems, favorites])

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const itemWidth = 120 // Aproximado del ancho de cada favorito (ajustar según tu diseño)
        const availableItems = Math.floor(containerWidth / itemWidth)

        setVisibleItems(
          availableItems < favorites.length ? availableItems : favorites.length
        )
      }
    }

    // Usamos ResizeObserver para detectar cambios en el tamaño del contenedor
    const resizeObserver = new ResizeObserver(() => handleResize())
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    // Limpia el observer cuando se desmonta el componente
    return () => resizeObserver.disconnect()
  }, [favsLimitNumber, favorites.length])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? "simple-popover" : undefined

  const handleUrlChange = async (FavUrl: string) => {
    try {
      const urlData = await getDataFromUrl(FavUrl)

      dispatch(
        updateActiveTabWithUrlData({ urlData, isInBookmark: true, tabId })
      )
    } catch (err) {
      console.error("Error fetching URL data:", err)
    }
  }

  return (
    <AppBar
      position="sticky"
      color="inherit"
      variant="elevation"
      elevation={0}
      ref={containerRef}
      sx={{
        borderRadius: "10px",
        marginBottom: "0.2rem",
        padding: 2,
        height,
        paddingLeft: 2,
        justifyContent: "center",

        bgcolor: CONFIG_GLASS_MODE
          ? "rgba(255, 255, 255, 0.8)"
          : ({ palette }) => palette?.background?.paper,
        backdropFilter: CONFIG_GLASS_MODE
          ? {
              md: "blur(3px) saturate(100%)",
              xs: "blur(3px) saturate(70%)",
            }
          : "none",
        boxShadow: CONFIG_GLASS_MODE ? "0 4px 30px rgba(0, 0, 0, 0.7)" : "none",
      }}
    >
      <Stack
        direction="row"
        // gap={1}
        sx={{
          alignItems: "center",
          width: "100%",
        }}
      >
        {favorites.slice(0, visibleItems)?.map((fav: Favorites, i: number) => {
          return (
            <Stack
              direction="row"
              flexWrap={"nowrap"}
              gap={0.5}
              key={i}
              sx={{
                maxWidth: 150,
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                borderRadius: "10px",
                padding: "1px 10px",
                transition: "background-color 0.3s",
                "&:hover": {
                  backgroundColor: "rgba(220, 209, 209, 0.826)",
                },
              }}
              onClick={() => handleUrlChange(fav.url)}
            >
              <CustomImage
                src={fav.icon}
                sx={{
                  height: 15,
                  width: 15,
                }}
              />
              <Typography
                variant="caption"
                textAlign="center"
                noWrap
                sx={{
                  color: ({ palette }) => palette?.text?.secondary,
                }}
              >
                {fav.title?.length > 10
                  ? `${fav.title.substring(0, 10)}...`
                  : fav.title}
              </Typography>
            </Stack>
          )
        })}
        {favoritesInPopover.length > 0 && (
          <IconButton
            id={id}
            onClick={handleClick}
            sx={{
              borderRadius: "50%",
              marginLeft: "auto",
            }}
          >
            <ChevronDown size={18} />
          </IconButton>
        )}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": id,
          }}
        >
          {favoritesInPopover?.map((fav: Favorites, i: number) => {
            return (
              <MenuItem
                onClick={() => (handleUrlChange(fav.url), handleClose())}
                key={i}
                sx={{ minWidth: 150 }}
              >
                <CustomImage
                  src={fav.icon}
                  sx={{
                    height: 15,
                    width: 15,
                    mr: 1.5,
                  }}
                />
                <Typography
                  variant="caption"
                  textAlign="center"
                  sx={{
                    color: ({ palette }) => palette?.common?.black,
                  }}
                >
                  {fav.title?.length > 10
                    ? `${fav.title.substring(0, 10)}...`
                    : fav.title}
                </Typography>
              </MenuItem>
            )
          })}
        </Menu>
      </Stack>
    </AppBar>
  )
}

export default BookmarkBar
