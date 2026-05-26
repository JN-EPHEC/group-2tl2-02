import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import styles from "./projet.module.css"


function Projet() {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const [project, setProject] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true)
                setError(null)

                let projectId: string | undefined = id
                if (!projectId) {
                    const stored = localStorage.getItem("selectedProjectId")
                    projectId = stored || undefined
                }

                if (!projectId) {
                    setError("Aucun ID de projet trouvé")
                    setLoading(false)
                    return
                }

                const response = await fetch(`/api/users/project/${projectId}`)
                if (!response.ok) {
                    throw new Error(`Erreur ${response.status}: Impossible de récupérer le projet`)
                }

                const data = await response.json()
                setProject(data)
                localStorage.setItem("selectedProjectData", JSON.stringify(data))
            } catch (err) {
                console.error("Erreur lors de la récupération du projet:", err)
                setError(err instanceof Error ? err.message : "Une erreur est survenue")
            } finally {
                setLoading(false)
            }
        }

        fetchProject()
    }, [id])

    const scrollToEtape = (etapeNumber: number) => {
        const element = document.getElementById(`etape-${etapeNumber}`)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <div className={styles.projetPage}>
            <header>
                <div className={styles.logoContainer}>
                    <img src="/logo.png" alt="logo" />
                    <h2>ProjetHub</h2>
                </div>
                <div>
                    <button className={styles.btnConnection} onClick={function () { navigate("/") }}>Accueil</button>
                </div>
            </header>

            {loading && <div style={{ padding: '20px', textAlign: 'center' }}>Chargement du projet...</div>}
            {error && <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>{error}</div>}

            {!loading && !error && project && (
            <div className={styles.projetColumns}>
                <div className={styles.projetInfo}>
                    <p><button className="btnConnection">⭐​</button></p>
                    <img
                        className={styles.avatarImage}
                        src={project?.Image?.[0]?.I_img || "./logo.png"}
                        alt={project?.title || "image du projet"}
                    />
                    <h1 className={styles.projetPseudo}>{project?.title || "Titre du projet"}</h1>
                    <div className={styles.projetBio}>
                        <h3>Description</h3>
                        <span className={styles.projetDescription}>
                            {project?.description || "description du projet"}
                        </span>
                        {project?.Tâche && project.Tâche.length > 0 && (
                            <div id="projetTableMatier">
                                <h3>Table des matières</h3>
                                <ol>
                                    {project.Tâche.map((tache: any, index: number) => (
                                        <li
                                            key={tache.TId || index}
                                            onClick={() => scrollToEtape(index + 1)}
                                        >
                                            Étape {index + 1} - {tache.title}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}

                        
                    </div>
                </div>
                <div className={styles.projetFenetre}>
                    <h1>{project?.title || "Titre du projet"}</h1>
                    <h3>Description</h3>
                    <p>{project?.description || "description du projet"}</p>
                    
                    {project?.video && project.video.length > 0 ? (
                        <div className={styles.videoSection}>
                            <h3>📹 Vidéo du projet</h3>
                            {project.video[0]?.mp4 && (
                                <video 
                                    className={styles.videoPlayer}
                                    src={project.video[0].mp4} 
                                    controls 
                                    width="100%"
                                >
                                    Votre navigateur ne supporte pas la balise vidéo.
                                </video>
                            )}
                            {project.video[0]?.lien && !project.video[0]?.mp4 && (
                                <div className={styles.videoLink}>
                                    <p>Lien vidéo externe :</p>
                                    <a 
                                        href={project.video[0].lien} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={styles.externalVideoLink}
                                    >
                                        🔗 Ouvrir la vidéo
                                    </a>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={styles.noVideo}>
                            <p>Aucune vidéo disponible pour ce projet</p>
                        </div>
                    )}
                    <hr />
                    
                    {project?.Tâche && project.Tâche.length > 0 ? (
                        project.Tâche.map((tache: any, index: number) => (
                            <section key={tache.TId || index} id={`etape-${index + 1}`}>
                                <h2>{tache.title}</h2>
                                {tache.I_img && tache.I_img.trim() !== '' && (
                                    <img src={tache.I_img} alt={`img${tache.title}`} />
                                )}
                                <div>
                                    <p>{tache.instruction}</p>
                                </div>
                                {index < project.Tâche.length - 1 && <hr />}
                            </section>
                        ))
                    ) : (
                        <section id="etape-1">
                            <h2>Titre de l'étape 1</h2>
                            <div>
                                <p>Aucune étape disponible</p>
                            </div>
                        </section>
                    )}
                </div>

                <div className={styles.projetComposants}>
                    <section className={styles.compoNess}>
                        <h3>Composants nécessaires :</h3>
                        <div className={styles.composantsList}>
                            {project?.composant && project.composant.length > 0 ? (
                                project.composant
                                    .filter((c: any) => !c.possédé)
                                    .map((composant: any) => (
                                        <div 
                                            key={composant.CId || composant.id} 
                                            className={styles.composantItem}
                                        >
                                            <span className={styles.composantIcon}></span>
                                            <span>{composant.nom}</span>
                                        </div>
                                    ))
                            ) : (
                                <p className={styles.emptyMessage}>Aucun composant nécessaire</p>
                            )}
                        </div>
                    </section>
                </div>
            </div>
            )}
        </div>
    )
}

export default Projet