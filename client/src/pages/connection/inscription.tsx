import { useNavigate } from "react-router-dom"
import "./inscription.css"

function Inscrip() {
    const navigate = useNavigate()
    return (
        <div>
            <h1>page d'inscription</h1>
            <button onClick={function () {navigate("/connection")}}>connection</button>
            <button onClick={function () {navigate("/")}}>retours</button>
        </div>
    )
}

export default Inscrip