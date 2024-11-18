import { CONFIG_MAX_SPLIT_VIEW } from "@/config/config"
import { COMMON_NEW_TAB_TITLE } from "@/constants/common"
import {
  IMAGE_AWS,
  IMAGE_DME_LOGO,
  IMAGE_OUTLOOK,
  IMAGE_TEAMS,
  IMAGE_TELEGRAM,
  IMAGE_TIGGER_AI,
  IMAGE_WHATSAPP,
  IMAGE_YOUTUBE_MUSIC,
} from "@/constants/img"
import { getRandomWaveBg } from "@/helpers/color"
import { ITabsBrowser, ITabsBrowserTab } from "@/types/tabsBrowser"
import { createSlice } from "@reduxjs/toolkit"
import { v4 as uuidv4 } from "uuid"

const INIT_STATE: ITabsBrowser = {
  tabs: [],
}

const defaultMiniApps = [
  {
    AppId: "1",
    Position: 1,
    Icon: IMAGE_TEAMS,
    Title: "Microsoft Teams",
    URL: "https://teams.microsoft.com/",
    Host: "microsoft.com",
    IsActive: false,
    IsLoading: false,
    IsReloading: false,
    IsPinned: false,
    IsLoaded: false,
  },
  {
    AppId: "2",
    Position: 2,
    Icon: IMAGE_OUTLOOK,
    Title: "Outlook",
    URL: "https://outlook.office.com/",
    Host: "office.com",
    IsActive: false,
    IsLoading: false,
    IsReloading: false,
    IsPinned: false,
    IsLoaded: false,
  },
  {
    AppId: "3",
    Position: 3,
    Icon: "https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/svg/onenote_48x1.svg",
    Title: "OneNote",
    URL: "https://www.onenote.com/",
    Host: "onenote.com",
    IsActive: false,
    IsLoading: false,
    IsReloading: false,
    IsPinned: false,
    IsLoaded: false,
  },
  {
    AppId: "4",
    Position: 4,
    Icon: IMAGE_TELEGRAM,
    Title: "Telegram",
    URL: "https://web.telegram.org/",
    Host: "telegram.org",
    IsActive: false,
    IsLoading: false,
    IsReloading: false,
    IsPinned: false,
    IsLoaded: false,
  },
  {
    AppId: "5",
    Position: 5,
    Icon: IMAGE_AWS,
    Title: "Amazon Web Services",
    URL: "https://984420317894.signin.aws.amazon.com/console",
    Host: "amazon.com",
    IsActive: false,
    IsLoading: false,
    IsReloading: false,
    IsPinned: false,
    IsLoaded: false,
  },
  {
    AppId: "6",
    Position: 6,
    Icon: IMAGE_YOUTUBE_MUSIC,
    Title: "Youtube Music",
    URL: "https://music.youtube.com/",
    Host: "youtube.com",
    IsActive: false,
    IsLoading: false,
    IsReloading: false,
    IsPinned: false,
    IsLoaded: false,
  },
  {
    AppId: "7",
    Position: 7,
    Icon: IMAGE_TIGGER_AI,
    Title: "dME AI",
    // URL: "https://tigger.dauth.ai/",
    URL: "http://localhost:3000/",
    Host: "dauth.com",
    IsActive: false,
    IsLoading: false,
    IsReloading: false,
    IsPinned: false,
    IsLoaded: false,
  },
  {
    AppId: "8",
    Position: 8,
    Icon: IMAGE_WHATSAPP,
    Title: "Whatsapp",
    URL: "https://web.whatsapp.com/",
    Host: "whatsapp.com",
    IsActive: false,
    IsLoading: false,
    IsReloading: false,
    IsPinned: false,
    IsLoaded: false,
  },
]

export const slice = createSlice({
  name: "tabsBrowser",
  initialState: INIT_STATE,
  reducers: {
    setDefaultTab: (state, action) => {
      const newTab: ITabsBrowserTab = {
        TabId: uuidv4(),
        WorkspaceId: action?.payload?.WorkspaceId,
        Position: state.tabs.length + 1,
        Icon: IMAGE_DME_LOGO,
        Title: COMMON_NEW_TAB_TITLE,
        URL: null,
        NavigateURL: null,
        IsBookmark: false,
        IsSecure: true,
        IsActive: true,
        IsMiniApp: false,
        IsMiniAppPinned: false,
        MiniAppDefaultUrl: null,
        IsLoading: false,
        IsReloading: false,
        Protocol: null,
        Host: null,
        BgColor: getRandomWaveBg(),
        SplitView: null,
        history: {
          past: [],
          present: "",
          future: [],
        },
      }
      state.tabs = [...state.tabs, newTab]

      // Verifica si ya existen mini apps en las tabs antes de crearlas
      const hasMiniApps = state.tabs.some((tab) => tab.IsMiniApp)

      const miniapps = createDefaultMiniApps({
        WorkspaceId: action?.payload?.WorkspaceId,
      })

      !hasMiniApps && (state.tabs = [...state.tabs, ...miniapps])
    },
    setHomeTab: (state, action) => {
      const pos = state.tabs.findIndex(
        (tab: ITabsBrowserTab) => tab?.TabId === action?.payload?.tabId
      )
      if (pos >= 0) {
        state.tabs[pos] = {
          ...state.tabs[pos],
          Icon: IMAGE_DME_LOGO,
          Title: COMMON_NEW_TAB_TITLE,
          URL: null,
          NavigateURL: null,
          IsBookmark: false,
          IsSecure: true,
          IsLoading: false,
          Protocol: null,
          Host: null,
        }
      }
    },
    setNewTab: (state, action) => {
      if (action?.payload?.WorkspaceId) {
        const TabId = uuidv4()
        const newTab: ITabsBrowserTab = {
          TabId,
          WorkspaceId: action?.payload?.WorkspaceId,
          Position:
            state.tabs[state.tabs.length - 1].Position === 0
              ? state.tabs[state.tabs.length - 1].Position + 2
              : state.tabs[state.tabs.length - 1].Position + 1,
          Icon: IMAGE_DME_LOGO,
          Title: COMMON_NEW_TAB_TITLE,
          URL: null,
          NavigateURL: null,
          IsBookmark: false,
          IsSecure: true,
          IsActive: true,
          IsMiniApp: false,
          IsMiniAppPinned: false,
          MiniAppDefaultUrl: null,
          IsLoading: false,
          IsReloading: false,
          Protocol: null,
          Host: null,
          BgColor: getRandomWaveBg(),
          SplitView: null,
          history: {
            past: [],
            present: "",
            future: [],
          },
        }
        state.tabs.push(newTab)

        if (
          state.tabs?.filter(
            (e: ITabsBrowserTab) =>
              e?.SplitView &&
              e?.WorkspaceId === action?.payload?.WorkspaceId &&
              !e?.IsMiniApp
          ).length > 0
        ) {
          const mainTab = state.tabs.find(
            (e: ITabsBrowserTab) =>
              e?.SplitView?.IsMain &&
              e?.WorkspaceId === action?.payload?.WorkspaceId &&
              !e?.IsMiniApp
          )

          if (
            mainTab &&
            state.tabs?.filter(
              (e: ITabsBrowserTab) =>
                e?.IsActive &&
                e?.WorkspaceId === action?.payload?.WorkspaceId &&
                !e?.IsMiniApp
            ).length >= CONFIG_MAX_SPLIT_VIEW
          ) {
            state.tabs = changeActiveTab({
              Tabs: state?.tabs,
              TabIds: [mainTab?.TabId, TabId],
              WorkspaceId: action?.payload?.WorkspaceId,
              SplitView: true,
            })
          }
        } else {
          state.tabs = changeActiveTab({
            Tabs: state?.tabs,
            TabIds: [TabId],
            WorkspaceId: action?.payload?.WorkspaceId,
          })
        }
      }
    },
    setNewTabWithUrl: (state, action) => {
      if (action?.payload?.WorkspaceId) {
        const TabId = uuidv4()
        const newTab: ITabsBrowserTab = {
          TabId,
          WorkspaceId: action?.payload?.WorkspaceId,
          Position: state.tabs.length + 1,
          Icon: IMAGE_DME_LOGO,
          Title: COMMON_NEW_TAB_TITLE,
          URL: action?.payload?.URL,
          NavigateURL: action?.payload?.URL,
          IsBookmark: false,
          IsSecure: true,
          IsActive: true,
          IsMiniApp: false,
          IsMiniAppPinned: false,
          MiniAppDefaultUrl: null,
          IsLoading: false,
          IsReloading: false,
          Protocol: null,
          Host: null,
          BgColor: getRandomWaveBg(),
          SplitView: null,
          history: {
            past: [],
            present: "",
            future: [],
          },
        }
        state.tabs.push(newTab)

        if (
          state.tabs?.filter(
            (e: ITabsBrowserTab) =>
              e?.SplitView &&
              e?.WorkspaceId === action?.payload?.WorkspaceId &&
              !e?.IsMiniApp
          ).length > 0
        ) {
          const mainTab = state.tabs.find(
            (e: ITabsBrowserTab) =>
              e?.SplitView?.IsMain &&
              e?.WorkspaceId === action?.payload?.WorkspaceId &&
              !e?.IsMiniApp
          )

          if (
            mainTab &&
            state.tabs?.filter(
              (e: ITabsBrowserTab) =>
                e?.IsActive &&
                e?.WorkspaceId === action?.payload?.WorkspaceId &&
                !e?.IsMiniApp
            ).length >= CONFIG_MAX_SPLIT_VIEW
          ) {
            state.tabs = changeActiveTab({
              Tabs: state?.tabs,
              TabIds: [mainTab?.TabId, TabId],
              WorkspaceId: action?.payload?.WorkspaceId,
              SplitView: true,
            })
          }
        } else {
          state.tabs = changeActiveTab({
            Tabs: state?.tabs,
            TabIds: [TabId],
            WorkspaceId: action?.payload?.WorkspaceId,
          })
        }
      }
    },
    // setDefaultCustomUrlTab: (state, action) => {
    //   if (action?.payload?.data) {
    //     state.tabs[0] = {
    //       TabId: uuidv4(),
    //       WorkspaceId: action?.payload?.data?.WorkspaceId,
    //       Position: 0,
    //       Icon: action?.payload?.data?.icon || "",
    //       Title: action?.payload?.data?.title || "",
    //       URL: action?.payload?.data?.baseUrl || "",
    //       IsBookmark: false,
    //       IsSecure: action?.payload?.data?.protocol
    //         ? action?.payload?.data?.protocol.indexOf("https") >= 0
    //           ? true
    //           : false
    //         : true,
    //       IsActive: true,
    //       IsLoading: true,
    //       Protocol: action?.payload?.data?.protocol
    //         ? action?.payload?.data?.protocol
    //         : "",
    //       Host: action?.payload?.data?.host,
    //       BgColor: getRandomWaveBg(),
    //       SplitView: null,
    //       history: {
    //         past: [],
    //         present: action?.payload?.data?.baseUrl || "",
    //         future: [],
    //       },
    //     }
    //   }
    // },
    setDataTab: (state, action) => {
      if (action?.payload?.data) {
        const pos = state.tabs.findIndex(
          (e: ITabsBrowserTab) => e?.TabId === action?.payload?.data?.TabId
        )
        if (pos >= 0) {
          state.tabs[pos] = {
            ...state.tabs[pos],
            ...action.payload.data,
          }
        }
      }
    },
    setTabUrl: (state, action) => {
      if (action?.payload?.data) {
        const pos = state.tabs.findIndex(
          (e: ITabsBrowserTab) => e?.TabId === action?.payload?.data?.TabId
        )
        if (pos >= 0) {
          state.tabs[pos] = {
            ...state.tabs[pos],
            URL: action.payload.data?.URL,
          }
        }
      }
    },
    setTabLoading: (state, action) => {
      if (action?.payload?.data) {
        const pos = state.tabs.findIndex(
          (e: ITabsBrowserTab) => e?.TabId === action?.payload?.data?.TabId
        )
        if (pos >= 0) {
          state.tabs[pos] = {
            ...state.tabs[pos],
            IsLoading: action.payload.data?.IsLoading,
          }
        }
      }
    },
    setTabHost: (state, action) => {
      if (action?.payload?.data) {
        const pos = state.tabs.findIndex(
          (e: ITabsBrowserTab) => e?.TabId === action?.payload?.data?.TabId
        )
        if (pos >= 0) {
          state.tabs[pos] = {
            ...state.tabs[pos],
            Host: action.payload.data?.Host,
          }
        }
      }
    },
    setTabTitle: (state, action) => {
      if (action?.payload?.data) {
        const pos = state.tabs.findIndex(
          (e: ITabsBrowserTab) => e?.TabId === action?.payload?.data?.TabId
        )
        if (pos >= 0) {
          state.tabs[pos] = {
            ...state.tabs[pos],
            Title: action.payload.data?.Title,
          }
        }
      }
    },
    setTabIcon: (state, action) => {
      if (action?.payload?.data) {
        const pos = state.tabs.findIndex(
          (e: ITabsBrowserTab) => e?.TabId === action?.payload?.data?.TabId
        )
        if (pos >= 0) {
          state.tabs[pos] = {
            ...state.tabs[pos],
            Icon: action.payload.data?.Icon,
          }
        }
      }
    },
    setCloseTab: (state, action) => {
      if (action?.payload?.TabId) {
        const pos = state.tabs.findIndex(
          (e: ITabsBrowserTab) => e?.TabId === action?.payload?.TabId
        )
        console.log(pos, "==================")
        if (pos >= 0) {
          const closingActiveTab = state.tabs[pos]?.IsActive
          const mainSplitTab = state.tabs[pos]?.SplitView?.IsMain ? true : false
          const requiresNewSplit =
            state.tabs[pos]?.SplitView &&
            state.tabs[pos]?.SplitView?.IsMain === false
              ? true
              : false

          state.tabs = state.tabs.filter(
            (e: ITabsBrowserTab) => e.TabId !== action.payload.TabId
          )

          if (
            state.tabs?.filter(
              (tab: ITabsBrowserTab) =>
                tab?.SplitView &&
                tab?.WorkspaceId === action?.payload?.WorkspaceId &&
                !tab?.IsMiniApp
            ).length > 0
          ) {
            if (mainSplitTab) {
              state.tabs = state.tabs?.map((tab: ITabsBrowserTab) => ({
                ...tab,
                IsActive: tab?.IsMiniApp
                  ? false
                  : tab?.WorkspaceId !== action?.payload?.WorkspaceId
                  ? tab?.IsActive
                  : tab?.SplitView
                  ? true
                  : false,
                SplitView: tab?.IsMiniApp
                  ? null
                  : tab?.WorkspaceId !== action?.payload?.WorkspaceId
                  ? tab?.SplitView
                  : null,
              }))
            }

            if (!mainSplitTab && requiresNewSplit) {
              const tabInactive = state.tabs.find(
                (tab: ITabsBrowserTab) =>
                  !tab?.IsActive &&
                  tab?.WorkspaceId === action?.payload?.WorkspaceId &&
                  !tab?.IsMiniApp
              )

              if (tabInactive) {
                tabInactive.IsActive = true
                tabInactive.SplitView = {
                  IsMain: false,
                  Position:
                    state.tabs?.filter(
                      (tab: ITabsBrowserTab) =>
                        tab?.SplitView &&
                        tab?.WorkspaceId === action?.payload?.WorkspaceId &&
                        !tab?.IsMiniApp
                    ).length + 1,
                }

                state.tabs = sortTabs(state.tabs)
              }
            }
          } else {
            if (closingActiveTab && state.tabs.length > 0) {
              if (!state.tabs[state.tabs.length - 1].IsMiniApp) {
                state.tabs[state.tabs.length - 1].IsActive = true
              } else {
                const tabInactive = state.tabs.find(
                  (tab: ITabsBrowserTab) =>
                    !tab?.IsActive &&
                    tab?.WorkspaceId === action?.payload?.WorkspaceId &&
                    !tab?.IsMiniApp
                )

                if (tabInactive) {
                  tabInactive.IsActive = true
                }
              }
            }
          }
        }
      }
    },
    setChangeSelectedTab: (state, action) => {
      if (action?.payload?.TabId) {
        if (
          state.tabs?.filter(
            (e: ITabsBrowserTab) =>
              e?.SplitView &&
              e?.WorkspaceId === action?.payload?.WorkspaceId &&
              !e?.IsMiniApp
          ).length > 0
        ) {
          const mainTab = state.tabs.find(
            (e: ITabsBrowserTab) =>
              e?.SplitView?.IsMain &&
              e?.WorkspaceId === action?.payload?.WorkspaceId &&
              !e?.IsMiniApp
          )

          if (action?.payload?.TabId !== mainTab?.TabId) {
            state.tabs = changeActiveTab({
              Tabs: state?.tabs,
              TabIds: [mainTab?.TabId, action?.payload?.TabId],
              WorkspaceId: action?.payload?.WorkspaceId,
              SplitView: true,
            })
          }
        } else {
          state.tabs = changeActiveTab({
            Tabs: state?.tabs,
            TabIds: [action?.payload?.TabId],
            WorkspaceId: action?.payload?.WorkspaceId,
          })
        }
      }
    },
    setToggleBookmarkTabByUrl: (state, action) => {
      if (action?.payload?.url) {
        state.tabs = state.tabs?.map((tab: ITabsBrowserTab) =>
          tab?.URL === action?.payload?.url
            ? {
                ...tab,
                IsBookmark: tab?.IsMiniApp ? tab?.IsBookmark : !tab.IsBookmark,
              }
            : tab
        )
      }
    },
    updateActiveTabWithUrlData: (state, action) => {
      state.tabs = state.tabs?.map((tab) =>
        tab.IsActive && tab.TabId === action.payload.tabId
          ? {
              ...tab,
              IsBookmark: action.payload.isInBookmark,
              Icon: action.payload.urlData.icon,
              Title: action.payload.urlData.title || tab.Title,
              URL: action.payload.urlData.fullUrl,
              NavigateURL: action.payload.urlData.fullUrl,
              IsSecure: action.payload.urlData.protocol === "https:",
              // IsLoading: true,
              Protocol: action.payload.urlData.protocol,
              Host: action.payload.urlData.host,
            }
          : tab
      )
    },
    goBackNavigation: (state, action) => {
      state.tabs = state.tabs?.map((tab) =>
        tab.IsActive && tab.TabId === action.payload.tabId
          ? {
              ...tab,
              URL: tab.history.past[tab.history.past.length - 1],
              NavigateURL: tab.history.past[tab.history.past.length - 1],
              Host: tab.history.past[tab.history.past.length - 1],
              history: {
                past: tab.history.past.slice(0, -1),
                present: tab.history.past[tab.history.past.length - 1],
                future: tab.history.future.concat(tab.URL || ""),
              },
            }
          : tab
      )
    },
    goForwardNavigation: (state, action) => {
      state.tabs = state.tabs?.map((tab) =>
        tab.IsActive && tab.TabId === action.payload.tabId
          ? {
              ...tab,
              URL: tab.history.future[tab.history.future.length - 1],
              NavigateURL: tab.history.future[tab.history.future.length - 1],
              Host: tab.history.future[tab.history.future.length - 1],
              history: {
                past: tab.history.past.concat(tab.URL || ""),
                present: tab.history.future[tab.history.future.length - 1],
                future: tab.history.future.slice(0, -1),
              },
            }
          : tab
      )
    },
    setSplitView: (state, action) => {
      if (action?.payload?.Split) {
        const currentPos = state.tabs.findIndex(
          (e: ITabsBrowserTab) =>
            e?.IsActive &&
            e?.WorkspaceId === action?.payload?.WorkspaceId &&
            !e?.IsMiniApp
        )

        if (currentPos >= 0) {
          state.tabs[currentPos].NavigateURL = state.tabs[currentPos].URL
          state.tabs[currentPos].SplitView = {
            IsMain: true,
            Position: 1,
          }
        }

        const tabInactive = state.tabs.find(
          (e: ITabsBrowserTab) =>
            !e?.IsActive &&
            e?.WorkspaceId === action?.payload?.WorkspaceId &&
            !e?.IsMiniApp
        )

        if (tabInactive) {
          tabInactive.NavigateURL = tabInactive.URL
          tabInactive.IsActive = true
          tabInactive.SplitView = {
            IsMain: false,
            Position:
              state.tabs?.filter(
                (e: ITabsBrowserTab) =>
                  e?.SplitView &&
                  e?.WorkspaceId === action?.payload?.WorkspaceId &&
                  !e?.IsMiniApp
              ).length + 1,
          }

          state.tabs = sortTabs(state.tabs)
        } else {
          const TabId = uuidv4()
          const newTab: ITabsBrowserTab = {
            TabId,
            WorkspaceId: action?.payload?.WorkspaceId,
            Position: state.tabs.length + 1,
            Icon: IMAGE_DME_LOGO,
            Title: COMMON_NEW_TAB_TITLE,
            URL: null,
            NavigateURL: null,
            IsBookmark: false,
            IsSecure: true,
            IsActive: true,
            IsMiniApp: false,
            IsMiniAppPinned: false,
            MiniAppDefaultUrl: null,
            IsLoading: false,
            IsReloading: false,
            Protocol: null,
            Host: null,
            BgColor: getRandomWaveBg(),
            SplitView: {
              IsMain: false,
              Position:
                state.tabs?.filter(
                  (e: ITabsBrowserTab) =>
                    e?.SplitView &&
                    e?.WorkspaceId === action?.payload?.WorkspaceId &&
                    !e?.IsMiniApp
                ).length + 1,
            },
            history: {
              past: [],
              present: "",
              future: [],
            },
          }

          state.tabs.push(newTab)
          state.tabs = sortTabs(state.tabs)
        }
      } else {
        state.tabs = state.tabs?.map((e: ITabsBrowserTab) => ({
          ...e,
          NavigateURL: e?.IsMiniApp ? e?.NavigateURL : e?.URL,
          IsActive: e?.IsMiniApp
            ? e?.IsActive
            : e?.WorkspaceId !== action?.payload?.WorkspaceId
            ? e?.IsActive
            : e?.SplitView?.IsMain
            ? true
            : false,
          SplitView: e?.IsMiniApp
            ? null
            : e?.WorkspaceId !== action?.payload?.WorkspaceId
            ? e?.SplitView
            : null,
        }))
      }
    },
    saveToHistory: (state, action) => {
      const { TabId, URL } = action.payload
      state.tabs = state.tabs?.map((tab) => {
        if (tab.TabId === TabId) {
          const lastPastUrl = tab.history.past[tab.history.past.length - 1]
          const currentPresent = tab.history.present

          const shouldDeleteFuture =
            URL !== currentPresent && tab.history.future.length > 0

          const shouldAddToPast =
            currentPresent &&
            currentPresent !== URL &&
            currentPresent !== lastPastUrl

          const newPast = shouldAddToPast
            ? [...tab.history.past, currentPresent]
            : currentPresent !== ""
            ? [...tab.history.past]
            : [""]

          return {
            ...tab,
            history: {
              future: shouldDeleteFuture ? [] : tab.history.future,
              past: newPast,
              present: URL,
            },
          }
        } else {
          return tab
        }
      })
    },
    setNewTabCustomUrl: (state, action) => {
      if (action?.payload?.WorkspaceId) {
        const TabId = uuidv4()
        const newTab: ITabsBrowserTab = {
          TabId,
          WorkspaceId: action?.payload?.WorkspaceId,
          Position: state.tabs.length + 1,
          Icon: action?.payload?.urlData?.icon,
          Title: action?.payload?.urlData?.title || "",
          URL: action?.payload?.urlData?.fullUrl,
          NavigateURL: action?.payload?.urlData?.fullUrl,
          IsBookmark: action?.payload?.isInBookmark,
          IsSecure: true,
          IsActive: true,
          IsMiniApp: false,
          IsMiniAppPinned: false,
          MiniAppDefaultUrl: null,
          IsLoading: true,
          IsReloading: false,
          Protocol: action?.payload?.urlData?.protocol,
          Host: action?.payload?.urlData?.host,
          BgColor: getRandomWaveBg(),
          SplitView: null,
          history: {
            past: [],
            present: "",
            future: [],
          },
        }

        state.tabs.push(newTab)

        if (
          state.tabs?.filter(
            (e: ITabsBrowserTab) =>
              e?.SplitView &&
              e?.WorkspaceId === action?.payload?.WorkspaceId &&
              !e?.IsMiniApp
          ).length > 0
        ) {
          const mainTab = state.tabs.find(
            (e: ITabsBrowserTab) =>
              e?.SplitView?.IsMain &&
              e?.WorkspaceId === action?.payload?.WorkspaceId &&
              !e?.IsMiniApp
          )

          if (
            mainTab &&
            state.tabs?.filter(
              (e: ITabsBrowserTab) =>
                e?.IsActive &&
                e?.WorkspaceId === action?.payload?.WorkspaceId &&
                !e?.IsMiniApp
            ).length >= CONFIG_MAX_SPLIT_VIEW
          ) {
            state.tabs = changeActiveTab({
              Tabs: state?.tabs,
              TabIds: [mainTab?.TabId, TabId],
              WorkspaceId: action?.payload?.WorkspaceId,
              SplitView: true,
            })
          }
        } else {
          state.tabs = changeActiveTab({
            Tabs: state?.tabs,
            TabIds: [TabId],
            WorkspaceId: action?.payload?.WorkspaceId,
          })
        }
      }
    },
    setOpenSidebarApp: (state, action) => {
      if (action?.payload?.TabId) {
        state.tabs = state.tabs?.map((tabs: ITabsBrowserTab) => {
          return {
            ...tabs,
            IsLoaded:
              action?.payload?.TabId === tabs?.TabId ? true : tabs?.IsLoaded,
            IsActive: !tabs?.IsMiniApp
              ? tabs?.IsActive
              : tabs?.TabId === action?.payload?.TabId
              ? true
              : false,
          }
        })
      }
    },
    setPinSidebarApp: (state) => {
      state.tabs = state.tabs.map((e: ITabsBrowserTab) => {
        return {
          ...e,
          IsMiniAppPinned: !e?.IsMiniApp ? false : !e?.IsMiniAppPinned,
        }
      })
    },
    setReloadPinSidebarApp: (state, action) => {
      if (action?.payload?.TabId) {
        const pos = state.tabs.findIndex(
          (e: ITabsBrowserTab) => e?.TabId === action?.payload?.TabId
        )

        if (pos >= 0) {
          state.tabs[pos] = {
            ...state.tabs[pos],
            IsReloading: action?.payload?.IsReloading,
            URL: action?.payload?.IsReloading
              ? state.tabs[pos]?.MiniAppDefaultUrl
              : state.tabs[pos]?.URL,
            NavigateURL: action?.payload?.IsReloading
              ? state.tabs[pos]?.MiniAppDefaultUrl
              : state.tabs[pos]?.URL,
          }
        }
      }
    },
    setCloseSidebarApp: (state) => {
      state.tabs = state.tabs?.map((e: ITabsBrowserTab) => {
        return {
          ...e,
          IsActive: !e?.IsMiniApp ? e?.IsActive : false,
          IsMiniAppPinned: !e?.IsMiniApp ? e?.IsMiniAppPinned : false,
        }
      })
    },
    setTabForceRedirectUrl: (state, action) => {
      if (action?.payload?.data) {
        const pos = state.tabs.findIndex(
          (e: ITabsBrowserTab) => e?.TabId === action?.payload?.data?.TabId
        )
        if (pos >= 0) {
          state.tabs[pos] = {
            ...state.tabs[pos],
            NavigateURL: action.payload.data?.NavigateURL,
          }
        }
      }
    },
    // setRestoreTabs: (state, action) => {
    //   console.log(action.payload.tabs, "===aca en el frontreduxxx")
    //   // state.tabs = action.payload.tabs
    // },

    setRestoreTabs: (state, action) => {
      const restoredTabs = action.payload.tabs
      const tabsWithoutHome = restoredTabs?.filter(
        (tab: ITabsBrowserTab) => tab?.URL !== null
      )

      const workspaceActive = action.payload.workspaceActive
      const newTabs = tabsWithoutHome.map((tab: ITabsBrowserTab) => {
        if (tab.TabId) {
          // Crear una nueva tab asociada al workspace sin verificar el estado de los workspaces
          const newTab: ITabsBrowserTab = {
            TabId: tab.TabId,
            WorkspaceId: tab.WorkspaceId, // Asociar el WorkspaceId directamente
            Position: state.tabs.length + 1, // Ajusta la lógica de posición según sea necesario
            Icon: null, // Puedes ajustar el icono
            Title: "Restored tab", // Ajusta el título de la tab
            URL: tab.URL,
            NavigateURL: tab.URL,
            IsBookmark: false,
            IsSecure: true,
            IsActive:
              workspaceActive === tab.WorkspaceId ? false : tab.IsActive, // Definir si la tab debe ser activa o no
            IsMiniApp: false,
            IsMiniAppPinned: false,
            MiniAppDefaultUrl: null,
            IsLoading: false,
            IsReloading: false,
            Protocol: "https:",
            Host: null,
            BgColor: getRandomWaveBg(),
            SplitView: null,
            history: {
              past: [],
              present: tab.URL ? tab.URL : "", // Usar la URL restaurada como presente
              future: [],
            },
          }
          return newTab
        }
      })

      const miniapps = createDefaultMiniApps({
        WorkspaceId: workspaceActive,
      })

      miniapps?.map((e: ITabsBrowserTab) => {
        state.tabs.push(e)
      })

      state.tabs = [...newTabs, ...miniapps]
    },
  },
})

export const {
  setDefaultTab,
  setNewTab,
  // setDefaultCustomUrlTab,
  setDataTab,
  setTabIcon,
  setTabTitle,
  setTabUrl,
  setTabLoading,
  setCloseTab,
  setChangeSelectedTab,
  updateActiveTabWithUrlData,
  setToggleBookmarkTabByUrl,
  goBackNavigation,
  goForwardNavigation,
  setSplitView,
  saveToHistory,
  setHomeTab,
  setTabHost,
  setNewTabCustomUrl,
  setOpenSidebarApp,
  setPinSidebarApp,
  setReloadPinSidebarApp,
  setCloseSidebarApp,
  setTabForceRedirectUrl,
  setRestoreTabs,
  setNewTabWithUrl,
} = slice.actions

export default slice.reducer

const changeActiveTab = ({
  Tabs,
  TabIds,
  WorkspaceId,
  SplitView = false,
}: {
  Tabs: ITabsBrowserTab[]
  TabIds: string[]
  WorkspaceId: string
  SplitView?: boolean
}) => {
  return Tabs?.map((e: ITabsBrowserTab) => ({
    ...e,
    IsActive: e?.IsMiniApp
      ? e?.IsActive
      : e?.WorkspaceId !== WorkspaceId
      ? e?.IsActive
      : TabIds.includes(e?.TabId)
      ? true
      : false,
    SplitView: e?.IsMiniApp
      ? null
      : e?.WorkspaceId !== WorkspaceId
      ? e?.SplitView
      : !SplitView || !TabIds.includes(e?.TabId)
      ? null
      : e?.SplitView?.IsMain
      ? e?.SplitView
      : {
          IsMain: false,
          Position: 2,
        },
  }))
}

const sortTabs = (Tabs: ITabsBrowserTab[]) => {
  Tabs.sort((a, b) => {
    // Si ambos tienen SplitView, comparar por SplitView.Position
    if (a.SplitView && b.SplitView) {
      return a.SplitView.Position - b.SplitView.Position
    }

    // Si 'a' tiene SplitView y 'b' no, 'a' debe ir antes
    if (a.SplitView && !b.SplitView) {
      return -1
    }

    // Si 'b' tiene SplitView y 'a' no, 'b' debe ir antes
    if (!a.SplitView && b.SplitView) {
      return 1
    }

    // Si ninguno tiene SplitView, comparar por Position
    return a.Position - b.Position
  })

  return Tabs
}

const createDefaultMiniApps = ({ WorkspaceId }: { WorkspaceId: string }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const list: ITabsBrowserTab[] = defaultMiniApps?.map((e: any) => {
    return {
      TabId: uuidv4(),
      WorkspaceId,
      Position: 0,
      Icon: e?.Icon,
      Title: e?.Title,
      URL: e?.URL,
      NavigateURL: e?.URL,
      IsBookmark: false,
      IsSecure: true,
      IsActive: false,
      IsMiniApp: true,
      IsMiniAppPinned: false,
      MiniAppDefaultUrl: e?.URL,
      IsLoading: false,
      IsLoaded: e.IsLoaded,
      IsReloading: false,
      Protocol: "https:",
      Host: e?.Host,
      BgColor: getRandomWaveBg(),
      SplitView: null,
      history: {
        past: [],
        present: "",
        future: [],
      },
    }
  })

  return list
}
