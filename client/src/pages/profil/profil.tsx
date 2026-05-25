import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./profil.module.css"

function Profil() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("projets")
    const [error, setError] = useState("")
    const [user, setUser] = useState({
        pseudo: "Chargement...",
        firstName: "",
        lastName: "",
        bio: "",
        avatarUrl: "",
        stats: { projets: 0, favoris: 0, badges: 0 }
    })
    const [projects, setProjects] = useState<any[]>([])
    const [favorites, setFavorites] = useState<any[]>([])

    const getProjectRouteId = (project: any) => {
        return project?.id ?? project?.PId ?? project?._id ?? project?.I_id ?? undefined
    }

    const handleProjectClick = (project: any) => {
        const routeId = getProjectRouteId(project)
        if (!routeId) return

        localStorage.setItem("selectedProjectId", String(routeId))
        localStorage.setItem("selectedProjectData", JSON.stringify(project))
        navigate(`/projet/${routeId}`)
    }

    const handleProjectEdit = (project: any, event: any) => {
        event.stopPropagation()
        const routeId = getProjectRouteId(project)
        if (!routeId) return

        localStorage.setItem("selectedProjectId", String(routeId))
        localStorage.setItem("selectedProjectData", JSON.stringify(project))
        navigate(`/creation?edit=true&id=${routeId}`)
    }

    const fetchUserData = async () => {
        try {
            const userId = localStorage.getItem("userId")
            
            if (!userId) {
                setError("Vous devez être connecté pour accéder à cette page")
                setTimeout(() => navigate("/connection"), 2000)
                return
            }

            const response = await fetch(`/api/users/${userId}`)
            const data = await response.json()

            if (!response.ok) {
                setError(data.message || "Erreur lors de la récupération des données")
                return
            }

            const userData = Array.isArray(data) ? data[0] : data

            setUser({
                pseudo: userData.pseudo || "Utilisateur",
                firstName: userData.firstName || "",
                lastName: userData.lastName || "",
                bio: userData.bio || "Aucune bio pour le moment.",
                avatarUrl: userData.Avatar?.[0]?.I_url || userData.Avatar?.[0]?.I_img || "",
                stats: {
                    projets: userData.stats?.projets ?? 0,
                    favoris: userData.stats?.favoris ?? 0,
                    badges: userData.stats?.badges ?? 0
                }
            })
            setProjects(Array.isArray(userData.Auteurs) ? userData.Auteurs : [])
            setFavorites(Array.isArray(userData.Favoris) ? userData.Favoris : [])
            setError("")
        } catch (err) {
            console.error("Erreur de fetch :", err)
            setError("Impossible de joindre le serveur. Vérifiez que l'API est démarrée.")
        }
    }

    useEffect(() => {
        fetchUserData()
    }, [navigate])

    useEffect(() => {
        const handleFocus = () => {
            fetchUserData()
        }

        window.addEventListener('focus', handleFocus)
        return () => window.removeEventListener('focus', handleFocus)
    }, [])

    return (
        <div className={styles.profilPage}>
            <header>
                <div className="logoContainer">
                    <img src="./logo.png" alt="logo" />
                    <h2>ProjetHub</h2>
                </div>
                <div>
                    {/* On utilise window.location pour que le Header de l'accueil se mette à jour */}
                    <button className="btnConnection" onClick={function () { window.location.href = "/" }}>
                        Accueil
                    </button>
                </div>
            </header>

            {error && <p style={{ color: "red", textAlign: "center", padding: "10px" }}>{error}</p>}
            
            <div className={styles.profilColumns}>
                <div className={styles.profilInfo}>
                    <img className={styles.avatarImage} src={user.avatarUrl || "./logo.png"} alt="pdp" />
                    
                    <h1 className={styles.profilPseudo}>{user.pseudo}</h1>
                    <h3 className={styles.profilStatus}>{user.firstName} {user.lastName}</h3>
                    
                    <table className={styles.profilTabInfo}>
                        <thead>
                            <tr>
                                <td>{user.stats.projets}</td>
                                <td>{user.stats.favoris}</td>
                                <td>{user.stats.badges}</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>Projets</td><td>Favoris</td><td>Badges</td></tr>
                        </tbody>
                    </table>
                    <div className={styles.profilBio}>
                        <h3>Bio</h3>
                        <span className={styles.profilDescription}>
                            {user.bio}
                        </span>
                    </div>
                </div>

                <div className={styles.profilFenetre}>
                    <div className={styles.tabsRow}>
                        <button
                            className={`${styles.profilButton} ${styles.tabButton} ${activeTab === "projets" ? styles.active : ""}`}
                            onClick={function () { setActiveTab("projets") }}
                        >Mes projets</button>
                        <button
                            className={`${styles.profilButton} ${styles.tabButton} ${activeTab === "favoris" ? styles.active : ""}`}
                            onClick={function () { setActiveTab("favoris") }}
                        >Mes Favoris</button>
                        <button
                            className={`${styles.profilButton} ${styles.tabButton} ${activeTab === "badges" ? styles.active : ""}`}
                            onClick={function () { setActiveTab("badges") }}
                        >Mes badges</button>
                    </div>

                    {/* Onglet Projets */}
                    <section className={`${styles.tabPanel} ${activeTab === "projets" ? styles.visible : styles.hidden}`}>
                        {projects.length === 0 ? (
                            <p>Vous n'avez aucun projet enregistré pour le moment.</p>
                        ) : (
                            projects.map((project) => (
                                <div
                                    key={project.id}
                                    className={styles.projectCard}
                                    onClick={() => handleProjectClick(project)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className={styles.projectCardTop}>
                                        <img
                                            className={styles.projectImage}
                                            src={project.Image?.[0]?.I_img || "./logo.png"}
                                            alt={project.title || "Projet"}
                                        />
                                        <div className={styles.projectCardInfo}>
                                            <div className={styles.projectCardHeader}>
                                                <h2 className={styles.projectTitle}>{project.title || "Projet sans titre"}</h2>
                                                <button
                                                    type="button"
                                                    className={styles.editProjectButton}
                                                    onClick={(event) => handleProjectEdit(project, event)}
                                                >
                                                    Modifier
                                                </button>
                                            </div>
                                            <p className={styles.projectMeta}>{project.description || "Aucune description disponible."}</p>
                                            <span className={styles.projectMeta}>
                                                {project.difficulty ? `Difficulté : ${project.difficulty}` : "Difficulté non renseignée"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </section>

                    {/* Onglet Favoris */}
                    <section className={`${styles.tabPanel} ${activeTab === "favoris" ? styles.visible : styles.hidden}`}>
                        {favorites.length === 0 ? (
                            <p>Vous n'avez aucun favori enregistré pour le moment.</p>
                        ) : (
                            favorites.map((project) => (
                                <div
                                    key={project.id}
                                    className={styles.projectCard}
                                    onClick={() => handleProjectClick(project)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className={styles.projectCardTop}>
                                        <img
                                            className={styles.projectImage}
                                            src={project.Image?.[0]?.I_img || "./logo.png"}
                                            alt={project.title || "Favori"}
                                        />
                                        <div className={styles.projectCardInfo}>
                                            <div className={styles.projectCardHeader}>
                                                <h2 className={styles.projectTitle}>{project.title || "Projet favori"}</h2>
                                                <button
                                                    type="button"
                                                    className={styles.editProjectButton}
                                                    onClick={(event) => handleProjectEdit(project, event)}
                                                >
                                                    Modifier
                                                </button>
                                            </div>
                                            <p className={styles.projectMeta}>{project.description || "Aucune description disponible."}</p>
                                            <span className={styles.projectMeta}>Favori</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </section>

                    {/* Onglet Badges */}
                    <section className={`${styles.tabPanel} ${activeTab === "badges" ? styles.visible : styles.hidden}`}>
                        <div className={styles.badgeCard}>
                            <h2>Badge Fondateur</h2>
                            <p>Utilisateur de la version Alpha</p>
                        </div>
                    </section>
                </div>
            </div>
            
            <footer className={styles.footer}>
                <p>© 2026 ProjetHub. Tous droits réservés.</p>
            </footer>
        </div>
    )
}

export default Profil