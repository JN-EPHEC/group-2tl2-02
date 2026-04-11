import { BrowserRouter, Routes, Route } from "react-router-dom"
import Acceuil from "./pages/home/home"
import Connec from "./pages/connection/connection"
import Inscrip from "./pages/connection/inscription"
import Profil from "./pages/profil/profil"
import Crea from "./pages/projets/creation"
import Projet from "./pages/projets/projet"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Acceuil />} />
        <Route path="/connection" element={<Connec />} />
        <Route path="/inscription" element={<Inscrip />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/creation" element={<Crea />} />
        <Route path="/projet" element={<Projet />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App