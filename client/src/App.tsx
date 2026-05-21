import { BrowserRouter, Routes, Route } from "react-router-dom"
import Acceuil from "./pages/home/home"
import Connec from "./pages/connection/connection"
import Inscrip from "./pages/connection/inscription"
import Profil from "./pages/profil/profil"
import MProfil from "./pages/profil/mprofil"
import Crea from "./pages/projets/creation"
import Projet from "./pages/projets/projet"
import ConContact from "./pages/info/contact"
import APropos from "./pages/info/a_propos"
import Faq from "./pages/info/faq"
import Panier from "./pages/panier/panier"
import Developpement from "./pages/developpement/developpement"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Acceuil />} />
        <Route path="/connection" element={<Connec />} />
        <Route path="/inscription" element={<Inscrip />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/mprofil" element={<MProfil />} />
        <Route path="/creation" element={<Crea />} />
        <Route path="/projet/:id" element={<Projet />} />
        <Route path="/contact" element={<ConContact />} />
        <Route path="/a_propos" element={<APropos />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/panier" element={<Panier />} />
        <Route path="/developpement" element={<Developpement />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App