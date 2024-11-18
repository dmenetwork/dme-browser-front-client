export interface IAuth {
  auth: IAuthUser | null
  colorTheme: "light" | "dark" | null
  loadingProfile: boolean
}

export interface IAuthUser {
  sub: string
  email: string
  family_name: string
  given_name: string
  email_verified: boolean
  phone_number?: string | null
  phone_number_verified?: boolean
  preferred_username?: string | null
  address?: string | null
  picture?: string | null
  gender?: string | null
  birthdate?: string | null
  dni_type?: string | null
  dni?: string | null
  enabled?: boolean
  status?: string | null
}

export interface IAuthToken {
  tokenType: string
  accessToken: string
  refreshToken: string
}
