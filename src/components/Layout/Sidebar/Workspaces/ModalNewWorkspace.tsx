import CustomImage from "@/components/CustomImage/CustomImage"
import { IMAGE_DME_LOGO } from "@/constants/img"
import { getColorWorkspace } from "@/helpers/color"
import { setGlobalBackdrop } from "@/redux/reducers/common"
import { setNewWorkspace } from "@/redux/reducers/workspace"
import { IWorkspaceSlot } from "@/types/workspace"
import {
  Box,
  Button,
  Card,
  Menu,
  MenuItem,
  Popover,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material"
import { Plus } from "lucide-react"
import { memo, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import useIconMap from "@/constants/WorkspacesIcons"

const ModalNewWorkspace = ({
  anchor,
  closeForm,
  editingWorkspace,
  cleanEditingWorkspace,
}: {
  anchor: null | HTMLElement
  closeForm: (force: boolean) => void
  editingWorkspace: IWorkspaceSlot | null
  cleanEditingWorkspace: () => void
}) => {
  const [openIconOptions, setOpenIconOptions] = useState<null | HTMLElement>(
    null
  )
  const [openColorOptions, setOpenColorOptions] = useState<null | HTMLElement>(
    null
  )
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "inherit"
    | "dark"
    | null
  >(null)
  const [selectedName, setSelectedName] = useState<string>("New Workspace")
  const [errorName, setErrorName] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const dispatch = useDispatch()
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === "dark"

  const iconsWithColor = Object.entries(useIconMap(isDarkMode))
  const iconMapToShow = useIconMap(isDarkMode)

  useEffect(() => {
    setErrorName(false)
  }, [selectedName])

  useEffect(() => {
    if (editingWorkspace) {
      setSelectedIcon(editingWorkspace?.Icon)
      setSelectedColor(editingWorkspace?.Color)
      setSelectedName(editingWorkspace?.Title)
    }
  }, [editingWorkspace])

  const closeModal = (force: boolean) => {
    setOpenIconOptions(null)
    setOpenColorOptions(null)
    setSelectedIcon(null)
    setSelectedColor(null)
    setSelectedName("New Workspace")
    closeForm(false)
    cleanEditingWorkspace()
    if (force) {
      dispatch(
        setGlobalBackdrop({
          isOpen: false,
          loading: false,
          body: null,
        })
      )
    }
  }

  const showIconsOptions = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpenIconOptions(e?.currentTarget)
  }

  const showColorOptions = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpenColorOptions(e?.currentTarget)
  }

  const closeIconOptions = () => {
    setOpenIconOptions(null)
  }

  const closeColorOptions = () => {
    setOpenColorOptions(null)
  }

  const changeSelectedIcon = (icon: string | null) => {
    setSelectedIcon(icon)
    setOpenIconOptions(null)
  }

  const changeSelectedColor = (
    color:
      | "primary"
      | "secondary"
      | "success"
      | "warning"
      | "error"
      | "info"
      | "inherit"
      | "dark"
      | null
  ) => {
    setSelectedColor(color)
    setOpenColorOptions(null)
  }

  const saveWorkspace = () => {
    if (!selectedName || selectedName.length < 3) {
      setErrorName(true)
      return
    }

    setLoading(true)
    dispatch(
      setNewWorkspace({
        workspace: {
          WorkspaceId: editingWorkspace ? editingWorkspace?.WorkspaceId : null,
          Icon: selectedIcon,
          Title: selectedName,
          Color: selectedColor,
        },
      })
    )

    setLoading(false)
    closeModal(true)
  }

  return (
    <>
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => closeForm(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{
          zIndex: ({ zIndex }) => zIndex?.drawer + 1,
          mt: 2,
        }}
      >
        <Box sx={{ mt: 1 }}>
          <Card sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" gap={1}>
              <Plus />
              <Typography variant="body1" color="textSecondary">
                New Workspace
              </Typography>
            </Stack>
            <Box sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" gap={5}>
                <Box
                  component="span"
                  onClick={showIconsOptions}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: 1,
                    borderColor: ({ palette }) => palette?.grey?.[500],
                    borderRadius: 300,
                    py: 1,
                    px: selectedIcon ? 1.5 : 1,
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: ({ palette }) => palette?.grey?.[100],
                    },
                  }}
                >
                  {selectedIcon ? (
                    iconMapToShow[selectedIcon as keyof typeof iconMapToShow]
                  ) : (
                    <CustomImage
                      src={IMAGE_DME_LOGO}
                      sx={{
                        width: "auto",
                        height: 35,
                        objectFit: "cover",
                      }}
                    />
                  )}
                </Box>
                <TextField
                  variant="standard"
                  value={selectedName}
                  onChange={(e) => setSelectedName(e?.target?.value)}
                  size="small"
                  helperText={errorName ? "3 characters at least" : ""}
                  error={errorName}
                  sx={{
                    width: 200,
                    "& .css-15stavw-MuiInputBase-input-MuiInput-input": {
                      color: ({ palette }) => palette?.text?.secondary,
                    },
                  }}
                />
                <Box
                  component="span"
                  onClick={showColorOptions}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: 1,
                    borderColor: ({ palette }) => palette?.grey?.[500],
                    borderRadius: 2,

                    p: 1.5,
                    cursor: "pointer",
                    bgcolor: ({ palette }) =>
                      selectedColor
                        ? getColorWorkspace({ palette, color: selectedColor })
                        : palette?.primary?.main,
                  }}
                />
              </Stack>
            </Box>
            <Stack direction="row" justifyContent="end" gap={1}>
              <Button
                variant="outlined"
                onClick={() => closeModal(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={saveWorkspace}
                disabled={loading}
              >
                Save
              </Button>
            </Stack>
          </Card>
        </Box>
      </Popover>

      {/* MENU ICON OPTIONS */}
      <Menu
        anchorEl={openIconOptions}
        open={Boolean(openIconOptions)}
        onClose={closeIconOptions}
        sx={{
          "& .css-1ii3vkc-MuiPaper-root-MuiPopover-paper-MuiMenu-paper, .css-xhoxn7-MuiPaper-root-MuiPopover-paper-MuiMenu-paper ":
            {
              "&::-webkit-scrollbar": {
                height: "5px",
                width: "10px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "10px",
                border: "1px solid ({ palette }) => palette?.background?.paper",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#555",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: ({ palette }) => palette?.background?.paper,
              },
            },
        }}
      >
        <MenuItem onClick={() => changeSelectedIcon(null)}>
          <CustomImage
            src={IMAGE_DME_LOGO}
            sx={{
              width: "auto",
              height: 30,
              objectFit: "cover",
            }}
          />
        </MenuItem>
        {iconsWithColor.map(([key, IconComponent]) => (
          <MenuItem key={key} onClick={() => changeSelectedIcon(key)}>
            {IconComponent}
          </MenuItem>
        ))}
      </Menu>

      {/* MENU COLOR OPTIONS */}
      <Menu
        anchorEl={openColorOptions}
        open={Boolean(openColorOptions)}
        onClose={closeColorOptions}
      >
        <MenuItem onClick={() => changeSelectedColor("primary")}>
          <Box
            component="span"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: 1,
              borderColor: ({ palette }) => palette?.grey?.[500],
              borderRadius: 2,
              p: 1.5,
              cursor: "pointer",
              bgcolor: ({ palette }) => palette?.primary?.main,
            }}
          />
        </MenuItem>
        <MenuItem onClick={() => changeSelectedColor("secondary")}>
          <Box
            component="span"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: 1,
              borderColor: ({ palette }) => palette?.grey?.[500],
              borderRadius: 2,
              p: 1.5,
              cursor: "pointer",
              bgcolor: ({ palette }) => palette?.secondary?.main,
            }}
          />
        </MenuItem>
        <MenuItem onClick={() => changeSelectedColor("success")}>
          <Box
            component="span"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: 1,
              borderColor: ({ palette }) => palette?.grey?.[500],
              borderRadius: 2,
              p: 1.5,
              cursor: "pointer",
              bgcolor: ({ palette }) => palette?.success?.main,
            }}
          />
        </MenuItem>
        <MenuItem onClick={() => changeSelectedColor("warning")}>
          <Box
            component="span"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: 1,
              borderColor: ({ palette }) => palette?.grey?.[500],
              borderRadius: 2,
              p: 1.5,
              cursor: "pointer",
              bgcolor: ({ palette }) => palette?.warning?.main,
            }}
          />
        </MenuItem>
        <MenuItem onClick={() => changeSelectedColor("error")}>
          <Box
            component="span"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: 1,
              borderColor: ({ palette }) => palette?.grey?.[500],
              borderRadius: 2,
              p: 1.5,
              cursor: "pointer",
              bgcolor: ({ palette }) => palette?.error?.main,
            }}
          />
        </MenuItem>
        <MenuItem onClick={() => changeSelectedColor("info")}>
          <Box
            component="span"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: 1,
              borderColor: ({ palette }) => palette?.grey?.[500],
              borderRadius: 2,
              p: 1.5,
              cursor: "pointer",
              bgcolor: ({ palette }) => palette?.info?.main,
            }}
          />
        </MenuItem>
        <MenuItem onClick={() => changeSelectedColor("dark")}>
          <Box
            component="span"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: 1,
              borderColor: ({ palette }) => palette?.grey?.[500],
              borderRadius: 2,
              p: 1.5,
              cursor: "pointer",
              bgcolor: ({ palette }) => palette?.common?.black,
            }}
          />
        </MenuItem>
        <MenuItem onClick={() => changeSelectedColor("inherit")}>
          <Box
            component="span"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: 1,
              borderColor: ({ palette }) => palette?.grey?.[500],
              borderRadius: 2,
              p: 1.5,
              cursor: "pointer",
              bgcolor: ({ palette }) => palette?.grey?.[500],
            }}
          />
        </MenuItem>
      </Menu>
    </>
  )
}

export default memo(ModalNewWorkspace)
