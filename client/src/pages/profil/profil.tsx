import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./profil.module.css"

function Profil() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("projets")

    return (
        <div className={styles.profilPage}>
            <header>
                <div className="logoContainer">
                    <img src="./Logo_electronique_dynamique_avec_ampoule.png" alt="logo" />
                    <h2>ProjetHub</h2>
                </div>
                <div>
                    <button className="btnConnection" onClick={function () { navigate("/") }}>Accueil</button>
                </div>
            </header>
            <div className={styles.profilColumns}>
                <div className={styles.profilInfo}>
                    <img className={styles.avatarImage} src="" alt="pdp" />
                    <h1 className={styles.profilPseudo}>LE PSEUUUUUUUUUUUUUUUUUUUUDO</h1>
                    <h3 className={styles.profilStatus}>le tstatus (inventeur passionner)</h3>
                    <table className={styles.profilTabInfo}>
                        <thead>
                            <tr><td>42</td><td>25</td><td>6</td></tr>
                        </thead>
                        <tbody>
                            <tr><td>Projets</td><td>Favorits</td><td>nBadges</td></tr>
                        </tbody>
                    </table>
                    <div className={styles.profilBio}>
                        <h3>Bio</h3>
                        <span className={styles.profilDescription}>
                            en sah joyeux annif rayan
                        </span>
                    </div>
                    <button className={styles.profilButton}>Modifier le profil</button>
                </div>
                <div className={styles.profilFenetre}>
                    <div className={styles.tabsRow}>
                        <button
                            className={`${styles.profilButton} ${styles.tabButton} ${activeTab === "projets" ? styles.active : ""}`}
                            onClick={function () { setActiveTab("projets") }}
                        >Mes projets</button>
                        <button
                            className={`${styles.profilButton} ${styles.tabButton} ${activeTab === "favorits" ? styles.active : ""}`}
                            onClick={function () { setActiveTab("favorits") }}
                        >Mes Favorits</button>
                        <button
                            className={`${styles.profilButton} ${styles.tabButton} ${activeTab === "badges" ? styles.active : ""}`}
                            onClick={function () { setActiveTab("badges") }}
                        >Mes badges</button>
                    </div>
                    <section className={`${styles.tabPanel} ${activeTab === "projets" ? styles.visible : styles.hidden}`}>
                        <div className={styles.projectCard}>
                            <img className={styles.projectImage} src="" alt="img du projet" />
                            <h2 className={styles.projectTitle}>titre du projet</h2>
                            <span className={styles.projectMeta}>modification temps</span>
                            <button className={styles.profilButton}>Modifier</button>
                            <button className={`${styles.profilButton} ${styles.secondary}`}>supprimer</button>
                        </div>
                        <div className={styles.projectCard}>
                            <img className={styles.projectImage} src="" alt="img du projet" />
                            <h2 className={styles.projectTitle}>titre du projet</h2>
                            <span className={styles.projectMeta}>modification temps</span>
                            <button className={styles.profilButton}>Modifier</button>
                            <button className={`${styles.profilButton} ${styles.secondary}`}>supprimer</button>
                        </div>
                        <div className={styles.projectCard}>
                            <img className={styles.projectImage} src="" alt="img du projet" />
                            <h2 className={styles.projectTitle}>titre du projet</h2>
                            <span className={styles.projectMeta}>modification temps</span>
                            <button className={styles.profilButton}>Modifier</button>
                            <button className={`${styles.profilButton} ${styles.secondary}`}>supprimer</button>
                        </div>
                    </section>
                    <section className={`${styles.tabPanel} ${activeTab === "favorits" ? styles.visible : styles.hidden}`}>
                        <div className={styles.projectCard}>
                            <img className={styles.projectImage} src="" alt="img du projet" />
                            <h2 className={styles.projectTitle}>titre du projet</h2>
                            <span className={styles.projectMeta}>modification temps</span>
                            <button className={styles.profilButton}>Modifier</button>
                            <button className={`${styles.profilButton} ${styles.secondary}`}>supprimer</button>
                        </div>
                        <div className={styles.projectCard}>
                            <img className={styles.projectImage} src="" alt="img du projet" />
                            <h2 className={styles.projectTitle}>titre du projet</h2>
                            <span className={styles.projectMeta}>modification temps</span>
                            <button className={styles.profilButton}>Modifier</button>
                            <button className={`${styles.profilButton} ${styles.secondary}`}>supprimer</button>
                        </div>
                        <div className={styles.projectCard}>
                            <img className={styles.projectImage} src="" alt="img du projet" />
                            <h2 className={styles.projectTitle}>titre du projet</h2>
                            <span className={styles.projectMeta}>modification temps</span>
                            <button className={styles.profilButton}>Modifier</button>
                            <button className={`${styles.profilButton} ${styles.secondary}`}>supprimer</button>
                        </div>
                    </section>
                    <section className={`${styles.tabPanel} ${activeTab === "badges" ? styles.visible : styles.hidden}`}>
                        <div className={styles.badgeCard}>
                            <h2>Badge 1</h2>
                            <p>Description du badge</p>
                        </div>
                        <div className={styles.badgeCard}>
                            <h2>Badge 2</h2>
                            <p>Description du badge</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default Profil
