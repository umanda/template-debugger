import { useSelector } from "react-redux"
import { Route, Routes } from "react-router-dom"
import Designer from "../src/designer/id"
import { selectUser } from "./components/store/user/selector"
import Loading from "./designer/Loading"

function App() {
  const user = useSelector(selectUser)

  return (
    <Routes>
      <Route path="/" element={user ? <Designer /> : <Loading />} />
      <Route path="/composer/" element={user ? <Designer /> : <Loading />} />
      <Route path="/composer/:id" element={user ? <Designer /> : <Loading />} />
    </Routes>
  )
}

export default App
