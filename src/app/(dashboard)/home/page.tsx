"use client"
import WebviewApp from "@/components/Webview/WebviewApp"
import WebviewTab from "@/components/Webview/WebviewTab"
import { IRedux } from "@/types"
import { ITabsBrowser, ITabsBrowserTab } from "@/types/tabsBrowser"
import { Box, Divider, Stack } from "@mui/material"
import { Fragment, memo, useState } from "react"
import { useSelector } from "react-redux"

const Home = () => {
  const { tabs } = useSelector<IRedux, ITabsBrowser>(
    (state) => state?.tabsBrowser
  )

  const DEFAULT_WIDTH: number = 50

  const [resizing, setResizing] = useState<boolean>(false)
  const [widths, setWidths] = useState({
    left: DEFAULT_WIDTH,
    right: DEFAULT_WIDTH,
  })
  const resizingPanel = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    setResizing(true)
    const startX = event.clientX

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.min(
        100,
        Math.max(
          0,
          widths.left + ((moveEvent.clientX - startX) / window.innerWidth) * 100
        )
      )

      requestAnimationFrame(() => {
        setWidths({ left: newWidth, right: 100 - newWidth })
      })
    }

    const handleMouseUp = () => {
      setResizing(false)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
  }

  return (
    <>
      <Stack
        direction="row"
        sx={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          width: "100%",
        }}
      >
        {tabs
          ?.filter((tab: ITabsBrowserTab) => tab?.IsMiniApp)
          ?.map((tab: ITabsBrowserTab, i: number) => (
            <Fragment key={i}>
              <WebviewApp tab={tab} />
            </Fragment>
          ))}

        {tabs
          ?.filter((tab: ITabsBrowserTab) => !tab?.IsMiniApp)
          ?.map((tab: ITabsBrowserTab, i: number) => (
            <Fragment key={i}>
              <WebviewTab
                tab={tab}
                width={i === 0 ? widths?.left : widths?.right}
              />
              {tabs?.filter(
                (tab: ITabsBrowserTab) => !tab?.IsMiniApp && tab?.SplitView
              ).length > 1 &&
                i === 0 && (
                  <Fragment>
                    <Box
                      sx={{
                        cursor: "col-resize",
                        width: resizing ? "100%" : 0,
                        height: "100%",
                        position: "absolute",
                        zIndex: (theme) => theme?.zIndex?.modal + 2,
                        alignSelf: "center",
                      }}
                      onMouseDown={resizingPanel}
                    />
                    <Box
                      onMouseDown={resizingPanel}
                      sx={{
                        cursor: "col-resize",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 10,
                        px: 1,
                        "&:hover": {
                          filter: "contrast(1.2)",
                          ".MuiDivider-root": {
                            bgcolor: ({ palette }) => palette?.grey?.[700],
                          },
                        },
                      }}
                    >
                      <Divider
                        sx={{
                          cursor: "col-resize",
                          width: 1.5,
                          bgcolor: ({ palette }) => palette?.grey?.[500],
                          height: 100,
                        }}
                      />
                    </Box>
                  </Fragment>
                )}
            </Fragment>
          ))}
      </Stack>
    </>
  )
}

export default memo(Home)
