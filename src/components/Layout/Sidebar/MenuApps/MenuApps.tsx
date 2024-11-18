import CustomImage from "@/components/CustomImage/CustomImage"
import { COMMON_IGNORE_CLICK_AWAY } from "@/constants/common"
import { setOpenSidebarApp } from "@/redux/reducers/tabsBrowser"
import { IRedux } from "@/types"
import { ITabsBrowser, ITabsBrowserTab } from "@/types/tabsBrowser"
import { Button, Stack, Tooltip } from "@mui/material"
import { memo, MouseEvent } from "react"
import { useDispatch, useSelector } from "react-redux"

const MenuApps = () => {
  const { tabs } = useSelector<IRedux, ITabsBrowser>(
    (state) => state?.tabsBrowser
  )
  const dispatch = useDispatch()

  const openApp = (e: MouseEvent<HTMLElement>, tab: ITabsBrowserTab) => {
    e?.stopPropagation()
    dispatch(setOpenSidebarApp({ TabId: tab?.TabId, IsLoaded: true }))
  }

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      gap={1}
      sx={{
        width: "100%",
        minHeight: "calc(100vh - 200px)",
      }}
    >
      {tabs
        ?.filter((tab: ITabsBrowserTab) => tab?.IsMiniApp)
        ?.map((tab: ITabsBrowserTab, i: number) => {
          return (
            <Tooltip
              key={i}
              title={tab?.Title}
              placement="right"
              arrow
              slotProps={{
                tooltip: { style: { color: "white" } },
              }}
            >
              <Button
                color="inherit"
                onClick={(e) => openApp(e, tab)}
                className={COMMON_IGNORE_CLICK_AWAY}
              >
                <CustomImage
                  src={tab?.Icon || ""}
                  sx={{
                    width: "auto",
                    height: 30,
                    objectFit: "cover",
                  }}
                />
              </Button>
            </Tooltip>
          )
        })}
    </Stack>
  )
}

export default memo(MenuApps)
