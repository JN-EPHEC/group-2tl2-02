import { useNavigate } from "react-router-dom"
import style from "./connection.module.css"

function Connec() {
    const navigate = useNavigate()
    return (
        <div className={style.authPage}>
            <header>
                <div className={style.logoContainer}>
                    <img src="./logo.png" alt="logo" />
                    <h2>ProjetHub</h2>
                </div>

                <div>
                    <button className={style.btnConnection} onClick={function () {navigate("/")}}>Accueil</button>
                </div>
            </header>

            <main className={style.mainConnection}>
                <div className={style.mainCard}>
                    <h3>Bon retour !</h3>
                    <form>
                        <div className={style.inputGroup}>
                            <label htmlFor="email">Email : </label>
                            <input type="email" id="email" name="email" placeholder="Entrez votre email" required />
                        </div>
                        <div className={style.inputGroup}>
                            <label htmlFor="password">Mot de passe : </label>
                            <input type="password" id="password" name="password" placeholder="••••••••" required />
                        </div>
                        <button className={style.btnFull} type="submit">Se connecter</button>
                    </form>
                    <p className={style.mainSwitch}>Vous n'avez pas de compte ? </p>
                    <button className={style.btnConnection} onClick={function () {navigate("/inscription")}}>Créer un compte</button>
                </div>
            </main>
        </div>
    )
}

export default Connec