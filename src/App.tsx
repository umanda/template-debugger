import { useCallback, useEffect, useState } from "react"
import { Route, Routes, useNavigate, useParams } from "react-router-dom"
import Designer from "../src/designer/id"
import { useAppDispatch } from "./components/store/store"
import { signInByToken } from "./components/store/user/action"
import { generateId } from "./components/utils/unique"
function App() {
  const [state, setState] = useState(false)

  return (
    <Routes>
      <Route path="/" element={state ? <Designer /> : <Loading setState={setState} state={state} />} />
      <Route path="/composer/" element={state ? <Designer /> : <Loading setState={setState} state={state} />} />
      <Route path="/composer/:id" element={state ? <Designer /> : <Loading setState={setState} state={state} />} />
    </Routes>
  )
}

function Loading({ setState, state }: { setState?: React.Dispatch<React.SetStateAction<boolean>>; state: boolean }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const dispath = useAppDispatch()

  useEffect(() => {
    initialState()
  }, [id, token])

  const initialState = useCallback(async () => {
    if (id) {
      if (token) {
        token !== "" && (await dispath(signInByToken(token)))
        setState(!state)
      } else {
        // window.location.href = "https://beta.drawify.com/home"
      }
    }
    id === undefined && navigate(`/composer/${generateId("proj")}`)
  }, [id, token])

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
