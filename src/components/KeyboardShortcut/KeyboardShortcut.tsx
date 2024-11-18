import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut"
import { getAllHistory } from "@/redux/reducers/allHistory"
import { setCloseTab, setNewTab } from "@/redux/reducers/tabsBrowser"
import { handleGetAllHistory } from "@/services/allHistory"
import { IRedux } from "@/types"
import { ITabsBrowser, ITabsBrowserTab } from "@/types/tabsBrowser"
import { IWorkspace, IWorkspaceSlot } from "@/types/workspace"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

const KeyboardShortcut = () => {
  const { workspaces } = useSelector<IRedux, IWorkspace>(
    (state) => state?.workspace
  )
  const { tabs } = useSelector<IRedux, ITabsBrowser>(
    (state) => state?.tabsBrowser
  )
  const dispatch = useDispatch()

  // Evitar navegación hacia atrás en Next.js y Electron
  useEffect(() => {
    const preventBackNavigation = (): void => {
      history.pushState(null, "", window.location.href)
    }

    // Ejecuta preventBackNavigation inicialmente y al retroceder
    preventBackNavigation()
    window.addEventListener("popstate", preventBackNavigation)

    return () => {
      window.removeEventListener("popstate", preventBackNavigation)
    }
  }, [])

  type shortcutAction = {
    key: string
    ctrlKey?: boolean
    shiftKey?: boolean
    callback: (event: KeyboardEvent) => void
  }

  const shortCuts: shortcutAction[] = [
    {
      key: "t",
      ctrlKey: true,
      callback: () => {
        newTab()
      },
    },
    {
      key: "w",
      ctrlKey: true,
      callback: () => {
        closeCurrentTab()
      },
    },
  ]

  /*** ONLY FOR PRODUCTION ***/
  if (process?.env?.NODE_ENV === "production") {
    shortCuts.push({
      key: "r",
      ctrlKey: true,
      shiftKey: true,
      callback: (event: KeyboardEvent) => {
        event.preventDefault()
        console.log("Ctrl + Shift + R deshabilitado en producción.")
      },
    })

    shortCuts.push({
      key: "r",
      ctrlKey: true,
      shiftKey: false,
      callback: (event: KeyboardEvent) => {
        event.preventDefault()
        console.log("Ctrl + R deshabilitado en producción.")
      },
    })
  }

  useKeyboardShortcut(shortCuts)

  const newTab = () => {
    const activeWorkspace = workspaces.find((e: IWorkspaceSlot) => e?.IsActive)

    if (activeWorkspace) {
      dispatch(
        setNewTab({
          WorkspaceId: activeWorkspace?.WorkspaceId,
        })
      )
    } else {
      console.error("No active workspace found")
    }
  }

  const closeCurrentTab = async () => {
    const activeWorkspace = workspaces.find((e: IWorkspaceSlot) => e?.IsActive)
    const activeTabs = tabs?.filter(
      (e: ITabsBrowserTab) =>
        e?.WorkspaceId === activeWorkspace?.WorkspaceId &&
        e?.IsActive &&
        !e?.IsMiniApp
    )

    if (activeTabs.length > 0) {
      if (activeTabs.length >= 2) {
        // TABS SPLITTED
        const tab = activeTabs.find(
          (e: ITabsBrowserTab) => e?.SplitView && !e?.SplitView?.IsMain
        )

        dispatch(
          setCloseTab({
            TabId: tab?.TabId,
            WorkspaceId: activeWorkspace?.WorkspaceId,
          })
        )

        const res = await handleGetAllHistory()
        if (res?.success) {
          dispatch(getAllHistory({ allHistory: res?.allHistory }))
        }
      } else {
        dispatch(
          setCloseTab({
            TabId: activeTabs[0]?.TabId,
            WorkspaceId: activeWorkspace?.WorkspaceId,
          })
        )
      }
    } else {
      console.error("No active tabs")
    }
  }

  return null // No renderiza nada, solo maneja los atajos de teclado
}

export default KeyboardShortcut
