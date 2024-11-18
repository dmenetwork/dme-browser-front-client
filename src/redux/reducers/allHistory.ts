import { IAllHistory } from "@/types/allHistory"
import { createSlice } from "@reduxjs/toolkit"

const INIT_STATE: IAllHistory = {
  allHistory: [],
  historyToInput: [],
}

export const slice = createSlice({
  name: "allHistory",
  initialState: INIT_STATE,
  reducers: {
    saveAllToHistory: (state, action) => {
      // Remove any existing entry with the same URL
      state.historyToInput = state.historyToInput?.filter(
        (item) => item.url !== action.payload.url
      )
      // Add the new entry to the beginning of the list
      state.historyToInput = [action.payload, ...state.historyToInput]
    },
    getAllHistory: (state, action) => {
      state.allHistory = action.payload.allHistory
    },
  },
})

export const { saveAllToHistory, getAllHistory } = slice.actions

export default slice.reducer
