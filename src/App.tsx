import { useToast } from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"
import { Route, Routes, useNavigate, useParams } from "react-router-dom"
import Designer from "../src/designer/id"
import { getFonts } from "./store/fonts/action"
import { useAppDispatch } from "./store/store"
import { getListDrawifiers, signInByToken } from "./store/user/action"
import { generateId } from "./utils/unique"
import Home from "./home/Home"
import SignIn from "./auth/SigIn"
import SmartSearch from './smart-search/SmartSearch';

const redirectHome: string = import.meta.env.VITE_REDIRECT_HOME
const redirectLogout = import.meta.env.VITE_LOGOUT

function App() {
  const [state, setState] = useState(false)

  return (
    <Routes>
     <Route path="/" element={<Home /> } />
     <Route path="/smart-search" element={<SmartSearch /> } />
     <Route path="/auth/sign-in" element={<SignIn /> } />
     {/*  <Route path="/" element={state ? <Designer /> : <Loading setState={setState} state={state} />} /> */}
      <Route path="/composer/" element={state ? <Designer /> : <Loading setState={setState} state={state} />} />
      <Route path="/composer/:id" element={state ? <Designer /> : <Loading setState={setState} state={state} />} />
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
    if (id?.length === 10) {
      initialState()
    } else {
      navigate(`/composer/${generateId("", 10)}`)
    }
  }, [id, token])

  const initialState = useCallback(async () => {
    if (id) {
      if (token) {
        await dispatch(getFonts())
        dispatch(getListDrawifiers({}))
        if (token !== "") {
          const resolve = (await dispatch(signInByToken(token))).payload
          resolve?.created_at ? setState(!state) : (window.location.href = redirectHome)
        }
      } else {
        toast({
          title: "PLEASE LOGIN.",
          status: "warning",
          position: "top",
          duration: 3000,
          isClosable: true
        })
        window.location.href = redirectLogout
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
          src="https://drawify-images.s3.eu-west-3.amazonaws.com/editor/splashLoader.gif"
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
