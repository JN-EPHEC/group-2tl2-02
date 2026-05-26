import { useNavigate } from "react-router-dom";
import styles from "./panier.module.css";

function Panier() {
    const navigate = useNavigate();

    // Simulation de données (à lier plus tard à ta base de données)
    const projetsPanier = [
        {
            id: 1,
            titre: "Station météo IoT",
            composants: [
                { nom: "ESP32 DevKit V1", prix: "8.50€", status: "manquant" },
                { nom: "Capteur BME280", prix: "4.20€", status: "possédé" },
                { nom: "Écran OLED 0.96", prix: "5.00€", status: "manquant" }
            ]
        },
        {
            id: 2,
            titre: "Robot suiveur de ligne",
            composants: [
                { nom: "Arduino Uno", prix: "12.00€", status: "manquant" },
                { nom: "Module L298N", prix: "3.50€", status: "manquant" },
                { nom: "Capteurs IR (x2)", prix: "2.00€", status: "manquant" }
            ]
        }
    ];

    return (
        <div className={styles.panierPage}>
            <header className={styles.headerMain}>
                <div className={styles.logoContainer} onClick={() => navigate("/")}>
                    <img src="./logo.png" alt="logo" />
                    <h2>ProjetHub</h2>
                </div>
                <button className={styles.btnNav} onClick={() => navigate("/")}>Accueil</button>
            </header>

            <main className={styles.mainContent}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Mon Panier de Composants</h1>
                    <p className={styles.subtitle}>Liste des pièces nécessaires pour vos projets en cours</p>
                </div>

                <div className={styles.panierList}>
                    {projetsPanier.map((projet) => (
                        <div key={projet.id} className={styles.projetCard}>
                            <h3 className={styles.projetTitre}>{projet.titre}</h3>
                            <div className={styles.composantsGrid}>
                                {projet.composants.map((comp, index) => (
                                    <div key={index} className={styles.composantItem}>
                                        <div className={styles.compInfo}>
                                            <input type="checkbox" checked={comp.status === "possédé"} readOnly />
                                            <span className={comp.status === "possédé" ? styles.done : ""}>
                                                {comp.nom}
                                            </span>
                                        </div>
                                        <span className={styles.price}>{comp.prix}</span>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.cardFooter}>
                                <button className={styles.btnAcheter}>Tout acheter (Amazon / AliExpress)</button>
                            </div>
                        </div>
                    ))}
                </div>

                {projetsPanier.length === 0 && (
                    <div className={styles.emptyState}>
                        <p>Votre panier est vide. Likez des projets pour voir les composants nécessaires !</p>
                    </div>
                )}
            </main>

            <footer className={styles.footer}>
                <p>© 2026 ProjetHub. Tous droits réservés.</p>
            </footer>
        </div>
    );
}

export default Panier;