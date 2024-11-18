import CustomImage from "@/components/CustomImage/CustomImage"
import ModalNewWorkspace from "@/components/Layout/Sidebar/Workspaces/ModalNewWorkspace"
import { IMAGE_DME_LOGO } from "@/constants/img"
import useIconMap from "@/constants/WorkspacesIcons"
import { getColorWorkspace } from "@/helpers/color"
import { setGlobalBackdrop } from "@/redux/reducers/common"
import { setChangeActivetWorkspace } from "@/redux/reducers/workspace"
import { IRedux } from "@/types"
import { ITabsBrowser, ITabsBrowserTab } from "@/types/tabsBrowser"
import { IWorkspace, IWorkspaceSlot } from "@/types/workspace"
import {
  Card,
  Chip,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  Stack,
  Typography,
  useTheme,
} from "@mui/material"
import { ChevronDown, ChevronUp, Plus, Settings2 } from "lucide-react"
import { Fragment, memo, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

const ModalWorkspace = ({
  anchor,
  closeWorkspaces,
}: {
  anchor: null | HTMLElement
  closeWorkspaces: () => void
}) => {
  const iconSize: number = 20
  const { workspaces } = useSelector<IRedux, IWorkspace>(
    (state) => state?.workspace
  )
  const { tabs } = useSelector<IRedux, ITabsBrowser>(
    (state) => state?.tabsBrowser
  )
  const dispatch = useDispatch()
  const popoverRef = useRef<HTMLDivElement | null>(null)
  const [collapseWorkspace, setCollapseWorkspace] = useState<string | null>(
    null
  )
  const [anchorForm, setAnchorForm] = useState<null | HTMLElement>(null)
  const [editingWorkspace, setEditingWorkspace] =
    useState<IWorkspaceSlot | null>(null)
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === "dark"
  const iconMapToShow = useIconMap(isDarkMode)

  useEffect(() => {
    if (anchor) {
      setBackdrop(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchor])

  const closeForm = (force: boolean) => {
    setAnchorForm(null)
    if (force) {
      closeWorkspaces()
      setBackdrop(false)
    }
  }

  const openForm = (
    e: React.MouseEvent<HTMLElement>,
    editWorkspace?: IWorkspaceSlot
  ) => {
    setAnchorForm(e?.currentTarget)
    e?.stopPropagation()
    if (editWorkspace) {
      setEditingWorkspace(editWorkspace)
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

  const expandWorkspace = (
    e: IWorkspaceSlot,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event?.stopPropagation()
    setCollapseWorkspace(
      collapseWorkspace === e?.WorkspaceId ? null : e?.WorkspaceId
    )
  }

  const changeCurrentWorkspace = (e: IWorkspaceSlot) => {
    dispatch(setChangeActivetWorkspace({ workspaceId: e?.WorkspaceId }))
    setBackdrop(false)
    closeWorkspaces()
  }

  const cleanEditingWorkspace = () => {
    setEditingWorkspace(null)
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
            <CustomImage
              src={IMAGE_DME_LOGO}
              sx={{
                width: "auto",
                height: 15,
                objectFit: "cover",
              }}
            />
            <Typography variant="subtitle2" sx={{ p: 2 }} color="textSecondary">
              dME Spaces
            </Typography>
          </Stack>
          <List
            dense
            sx={{
              filter: `saturate(${anchorForm ? `10` : `100`}%)`,
            }}
          >
            {workspaces?.map((e: IWorkspaceSlot, i: number) => {
              return (
                <Fragment key={i}>
                  <ListItemButton
                    onClick={() => changeCurrentWorkspace(e)}
                    sx={{
                      bgcolor: ({ palette }) =>
                        e?.IsActive
                          ? `${getColorWorkspace({
                              palette,
                              color: e?.Color,
                            })}1A`
                          : "none",
                      borderLeft: 5,
                      borderLeftColor: ({ palette }) =>
                        e?.IsActive
                          ? getColorWorkspace({ palette, color: e?.Color })
                          : "transparent",
                      pl: 3,
                      pr: 2,
                      "&:hover": {
                        borderLeftColor: ({ palette }) =>
                          getColorWorkspace({ palette, color: e?.Color }),
                        bgcolor: ({ palette }) =>
                          e?.IsActive
                            ? `${getColorWorkspace({
                                palette,
                                color: e?.Color,
                              })}1A`
                            : "none",
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Stack direction="row" alignItems="center" gap={2}>
                          {e?.Icon ? (
                            iconMapToShow[e?.Icon as keyof typeof iconMapToShow]
                          ) : (
                            <CustomImage
                              src={IMAGE_DME_LOGO}
                              sx={{
                                width: "auto",
                                height: 30,
                                objectFit: "cover",
                              }}
                            />
                          )}
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            fontWeight={e?.IsActive ? 600 : 100}
                          >
                            {e?.Title}
                          </Typography>
                          <Chip
                            variant="filled"
                            color="default"
                            size="small"
                            label={
                              tabs?.filter(
                                (tab: ITabsBrowserTab) =>
                                  tab?.WorkspaceId === e?.WorkspaceId &&
                                  !tab?.IsMiniApp
                              ).length
                            }
                          />
                        </Stack>
                      }
                    />
                    <IconButton
                      sx={{ ml: 2 }}
                      onClick={(event) => expandWorkspace(e, event)}
                    >
                      {e?.WorkspaceId === collapseWorkspace ? (
                        <ChevronUp size={iconSize} />
                      ) : (
                        <ChevronDown size={iconSize} />
                      )}
                    </IconButton>
                    <IconButton onClick={(event) => openForm(event, e)}>
                      <Settings2 size={iconSize} />
                    </IconButton>
                  </ListItemButton>
                  <Collapse
                    in={e?.WorkspaceId === collapseWorkspace ? true : false}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {tabs
                        ?.filter(
                          (tab: ITabsBrowserTab) =>
                            tab?.WorkspaceId === collapseWorkspace &&
                            !tab?.IsMiniApp
                        )
                        ?.map((tab: ITabsBrowserTab, z: number) => {
                          return (
                            <ListItemText
                              key={z}
                              primary={
                                <Stack
                                  direction="row"
                                  justifyContent="left"
                                  alignItems="center"
                                  gap={1}
                                  sx={{ px: 5 }}
                                >
                                  <CustomImage
                                    src={tab?.Icon || ""}
                                    sx={{
                                      height: 18,
                                      width: "auto",
                                      objectFit: "cover",
                                    }}
                                  />
                                  <Typography
                                    variant="body2"
                                    align="left"
                                    color="textSecondary"
                                    noWrap
                                    sx={{
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {tab?.Title}1{" "}
                                  </Typography>
                                </Stack>
                              }
                            />
                          )
                        })}
                    </List>
                  </Collapse>
                </Fragment>
              )
            })}
            <Divider />
            <ListItemButton
              disabled={Boolean(anchorForm)}
              onClick={openForm}
              sx={{
                borderLeft: 5,
                borderLeftColor: "transparent",
                pl: 3,
                pr: 7,
              }}
            >
              <ListItemIcon>
                <Plus />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" color="textSecondary">
                    New Space
                  </Typography>
                }
              />
            </ListItemButton>
          </List>
        </Card>
      </Popover>
      <ModalNewWorkspace
        anchor={anchorForm}
        closeForm={closeForm}
        editingWorkspace={editingWorkspace}
        cleanEditingWorkspace={cleanEditingWorkspace}
      />
    </>
  )
}

export default memo(ModalWorkspace)
