import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    main: {
      accent1: "#598445",
      accent2: "#27739E",
      background1: "#E9E6E0",
      text: "#1F1F1F",
    },
    additional: {
      background2: "#F5F5F5",
      grey2: "#AAAAAA",
      grey1: "#737373",
      greydark: "#565656",
      support1: "#416782",
      support2: "#408D79",
      support3: "#C48B0F",
      support4: "#91643B",
      support5: "#624469",
      error: "#416782",
    },
  },
  typography: {
    fontFamily: "IBM Plex Sans",
    color: "#1F1F1F",
    header: {
      color: "#1F1F1F",
      fontFamily: "IBM Plex Sans",
      fontSize: "2.5rem",
      fontStyle: "normal",
      fontWeight: 600,
      lineHeight: "normal",
    },
    subtitle: {
      color: "#1F1F1F",
      fontFamily: "IBM Plex Sans",
      fontSize: "1.25rem",
      fontStyle: "italic",
      fontWeight: 500,
      lineHeight: "normal",
    },
  },
});

export default theme;
