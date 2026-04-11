import { useNavigate } from "react-router-dom"
import "./creation.css"

function Crea() {
    const navigate = useNavigate()
    return (
        <div>
            <h1>Création de projets</h1>
            <button onClick={function () {navigate("/")}}>retours</button>
        </div>
    )
}

export default Crea