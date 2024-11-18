import { CONFIG_API_AUTH } from "@/config/config"
import { encryptString } from "@/helpers/format"
import { IAuthToken, IAuthUser } from "@/types/auth"
import axios from "axios"

interface ISignInResponse {
  message: string
  status: boolean
  user: IAuthUser
  token?: IAuthToken
  mustChangePassword?: boolean
  challengeToken?: string | null
}

interface IVerifyTokenResponse {
  message: string
  status: boolean
  user: IAuthUser
  token?: IAuthToken
}

interface IForgotPassword {
  message: string
  mustVerify: boolean
  mustmustReset: boolean
}

interface IConfirmForgotPassword {
  message: string
}

interface IFirstChangePassword {
  message: string
}

export const signIn = async ({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<ISignInResponse> => {
  return new Promise(async (resolve, reject) => {
    const encryptPassword = encryptString(password)

    try {
      const { data } = await axios.post(`${CONFIG_API_AUTH}/v1/sign-in`, {
        email,
        password: encryptPassword,
      })

      axios.defaults.headers.common = {
        Authorization: `Bearer ${data?.token?.accessToken}`,
      }
      resolve(data)
    } catch (err) {
      reject(err)
    }
  })
}

export const verifyToken = async ({
  accessToken,
  refreshToken = null,
}: {
  accessToken: string
  refreshToken?: string | null
}): Promise<IVerifyTokenResponse> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.post(`${CONFIG_API_AUTH}/v1/verify-token`, {
        accessToken,
        refreshToken,
      })
      if (data?.token && data?.token?.accessToken) {
        axios.defaults.headers.common = {
          Authorization: `Bearer ${data?.token?.accessToken}`,
        }
      }
      resolve(data)
    } catch (err) {
      reject(err)
    }
  })
}

export const forgotPassword = async ({
  email,
}: {
  email: string
}): Promise<IForgotPassword> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.post(
        `${CONFIG_API_AUTH}/v1/forgot-password`,
        {
          email,
        }
      )
      resolve(data)
    } catch (err) {
      reject(err)
    }
  })
}

export const confirmForgotPassword = async ({
  email,
  password,
  confirmationCode,
}: {
  email: string
  password: string
  confirmationCode: string
}): Promise<IConfirmForgotPassword> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.post(
        `${CONFIG_API_AUTH}/v1/confirm-forgot-password`,
        {
          email,
          password: encryptString(password),
          confirmationCode,
        }
      )
      resolve(data)
    } catch (err) {
      reject(err)
    }
  })
}

export const firstChangePassword = async ({
  email,
  password,
  token,
}: {
  email: string
  password: string
  token: string
}): Promise<IFirstChangePassword> => {
  return new Promise(async (resolve, reject) => {
    const encryptPassword = encryptString(password)

    try {
      const { data } = await axios.post(
        `${CONFIG_API_AUTH}/v1/first-change-password`,
        {
          email,
          password: encryptPassword,
          token,
        }
      )
      resolve(data)
    } catch (err) {
      reject(err)
    }
  })
}
