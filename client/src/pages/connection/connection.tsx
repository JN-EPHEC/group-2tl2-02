import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import style from "./connection.module.css"

function Connec() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setMessage("")
        setError("")
        setIsSubmitting(true)

        try {
            const response = await fetch("/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.message || "Une erreur est survenue lors de la connexion.")
                return
            }

            // Stocker l'ID de l'utilisateur en localStorage
            localStorage.setItem("userId", data.user.id)
            localStorage.setItem("userEmail", data.user.email)
            
            setMessage(data.message || "Connexion réussie !")
            setTimeout(() => navigate("/profil"), 1200)
        } catch (fetchError) {
            console.error(fetchError)
            setError("Impossible de joindre le serveur. Vérifiez que l'API est démarrée.")
        } finally {
            setIsSubmitting(false)
        }
    }

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
                    {message && <p style={{ color: "green" }}>{message}</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className={style.inputGroup}>
                            <label htmlFor="email">Email : </label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Entrez votre email" 
                                required 
                            />
                        </div>
                        <div className={style.inputGroup}>
                            <label htmlFor="password">Mot de passe : </label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••" 
                                required 
                            />
                        </div>
                        <button className={style.btnFull} type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Connexion..." : "Se connecter"}
                        </button>
                    </form>
                    <p className={style.mainSwitch}>Vous n'avez pas de compte ? </p>
                    <button className={style.btnConnection} onClick={function () {navigate("/inscription")}}>Créer un compte</button>
                </div>
            </main>
        </div>
    )
}

export default Connec