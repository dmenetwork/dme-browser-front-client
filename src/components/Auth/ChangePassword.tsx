/* eslint-disable react-hooks/exhaustive-deps */
import { validatePassword } from "@/helpers/validate"
import { setGlobalNotification } from "@/redux/reducers/common"
import { firstChangePassword } from "@/services/auth"
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
import { Dispatch, memo, useEffect, useState } from "react"
import { useDispatch } from "react-redux"

const ChangePassword = ({
  email,
  setMustChangePassword,
  changePasswordToken,
}: {
  email: string
  setMustChangePassword: Dispatch<React.SetStateAction<boolean>>
  changePasswordToken: string
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
  const [newPassword, setNewPassword] = useState<string>("")
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("")
  const [showConfirmNewPassword, setShowConfirmNewPassword] =
    useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const { palette } = useTheme()
  const dispatch = useDispatch()

  useEffect(() => {
    if (error) {
      setError(false)
    }
  }, [newPassword, confirmNewPassword])

  const changePassword = async () => {
    setLoading(true)
    setError(false)

    await firstChangePassword({
      email,
      password: newPassword,
      token: changePasswordToken,
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
        setNewPassword("")
        setConfirmNewPassword("")
        setError(false)
        setLoading(false)
        setMustChangePassword(false)
      })
      .catch((err) => {
        setError(true)
        console.error("changePassword err:", err)
        setLoading(false)
      })
  }

  return (
    <>
      <Stack justifyContent="center" gap={3} sx={{ height: "100%" }}>
        <Stack>
          <Typography variant="h5" align="center">
            Please change your password
          </Typography>
          <Typography variant="caption" color="textSecondary" align="center">
            On your first session, you will need to create a password
          </Typography>
        </Stack>
        <Stack gap={1}>
          <Typography variant="body1">New Password</Typography>
          <OutlinedInput
            placeholder="******"
            size="small"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e?.target?.value)}
            endAdornment={
              newPassword.length > 0 && (
                <IconButton
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
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
                  >
                    1 number
                  </Typography>
                </Stack>
              </Stack>
            )}
        </Stack>
        <Stack gap={1}>
          <Typography variant="body1">Confirm New Password</Typography>
          <OutlinedInput
            placeholder="******"
            size="small"
            type={showConfirmNewPassword ? "text" : "password"}
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e?.target?.value)}
            endAdornment={
              confirmNewPassword.length > 0 && (
                <IconButton
                  onClick={() =>
                    setShowConfirmNewPassword(!showConfirmNewPassword)
                  }
                >
                  {showConfirmNewPassword ? (
                    <EyeOff style={{ opacity: 0.5 }} />
                  ) : (
                    <Eye style={{ opacity: 0.5 }} />
                  )}
                </IconButton>
              )
            }
            onKeyDown={(e) => {
              if (e?.key === "Enter") {
                e?.preventDefault()
                changePassword()
              }
            }}
          />
          {newPassword.length > 0 &&
            confirmNewPassword.length > 0 &&
            newPassword !== confirmNewPassword && (
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
          <Button
            variant="contained"
            color="primary"
            disabled={
              loading ||
              newPassword.length < 6 ||
              !validatePassword(newPassword, "CHAR") ||
              !validatePassword(newPassword, "LOWERCASE") ||
              !validatePassword(newPassword, "UPPERCASE") ||
              !validatePassword(newPassword, "NUMBER") ||
              newPassword !== confirmNewPassword
            }
            startIcon={loading && <CircularProgress size={18} />}
            onClick={changePassword}
          >
            Change Password
          </Button>
          {error && (
            <Typography
              variant="body2"
              color="error"
              textAlign="center"
              sx={{ mt: 1 }}
            >
              We could not configure the new password, try again in a few
              minutes
            </Typography>
          )}
        </Stack>
        <Button
          variant="text"
          color="primary"
          fullWidth
          startIcon={<ArrowLeft size={20} />}
          onClick={() => setMustChangePassword(false)}
          sx={{
            mt: 1,
          }}
        >
          Go back
        </Button>
      </Stack>
    </>
  )
}

export default memo(ChangePassword)
