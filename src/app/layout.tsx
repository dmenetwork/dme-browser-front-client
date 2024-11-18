"use client"
import GlobalBackdrop from "@/components/GlobalBackdrop/GlobalBackdrop"
import GlobalNotification from "@/components/GlobalNotification/GlobalNotification"
import KeyboardShortcut from "@/components/KeyboardShortcut/KeyboardShortcut"
import store from "@/redux/store"
import "@/styles/globals.css"
import { GlobalStyles } from "@mui/material"
import CssBaseline from "@mui/material/CssBaseline"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import { ReactNode } from "react"
import { Provider as ReduxProvider } from "react-redux"
// import NewAppVersion from "@/components/NewAppVersion/NewAppVersion"
import { MuiThemeProvider } from "@/components/MuiThemeProvider/MuiThemeProvider"

export default function RootLayout({ children }: { children: ReactNode }) {
  // const customPtBRLocaleText: Partial<PickersLocaleText<any>> = {
  //     okButtonLabel: "OK",
  //     cancelButtonLabel: "Cancelar"
  // }

  return (
    <html lang="en">
      <body>
        <ReduxProvider store={store}>
          <GlobalStyles
            styles={{
              body: {
                height: "100%",
                padding: 0,
                margin: 0,
              },
              a: {
                textDecoration: "none",
                color: "inherit",
              },
            }}
          />
          <LocalizationProvider
            dateAdapter={AdapterMoment}
            // adapterLocale="es"
            // localeText={customPtBRLocaleText}
          >
            <MuiThemeProvider>
              <CssBaseline />
              {/* <NewAppVersion /> */}
              <GlobalNotification />
              <GlobalBackdrop />
              <KeyboardShortcut />
              {children}
            </MuiThemeProvider>
          </LocalizationProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
