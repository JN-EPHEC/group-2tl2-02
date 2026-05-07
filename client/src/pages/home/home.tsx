import { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./home.module.css";

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
        image: "./logo.png"
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
        image: "./logo.png"
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
        image: "./logo.png"
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
        image: "./logo.png"
    },
];

function Acceuil() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className={style.authPage}>
            <header className={style.headerMain}>
                <div className={style.logoContainer}>
                    <img src="./logo.png" alt="logo" />
                    <h2>ProjetHub</h2>
                </div>
                <div className={style.headerActions}>
                    <button className={style.btnConnection} onClick={() => navigate("/connection")}>
                        Connexion
                    </button>
                    
                    {/* Conteneur du menu profil */}
                    <div className={style.profileContainer}>
                        <button 
                            className={style.btnProfilTrigger} 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            Profil <span className={style.arrow}>{isMenuOpen ? "▲" : "▼"}</span>
                        </button>

                        {isMenuOpen && (
                            <div className={style.dropdownMenu}>
                                <button onClick={() => { setIsMenuOpen(false); navigate("/profil"); }}>
                                    👤 Mon profil
                                </button>
                                <button onClick={() => navigate("/creation")}>
                                    📂 Nouveau projet
                                </button>
                                <button onClick={() => navigate("/composants")}>
                                    🧩 Voir composants
                                </button>
                                <button onClick={() => { setIsMenuOpen(false); navigate("/mprofil"); }}>
                                    ⚙️ Paramètres
                                </button>
                                <div className={style.menuDivider}></div>
                                <button className={style.btnLogout} onClick={() => navigate("/connection")}>
                                    Déconnexion
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className={style.mainBox}>
                <aside className={style.box}>
                    <h3>Projets visités récemment</h3>
                    {PROJETS_MOCK.slice(0, 4).map(p => (
                        <button key={p.id} className={style.addBlock} onClick={() => navigate(`/projet/${p.id}`)}>
                            • {p.titre}
                        </button>
                    ))}
                    <br /><br />
                    <h3>Projets likés</h3>
                    {PROJETS_MOCK.slice(0, 4).map(p => (
                        <button key={p.id} className={style.addBlock} onClick={() => navigate(`/projet/${p.id}`)}>
                            • {p.titre}
                        </button>
                    ))}
                </aside>

                <section className={style.sectionCenter}>
                    <div className={style.searchBar}>
                        <input className={style.searchInput} type="text" placeholder="Rechercher un projet..." />
                        <button className={style.searchButton}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </button>
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

                <aside className={style.box}>
                    <h3>Projets en cours</h3>
                    {PROJETS_MOCK.slice(0, 4).map(p => (
                        <button key={p.id} className={style.addBlock} onClick={() => navigate(`/projet/${p.id}`)}>
                            • {p.titre}
                        </button>
                    ))}
                    <br /><br />
                    <h3>Panier</h3>
                    <button onClick={() => navigate("/panier")}>• Voir panier</button>
                </aside>
            </main>

            <footer className={style.footer}>
                <p>© 2026 ProjetHub. Tous droits réservés.</p>
                <div className={style.footerNav}>
                    <button className={style.footerBtn} onClick={() => navigate("/contact")}>Contact</button>
                    <button className={style.footerBtn} onClick={() => navigate("/a_propos")}>À propos</button>
                    <button className={style.footerBtn} onClick={() => navigate("/faq")}>FAQ</button>
                </div>
            </footer>
        </div>
    );
}

export default Acceuil;