import React, { FC } from "react"
import ErrorImage from "./ErrorImage"
import { COLOR_BG_MIST, COLOR_BG_MIST_DARK_THEME } from "@/constants/colors"
import { Box, Button, Typography } from "@mui/material"
import { setUrlError } from "@/redux/reducers/common"
import { useDispatch } from "react-redux"
import { setHomeTab } from "@/redux/reducers/tabsBrowser"

// Define the prop types
interface ErrorComponentProps {
  errorCode: number
  message: string
  tab: {
    TabId: string
  }
}

const ErrorComponent: FC<ErrorComponentProps> = ({
  errorCode,
  message,
  tab,
}) => {
  const dispatch = useDispatch()

  const handleRetry = () => {
    dispatch(setUrlError({}))
    dispatch(setHomeTab({ tabId: tab.TabId }))
  }

  return (
    <Box
      sx={{
        height: "100%",
        borderRadius: "10px",
        overflowX: "auto",
        p: "1.5rem 2rem 0 2rem",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundColor: COLOR_BG_MIST,
        backgroundBlendMode: "overlay",
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          background: "rgba(192, 176, 215, 0.32)",
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          textAlign: "left",
          padding: "20px",
          color: COLOR_BG_MIST_DARK_THEME,
        }}
      >
        <ErrorImage sx={{ width: "13em", height: "13em" }} />
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
          An Unexpected Error Happened
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {errorCode}
        </Typography>
        <Typography variant="body1" sx={{ py: 1 }}>
          {message}
        </Typography>
        <Button
          sx={{
            borderRadius: "100px",
            height: "40px",
            padding: "10px 24px",
            color: "white",
            border: "none",
            backgroundColor: "black",
            cursor: "pointer",
          }}
          onClick={handleRetry}
        >
          Try again
        </Button>
      </Box>
    </Box>
  )
}

export default ErrorComponent
