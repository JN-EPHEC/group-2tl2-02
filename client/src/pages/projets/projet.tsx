import { useNavigate } from "react-router-dom"
import "./projet.css"

function Projet() {
    const navigate = useNavigate()
    return (
        <div>
            <h1>Page des projets</h1>
            <button onClick={function () {navigate("/")}}>retours</button>
        </div>
    )
}

export default Projet