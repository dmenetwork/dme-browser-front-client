/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import ChangePassword from "@/components/Auth/ChangePassword"
import Login from "@/components/Auth/Login"
import { memo, useState } from "react"

const SignIn = () => {
  const [mustChangePassword, setMustChangePassword] = useState<boolean>(false)
  const [email, setEmail] = useState<string>("")
  const [changePasswordToken, setChangePasswordToken] = useState<string>("")

  return (
    <>
      {/* CHANGE PASSWORD SCREEN */}
      {mustChangePassword && (
        <ChangePassword
          email={email}
          setMustChangePassword={setMustChangePassword}
          changePasswordToken={changePasswordToken}
        />
      )}

      {/* LOGIN SCREEN  */}
      {!mustChangePassword && (
        <Login
          email={email}
          setEmail={setEmail}
          setChangePasswordToken={setChangePasswordToken}
          setMustChangePassword={setMustChangePassword}
        />
      )}
    </>
  )
}

export default memo(SignIn)
