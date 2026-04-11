import { useNavigate } from "react-router-dom"
import "./connection.css"

function Connec() {
    const navigate = useNavigate()
    return (
        <div>
            <h1>page de connection</h1>
            <button onClick={function () {navigate("/inscription")}}>inscription</button>
            <button onClick={function () {navigate("/")}}>retours</button>
        </div>
    )
}

export default Connec