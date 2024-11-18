import { validateEmail, validatePassword } from "@/helpers/validate"
import {
  Button,
  CircularProgress,
  IconButton,
  OutlinedInput,
  Stack,
  Typography,
  useTheme,
} from "@mui/material"
import { ArrowLeft, CheckCircle, CircleX, Eye, EyeOff } from "lucide-react"
import { memo, useState } from "react"
import InputVerificationCode from "@/components/InputVerificationCode/InputVerificationCode"
import Link from "next/link"
import { ROUTE_SIGN_IN } from "@/constants/routes"
import { confirmForgotPassword } from "@/services/auth"
import { useDispatch } from "react-redux"
import { setGlobalNotification } from "@/redux/reducers/common"
import { useRouter } from "next/navigation"

const ConfirmForgotPassword = ({ email }: { email: string }) => {
  const { palette } = useTheme()
  const { push } = useRouter()
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [newPassword, setNewPassword] = useState<string>("")
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [verificationCode, setVerificationCode] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const handleConfirmForgotPassword = async () => {
    setLoading(true)

    if (validateEmail(email)) {
      await confirmForgotPassword({
        email,
        password: newPassword,
        confirmationCode: verificationCode,
      })
        .then(() => {
          dispatch(
            setGlobalNotification({
              isOpen: true,
              message: "Password changed",
              severity: "success",
              variant: "filled",
            })
          )
          push(ROUTE_SIGN_IN)
        })
        .catch((err) => {
          console.error(err)
          dispatch(
            setGlobalNotification({
              isOpen: true,
              message:
                "The application could not confirm this change. Try again in a few minutes",
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
        <Stack alignItems="center" gap={1}>
          <Typography variant="h5" gutterBottom>
            Recover password
          </Typography>
          <Typography variant="caption" color="textSecondary" align="center">
            Please digit the 6 digit code that we send to your email and enter a
            new password
          </Typography>
        </Stack>
        <Stack>
          <Typography variant="body1" color="textSecondary">
            New Password
          </Typography>
          <OutlinedInput
            sx={{
              color: palette?.text?.secondary,
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "black",
              },
            }}
            placeholder="******"
            size="small"
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e?.target?.value)}
            endAdornment={
              newPassword.length > 0 && (
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff style={{ opacity: 0.5 }} />
                  ) : (
                    <Eye style={{ opacity: 0.5 }} />
                  )}
                </IconButton>
              )
            }
          />
          {newPassword.length > 0 &&
            (!validatePassword(newPassword, "CHAR") ||
              !validatePassword(newPassword, "LOWERCASE") ||
              !validatePassword(newPassword, "UPPERCASE") ||
              !validatePassword(newPassword, "NUMBER")) && (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                gap={1}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="start"
                  gap={1}
                >
                  {!validatePassword(newPassword, "CHAR") ? (
                    <CircleX size={16} color={palette?.error?.main} />
                  ) : (
                    <CheckCircle size={16} color={palette?.success?.main} />
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      color: !validatePassword(newPassword, "CHAR")
                        ? palette?.error?.main
                        : palette?.success?.main,
                    }}
                    color="textSecondary"
                  >
                    6 char
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="start"
                  gap={1}
                >
                  {!validatePassword(newPassword, "LOWERCASE") ? (
                    <CircleX size={16} color={palette?.error?.main} />
                  ) : (
                    <CheckCircle size={16} color={palette?.success?.main} />
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      color: !validatePassword(newPassword, "LOWERCASE")
                        ? palette?.error?.main
                        : palette?.success?.main,
                    }}
                    color="textSecondary"
                  >
                    1 lowercase
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="start"
                  gap={1}
                >
                  {!validatePassword(newPassword, "UPPERCASE") ? (
                    <CircleX size={16} color={palette?.error?.main} />
                  ) : (
                    <CheckCircle size={16} color={palette?.success?.main} />
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      color: !validatePassword(newPassword, "UPPERCASE")
                        ? palette?.error?.main
                        : palette?.success?.main,
                    }}
                    color="textSecondary"
                  >
                    1 upercase
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="start"
                  gap={1}
                >
                  {!validatePassword(newPassword, "NUMBER") ? (
                    <CircleX size={16} color={palette?.error?.main} />
                  ) : (
                    <CheckCircle size={16} color={palette?.success?.main} />
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      color: !validatePassword(newPassword, "NUMBER")
                        ? palette?.error?.main
                        : palette?.success?.main,
                    }}
                    color="textSecondary"
                  >
                    1 number
                  </Typography>
                </Stack>
              </Stack>
            )}
        </Stack>
        <Stack>
          <Typography variant="body1" color="textSecondary">
            Confirm Password
          </Typography>
          <OutlinedInput
            sx={{
              color: palette?.text?.secondary,
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "black",
              },
            }}
            placeholder="******"
            size="small"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e?.target?.value)}
            endAdornment={
              confirmPassword.length > 0 && (
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff style={{ opacity: 0.5 }} />
                  ) : (
                    <Eye style={{ opacity: 0.5 }} />
                  )}
                </IconButton>
              )
            }
          />
          {newPassword.length > 0 &&
            confirmPassword.length > 0 &&
            newPassword !== confirmPassword && (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                gap={1}
              >
                <CircleX size={16} color={palette?.error?.main} />
                <Typography
                  variant="caption"
                  sx={{ color: palette?.error?.main }}
                >
                  Passwords must match
                </Typography>
              </Stack>
            )}
        </Stack>
        <Stack>
          <Typography variant="body1" color="textSecondary">
            Verification Code
          </Typography>
          <InputVerificationCode
            variant="outlined"
            setCode={setVerificationCode}
          />
        </Stack>
        <Stack>
          <Button
            variant="contained"
            color="primary"
            disabled={
              loading ||
              newPassword.length < 1 ||
              verificationCode.length < 6 ||
              !validatePassword(newPassword, "CHAR") ||
              !validatePassword(newPassword, "LOWERCASE") ||
              !validatePassword(newPassword, "UPPERCASE") ||
              !validatePassword(newPassword, "NUMBER") ||
              newPassword !== confirmPassword
            }
            startIcon={loading && <CircularProgress size={18} />}
            onClick={handleConfirmForgotPassword}
          >
            Recover Password
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

export default memo(ConfirmForgotPassword)
