import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./creation.module.css"

type Etape = {
    id: number
    titre: string
    image: string
    description: string
}

type Composant = {
    id: number
    nom: string
    nombre: number
}

function Crea() {
    const navigate = useNavigate()
    const [projectTitle, setProjectTitle] = useState("")
    const [projectDescription, setProjectDescription] = useState("")
    const [projectImage, setProjectImage] = useState("")
    const [estimatedDuration, setEstimatedDuration] = useState("")
    const [needs3D, setNeeds3D] = useState(false)
    const [needsSoldering, setNeedsSoldering] = useState(false)
    const [videoFile, setVideoFile] = useState("")
    const [videoLink, setVideoLink] = useState("")
    const [previewTitle, setPreviewTitle] = useState("Titre du projet")
    const [previewDescription, setPreviewDescription] = useState("Description du projet")
    const [composants, setComposants] = useState<Composant[]>([])
    const [nextComposantId, setNextComposantId] = useState(1)
    const [isPrivate, setIsPrivate] = useState(false)
    const [etapes, setEtapes] = useState<Etape[]>([
        { id: 1, titre: "", image: "", description: "" }
    ])
    const [nextId, setNextId] = useState(3)

    // Calcul automatique de la difficulté
    const calculateDifficulty = () => {
        let difficulty = 1; // Niveau de base: Très facile
        
        // +1 si durée > 5h
        if (estimatedDuration && parseInt(estimatedDuration) > 5) {
            difficulty += 1
        }
        
        // +2 si imprimante 3D
        if (needs3D) {
            difficulty += 2
        }
        
        // +2 si soudure
        if (needsSoldering) {
            difficulty += 2
        }
        
        // Limiter au maximum de 6
        return Math.min(difficulty, 6)
    }

    const getDifficultyLabel = (level: number) => {
        const labels: Record<number, string> = {
            1: "Très facile",
            2: "Facile",
            3: "Moyen",
            4: "Difficile",
            5: "Très difficile",
            6: "Expert"
        }
        return labels[level] || "Indéfini"
    }

    const currentDifficulty = calculateDifficulty()

    // Mise à jour automatique du preview
    useEffect(() => {
        setPreviewTitle(projectTitle || "Titre du projet")
        setPreviewDescription(projectDescription || "Description du projet")
    }, [projectTitle, projectDescription])

    const ajouterEtape = () => {
        const nouvelleEtape = { id: nextId, titre: "", image: "", description: "" }
        setEtapes([...etapes, nouvelleEtape])
        setNextId(nextId + 1)
    }

    const supprimerEtape = (id: number) => {
        if (etapes.length > 1) {
            setEtapes(etapes.filter(etape => etape.id !== id))
        } else {
            alert("Vous devez avoir au moins une étape !")
        }
    }

    const mettreAJourEtape = (id: number, champ: keyof Etape, valeur: string) => {
        setEtapes(etapes.map(etape =>
            etape.id === id ? { ...etape, [champ]: valeur } : etape
        ))
    }

    const ajouterComposant = () => {
        const nouveauComposant: Composant = { id: nextComposantId, nom: "", nombre: 1 }
        setComposants([...composants, nouveauComposant])
        setNextComposantId(nextComposantId + 1)
    }

    const supprimerComposant = (id: number) => {
        setComposants(composants.filter(comp => comp.id !== id))
    }

    const mettreAJourComposant = (id: number, champ: keyof Composant, valeur: string | number) => {
        setComposants(composants.map(comp =>
            comp.id === id ? { ...comp, [champ]: valeur } : comp
        ))
    }

    const saveProject = () => {
        const projectData = {
            title: projectTitle,
            description: projectDescription,
            image: projectImage,
            duration: estimatedDuration,
            difficulty: currentDifficulty,
            difficultyLabel: getDifficultyLabel(currentDifficulty),
            needs3D,
            needsSoldering,
            visibility: isPrivate ? "private" : "public",
            video: {
                file: videoFile,
                link: videoLink,
            },
            steps: etapes,
            composants,
            savedAt: new Date().toISOString(),
        }

        localStorage.setItem("savedProject", JSON.stringify(projectData))
        alert("Projet enregistré localement.")
    }

    const clearForm = () => {
        setProjectTitle("")
        setProjectDescription("")
        setProjectImage("")
        setEstimatedDuration("")
        setNeeds3D(false)
        setNeedsSoldering(false)
        setVideoFile("")
        setVideoLink("")
        setIsPrivate(false)
        setComposants([])
        setEtapes([{ id: 1, titre: "", image: "", description: "" }])
        setNextComposantId(1)
        setNextId(3)
    }

    return (
        <div className={styles.creationPage}>
            <header className={styles.pageHeader}>
                <div className={styles.logoContainer}>
                    <img src="./logo.png" alt="logo" />
                    <h2>ProjetHub</h2>
                </div>

                <div>
                    <button className={styles.btnConnection} onClick={function () {navigate("/")}}>Accueil</button>
                </div>
            </header>
            <div className={styles.contentContainer}>
                <form className={styles.projectForm}>
                    <div className={styles.formGroup}>
                        <img className={styles.projectImage} src={projectImage} alt="photo du projet" />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel} htmlFor="img">Importer une image pour le projet :</label>
                        <input 
                            className={styles.formInput} 
                            type="file" 
                            name="img" 
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                    const reader = new FileReader()
                                    reader.onload = (event) => {
                                        if (event.target?.result) {
                                            setProjectImage(event.target.result as string)
                                        }
                                    }
                                    reader.readAsDataURL(file)
                                }
                            }}
                        />

                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel} htmlFor="titre">Titre :</label>
                        <input 
                            className={styles.formInput} 
                            type="text" 
                            name="titre" 
                            placeholder="Titre du projet"
                            value={projectTitle}
                            onChange={(e) => setProjectTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.descriptionSection}>
                        <h3>Description du projet</h3>
                        <textarea 
                            className={styles.formTextarea}
                            name="description" 
                            rows={6} 
                            cols={5} 
                            placeholder="Entrez la description détaillée de votre projet..."
                            value={projectDescription}
                            onChange={(e) => setProjectDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <div className={styles.difficultySection}>
                        <h4>Paramètres de difficulté :</h4>
                        <div className={styles.difficultyOption}>
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={needs3D}
                                    onChange={(e) => setNeeds3D(e.target.checked)}
                                />
                                Imprimante 3D
                            </label>
                        </div>
                        <div className={styles.difficultyOption}>
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={needsSoldering}
                                    onChange={(e) => setNeedsSoldering(e.target.checked)}
                                />
                                Soudure
                            </label>
                        </div>
                    </div>
                    <div className={styles.durationSection}>
                        <label htmlFor="duree">Durée estimée :</label>
                        <p>
                            <input 
                                className={styles.durationInput}
                                type="number" 
                                name="duree"
                                id="duree"
                                placeholder="Entrez la durée en heures"
                                value={estimatedDuration}
                                onChange={(e) => setEstimatedDuration(e.target.value)}
                                min="0"
                                max="1000"
                            />
                        </p>
                    </div>

                </form>
                <div className={styles.preview}>
                    <div className={styles.visibilityTopRight}>
                        <div className={styles.visibilitySection}>
                            <label>Visibilité :</label>
                            <div className={styles.radioGroup}>
                                <div className={styles.radioOption}>
                                    <input 
                                        type="radio" 
                                        name="visibility" 
                                        id="public"
                                        value="public"
                                        checked={!isPrivate}
                                        onChange={() => setIsPrivate(false)}
                                    />
                                    <label htmlFor="public">Public</label>
                                </div>
                                <div className={styles.radioOption}>
                                    <input 
                                        type="radio" 
                                        name="visibility" 
                                        id="private"
                                        value="private"
                                        checked={isPrivate}
                                        onChange={() => setIsPrivate(true)}
                                    />
                                    <label htmlFor="private">Privé</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h1 className={styles.previewTitle}>{previewTitle}</h1>
                    <h3 className={styles.previewDescription}>{previewDescription}</h3>
                    <p className={styles.previewMeta}>
                        Difficulté : {getDifficultyLabel(currentDifficulty)} ({currentDifficulty})
                    </p>
                    <form action="#" onSubmit={(e) => e.preventDefault()} className={styles.stepsForm}>
                        <fieldset>
                            <legend>Ajout des étapes :</legend>
                                <div>
                                    <h3>Vidéo :</h3>
                                    <label htmlFor="video">Ajout d'une vidéo : </label>
                                    <input
                                        type="file"
                                        name="video"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) {
                                                setVideoFile(file.name)
                                            }
                                        }}
                                    /><br />
                                    ou <br />
                                    <label htmlFor="lien">Ajouter un lien : </label>
                                    <input
                                        type="text"
                                        name="lien"
                                        placeholder="Coller le lien ici"
                                        value={videoLink}
                                        onChange={(e) => setVideoLink(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <h3>Étapes :</h3>
                                    {etapes.map((etape, index) => (
                                        <section key={etape.id} className={styles.etapeSection}>
                                            <h4>Étape {index + 1}</h4>
                                            <div className={styles.formGroup}>
                                                <label htmlFor={`tEtape${etape.id}`}>Titre : </label>
                                                <input 
                                                    className={styles.formInput}
                                                    type="text" 
                                                    name={`tEtape${etape.id}`} 
                                                    placeholder={`Entrer le nom de l'étape ${index + 1}`}
                                                    value={etape.titre}
                                                    onChange={(e) => mettreAJourEtape(etape.id, 'titre', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label htmlFor={`imgE${etape.id}`}>Importer une image l'étape {index + 1} :</label><br />
                                                <input 
                                                    className={styles.formInput}
                                                    type="file" 
                                                    name={`imgE${etape.id}`}
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0]
                                                        if (file) {
                                                            mettreAJourEtape(etape.id, 'image', file.name)
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label htmlFor={`etape${etape.id}`}>Étape {index + 1} : </label>
                                                <textarea 
                                                    className={styles.formTextarea}
                                                    name={`etape${etape.id}`} 
                                                    rows={6} 
                                                    cols={50} 
                                                    placeholder={`Entrez la description détaillée de l'étape ${index + 1}`}
                                                    value={etape.description}
                                                    onChange={(e) => mettreAJourEtape(etape.id, 'description', e.target.value)}
                                                    required
                                                ></textarea>
                                            </div>
                                            {etapes.length > 1 && (
                                                <button 
                                                    className={styles.deleteButton}
                                                    type="button"
                                                    onClick={() => supprimerEtape(etape.id)}
                                                >
                                                    Supprimer cette étape
                                                </button>
                                            )}
                                        </section>
                                    ))}

                                    <button 
                                        className={styles.addButton}
                                        id="ajoutEtape"
                                        type="button"
                                        onClick={ajouterEtape}
                                    >
                                        Ajouter une étape
                                    </button>
                                </div>
                        </fieldset>
                    </form>
                    <div className={styles.formActions}>
                        <button
                            type="button"
                            className={styles.addButton}
                            onClick={saveProject}
                        >
                            Enregistrer
                        </button>
                        <button
                            type="button"
                            className={styles.deleteButton}
                            onClick={clearForm}
                        >
                            Effacer
                        </button>
                    </div>
                </div>
                <div id="composant" className={styles.componentSection}>
                    <h2>Composants nécessaires :</h2>
                    <div className={styles.componentList}>
                        {composants.map((comp, index) => (
                            <div key={comp.id} className={styles.componentItem}>
                                <label htmlFor={`compo${comp.id}`}>Composant {index + 1} : </label>
                                <div className={styles.componentInputGroup}>
                                    <input 
                                        className={styles.formInput}
                                        type="text" 
                                        name={`compo${comp.id}`}
                                        id={`compo${comp.id}`}
                                        placeholder="Nom du composant"
                                        value={comp.nom}
                                        onChange={(e) => mettreAJourComposant(comp.id, 'nom', e.target.value)}
                                    />
                                    <input 
                                        className={styles.numberInput}
                                        type="number" 
                                        name={`nombre${comp.id}`}
                                        min="1"
                                        placeholder="Qté"
                                        value={comp.nombre}
                                        onChange={(e) => mettreAJourComposant(comp.id, 'nombre', parseInt(e.target.value) || 1)}
                                    />
                                    <button 
                                        className={styles.deleteButton}
                                        type="button"
                                        onClick={() => supprimerComposant(comp.id)}
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button 
                        className={styles.addButton}
                        type="button"
                        onClick={ajouterComposant}
                    >
                        Ajouter un composant
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Crea