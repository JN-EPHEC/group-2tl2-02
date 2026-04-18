import { useNavigate } from "react-router-dom"
import style from "./connection.module.css"

function Connec() {
    const navigate = useNavigate()
    return (
        <div>
            <header>
                <div className="{style.logoContainer}">
                    <img src="./Logo_electronique_dynamique_avec_ampoule.png" alt="logo" />
                    <h2>ProjetHub</h2>
                </div>

                <div>
                    <button className={style.btnConnection} onClick={function () {navigate("/")}}>Accueil</button>
                </div>
            </header>

            <main className={style.mainConnection}>
                <div>
                    <h3>Bon retour !</h3>
                    <form action="">
                        <div>
                            <label htmlFor="email">Email : </label>
                            <input type="email" id="email" name="email" placeholder="Entrez votre email" required />
                        </div>
                        <div>
                            <label htmlFor="password">Mot de passe : </label>
                            <input type="password" id="password" name="password" placeholder="••••••••" required />
                        </div>
                        <button className={style.btnConnection} type="submit">Se connecter</button>
                    </form>
                    <p>Vous n'avez pas de compte ? <button className={style.btnConnection} onClick={function () {navigate("/inscription")}}>Créer un compte</button></p>
                </div>
            </main>
        </div>
    )
}

export default Connec