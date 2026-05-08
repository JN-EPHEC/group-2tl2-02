import { useNavigate } from "react-router-dom"
import styles from "./mprofil.module.css"

function MProfil() {
    const navigate = useNavigate()

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

                <div className={styles.profilGrid}>
                    {/* Colonne Gauche : Photo et Bio */}
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

                        <div className={styles.formGroup}>
                            <label>Pseudo</label>
                            <input type="text" placeholder="Ancien pseudo" className={styles.formInput} />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Bio</label>
                            <textarea rows={4} placeholder="Parlez de vous..." className={styles.formTextarea}></textarea>
                        </div>
                        
                        <div className={styles.buttonRow}>
                            <button className={styles.submitButton}>Enregistrer la bio</button>
                        </div>
                    </div>

                    {/* Colonne Droite : Infos et Sécurité */}
                    <div className={styles.rightColumn}>
                        {/* Infos Générales */}
                        <div className={styles.card}>
                            <h3>Informations personnelles</h3>
                            <div className={styles.inputGrid}>
                                <div className={styles.formGroup}>
                                    <label>Prénom</label>
                                    <input type="text" placeholder="Ton prénom" className={styles.formInput} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Nom</label>
                                    <input type="text" placeholder="Ton nom" className={styles.formInput} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Âge</label>
                                    <input type="number" placeholder="Ton âge" className={styles.formInput} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Email</label>
                                    <input type="email" placeholder="ton@mail.com" className={styles.formInput} />
                                </div>
                            </div>
                            <div className={styles.buttonRow}>
                                <button className={styles.submitButton}>Mettre à jour</button>
                            </div>
                        </div>

                        {/* Sécurité */}
                        <div className={styles.card}>
                            <h3>Sécurité</h3>
                            <div className={styles.formGroup}>
                                <label>Ancien mot de passe</label>
                                <input type="password" placeholder="••••••••" className={styles.formInput} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Nouveau mot de passe</label>
                                <input type="password" placeholder="••••••••" className={styles.formInput} />
                            </div>
                            <div className={styles.buttonRow}>
                                <button className={styles.submitButton}>Changer le mot de passe</button>
                            </div>
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