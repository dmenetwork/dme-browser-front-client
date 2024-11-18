import { IRedux } from "@/types"
import { ICommon } from "@/types/common"
import { Box, LinearProgress } from "@mui/material"
import { memo } from "react"
import { useSelector } from "react-redux"

const GlobalProgressBar = () => {
  const { globalLoading } = useSelector<IRedux, ICommon>(
    (state) => state?.common
  )

  return (
    <>
      {globalLoading && (
        <Box position="absolute" width="100%">
          <LinearProgress />
        </Box>
      )}
    </>
  )
}

export default memo(GlobalProgressBar)
