import { createTheme } from "@mui/material";

export const darkTheme = createTheme({
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: 14,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: "#d7d7db",
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: "#d7d7db",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderColor: "#d7d7db",
          " fieldset": {
            borderColor: "#d7d7db",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#d7d7db",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          "[disabled]": {
            backgroundColor: "#667181",
            borderRadius: 4,
          },
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#1c78d3",
      light: "#f4f7fe",
      dark: "#101824",
    },
    // secondary: {
    //   main: "#1a66dd",
    //   light: "#f4f7fe",
    // },
    text: {
      primary: "#d7d7db",
      secondary: "#55657d",
    },
    success: {
      main: "#29caab",
      light: "#eafaf7",
    },
    error: {
      main: "#f4324c",
      light: "#fff3f5",
    },
    background: {
      default: "#2a3648",
      paper: "#202836",
    },
    grey: {
      100: "e7e7e7",
      200: "#cbcbcb",
      400: "#eef1f8",
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    primary: {
      main: "#1c78d3",
      light: "#f4f7fe",
      dark: "#101824",
    },
    // secondary: {
    //   main: "#1a66dd",
    //   light: "#f4f7fe",
    // },
    text: {
      primary: "#000",
      secondary: "#55657d",
    },
    success: {
      main: "#29caab",
      light: "#eafaf7",
    },
    error: {
      main: "#f4324c",
      light: "#fff3f5",
    },
    background: {
      default: "#2a3648",
      paper: "#202836",
    },
    grey: {
      100: "e7e7e7",
      400: "#eef1f8",
    },
  },
});
