import { useNavigate } from "react-router-dom";
import style from "./a_propos.module.css";

function APropos() {
    const navigate = useNavigate();

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
                    {/* Carte Mission */}
                    <div className={style.card}>
                        <h3>🚀 Notre Mission</h3>
                        <p>
                            ProjetHub est né à l'EPHEC Louvain-la-Neuve avec une idée simple : 
                            centraliser les projets d'électronique et d'informatique pour permettre 
                            aux étudiants et passionnés de collaborer plus facilement.
                        </p>
                    </div>

                    {/* Carte Vision */}
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
                        <div className={style.member}>
                            <div className={style.avatar}>👨‍💻</div>
                            <h4>Membre 1</h4>
                            <p>Développeur Front-end</p>
                        </div>
                        <div className={style.member}>
                            <div className={style.avatar}>⚡</div>
                            <h4>Membre 2</h4>
                            <p>Expert Électronique</p>
                        </div>
                        <div className={style.member}>
                            <div className={style.avatar}>🛠️</div>
                            <h4>Membre 3</h4>
                            <p>Développeur Back-end</p>
                        </div>
                        <div className={style.member}>
                            <div className={style.avatar}>🎨</div>
                            <h4>Membre 4</h4>
                            <p>Designer UI/UX</p>
                        </div>
                    </div>
                </section>
            </main>

            <footer className={style.footer}>
                <p>© 2026 ProjetHub. Tous droits réservés.</p>
            </footer>
        </div>
    );
}

export default APropos;