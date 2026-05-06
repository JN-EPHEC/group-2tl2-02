import { useNavigate } from "react-router-dom"
import style from "./faq.module.css"

function Faq() {
    const navigate = useNavigate();
    return (
        <div>
            <h1>Foire Aux Questions</h1>
        </div>
    );
}

export default Faq