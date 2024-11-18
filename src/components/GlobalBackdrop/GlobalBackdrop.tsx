import { IRedux } from "@/types"
import { ICommon } from "@/types/common"
import {
  Backdrop,
  Box,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material"
import { memo } from "react"
import { useSelector } from "react-redux"

const GlobalBackdrop = () => {
  const { globalBackdrop } = useSelector<IRedux, ICommon>(
    (state) => state?.common
  )

  return (
    <>
      <Backdrop
        sx={({ palette, zIndex }) => ({
          color: palette?.common?.white,
          zIndex: zIndex?.drawer + 1,
        })}
        open={globalBackdrop?.isOpen}
      >
        <Stack gap={3} justifyContent="center" alignItems="center">
          {globalBackdrop?.loading && <CircularProgress color="inherit" />}
          {globalBackdrop?.body && typeof globalBackdrop?.body === "string" && (
            <Typography variant="h6">{globalBackdrop?.body}</Typography>
          )}
          {globalBackdrop?.body && typeof globalBackdrop?.body !== "string" && (
            <Box>{globalBackdrop?.body}</Box>
          )}
        </Stack>
      </Backdrop>
    </>
  )
}

export default memo(GlobalBackdrop)
