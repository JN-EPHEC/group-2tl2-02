import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./creation.module.css"


function Crea() {
    const navigate = useNavigate()
    const [projectTitle, setProjectTitle] = useState("")
    const [projectDescription, setProjectDescription] = useState("")
    const [projectImage, setProjectImage] = useState("")
    const [previewTitle, setPreviewTitle] = useState("Titre du projet")
    const [previewDescription, setPreviewDescription] = useState("Description du projet")
    const [composants, setComposants] = useState([])
    const [nextComposantId, setNextComposantId] = useState(1)
    const [etapes, setEtapes] = useState([
        { id: 1, titre: "", image: "", description: "" },
        { id: 2, titre: "", image: "", description: "" }
    ])
    const [nextId, setNextId] = useState(3)

    const ajouterEtape = () => {
        const nouvelleEtape = { id: nextId, titre: "", image: "", description: "" }
        setEtapes([...etapes, nouvelleEtape])
        setNextId(nextId + 1)
    }

    const supprimerEtape = (id) => {
        if (etapes.length > 1) {
            setEtapes(etapes.filter(etape => etape.id !== id))
        } else {
            alert("Vous devez avoir au moins une étape !")
        }
    }

    const mettreAJourEtape = (id, champ, valeur) => {
        setEtapes(etapes.map(etape =>
            etape.id === id ? { ...etape, [champ]: valeur } : etape
        ))
    }

    const handleEnregistrer = (e) => {
        e.preventDefault()
        setPreviewTitle(projectTitle || "Titre du projet")
        setPreviewDescription(projectDescription || "Description du projet")
    }

    const handleEffacer = () => {
        setProjectTitle("")
        setProjectDescription("")
        setProjectImage("")
    }

    const ajouterComposant = () => {
        const nouveauComposant = { id: nextComposantId, nom: "", nombre: 1 }
        setComposants([...composants, nouveauComposant])
        setNextComposantId(nextComposantId + 1)
    }

    const supprimerComposant = (id) => {
        setComposants(composants.filter(comp => comp.id !== id))
    }

    const mettreAJourComposant = (id, champ, valeur) => {
        setComposants(composants.map(comp =>
            comp.id === id ? { ...comp, [champ]: valeur } : comp
        ))
    }
    return (
        <div className={styles.creationPage}>
            <header>
                <div className="logoContainer">
                    <img src="./logo.png" alt="logo" />
                    <h2>ProjetHub</h2>
                </div>
                <div>
                    <button className="btnConnection" onClick={function () { navigate("/") }}>Accueil</button>
                </div>
            </header>
            <div className={styles.contentContainer}>
                <form className={styles.projectForm} onSubmit={handleEnregistrer}>
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
                                const file = e.target.files[0]
                                if (file) {
                                    const reader = new FileReader()
                                    reader.onload = (event) => {
                                        setProjectImage(event.target.result)
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
                            rows="6" 
                            cols="50" 
                            placeholder="Entrez la description détaillée de votre projet..."
                            value={projectDescription}
                            onChange={(e) => setProjectDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <div className={styles.buttonGroup}>
                        <button className={styles.resetButton} type="button" onClick={handleEffacer}>Effacer</button>
                        <button className={styles.submitButton} type="submit">Enregistrer</button>
                    </div>
                </form>
                <div className={styles.preview}>
                    <h1 className={styles.previewTitle}>{previewTitle}</h1>
                    <h3 className={styles.previewDescription}>{previewDescription}</h3>
                    <form action="#" onSubmit="return laDeuxiemeFonction(this)" className={styles.stepsForm}>
                        <fieldset>
                            <legend>Ajout des étapes :</legend>
                                <p>
                                    <h3>Vidéo :</h3>
                                    <label htmlFor="video">Ajout d'une vidéo : </label>
                                    <input type="file" name="video" /><br />
                                    ou <br />
                                    <label htmlFor="lien">Ajouter un lien : </label>
                                    <input type="text" name="lien" placeholder="Coller le lien ici"/>
                                </p>
                                <p>
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
                                                    onChange={(e) => mettreAJourEtape(etape.id, 'image', e.target.value)}
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label htmlFor={`etape${etape.id}`}>Étape {index + 1} : </label>
                                                <textarea 
                                                    className={styles.formTextarea}
                                                    name={`etape${etape.id}`} 
                                                    rows="6" 
                                                    cols="50" 
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
                                </p>
                        </fieldset>
                        <button onClick={handleEffacer}>Effacer</button>
                        <button type="submit">Enregistrer</button>
                    </form>
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