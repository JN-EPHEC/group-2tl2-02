import { useNavigate } from "react-router-dom"
//import "./index.css"

function Acceuil() {
    const navigate = useNavigate()
    return (
        <div>
            <h1>page d'acceuil</h1>
            <button onClick={function () {navigate("/connection")}}>connection</button>
            <button onClick={function () {navigate("/profil")}}>profil</button>
            <button onClick={function () {navigate("/creation")}}>Nouveau projet</button>
            <button onClick={function () {navigate("/projet")}}>projet</button>
        </div>
    )
}

export default Acceuil