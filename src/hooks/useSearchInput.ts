import { getDataFromUrl, isValidUrl } from "@/helpers/url"
import {
  addFavorite,
  removeFavorite,
  updateFavoriteTitle,
} from "@/redux/reducers/bookmark"
import { setGlobalBackdrop } from "@/redux/reducers/common"
import {
  setToggleBookmarkTabByUrl,
  updateActiveTabWithUrlData,
} from "@/redux/reducers/tabsBrowser"
import {
  handleDeleteBookmarkInDb,
  handleEditBookmarkInDb,
  saveBookmark,
} from "@/services/bookmark"
import { IRedux } from "@/types"
import { IAllHistory } from "@/types/allHistory"
import { IFavorites, ITabsBrowserTab } from "@/types/tabsBrowser"
import React, { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { v4 as uuidv4 } from "uuid"

const useSearchInput = ({
  tab,
  isFocusable,
  newPageIdFocused,
}: {
  isFocusable?: boolean
  tab: ITabsBrowserTab
  isFromNewTab?: boolean
  newPageIdFocused?: string
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch()

  const { favorites } = useSelector<IRedux, IFavorites>(
    (state) => state.bookmark
  )

  const { allHistory } = useSelector<IRedux, IAllHistory>(
    (state) => state.allHistory
  )

  const activeTab = tab

  const [filteredFavorites] = favorites?.filter(
    (item) => item.url === activeTab.URL
  )
  const isBookmarked = favorites.some((item) => item.url === activeTab.URL)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [inputValue, setInputValue] = useState(activeTab.URL || "")
  const [bookmarkInputValue, setBookmarkInputValue] = useState("")
  const [openOptionsBox, setOpenOptionsBox] = useState(false)
  const uniqueHistory = Array.from(new Set(allHistory.map((item) => item.url)))
    .map((url) => allHistory.find((item) => item.url === url))
    .filter((item) => item !== undefined)

  const historyToInputOptions = uniqueHistory.slice(0, 8)
  const open = Boolean(anchorEl)
  const id = open ? "simple-popper" : undefined

  useEffect(() => {
    if (inputValue === "" && isFocusable && tab.IsActive) {
      searchInputRef.current?.focus()
    }
  }, [inputValue, isFocusable, tab.IsActive, tab.TabId])

  useEffect(() => {
    if (
      inputValue === "" &&
      isFocusable &&
      tab.TabId === newPageIdFocused &&
      tab.SplitView !== null
    ) {
      // if the input value is empty, focus on the input
      searchInputRef.current?.focus()
    }
  }, [inputValue, isFocusable, tab.TabId, newPageIdFocused, tab.SplitView])

  useEffect(() => {
    setInputValue(activeTab?.URL || "")
  }, [activeTab?.URL])

  useEffect(() => {
    if (activeTab?.URL) {
      setInputValue(activeTab?.URL)
    }
  }, [activeTab?.URL])

  useEffect(() => {
    if (anchorEl) {
      setBackdrop(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchorEl])

  useEffect(() => {
    const handleCopyCut = (e: ClipboardEvent) => {
      if (document.activeElement === document.getElementById("url_input")) {
        e.preventDefault()
        const finalUrl = inputValue.startsWith("http")
          ? inputValue
          : `https://${inputValue}`
        e.clipboardData?.setData("text/plain", finalUrl)
      }
    }

    document.addEventListener("copy", handleCopyCut)
    document.addEventListener("cut", handleCopyCut)

    return () => {
      document.removeEventListener("copy", handleCopyCut)
      document.removeEventListener("cut", handleCopyCut)
    }
  }, [inputValue])

  const setBackdrop = (e: boolean) => {
    dispatch(
      setGlobalBackdrop({
        isOpen: e,
        loading: false,
        body: null,
      })
    )
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)

    if (!anchorEl) {
      setBookmarkInputValue(filteredFavorites?.title || "")
    }

    handleToggleBookmark()
  }

  const handleToggleBookmark = async () => {
    const bookmarkId = uuidv4()
    if (activeTab.URL && !isBookmarked) {
      dispatch(
        setToggleBookmarkTabByUrl({
          url: activeTab.URL,
        })
      )
      const result = await saveBookmark({
        bookmarkId,
        url: activeTab.URL,
        icon: activeTab.Icon || "",
        title: activeTab.Title,
        isBookmark: true,
      })
      if (result?.success) {
        dispatch(addFavorite({ favorite: { ...activeTab, bookmarkId } }))
        setBookmarkInputValue(filteredFavorites?.title || activeTab.Title)
      }
    }
  }

  const handleRemoveBookmark = async () => {
    if (activeTab.URL) {
      dispatch(
        setToggleBookmarkTabByUrl({
          url: activeTab.URL,
        })
      )
      handleDeleteBookmarkInDb(filteredFavorites.bookmarkId)
      dispatch(
        removeFavorite({
          favorite: activeTab,
          bookmarkId: filteredFavorites.bookmarkId,
        })
      )
    }
  }

  const handleBookmarkInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookmarkInputValue(e.target.value)
  }

  const handleUrlChange = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      setOpenOptionsBox(false)
      if (inputValue.trim()) {
        try {
          let finalUrl = inputValue.trim()
          if (isValidUrl(finalUrl)) {
            // Ensure the URL starts with 'http://' or 'https://'
            finalUrl = finalUrl.startsWith("http")
              ? finalUrl
              : `https://${finalUrl}`
          } else {
            const searchEngineUrl = "https://duckduckgo.com/?q="
            const duckDuckGoFinalUrl = "&ia=web"
            finalUrl =
              searchEngineUrl +
              finalUrl.trim().replace(/\s+/g, "+") +
              duckDuckGoFinalUrl
          }

          if (activeTab?.URL === finalUrl) {
            const escapedId = CSS.escape(activeTab?.TabId)
            const webview = document.querySelector(
              `webview#${escapedId}`
            ) as Electron.WebviewTag
            webview.reload()
          } else {
            const urlData = await getDataFromUrl(finalUrl)

            const isInBookmark = favorites.some(
              (item) => item.url === urlData.baseUrl
            )

            ;(e.target as HTMLElement).blur()
            dispatch(
              updateActiveTabWithUrlData({
                urlData,
                isInBookmark,
                tabId: tab.TabId,
              })
            )
          }
        } catch (err) {
          console.error("Error handling URL change:", err)
        }
      }
    }
  }

  const handleSelectOption = async (value: string) => {
    const finalUrl = value.trim()
    const urlData = await getDataFromUrl(finalUrl)

    const isInBookmark = favorites.some((item) => item.url === urlData.baseUrl)

    dispatch(
      updateActiveTabWithUrlData({ urlData, isInBookmark, tabId: tab.TabId })
    )
  }

  const handleClose = () => {
    setAnchorEl(null)
    setBackdrop(false)
  }

  const handleChangeFavoriteName = async () => {
    const newTitle = bookmarkInputValue
    const result = await handleEditBookmarkInDb(
      filteredFavorites.bookmarkId,
      newTitle
    )
    console.log(result.message)
    dispatch(
      updateFavoriteTitle({
        newTitle,
        bookmarkToEdit: filteredFavorites.bookmarkId,
      })
    )
  }

  const closeFavorite = (type?: "OK" | "DELETE" | null) => {
    if (type === "OK") {
      handleChangeFavoriteName()
    }
    if (type === "DELETE") {
      handleRemoveBookmark()
    }
    setAnchorEl(null)
    setBackdrop(false)
  }

  return {
    open,
    searchInputRef,
    favorites,
    historyToInputOptions,
    id,
    bookmarkInputValue,
    anchorEl,
    isBookmarked,
    inputValue,
    openOptionsBox,
    handleClick,
    handleBookmarkInput,
    handleUrlChange,
    handleSelectOption,
    handleClose,
    closeFavorite,
    setInputValue,
    setOpenOptionsBox,
  }
}

export default useSearchInput
