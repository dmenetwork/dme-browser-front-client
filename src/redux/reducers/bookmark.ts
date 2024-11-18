import { Favorites } from "@/types/tabsBrowser"
import { createSlice } from "@reduxjs/toolkit"

const INIT_STATE: { bookmarkVisible: boolean; favorites: Favorites[] } = {
  bookmarkVisible: false,
  favorites: [],
}

export const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState: INIT_STATE,
  reducers: {
    setVisible: (state) => {
      state.bookmarkVisible = !state.bookmarkVisible
    },
    addFavorite: (state, action) => {
      const tabToFavorite = {
        bookmarkId: action.payload.favorite.bookmarkId,
        url: action.payload.favorite.URL,
        icon: action.payload.favorite.Icon,
        title: action.payload.favorite.Title,
        IsBookmark: action.payload.favorite.IsBookmark,
      }
      state.favorites.push(tabToFavorite)
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites?.filter(
        (item) => item.url !== action.payload.favorite.URL
      )
    },
    updateFavoriteTitle: (state, action) => {
      const { newTitle, bookmarkToEdit } = action.payload
      const favorite = state.favorites.find(
        (item) => item.bookmarkId === bookmarkToEdit
      )
      if (favorite) {
        favorite.title = newTitle
      }
    },
    addAllFavorites: (state, action) => {
      state.favorites = action.payload.favorites
    },
  },
})

export const {
  setVisible,
  addFavorite,
  removeFavorite,
  updateFavoriteTitle,
  addAllFavorites,
} = bookmarkSlice.actions
export default bookmarkSlice.reducer
