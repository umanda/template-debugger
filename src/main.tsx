import { ChakraProvider } from "@chakra-ui/react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import App from "./App"
import { DesignEditorProvider } from "./components/contexts/DesignEditor"
import { ResourcesContextProvider } from "./components/contexts/ResourcesContext"
import { store } from "./components/store/store"
import theme from "./styles/theme"
import { Provider as LayerhubProvider } from "@layerhub-pro/react"
import { BrowserRouter } from "react-router-dom"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ChakraProvider theme={theme}>
    <DesignEditorProvider>
      <BrowserRouter>
        <ResourcesContextProvider>
          <Provider store={store}>
            {/* <PersistGate persistor={persistor}> */}
            <LayerhubProvider>
              <App />
            </LayerhubProvider>
            {/* </PersistGate> */}
          </Provider>
        </ResourcesContextProvider>
      </BrowserRouter>
    </DesignEditorProvider>
  </ChakraProvider>
)
