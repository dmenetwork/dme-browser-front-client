import { ROUTE_SIGN_IN } from "@/constants/routes"
import { validateEmail } from "@/helpers/validate"
import { setGlobalNotification } from "@/redux/reducers/common"
import { forgotPassword } from "@/services/auth"
import {
  Button,
  CircularProgress,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Dispatch, memo, useState } from "react"
import { useDispatch } from "react-redux"

const RequestForgotPassword = ({
  email,
  setEmail,
  setScreenMustVerify,
  setScreenVerificationCode,
}: {
  email: string
  setEmail: Dispatch<React.SetStateAction<string>>
  setScreenMustVerify: Dispatch<React.SetStateAction<boolean>>
  setScreenVerificationCode: Dispatch<React.SetStateAction<boolean>>
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const dispatch = useDispatch()
  const { push } = useRouter()

  const handleForgotPassword = async () => {
    setLoading(true)

    if (validateEmail(email)) {
      await forgotPassword({ email })
        .then((res) => {
          dispatch(
            setGlobalNotification({
              isOpen: true,
              message: res?.message,
              severity: "success",
              variant: "filled",
            })
          )
          if (res?.mustmustReset) {
            push(ROUTE_SIGN_IN)
          }
          if (res?.mustVerify) {
            setScreenMustVerify(true)
            setScreenVerificationCode(false)
          } else {
            setScreenVerificationCode(true)
            setScreenMustVerify(false)
          }
        })
        .catch((err) => {
          console.error(err)
          dispatch(
            setGlobalNotification({
              isOpen: true,
              message:
                "The application could not be generated. Try again in a few minutes",
              severity: "error",
              variant: "filled",
            })
          )
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  return (
    <>
      <Stack justifyContent="center" gap={3} sx={{ height: "100%" }}>
        <Stack alignItems="center">
          <Typography variant="h5" color="textSecondary">
            Forgot Password
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Please enter your email to send instructions to restore your
            password
          </Typography>
        </Stack>
        <Stack gap={1}>
          <Typography variant="body1" color="textSecondary">
            Email
          </Typography>
          <OutlinedInput
            placeholder="example@me.com"
            size="small"
            value={email}
            onChange={(e) => setEmail(e?.target?.value)}
            onKeyDown={(e) => {
              if (e?.key === "Enter" && validateEmail(email)) {
                e?.preventDefault()
                handleForgotPassword()
              }
            }}
            sx={{
              color: ({ palette }) => palette?.text?.secondary,
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: ({ palette }) => palette?.text?.secondary,
              },
            }}
          />
        </Stack>
        <Stack>
          <Button
            variant="contained"
            color="primary"
            disabled={loading || !validateEmail(email)}
            startIcon={loading && <CircularProgress size={18} />}
            onClick={handleForgotPassword}
          >
            Recovery Password
          </Button>
        </Stack>
        <Link href={ROUTE_SIGN_IN}>
          <Button
            variant="text"
            color="primary"
            fullWidth
            startIcon={<ArrowLeft size={20} />}
            sx={{
              mt: 1,
            }}
          >
            Go back
          </Button>
        </Link>
      </Stack>
    </>
  )
}

export default memo(RequestForgotPassword)
