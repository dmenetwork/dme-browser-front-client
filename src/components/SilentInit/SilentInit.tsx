"use client"
// import { COMMON_DEFAULT_BROWSER_URL } from "@/constants/common"
// import { getDataFromUrl } from "@/helpers/url"
import { getAllHistory } from "@/redux/reducers/allHistory"
import { addAllFavorites } from "@/redux/reducers/bookmark"
import {
  setDefaultTab,
  setNewTab,
  setRestoreTabs,
} from "@/redux/reducers/tabsBrowser"
import {
  getWorkspaces,
  setDefaultWorkspace,
  // setRestoreWorkspaces,
} from "@/redux/reducers/workspace"
import { handleGetAllHistory } from "@/services/allHistory"
import { getAllBookmarks } from "@/services/bookmark"
import { restoreSession } from "@/services/restoreSession"
import { loadAllWorkspaces } from "@/services/workspaces"
import { IRedux } from "@/types"
import { ITabsBrowser, ITabsBrowserTab } from "@/types/tabsBrowser"
import { IWorkspace } from "@/types/workspace"
import { memo, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

const SilentInit = () => {
  const { workspaces } = useSelector<IRedux, IWorkspace>(
    (state) => state?.workspace
  )
  const { tabs } = useSelector<IRedux, ITabsBrowser>(
    (state) => state?.tabsBrowser
  )

  const dispatch = useDispatch()

  useEffect(() => {
    loadWorkspaces()
    // restoreWorkspacesAndTabs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (workspaces.length === 0) {
      defaultWorkspace()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaces])

  useEffect(() => {
    if (
      workspaces.length === 1 &&
      tabs?.filter((tab: ITabsBrowserTab) => !tab?.IsMiniApp).length === 0
    ) {
      defaultTab()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaces, tabs])

  useEffect(() => {
    if (workspaces.length === 1) {
      loadFavorites()
      loadAllHistory()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaces])

  const defaultWorkspace = async () => {
    dispatch(setDefaultWorkspace())
  }

  const defaultTab = async () => {
    // RENDERIZAR PAGINA POR DEFECTO
    // const data = await getDataFromUrl(COMMON_DEFAULT_BROWSER_URL)
    //   .then((res) => res)
    //   .catch((err) => err)
    // dispatch(setDefaultCustomUrl({ data: { ...data, WorkspaceId: workspaces[0]?.WorkspaceId } }))
    dispatch(setDefaultTab({ WorkspaceId: workspaces[0]?.WorkspaceId }))
  }

  const loadFavorites = async () => {
    const res = await getAllBookmarks()
    if (res?.success) {
      dispatch(addAllFavorites({ favorites: res?.bookmarks }))
    }
  }

  const loadAllHistory = async () => {
    const res = await handleGetAllHistory()
    if (res?.success) {
      dispatch(getAllHistory({ allHistory: res?.allHistory }))
    }
  }

  const loadWorkspaces = async () => {
    try {
      const { workspaces } = await loadAllWorkspaces()
      if (workspaces && workspaces.length > 0) {
        dispatch(getWorkspaces({ workspaces }))
        const workspaceActive = workspaces.find(
          (workspaces) => workspaces.IsActive
        )

        restoreWorkspacesAndTabs(workspaceActive?.WorkspaceId)
      }
    } catch (e) {
      console.log("🚀 ~ loadAllWorkspaces ~ e:", e)
    }
  }

  const restoreWorkspacesAndTabs = async (workspaceId: string | undefined) => {
    try {
      const { success, tabs } = await restoreSession()

      if (success && tabs && tabs.length > 0) {
        dispatch(
          setRestoreTabs({
            tabs,
            workspaceActive: workspaceId,
          })
        )
        dispatch(
          setNewTab({
            WorkspaceId: workspaceId,
          })
        )
      }
    } catch (e) {
      console.log("🚀 ~ restoreWorkspacesAndTabs ~ e:", e)
    }
  }

  return <></>
}

export default memo(SilentInit)
