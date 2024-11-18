import { COMMON_CONFLICTING_URL } from "@/constants/common"
import {
  ICommon,
  ICommonBackdrop,
  ICommonNotification,
  IErrorUrl,
} from "@/types/common"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"

const INIT_STATE: ICommon = {
  globalNotification: [],
  globalBackdrop: {
    isOpen: false,
    loading: false,
    body: null,
  },
  conflictingUrl: COMMON_CONFLICTING_URL,
  globalLoading: true,
  reduxTheme: "dark",
  errorUrl: undefined,
}

export const slice = createSlice({
  name: "common",
  initialState: INIT_STATE,
  reducers: {
    setGlobalNotification: (
      state,
      action: PayloadAction<ICommonNotification>
    ) => {
      if (action?.payload) {
        const payload: ICommonNotification = {
          isOpen: action?.payload?.isOpen || false,
          severity: action?.payload?.severity || "info",
          variant: action?.payload?.variant || "standard",
          message: action?.payload?.message || "",
        }

        state.globalNotification.push(payload)
      }
    },
    setCloseGlobalNotification: (
      state,
      action: PayloadAction<{ position: number }>
    ) => {
      if (
        action?.payload?.position !== null &&
        action?.payload?.position > -1
      ) {
        state.globalNotification.splice(action?.payload?.position, 1)
      }
    },
    setGlobalBackdrop: (state, action: PayloadAction<ICommonBackdrop>) => {
      if (action?.payload) {
        state.globalBackdrop = {
          isOpen: action?.payload?.isOpen || false,
          loading: action?.payload?.loading || false,
          body: action?.payload?.body || null,
        }
      }
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action?.payload
    },
    toggleTheme: (state) => {
      state.reduxTheme = state.reduxTheme === "light" ? "dark" : "light"
    },
    setUrlError: (state, action: PayloadAction<IErrorUrl>) => {
      try {
        if (action.payload.description) {
          state.errorUrl = action.payload
        } else {
          state.errorUrl = undefined
        }
      } catch (err) {
        console.error(err)
        state.errorUrl = undefined
      }
    },
  },
})

export const {
  setGlobalNotification,
  setCloseGlobalNotification,
  setGlobalBackdrop,
  setGlobalLoading,
  toggleTheme,
  setUrlError,
} = slice.actions

export default slice.reducer
