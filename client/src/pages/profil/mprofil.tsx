import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./profil.module.css"

function MProfil() {
    const navigate = useNavigate()

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
                    <form className={styles.projectForm} >
                        <div className={styles.formGroup}>
                            <img className={styles.projectImage} src="" alt="photo de profil" />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel} htmlFor="img">selectionner une image : </label>
                            <input 
                                className={styles.formInput} 
                                type="file" 
                                name="img" 
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel} htmlFor="titre">Pseudo : </label>
                            <input 
                                className={styles.formInput} 
                                type="text" 
                                name="titre" 
                                placeholder="l'ancien pseudo"
                            />
                        </div>
                        <div className={styles.descriptionSection}>
                            <h3>Bio</h3>
                            <textarea 
                                className={styles.formTextarea}
                                name="description" 
                                rows="6" 
                                cols="35" 
                                placeholder="bla bal, la bio..."
                                
                            ></textarea>
                        </div>
                        <div className={styles.buttonGroup}>
                            <button className={styles.resetButton} type="button">Effacer</button>
                            <button className={styles.submitButton} type="submit">Enregistrer</button>
                        </div>
                    </form>
                </div>
                <div className={styles.profilFenetre}>
                    <div className={styles.projectCard}>
                        <h2 className={styles.projectTitle}>Info general : </h2>
                        <form action="#" onSubmit={(e) => { e.preventDefault(); }}>
                            <fieldset>
                                <legend>Info Utilisateur</legend>
                                <p>
                                    <label htmlFor="prenom">Prénom : </label>
                                    <input type="text" name="prenom"  placeholder="indiquer votre prenom"/>
                                </p>
                                <p>
                                    <label htmlFor="nom">Nom : </label>
                                    <input type="text" name="nom"  placeholder="indiquer votre nom"/>
                                </p>
                                <p>
                                    <label htmlFor="age">Age : </label>
                                    <input type="text" name="age"  placeholder="indiquer votre age"/>
                                </p>
                                <p>
                                    <label htmlFor="mail">Email : </label>
                                    <input type="text" name="mail"  placeholder="indiquer votre Adresse mail"/>
                                </p>
                                <button className={styles.resetButton} type="button">Effacer</button>
                                <button className={styles.submitButton} type="submit">Enregistrer</button>
                            </fieldset>
                        </form>
                    </div>
                    <div className={styles.projectCard}>
                        <h2 className={styles.projectTitle}>Secutité</h2>
                        <form action="#" onSubmit={(e) => { e.preventDefault(); }}>
                            <fieldset>
                                <legend>Mot de passe</legend>
                                <p>
                                    <label htmlFor="apw">Ancien mots de passe : </label>
                                    <input type="password" name="apw" placeholder="indiquer votre ancien mdp" required/>
                                </p>
                                <p>
                                    <label htmlFor="npw">Nouveau mot de passe : </label>
                                    <input type="password" name="npw"  placeholder="indiquer votre nouveau mdp" required/>
                                </p>
                                <p>
                                    <label htmlFor="rpw">Réecrivez le mot de passe : </label>
                                    <input type="password" name="rpw"  placeholder="réecrivez votre nouveau mdp" required/>
                                </p>
                                <button className={styles.resetButton} type="button">Effacer</button>
                                <button className={styles.submitButton} type="submit">Enregistrer</button>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
            <button className={styles.profilButton} onClick={function () { navigate("/profil") }}>Retour</button>
        </div>

    )
}

export default MProfil;
