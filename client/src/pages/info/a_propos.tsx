import { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./a_propos.module.css";

const TEAM_MEMBERS = [
    { 
        id: 1, 
        nom: "Eliott Sauvenière", 
        role: "Développeur Front-end", 
        image: "./eliott.jpg",
        bio: "Passionné de developpement web et d'impression 3D, Eliott a participé à la création de l'idée de ProjetHub et a développé l'interface utilisateur avec son compagnon de code, William." 
    },
    { 
        id: 2, 
        nom: "William Stevant", 
        role: "Développeur Front-end", 
        image: "./william.jpg",
        bio: "Passionné de developpement web et de ciruit électronique, William a participé à la création de l'idée de ProjetHub et a développé l'interface utilisateur avec son compagnon de code, Eliott." 
    },
    { 
        id: 3, 
        nom: "Rayan Kinet", 
        role: "Développeur Back-end", 
        image: "./rayan.jpg", 
        bio: "Le cerveau technique du groupe et spécialiste en architecture backend et sécurité. Rayan a conçu l'infrastructure de ProjetHub pour garantir une expérience utilisateur fluide et sécurisée." 
    },
    { 
        id: 4, 
        nom: "Oumou Fofana", 
        role: "Développeur Back-end", 
        image: "./oumou.jpg", 
        bio: "Spécialiste en bases de données et sécurité, Oumou a travaillé en étroite collaboration avec Rayan pour garantir que les données des utilisateurs soient protégées et que la plateforme soit performante." 
    },
];

function APropos() {
    const navigate = useNavigate();
    const [selectedMember, setSelectedMember] = useState<any>(null);

    return (
        <div className={style.aboutPage}>
            <header>
                <div className={style.logoContainer}>
                    <img src="./logo.png" alt="logo" />
                    <h2>ProjetHub</h2>
                </div>
                <div>
                    <button className={style.btnConnection} onClick={() => navigate("/")}>Accueil</button>
                </div>
            </header>

            <main className={style.mainContent}>
                <section className={style.heroSection}>
                    <h1>Innover, Créer, Partager.</h1>
                    <p>Découvrez l'histoire derrière ProjetHub et notre mission pour la communauté électronique.</p>
                </section>

                <div className={style.gridContent}>
                    <div className={style.card}>
                        <h3>🚀 Notre Mission</h3>
                        <p>
                            ProjetHub est né à l'EPHEC Louvain-la-Neuve avec une idée simple : 
                            centraliser les projets d'électronique et d'informatique pour permettre 
                            aux étudiants et passionnés de collaborer plus facilement.
                        </p>
                    </div>
                    <div className={style.card}>
                        <h3>💡 Pourquoi ProjetHub ?</h3>
                        <p>
                            Trop de projets restent dans des tiroirs. Nous offrons une vitrine 
                            pour documenter vos circuits, partager vos codes et inspirer la 
                            prochaine génération d'ingénieurs.
                        </p>
                    </div>
                </div>

                <section className={style.teamSection}>
                    <h2>L'équipe EPHEC</h2>
                    <div className={style.teamGrid}>
                        {TEAM_MEMBERS.map((member) => (
                            <div 
                                key={member.id} 
                                className={style.member} 
                                onClick={() => setSelectedMember(member)}
                            >
                                <div className={style.memberPhotoContainer}>
                                    <img src={member.image} alt={member.nom} className={style.memberPhoto} />
                                </div>
                                <h4>{member.nom}</h4>
                                <p>{member.role}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* POPUP CORRIGÉ */}
            {selectedMember && (
                <div className={style.overlay} onClick={() => setSelectedMember(null)}>
                    <div className={style.popupWindow} onClick={(e) => e.stopPropagation()}>
                        <button className={style.closeBtn} onClick={() => setSelectedMember(null)}>×</button>
                        
                        <img src={selectedMember.image} alt={selectedMember.nom} className={style.popupImage} />
                        
                        <div className={style.popupText}>
                            <h3>{selectedMember.nom}</h3>
                            <span className={style.roleBadge}>{selectedMember.role}</span>
                            <hr className={style.separator} />
                            <p className={style.bioText}>{selectedMember.bio}</p>
                        </div>
                    </div>
                </div>
            )}

            <footer className={style.footer}>
                <p>© 2026 ProjetHub. Tous droits réservés.</p>
            </footer>
        </div>
    );
}

export default APropos;