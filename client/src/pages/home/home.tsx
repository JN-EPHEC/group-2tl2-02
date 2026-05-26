import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "./home.module.css";

function Acceuil() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // --- LOGIQUE DE CONNEXION ---
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [projects, setProjects] = useState<any[]>([])
    const [loadingProjects, setLoadingProjects] = useState(true)
    const [visitedProjects, setVisitedProjects] = useState<any[]>([])
    const [likedProjects, setLikedProjects] = useState<any[]>([])
    const [inProgressProjects, setInProgressProjects] = useState<any[]>([])
    const [cartItems, setCartItems] = useState<any[]>([])

    const handleProjectClick = (project: any) => {
        if (project?.id) {
            localStorage.setItem("selectedProjectId", String(project.id))
            localStorage.setItem("selectedProjectData", JSON.stringify(project))
        }
        // update visited projects list (most recent first, unique)
        try {
            const raw = localStorage.getItem('visitedProjects')
            const arr = raw ? JSON.parse(raw) : []
            const filtered = arr.filter((p: any) => p.id !== project.id)
            const newList = [project, ...filtered].slice(0, 8)
            localStorage.setItem('visitedProjects', JSON.stringify(newList))
            setVisitedProjects(newList)
        } catch (err) {
            console.error('Erreur updating visitedProjects', err)
        }

        const routeId = project?.id ?? project?.I_id ?? project?._id
        console.log('handleProjectClick: project, resolved routeId ->', project, routeId)
        if (routeId) navigate(`/projet/${routeId}`)
        else navigate("/projet")
    }

    useEffect(() => {
        const user = localStorage.getItem("userId");
        if (user) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        setIsLoggedIn(false);
        setIsMenuOpen(false);
        window.location.href = "/"; 
    };

    useEffect(() => {
            const fetchProjects = async () => {
            try {
                setLoadingProjects(true)
                const userId = localStorage.getItem('userId')
                const url = userId 
                    ? `/api/users/AllProject?viewerUid=${userId}` 
                    : '/api/users/AllProject'
                const res = await fetch(url)
                if (!res.ok) throw new Error('Erreur API')
                const data = await res.json()
                if (Array.isArray(data)) setProjects(data)
            } catch (err) {
                console.error('Impossible de récupérer les projets :', err)
            } finally {
                setLoadingProjects(false)
            }
        }

        fetchProjects()
        // load local lists
        try {
            const v = JSON.parse(localStorage.getItem('visitedProjects') || '[]')
            setVisitedProjects(Array.isArray(v) ? v : [])
            const ip = JSON.parse(localStorage.getItem('inProgress') || '[]')
            setInProgressProjects(Array.isArray(ip) ? ip : [])
            const c = JSON.parse(localStorage.getItem('cart') || '[]')
            setCartItems(Array.isArray(c) ? c : [])
            // if logged in, fetch user favoris
            const userId = localStorage.getItem('userId')
            if (userId) {
                setIsLoggedIn(true)
                fetch(`/api/users/${userId}/favoris`)
                    .then(r => r.ok ? r.json() : [])
                    .then(data => { if (Array.isArray(data)) setLikedProjects(data) })
                    .catch(e => console.error('Erreur favoris', e))
            }
        } catch (err) {
            console.error('Erreur lecture localStorage', err)
        }
    }, [])

    return (
        <div className={style.authPage}>
            <header className={style.headerMain}>
                <div className={style.logoContainer}>
                    <img src="./logo.png" alt="logo" />
                    <h2>ProjetHub</h2>
                </div>
                <div className={style.headerActions}>
                    
                    {/* BOUTON CONNEXION : N'apparaît que si non connecté */}
                    {!isLoggedIn && (
                        <button className={style.btnConnection} onClick={() => navigate("/connection")}>
                            Connexion
                        </button>
                    )}
                    
                    {/* MENU PROFIL : N'apparaît que si connecté */}
                    {isLoggedIn && (
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
                                    <button onClick={() => navigate("/developpement")}>
                                        📢 Notifications
                                    </button>
                                    <button onClick={() => navigate("/developpement")}>
                                        💎 Abonnements
                                    </button>
                                    <button onClick={() => { setIsMenuOpen(false); navigate("/mprofil"); }}>
                                        ⚙️ Paramètres
                                    </button>
                                    <div className={style.menuDivider}></div>
                                    <button className={style.btnLogout} onClick={handleLogout}>
                                        Déconnexion
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </header>

            <main className={style.mainBox}>
                {/* COLONNE GAUCHE */}
                <aside className={style.box}>
                        <h3>Projets visités récemment</h3>
                        {visitedProjects.length === 0 ? (
                            <p>Aucun projet visité récemment.</p>
                        ) : (
                            visitedProjects.slice(0,4).map((p: any) => (
                                <button key={p.id} className={style.addBlock} onClick={() => handleProjectClick(p)}>
                                    • {p.titre || p.title}
                                </button>
                            ))
                        )}
                    <br /><br />
                    <h3>Projets likés</h3>
                    {!isLoggedIn ? (
                        <p>Connectez-vous pour voir vos favoris.</p>
                    ) : likedProjects.length === 0 ? (
                        <p>Vous n'avez pas encore de favoris.</p>
                    ) : (
                        likedProjects.slice(0,4).map((p: any) => (
                            <button key={p.id} className={style.addBlock} onClick={() => handleProjectClick(p)}>
                                • {p.titre || p.title}
                            </button>
                        ))
                    )}
                </aside>

                {/* COLONNE CENTRE */}
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
                        {loadingProjects && <p>Chargement des projets...</p>}
                        {!loadingProjects && projects.length === 0 && <p>Aucun projet disponible.</p>}
                        {!loadingProjects && projects.length > 0 && projects.map((projet) => (
                            <button 
                                key={projet.id} 
                                className={style.projectCard}
                                onClick={() => handleProjectClick(projet)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className={style.imageProject}>
                                    <img src={projet.image || projet.Image?.[0]?.I_img || "./logo.png"} alt={projet.titre || projet.title} />
                                </div>
                                <div className={style.projectInfo}>
                                    <h4>{projet.titre || projet.title}</h4>
                                    <p>{projet.description}</p>
                                    <div className={style.extra}>
                                        <small className={style.metaSmall}>difficulté : {projet.difficulte || projet.difficulty || 'N/A'}/6</small>
                                        <small className={style.metaSmall}>durées : {projet.duree || projet.duration || 'N/A'}h</small>
                                    </div>
                                    <small>Par {projet.auteur || projet.Auteurs?.[0]?.pseudo || 'Auteur'} • {projet.date || projet.createdAt}</small>
                                </div>
                                <div className={style.tags}>
                                    {(projet.tags || []).map((tag: string, index: number) => (
                                        <span key={index}>{tag}</span>
                                    ))}
                                </div>  
                            </button>
                        ))}
                    </div>
                </section>

                {/* COLONNE DROITE */}
                <aside className={style.box}>
                    <h3>Projets en cours</h3>
                    {inProgressProjects.length === 0 ? (
                        <p>Aucun projet en cours.</p>
                    ) : (
                        inProgressProjects.slice(0,4).map((p: any) => (
                            <button key={p.id} className={style.addBlock} onClick={() => handleProjectClick(p)}>
                                • {p.titre || p.title}
                            </button>
                        ))
                    )}
                    <br /><br />
                    <h3>Panier</h3>
                    <button onClick={() => navigate("/developpement")}>• Voir panier ({cartItems.length})</button>
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