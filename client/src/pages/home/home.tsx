import { useNavigate } from "react-router-dom"
import style from "./home.module.css"

const PROJETS_MOCK = [
    {
        id: 1,
        titre: "Station météo IoT",
        description: "Mesurez température et humidité en WiFi.",
        difficulte: "Intermédiaire",
        duree: "4h",
        auteur: "Eliott",
        date: "26/03/2026",
        tags: ["IoT", "Arduino"],
        image: "./Logo_electronique_dynamique_avec_ampoule.png"
    },
    {
        id: 2,
        titre: "Ads Block Physique",
        description: "Bloquez les publicités sur votre réseau local.",
        difficulte: "Avancé",
        duree: "6h",
        auteur: "Marc",
        date: "25/03/2026",
        tags: ["Réseau", "RPi"],
        image: "./Logo_electronique_dynamique_avec_ampoule.png"
    },
    {
        id: 3,
        titre: "Système d'alarme maison",
        description: "Protégez votre maison avec des capteurs de mouvement.",
        difficulte: "Intermédiaire",
        duree: "5h",
        auteur: "Sophie",
        date: "24/03/2026",
        tags: ["Sécurité", "Arduino"],
        image: "./Logo_electronique_dynamique_avec_ampoule.png"
    },
    {
        id: 4,
        titre: "Robot suiveur de ligne",
        description: "Construisez un robot qui suit une ligne noire.",
        difficulte: "Débutant",
        duree: "3h",
        auteur: "Léa",
        date: "23/03/2026",
        tags: ["Robotique", "Arduino"],
        image: "./Logo_electronique_dynamique_avec_ampoule.png"
    },
];

function Acceuil() {
    const navigate = useNavigate();

    return (
        <div className={style.authPage}>
            <header>
                <div className={style.logoContainer}>
                    <img src="./Logo_electronique_dynamique_avec_ampoule.png" alt="logo" />
                    <h2>ProjetHub</h2>
                </div>
                <div>
                    <button className={style.btnConnection} onClick={() => navigate("/connection")}>Connexion</button>
                    <button className={style.btnConnection} onClick={() => navigate("/inscription")}>Inscription</button>
                </div>
            </header>

            <main className={style.mainBox}>
                {/* Sidebar Gauche */}
                <aside className={style.box}>
                    <h3>Projets récents</h3>
                    {PROJETS_MOCK.slice(0, 3).map(p => (
                        <button key={p.id} className={style.addBlock} onClick={() => navigate(`/projet/${p.id}`)}>
                            • {p.titre}
                        </button>
                    ))}
                </aside>

                {/* Section Centrale */}
                <section className={style.sectionCenter}>
                    <div className={style.searchBar}>
                        <input className={style.searchInput} type="text" placeholder="Rechercher un projet..." />
                        <button className={style.searchButton}>Rechercher</button>
                    </div>

                    <h3 className={style.sectionTitle}>Projets disponibles</h3>
                    
                    <div className={style.projectList}>
                        {PROJETS_MOCK.map((projet) => (
                            <button 
                                key={projet.id} 
                                className={style.projectCard} 
                                onClick={() => navigate(`/projet/${projet.id}`)}
                            >
                                <div className={style.imageProject}>
                                    <img src={projet.image} alt={projet.titre} />
                                </div>
                                <div className={style.projectInfo}>
                                    <h4>{projet.titre}</h4>
                                    <p>{projet.description}</p>
                                    <div className={style.extra}>
                                        <span>{projet.difficulte}</span>
                                        <span>{projet.duree}</span>
                                    </div>
                                    <small>Par {projet.auteur} • {projet.date}</small>
                                </div>
                                <div className={style.tags}>
                                    {projet.tags.map((tag, index) => (
                                        <span key={index}>{tag}</span>
                                    ))}
                                </div>  
                            </button>
                        ))}
                    </div>
                </section>

                {/* Sidebar Droite */}
                <aside className={style.box}>
                    <h3>Statistiques</h3>
                    <button onClick={() => navigate("/creation")}>• Nouveau projet</button>
                    <button onClick={() => navigate("/composants")}>• Voir composants</button>
                </aside>
            </main>
        </div>
    );
}

export default Acceuil