import { useState, useEffect } from "react"
import type { FormEvent, ChangeEvent } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./mprofil.module.css"

type FormData = {
    pseudo: string
    firstName: string
    lastName: string
    bio: string
    age: string
    email: string
}

type PasswordData = {
    oldPassword: string
    newPassword: string
}

function MProfil() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState<FormData>({
        pseudo: "",
        firstName: "",
        lastName: "",
        bio: "",
        age: "",
        email: ""
    })
    const [passwordData, setPasswordData] = useState<PasswordData>({
        oldPassword: "",
        newPassword: ""
    })
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userId = localStorage.getItem("userId")
                if (!userId) {
                    setError("Vous devez être connecté.")
                    setTimeout(() => navigate("/connection"), 1200)
                    return
                }

                const response = await fetch(`/api/users/${userId}`)
                const data = await response.json()

                if (!response.ok) {
                    setError(data.message || "Impossible de charger les informations utilisateur.")
                    return
                }

                const userData = Array.isArray(data) ? data[0] : data
                setFormData({
                    pseudo: userData.pseudo || "",
                    firstName: userData.firstName || "",
                    lastName: userData.lastName || "",
                    bio: userData.bio || "",
                    age: userData.age || "",
                    email: userData.email || ""
                })
            } catch (err) {
                console.error(err)
                setError("Erreur serveur lors du chargement du profil.")
            }
        }

        loadUser()
    }, [navigate])

    const handleFormChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setPasswordData(prev => ({ ...prev, [name]: value }))
    }

    const submitProfile = async (event: FormEvent) => {
        event.preventDefault()
        setError("")
        setMessage("")
        setLoading(true)

        try {
            const userId = localStorage.getItem("userId")
            if (!userId) {
                setError("Vous devez être connecté.")
                return
            }

            const response = await fetch(`/api/users/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pseudo: formData.pseudo,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    bio: formData.bio,
                    age: formData.age,
                    email: formData.email
                })
            })

            const data = await response.json()
            if (!response.ok) {
                setError(data.message || "Impossible de mettre à jour le profil.")
                return
            }

            setMessage("Profil enregistré avec succès.")
            setTimeout(() => setMessage(""), 3000)
        } catch (err) {
            console.error(err)
            setError("Erreur serveur lors de la mise à jour du profil.")
        } finally {
            setLoading(false)
        }
    }

    const submitPassword = async (event: FormEvent) => {
        event.preventDefault()
        setError("")
        setMessage("")
        setLoading(true)

        if (!passwordData.oldPassword || !passwordData.newPassword) {
            setError("Remplissez les deux champs de mot de passe.")
            setLoading(false)
            return
        }

        try {
            const loginResponse = await fetch("/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email, password: passwordData.oldPassword })
            })

            if (!loginResponse.ok) {
                setError("Ancien mot de passe incorrect.")
                return
            }

            const userId = localStorage.getItem("userId")
            if (!userId) {
                setError("Vous devez être connecté.")
                return
            }

            const response = await fetch(`/api/users/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: passwordData.newPassword })
            })

            const data = await response.json()
            if (!response.ok) {
                setError(data.message || "Impossible de changer le mot de passe.")
                return
            }

            setMessage("Mot de passe modifié avec succès.")
            setPasswordData({ oldPassword: "", newPassword: "" })
            setTimeout(() => setMessage(""), 3000)
        } catch (err) {
            console.error(err)
            setError("Erreur serveur lors du changement de mot de passe.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.profilPage}>
            <header className={styles.headerMain}>
                <div className={styles.logoContainer}>
                    <img src="./logo.png" alt="logo" />
                    <h2>ProjetHub</h2>
                </div>
                <div>
                    <button className={styles.btnNav} onClick={() => navigate("/")}>Accueil</button>
                </div>
            </header>

            <main className={styles.mainContent}>
                <h1 className={styles.pageTitle}>Modifier mon profil</h1>

                {error && <p style={{ color: "red", textAlign: "center", padding: "10px" }}>{error}</p>}
                {message && <p style={{ color: "green", textAlign: "center", padding: "10px" }}>{message}</p>}

                <div className={styles.profilGrid}>
                    <div className={styles.card}>
                        <div className={styles.avatarSection}>
                            <div className={styles.avatarCircle}>
                                <img src="./logo.png" alt="Aperçu" />
                            </div>
                            <label className={styles.fileLabel}>
                                Choisir une photo
                                <input type="file" className={styles.hiddenInput} />
                            </label>
                        </div>

                        <form onSubmit={submitProfile}>
                            <div className={styles.formGroup}>
                                <label>Pseudo</label>
                                <input
                                    type="text"
                                    name="pseudo"
                                    value={formData.pseudo}
                                    onChange={handleFormChange}
                                    placeholder="Ton pseudo"
                                    className={styles.formInput}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Bio</label>
                                <textarea
                                    name="bio"
                                    rows={4}
                                    value={formData.bio}
                                    onChange={handleFormChange}
                                    placeholder="Parlez de vous..."
                                    className={styles.formTextarea}
                                />
                            </div>

                            <div className={styles.buttonRow}>
                                <button type="submit" className={styles.submitButton} disabled={loading}>
                                    {loading ? "Enregistrement..." : "Enregistrer le profil"}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className={styles.rightColumn}>
                        <div className={styles.card}>
                            <h3>Informations personnelles</h3>
                            <form onSubmit={submitProfile}>
                                <div className={styles.inputGrid}>
                                    <div className={styles.formGroup}>
                                        <label>Prénom</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleFormChange}
                                            placeholder="Ton prénom"
                                            className={styles.formInput}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Nom</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleFormChange}
                                            placeholder="Ton nom"
                                            className={styles.formInput}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Âge</label>
                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleFormChange}
                                            placeholder="Ton âge"
                                            className={styles.formInput}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleFormChange}
                                            placeholder="ton@mail.com"
                                            className={styles.formInput}
                                        />
                                    </div>
                                </div>
                                <div className={styles.buttonRow}>
                                    <button type="submit" className={styles.submitButton} disabled={loading}>
                                        {loading ? "Mise à jour..." : "Mettre à jour"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className={styles.card}>
                            <h3>Sécurité</h3>
                            <form onSubmit={submitPassword}>
                                <div className={styles.formGroup}>
                                    <label>Ancien mot de passe</label>
                                    <input
                                        type="password"
                                        name="oldPassword"
                                        value={passwordData.oldPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="••••••••"
                                        className={styles.formInput}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Nouveau mot de passe</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="••••••••"
                                        className={styles.formInput}
                                    />
                                </div>
                                <div className={styles.buttonRow}>
                                    <button type="submit" className={styles.submitButton} disabled={loading}>
                                        {loading ? "Mise à jour..." : "Changer le mot de passe"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <footer className={styles.footer}>
                <p>© 2026 ProjetHub. Tous droits réservés.</p>
            </footer>
        </div>
    )
}

export default MProfil;