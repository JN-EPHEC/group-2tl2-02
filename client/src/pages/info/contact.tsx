import { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./contact.module.css";

function Contact() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Message envoyé avec succès !");
        setIsModalOpen(false);
    };

    return (
        <div className={style.contactPage}>
            <header className={style.header}>
                <div className={style.logoContainer}>
                    <img src="./logo.png" alt="logo" />
                    <h2>ProjetHub</h2>
                </div>
                <button className={style.btnHome} onClick={() => navigate("/")}>Accueil</button>
            </header>
            
            <main className={style.mainContent}>
                <section className={style.heroContact}>
                    <h1>Une question ? <br/><span>On est là pour vous aider.</span></h1>
                    <p>Que vous soyez étudiant à l'EPHEC ou passionné d'électronique, notre équipe vous répond avec plaisir.</p>
                    
                    <div className={style.infoGrid}>
                        <div className={style.infoCard}>
                            <div className={style.iconCircle}>📍</div>
                            <h3>Localisation</h3>
                            <p>EPHEC - Louvain-la-Neuve</p>
                        </div>
                        <div className={style.infoCard}>
                            <div className={style.iconCircle}>✉️</div>
                            <h3>Email</h3>
                            <p>projethub@gmail.com</p>
                        </div>
                    </div>

                    <button className={style.btnOpenPopup} onClick={() => setIsModalOpen(true)}>
                        Nous envoyer un message
                    </button>
                </section>

                {/* MODAL / POPUP */}
                {isModalOpen && (
                    <div className={style.modalOverlay} onClick={() => setIsModalOpen(false)}>
                        <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
                            <button className={style.btnClose} onClick={() => setIsModalOpen(false)}>×</button>
                            
                            <h2>Envoyez-nous un message</h2>
                            <p>Nous vous répondrons sous 24h à 48h.</p>

                            <form className={style.contactForm} onSubmit={handleSubmit}>
                                <div className={style.inputGroup}>
                                    <label>Nom complet</label>
                                    <input type="text" placeholder="Ex: Jean Dupont" required />
                                </div>
                                <div className={style.inputGroup}>
                                    <label>Email</label>
                                    <input type="email" placeholder="votre@email.com" required />
                                </div>
                                <div className={style.inputGroup}>
                                    <label>Message</label>
                                    <textarea rows={4} placeholder="Comment pouvons-nous vous aider ?" required></textarea>
                                </div>
                                <button type="submit" className={style.btnSend}>Envoyer</button>
                            </form>
                        </div>
                    </div>
                )}
            </main>

            <footer className={style.footer}>
                <p>© 2026 ProjetHub. Tous droits réservés.</p>
            </footer>
        </div>
    );
}

export default Contact;