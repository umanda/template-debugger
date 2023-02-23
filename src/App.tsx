import { useToast } from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"
import { Route, Routes, useNavigate, useParams } from "react-router-dom"
import Designer from "../src/designer/id"
import { getFonts } from "./components/store/fonts/action"
import { useAppDispatch } from "./components/store/store"
import { getListDrawifiers, signInByToken } from "./components/store/user/action"
import { generateId } from "./components/utils/unique"
import SplashLoader from "./images/SplashLoader.gif"

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
      if (token) {
        await dispatch(getFonts())
        dispatch(getListDrawifiers({}))
        if (token !== "") {
          const resolve = (await dispatch(signInByToken(token))).payload
          resolve?.plan ? setState(!state) : (window.location.href = redirectHome)
        }
      } else {
        toast({
          title: "PLEASE LOGIN.",
          status: "warning",
          position: "top",
          duration: 3000,
          isClosable: true
        })
        window.location.href = redirectHome
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
        <img
          src={SplashLoader}
          style={{
            height: "75px",
            width: "75px"
          }}
        ></img>
        <p>{"LOADING"}</p>
      </div>
    </div>
  )
}

export default App
