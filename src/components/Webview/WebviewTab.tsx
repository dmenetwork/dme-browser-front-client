"use client"
import BookmarkBar from "@/components/Layout/BookmarkBar/BookmarkBar"
import SearchBar from "@/components/Layout/SearchBar/SearchBar"
import { CONFIG_WIDTH_WEBVIEW } from "@/config/config"
import NewPage from "@/components/NewPage/NewPage"
import { IRedux } from "@/types"
import { IFavorites, ITabsBrowser, ITabsBrowserTab } from "@/types/tabsBrowser"
import { IWorkspace, IWorkspaceSlot } from "@/types/workspace"
import { Box, Collapse } from "@mui/material"
import dynamic from "next/dynamic"
import { memo, useState } from "react"
import { useSelector } from "react-redux"
import { ICommon } from "@/types/common"
import ErrorComponent from "./ErrorScreen/ErrorComponent"
const Webview = dynamic(() => import("@/components/Webview/Webview"), {
  ssr: false,
})

const WebviewTab = ({
  tab,
  width,
}: {
  tab: ITabsBrowserTab
  width: number
}) => {
  const [newPageIdFocused, setNewPageIdFocused] = useState<string>("")
  const { tabs } = useSelector<IRedux, ITabsBrowser>(
    (state) => state?.tabsBrowser
  )
  const { workspaces } = useSelector<IRedux, IWorkspace>(
    (state) => state?.workspace
  )
  const { bookmarkVisible, favorites } = useSelector<IRedux, IFavorites>(
    (state) => state?.bookmark
  )

  const { errorUrl } = useSelector<IRedux, ICommon>((state) => state?.common)

  const activeWorkspace = workspaces.find((e: IWorkspaceSlot) => e?.IsActive)

  const activeTabs = tabs?.filter(
    (tab: ITabsBrowserTab) =>
      tab?.IsActive &&
      tab?.WorkspaceId === activeWorkspace?.WorkspaceId &&
      !tab?.IsMiniApp
  )

  const handleTabClick = (tab: ITabsBrowserTab) => {
    setNewPageIdFocused(tab.TabId)
  }

  return (
    <Box
      onClick={() => handleTabClick(tab)}
      sx={{
        width: activeTabs.length > 1 ? `${width}%` : "100%",
        minWidth: `${CONFIG_WIDTH_WEBVIEW?.min}%`,
        height: "100%",
        display:
          tab?.IsActive && tab?.WorkspaceId === activeWorkspace?.WorkspaceId
            ? "flex"
            : "none",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Box sx={{ flex: "0 0 auto" }}>
        <SearchBar tab={tab} newPageIdFocused={newPageIdFocused} />
        <Collapse in={bookmarkVisible} timeout={200}>
          <Box sx={{ flex: "0 0 auto" }}>
            <BookmarkBar favorites={favorites} tabId={tab.TabId} />
          </Box>
        </Collapse>
      </Box>
      <Box
        sx={{
          flex: "1 1 auto",
          overflow: "auto",
        }}
      >
        {errorUrl !== undefined &&
        errorUrl.code !== -3 &&
        errorUrl.code !== -30 ? (
          <ErrorComponent
            errorCode={errorUrl?.code ?? 0}
            message={errorUrl?.description ?? ""}
            tab={tab}
          />
        ) : tab?.URL ? (
          <Webview tab={tab} />
        ) : (
          <NewPage tab={tab} />
        )}
      </Box>
    </Box>
  )
}

export default memo(WebviewTab)
