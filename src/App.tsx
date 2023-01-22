import { Route, Routes } from "react-router-dom"
import Designer from "../src/designer/id"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Designer />} />
      <Route path="/composer/" element={<Designer />} />
      <Route path="/composer/:id" element={<Designer />} />
    </Routes>
  )
}

export default App
