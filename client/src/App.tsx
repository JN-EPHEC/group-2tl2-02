import { BrowserRouter, Routes, Route } from "react-router-dom"
import Acceuil from "./pages/home/"
import Connec from "./pages/connection/connection"
import Inscrip from "./pages/connection/inscription"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Acceuil />} />
        <Route path="/connection" element={<Connec />} />
        <Route path="/inscription" element={<Inscrip />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App