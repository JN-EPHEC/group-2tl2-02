import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import style from "./inscription.module.css"

function Inscrip() {
    const navigate = useNavigate()
    const [pseudo, setPseudo] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setMessage("")
        setError("")

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.")
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch("/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pseudo,
                    firstName,
                    lastName,
                    email,
                    password,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.message || "Une erreur est survenue lors de l'inscription.")
                return
            }

            const userId = data?.user?.id ?? data?.user?.Uid ?? data?.user?.uid
            if (!userId) {
                setError("Impossible de récupérer l'identifiant utilisateur depuis le serveur.")
                return
            }

            localStorage.setItem("userId", String(userId))
            localStorage.setItem("userEmail", data?.user?.email || "")

            setMessage(data.message || "Inscription réussie !")
            setTimeout(() => navigate("/"), 1200)
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
                    <button className={style.btnConnection} onClick={() => navigate("/")}>Accueil</button>
                </div>
            </header>

            <main className={style.mainConnection}>
                <div className={style.mainCard}>
                    <h3>Rejoindre la communauté</h3>
                    <form onSubmit={handleSubmit}>
                        <div className={style.inputGroup}>
                            <label>Nom d'utilisateur</label>
                            <input
                                type="text"
                                name="pseudo"
                                value={pseudo}
                                onChange={(e) => setPseudo(e.target.value)}
                                placeholder="Ex : RobotMaster99"
                                required
                            />
                        </div>
                        <div className={style.inputGroup}>
                            <label>Nom</label>
                            <input
                                type="text"
                                name="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Ex : Afficheur"
                                required
                            />
                        </div>
                        <div className={style.inputGroup}>
                            <label>Prénom</label>
                            <input
                                type="text"
                                name="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Ex : Ben"
                                required
                            />
                        </div>
                        <div className={style.inputGroup}>
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Ex : robotmaster99@example.com"
                                required
                            />
                        </div>
                        <div className={style.inputGroup}>
                            <label>Mot de passe</label>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <div className={style.inputGroup}>
                            <label>Confirmer le mot de passe</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        {error && <p className={style.errorMessage}>{error}</p>}
                        {message && <p className={style.successMessage}>{message}</p>}
                        <button className={style.btnFull} type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Enregistrement..." : "Créer mon compte"}
                        </button>
                    </form>
                    <p className={style.mainSwitch}>Vous avez déjà un compte ? </p>
                    <button className={style.btnConnection} onClick={() => navigate("/connection")}>Se connecter</button>
                </div>
            </main>
        </div>
    )
}

export default Inscrip