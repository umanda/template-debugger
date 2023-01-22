import { Route, Routes } from "react-router-dom"
import Designer from "../src/designer/id"

function App() {
  console.log("router")
  return (
    <Routes>
      <Route path="/" element={<Designer />} />
      <Route path="/composer/" element={<Designer />} />
      <Route path="/composer/:id" element={<Designer />} />
    </Routes>
  )
}

export default App
