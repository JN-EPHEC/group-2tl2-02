import { useNavigate } from "react-router-dom"
import styles from "./projet.module.css"


function Projet() {
    const navigate = useNavigate()
    return (
        <div className={styles.projetPage}>
            <header className={styles.pageHeader}>
                <div className={styles.logoContainer}>
                    <img src="./logo.png" alt="logo" />
                    <h2>ProjetHub</h2>
                </div>
                <div>
                    <button className={styles.btnConnection} onClick={function () { navigate("/") }}>Accueil</button>
                </div>
            </header>

            <div className={styles.projetColumns}>
                <div className={styles.projetInfo}>
                    <img className={styles.avatarImage} src="" alt="img du projet" />
                    <h1 className={styles.projetPseudo}>Titre du projet</h1>
                    <div className={styles.projetBio}>
                        <h3>Description</h3>
                        <span className={styles.projetDescription}>
                            description du projet
                        </span>
                    </div>
                </div>
                <div className={styles.projetFenetre}>
                    <button>ajouter au favorits</button>
                    <h1>Titre du projet</h1>
                    <h3>Description</h3>
                    <video src="" controls></video>
                    <p><a href="">lien de la vidéo</a></p>
                    <hr />
                    <section>
                        <h2>Titre de l'étape 1</h2>
                        <img src="" alt="imgEtape1" />
                        <div>
                            <p>
                                bla bla bla <br />
                                ce qu'il faut faire ...
                            </p>
                        </div>
                    </section>
                    <hr />
                    <section>
                        <h2>Titre de l'étape 2</h2>
                        <img src="" alt="imgEtape2" />
                        <div>
                            <p>
                                bla bla bla <br />
                                ce qu'il faut faire ...µ
                            </p>
                        </div>
                    </section>
                    <hr />
                    <section>
                        <h2>Titre de l'étape 3</h2>
                        <img src="" alt="imgEtape3" />
                        <div>
                            <p>
                                bla bla bla <br />
                                ce qu'il faut faire ...
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default Projet