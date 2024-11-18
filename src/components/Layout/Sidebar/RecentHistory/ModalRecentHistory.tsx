import CustomImage from "@/components/CustomImage/CustomImage"
import { IMAGE_DME_LOGO } from "@/constants/img"
import { setGlobalBackdrop } from "@/redux/reducers/common"
import { setNewTabWithUrl } from "@/redux/reducers/tabsBrowser"
import { IRedux } from "@/types"
import { IAllHistory, IHistory } from "@/types/allHistory"
import { IWorkspace } from "@/types/workspace"
import {
  Card,
  List,
  ListItemButton,
  ListItemText,
  Popover,
  Stack,
  Typography,
} from "@mui/material"
import { Fragment, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"

const ModalRecentHistory = ({
  anchor,
  closeRecentHistory,
}: {
  anchor: null | HTMLElement
  closeRecentHistory: () => void
}) => {
  const { workspaces } = useSelector<IRedux, IWorkspace>(
    (state) => state?.workspace
  )

  const workspaceActive = workspaces.find((workspaces) => workspaces.IsActive)

  const { allHistory } = useSelector<IRedux, IAllHistory>(
    (state) => state?.allHistory
  )
  //solo muestra las pestañas cerradas recientemente incluyendo las repetidas
  const getRecentlyClosedTabs = (history: IHistory[]) => {
    const tabs: IHistory[] = []
    history?.forEach((entry) => {
      if (tabs.length < 21 && entry.updatedAt !== entry.createdAt) {
        tabs.push(entry)
      }
    })
    return tabs
  }

  // Llamar a la función para obtener las pestañas cerradas recientemente
  const recentlyClosedTabs = getRecentlyClosedTabs(allHistory)

  const dispatch = useDispatch()
  const popoverRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (anchor) {
      setBackdrop(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchor])

  const closeForm = (force: boolean) => {
    if (force) {
      closeRecentHistory()
      setBackdrop(false)
    }
  }

  const setBackdrop = (e: boolean) => {
    dispatch(
      setGlobalBackdrop({
        isOpen: e,
        loading: false,
        body: null,
      })
    )
  }

  const handleOpenRecentlyClosed = (URL: string) => {
    closeRecentHistory()
    setBackdrop(false)
    dispatch(
      setNewTabWithUrl({
        WorkspaceId: workspaceActive?.WorkspaceId,
        URL,
      })
    )
  }

  return (
    <>
      <Popover
        onClose={() => closeForm(true)}
        open={anchor ? true : false}
        anchorEl={anchor}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          zIndex: ({ zIndex }) => zIndex?.drawer + 1,
          maxWidth: 400,
        }}
        ref={popoverRef}
      >
        <Card
          sx={{
            backdropFilter: {
              md: "blur(10px) saturate(100%)",
              xs: "blur(3px) saturate(70%)",
            },
            backgroundColor: "rgba(255, 255, 255, 0.3)", // Fondo translúcido
            borderRadius: 2, // Bordes redondeados
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", // Sombra suave
            border: "1px solid rgba(255, 255, 255, 0.2)", // Borde sutil
          }}
        >
          <Stack
            direction="row"
            justifyContent="start"
            alignItems="center"
            sx={{ px: 2 }}
          >
            <Typography
              variant="inherit"
              sx={{ p: 2, fontWeight: "bold" }}
              color="textSecondary"
            >
              Recently Closed
            </Typography>
          </Stack>
          <List
            dense
            sx={{
              overflow: "auto",
              maxHeight: 300,
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f1f1",
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
            {recentlyClosedTabs?.map((tabClosed: IHistory) => {
              return (
                <Fragment key={tabClosed.tabId}>
                  <ListItemButton
                    onClick={() => handleOpenRecentlyClosed(tabClosed.url)}
                    sx={{
                      pl: 3,
                      pr: 2,
                    }}
                  >
                    <ListItemText
                      primary={
                        <Stack direction="row" alignItems="center" gap={2}>
                          {tabClosed?.icon ? (
                            <CustomImage
                              src={tabClosed?.icon}
                              sx={{
                                width: "auto",
                                height: 20,
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <CustomImage
                              src={IMAGE_DME_LOGO}
                              sx={{
                                width: "auto",
                                height: 20,
                                objectFit: "cover",
                              }}
                            />
                          )}
                          <Typography variant="subtitle1" color="textSecondary">
                            {tabClosed?.title.length > 30
                              ? `${tabClosed?.title.substring(0, 30)}...`
                              : tabClosed?.title}
                          </Typography>
                        </Stack>
                      }
                    />
                  </ListItemButton>
                </Fragment>
              )
            })}
          </List>
        </Card>
      </Popover>
    </>
  )
}

export default ModalRecentHistory
