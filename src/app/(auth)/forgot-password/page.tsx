/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import ConfirmForgotPassword from "@/components/Auth/ConfirmForgotPassword"
import MustVerifyAccount from "@/components/Auth/MustVerifyAccount"
import RequestForgotPassword from "@/components/Auth/RequestForgotPassword"
import { Container } from "@mui/material"
import { memo, useState } from "react"

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("")
  const [screenMustVerify, setScreenMustVerify] = useState<boolean>(false)
  const [screenVerificationCode, setScreenVerificationCode] =
    useState<boolean>(false)

  return (
    <>
      <Container sx={{ height: "100%" }}>
        {!screenMustVerify && !screenVerificationCode && (
          <RequestForgotPassword
            email={email}
            setEmail={setEmail}
            setScreenMustVerify={setScreenMustVerify}
            setScreenVerificationCode={setScreenVerificationCode}
          />
        )}

        {screenMustVerify && <MustVerifyAccount />}

        {screenVerificationCode && <ConfirmForgotPassword email={email} />}
      </Container>
    </>
  )
}

export default memo(ForgotPassword)
