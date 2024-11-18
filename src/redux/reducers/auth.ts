import { IAuth, IAuthUser } from "@/types/auth"
import { createSlice } from "@reduxjs/toolkit"

const INIT_STATE: IAuth = {
  auth: null,
  colorTheme: null,
  loadingProfile: true,
}

export const slice = createSlice({
  name: "auth",
  initialState: INIT_STATE,
  reducers: {
    setInitAuth: (state, action) => {
      if (action?.payload?.user) {
        const user: IAuthUser = {
          sub: action?.payload?.user?.sub,
          email: action?.payload?.user?.email,
          family_name: action?.payload?.user?.family_name,
          given_name: action?.payload?.user?.given_name,
          email_verified:
            action?.payload?.user?.email_verified === "true" ? true : false,
          phone_number: action?.payload?.user?.phone_number ?? null,
          phone_number_verified:
            action?.payload?.user?.phone_number_verified === "true"
              ? true
              : false,
          preferred_username: action?.payload?.user?.preferred_username ?? null,
          address: action?.payload?.user?.address ?? null,
          picture: action?.payload?.user?.picture ?? null,
          gender: action?.payload?.user?.gender ?? null,
          birthdate: action?.payload?.user?.birthdate ?? null,
          dni_type: action?.payload?.user?.dni_type ?? null,
          dni: action?.payload?.user?.dni ?? null,
          enabled: action?.payload?.user?.enabled ?? true,
          status: action?.payload?.user?.status ?? null,
        }
        state.auth = user
        state.loadingProfile = false
      }
    },
    setCloseSession: (state) => {
      state.auth = null
      state.loadingProfile = false
    },
    setColorTheme: (state, action) => {
      state.colorTheme = action?.payload?.colorTheme
    },
  },
})

export const { setInitAuth, setColorTheme, setCloseSession } = slice.actions

export default slice.reducer
