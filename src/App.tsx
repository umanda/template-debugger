import { useToast } from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"
import { Route, Routes, useNavigate, useParams } from "react-router-dom"
import Designer from "../src/designer/id"
import { getFonts } from "./components/store/fonts/action"
import { useAppDispatch } from "./components/store/store"
import { getListDrawifiers, signInByToken } from "./components/store/user/action"
import { generateId } from "./components/utils/unique"
const redirectHome: string = import.meta.env.VITE_REDIRECT_HOME

function App() {
  const [state, setState] = useState(false)

  return (
    <Routes>
      <Route path="/" element={state ? <Designer /> : <Loading setState={setState} state={state} />} />
      <Route path="/composer/" element={state ? <Designer /> : <Loading setState={setState} state={state} />} />
      <Route path="/composer/:id" element={state ? <Designer /> : <Loading setState={setState} state={state} />} />
      {/* <Route path="/composer/test/test" element={<Test />} /> */}
    </Routes>
  )
}

function Loading({ setState, state }: { setState?: React.Dispatch<React.SetStateAction<boolean>>; state: boolean }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const dispatch = useAppDispatch()
  const toast = useToast()

  useEffect(() => {
    initialState()
  }, [id, token])

  const initialState = useCallback(async () => {
    if (id) {
      setState(!state)
      if (token) {
        await dispatch(getFonts())
        dispatch(getListDrawifiers({}))
        if (token !== "") {
          const resolve = (await dispatch(signInByToken(token))).payload

          // resolve?.plan ? setState(!state) : (window.location.href = redirectHome)
        }
      } else {
        toast({
          title: "PLEASE LOGIN.",
          status: "warning",
          position: "top",
          duration: 3000,
          isClosable: true
        })
        // window.location.href = redirectHome
      }
    }
    id === undefined && navigate(`/composer/${generateId("", 10)}`)
  }, [id, token, state, setState])

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        height: "100vh",
        width: "100vw"
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" viewBox="0 0 100 100">
        <circle cx="30" cy="50" fill="#000">
          <animate attributeName="r" values="0;5;0" dur="1.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="50" cy="50" fill="#000">
          <animate attributeName="r" values="0;5;0" dur="1.2s" begin="0.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="70" cy="50" fill="#000">
          <animate attributeName="r" values="0;5;0" dur="1.2s" begin="0.8s" repeatCount="indefinite" />
        </circle>
      </svg>
      {"LOADING"}
    </div>
  )
}

export default App
