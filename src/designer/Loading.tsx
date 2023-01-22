import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAppDispatch } from "../components/store/store"
import { signInByToken } from "../components/store/user/action"
import { generateId } from "../components/utils/unique"

function Loading({ text }: { text?: string }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const dispath = useAppDispatch()

  useEffect(() => {
    if (id) {
      if (token) {
        console.log("sign in with token by drawify 2.0")
        token !== "" && dispath(signInByToken(token))
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
        flexDirection: "column"
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
      {text && text}
    </div>
  )
}

export default Loading
