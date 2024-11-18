/* eslint-disable react-hooks/exhaustive-deps */
import { ThemeProvider } from "@mui/material/styles"
import { DarkTheme, LightTheme } from "@/styles/MuiTheme"
import { ReactNode } from "react"
import { useDispatch, useSelector } from "react-redux"
import { IRedux } from "@/types"
import { ICommon } from "@/types/common"
import { useEffect } from "react"
import { toggleTheme } from "@/redux/reducers/common"

export const MuiThemeProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch()
  const { reduxTheme } = useSelector<IRedux, ICommon>((state) => state?.common)
  const theme = reduxTheme === "light" ? LightTheme : DarkTheme

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme")
    if (storedTheme === "light") {
      dispatch(toggleTheme())
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("theme", reduxTheme)
  }, [reduxTheme])

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
