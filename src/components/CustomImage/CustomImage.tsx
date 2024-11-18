import { Box, SxProps } from "@mui/material"
import { memo } from "react"

const CustomImage = ({ src, sx }: { src: string; sx?: SxProps }) => {
  return (
    <>
      <Box component="img" src={src} sx={sx} />
    </>
  )
}

export default memo(CustomImage)
