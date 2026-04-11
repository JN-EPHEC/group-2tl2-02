import { useNavigate } from "react-router-dom"
import "./profil.css"

function Profil() {
    const navigate = useNavigate()
    return (
        <div>
            <h1>Votre profil</h1>
            <button onClick={function () {navigate("/")}}>retours</button>
        </div>
    )
}

export default Profil