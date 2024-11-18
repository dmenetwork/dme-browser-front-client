import { configureStore } from "@reduxjs/toolkit"
import auth from "@/redux/reducers/auth"
import common from "@/redux/reducers/common"
import webview from "@/redux/reducers/webView"
import tabsBrowser from "@/redux/reducers/tabsBrowser"
import bookmark from "@/redux/reducers/bookmark"
import workspace from "@/redux/reducers/workspace"
import allHistory from "@/redux/reducers/allHistory"

export default configureStore({
  reducer: {
    auth,
    common,
    tabsBrowser,
    webview,
    bookmark,
    workspace,
    allHistory,
  },
})
