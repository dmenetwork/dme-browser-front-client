"use client"
import {
  COLOR_BG_MIST,
  COLOR_PAPER,
  COLOR_COMMON_BLACK,
  COLOR_WHITE,
  COLOR_PRIMARY_GREEN,
  COLOR_PRIMARY_PURPLE,
  COLOR_PRIMARY_PURPLE_LIGHT,
  COLOR_PRIMARY_YELLOW,
  COLOR_SECONDARY_INDIGO,
  COLOR_SECONDARY_INDIGO_LIGHT,
  COLOR_BG_MIST_DARK,
  COLOR_PRIMARY_PURPLE_DARK,
  COLOR_BG_MIST_DARK_THEME,
  COLOR_GREY_DISABLED,
  COLOR_GREY_DISABLED_DARK,
} from "@/constants/colors"
import "@fontsource/inter"
import { createTheme } from "@mui/material/styles"

export const LightTheme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          "&::-webkit-scrollbar": {
            width: 10,
            display: "none",
            // marginTop: 200,
            // marginBottom: 200,
          },
          "&::-webkit-scrollbar-button": {
            // height: 100,
            // marginTop: 200,
            // marginBottom: 200,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: COLOR_WHITE,
            // marginTop: 200,
            // marginBottom: 200,
          },
          "&::-webkit-scrollbar-track-piece": {},
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: `${COLOR_COMMON_BLACK}FF`,
            borderRadius: 5,
            height: "50px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: `${COLOR_COMMON_BLACK}E6`,
            // marginTop: 200,
            // marginBottom: 200,
          },
          "&::-webkit-scrollbar-corner": {},
          "&::-webkit-resizer": {},
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: () => ({
          borderRadius: 10,
          textTransform: "none",
          transition: "border-radius ease-in 1s",
        }),
        containedPrimary: {
          "&:not(.Mui-disabled)": {
            background: `linear-gradient(150deg, ${COLOR_PRIMARY_PURPLE} 30%, ${COLOR_SECONDARY_INDIGO} 90%)`,
            "&:hover": {
              background: `linear-gradient(150deg, ${COLOR_PRIMARY_PURPLE} 40%, ${COLOR_COMMON_BLACK} 100%)`,
              boxShadow: "0 1px 5px rgba(0, 0, 0, 0.7)",
              borderRadius: 100,
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: () => ({
          borderRadius: 10,
        }),
      },
    },

    /*** INPUT GOOGLE MAP ***/
    // MuiCssBaseline: {
    //   styleOverrides: `
    //           .pac-container {
    //             z-index: 99999;
    //           }
    //         `,
    // },
  },
  palette: {
    mode: "light",
    common: {
      black: COLOR_COMMON_BLACK,
      white: COLOR_WHITE,
    },
    grey: {
      "900": COLOR_GREY_DISABLED,
    },
    background: {
      default: COLOR_BG_MIST,
      paper: COLOR_PAPER,
    },
    primary: {
      main: COLOR_PRIMARY_PURPLE,
      light: COLOR_PRIMARY_PURPLE_LIGHT,
    },
    secondary: {
      main: COLOR_SECONDARY_INDIGO,
      light: COLOR_SECONDARY_INDIGO_LIGHT,
    },
    warning: {
      main: COLOR_PRIMARY_YELLOW,
    },
    success: {
      main: COLOR_PRIMARY_GREEN,
    },
    text: {
      primary: COLOR_WHITE,
      secondary: COLOR_COMMON_BLACK,
    },
    // secondary: {
    //     main: COLOR_RED_AGIL
    // }
  },
  typography: {
    fontFamily: "Inter, Arial, sans-serif", // Definir Inter como la fuente predeterminada
  },
})

export const DarkTheme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: () => ({
          borderRadius: 10,
          textTransform: "none",
          transition: "border-radius ease-in 1s",
        }),
        containedPrimary: {
          "&:not(.Mui-disabled)": {
            background: `linear-gradient(150deg, ${COLOR_PRIMARY_PURPLE} 30%, ${COLOR_SECONDARY_INDIGO} 90%)`,
            color: COLOR_WHITE,
            "&:hover": {
              background: `linear-gradient(150deg, ${COLOR_PRIMARY_PURPLE} 40%, ${COLOR_COMMON_BLACK} 100%)`,
              boxShadow: "0 1px 5px rgba(0, 0, 0, 0.7)",
              borderRadius: 100,
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: () => ({
          borderRadius: 10,
        }),
      },
    },

    /*** INPUT GOOGLE MAP ***/
    // MuiCssBaseline: {
    //   styleOverrides: `
    //           .pac-container {
    //             z-index: 99999;
    //           }
    //         `,
    // },
  },
  palette: {
    mode: "dark",
    common: {
      black: COLOR_COMMON_BLACK,
      white: COLOR_WHITE,
    },
    grey: {
      "900": COLOR_GREY_DISABLED_DARK,
    },
    text: {
      primary: COLOR_WHITE,
      secondary: COLOR_WHITE,
    },
    background: {
      default: COLOR_BG_MIST_DARK_THEME,
      paper: COLOR_BG_MIST_DARK,
    },
    primary: {
      main: COLOR_PRIMARY_PURPLE_DARK,
      light: COLOR_PRIMARY_PURPLE_DARK,
    },
    secondary: {
      main: COLOR_SECONDARY_INDIGO,
      light: COLOR_SECONDARY_INDIGO_LIGHT,
    },
    warning: {
      main: COLOR_PRIMARY_YELLOW,
    },
    success: {
      main: COLOR_PRIMARY_GREEN,
    },
  },
  typography: {
    fontFamily: "Inter, Arial, sans-serif", // Definir Inter como la fuente predeterminada
  },
})
