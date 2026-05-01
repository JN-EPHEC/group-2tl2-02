import { useNavigate } from "react-router-dom"
import style from "./inscription.module.css"

function Inscrip() {
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
                    <h3>Rejoindre la communauté</h3>
                    <form>
                        <div className={style.inputGroup}>
                            <label>Nom d'utilisateur</label>
                            <input type="text" placeholder="Ex : RobotMaster99"/>
                        </div>
                        <div className={style.inputGroup}>
                            <label>Email</label>
                            <input type="email" placeholder="Ex : robotmaster99@example.com"/>
                        </div>
                        <div className={style.inputGroup}>
                            <label>Mot de passe</label>
                            <input type="password" placeholder="••••••••"/>
                        </div>
                        <div className={style.inputGroup}>
                            <label>Confirmer le mot de passe</label>
                            <input type="password" placeholder="••••••••"/>
                        </div>
                        <button className={style.btnFull} type="submit">Créer mon compte</button>
                    </form>
                    <p className={style.mainSwitch}>Vous avez déjà un compte ? </p>
                    <button className={style.btnConnection} onClick={function () {navigate("/connection")}}>Se connecter</button>
                </div>
            </main>
        </div>
    )
}

export default Inscrip