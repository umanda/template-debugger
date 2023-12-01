import { extendTheme, theme as base, withDefaultColorScheme, withDefaultSize } from "@chakra-ui/react"

export default extendTheme(
  {
    colors: {
      black: "#545465",
      white: "#fff",
      brand: {
        "50": "#f0f0ff",
        "100": "#EBEDFB",
        "200": "#9B9CFE",
        "300": "#8A8CFD",
        "400": "#7A7BFD",
        "500": "#5456F5",
        "600": "#4648fd",
        "700": "#2225fc",
        "800": "#0307f7",
        "900": "#0306d4"
      },
      primary: {
        "50": "#fdf5f5",
        "100": "#f9d9d7",
        "200": "#f3b7b4",
        "300": "#ec8b86",
        "400": "#e86f69",
        "500": "#e1443c",
        "600": "#bf3932",
        "700": "#9a2e28",
        "800": "#822722",
        "900": "#5f1c19"
      },
      secondary: {
        "50": "#fef6f1",
        "100": "#fbd9c7",
        "200": "#f8b795",
        "300": "#f48a52",
        "400": "#da7b49",
        "500": "#b8683e",
        "600": "#9b5834",
        "700": "#7d472a",
        "800": "#693c23",
        "900": "#4c2b1a"
      }
    },
    fonts: {
      body: `Outfit, ${base.fonts.body}`
    },
    components: {
      Button: {
        baseStyle: {
          fontWeight: "normal",
          colorScheme: "brand"
        }
      }
    }
  },
  withDefaultColorScheme({
    colorScheme: "brand",
    components: ["Tabs", "Slider", "Input"]
  }),
  withDefaultSize({
    size: "sm",
    components: ["Button", "Tabs", "Input", "Avatar"]
  })
)
