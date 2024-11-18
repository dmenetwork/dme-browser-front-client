/* eslint-disable react-hooks/exhaustive-deps */
import { COMMON_APP_NAME } from "@/constants/common"
import { ROUTE_FORGOT_PASS, ROUTE_HOME } from "@/constants/routes"
import {
  LOCALSTORAGE_ACCESS_TOKEN,
  LOCALSTORAGE_REFRESH_TOKEN,
} from "@/constants/storage"
import { validateEmail } from "@/helpers/validate"
import { setInitAuth } from "@/redux/reducers/auth"
import { signIn } from "@/services/auth"
import {
  Button,
  CircularProgress,
  IconButton,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Dispatch, memo, useEffect, useState } from "react"
import { useDispatch } from "react-redux"

const Login = ({
  email,
  setEmail,
  setChangePasswordToken,
  setMustChangePassword,
}: {
  email: string
  setEmail: Dispatch<React.SetStateAction<string>>
  setChangePasswordToken: Dispatch<React.SetStateAction<string>>
  setMustChangePassword: Dispatch<React.SetStateAction<boolean>>
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [password, setPassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const { push } = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    if (error) {
      setError(false)
    }
  }, [email, password])

  const login = async () => {
    setLoading(true)
    setError(false)

    if (!validateEmail(email) || password.length < 6) {
      setError(true)
      setLoading(false)
      return
    }

    await signIn({
      email,
      password,
    })
      .then((res) => {
        if (res?.mustChangePassword) {
          setChangePasswordToken(res?.challengeToken || "")
          setMustChangePassword(true)
          setLoading(false)
        } else {
          if (res?.user && res?.token) {
            localStorage.setItem(
              LOCALSTORAGE_ACCESS_TOKEN,
              res?.token?.accessToken
            )
            localStorage.setItem(
              LOCALSTORAGE_REFRESH_TOKEN,
              res?.token?.refreshToken
            )

            dispatch(setInitAuth({ user: res?.user }))
            push(ROUTE_HOME)
          }
        }
      })
      .catch((err) => {
        setError(true)
        console.error("signIn err:", err)
        setLoading(false)
      })
  }

  return (
    <>
      <Stack justifyContent="center" gap={3} sx={{ height: "100%" }}>
        <Stack alignItems="start">
          <Typography variant="h5" color="textSecondary">
            Welcome to
          </Typography>
          <Typography
            component="span"
            variant="h5"
            sx={{
              color: ({ palette }) => palette?.primary?.main,
            }}
          >
            {COMMON_APP_NAME}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Please enter your credentials to access.
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
              if (e?.key === "Enter") {
                e?.preventDefault()
                login()
              }
            }}
            sx={{
              color: ({ palette }) => palette?.text?.secondary,
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: ({ palette }) => palette?.text?.secondary,
              },
            }}
          />
          <Typography variant="body1" color="textSecondary">
            Password
          </Typography>
          <OutlinedInput
            placeholder="******"
            size="small"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e?.target?.value)}
            endAdornment={
              password.length > 0 && (
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
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
                login()
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
            disabled={loading}
            startIcon={loading && <CircularProgress size={18} />}
            onClick={login}
          >
            Log In
          </Button>
          {error && (
            <Typography
              variant="body2"
              color="error"
              textAlign="center"
              sx={{ mt: 1 }}
            >
              Invalid email or password
            </Typography>
          )}
        </Stack>
        <Link href={ROUTE_FORGOT_PASS}>
          <Button
            variant="text"
            color="primary"
            fullWidth
            sx={{
              mt: 1,
            }}
          >
            Forgot password
          </Button>
        </Link>
      </Stack>
    </>
  )
}

export default memo(Login)
