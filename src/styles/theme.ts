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
