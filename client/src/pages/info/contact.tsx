import { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./contact.module.css";

function Contact() {
    const navigate = useNavigate();

    return (
        <div className={style.contactPage}>
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
                <section className={style.contactCard}>
                    <div className={style.infoSection}>
                        <h1>Contactez-nous</h1>
                        <p>Une question sur un projet ? Notre équipe de passionnés d'électronique vous répond dans les plus brefs délais.</p>
                        
                        <div className={style.details}>
                            <div className={style.detailItem}>
                                <span>📍</span>
                                <p>EPHEC - Louvain La Neuve, Belgique</p>
                            </div>
                            <div className={style.detailItem}>
                                <span>✉️</span>
                                <p>projethub@gmail.com</p>
                            </div>
                        </div>
                    </div>

                    <form className={style.contactForm}>
                        <div className={style.inputGroup}>
                            <label htmlFor="name">Nom complet du projet</label>
                            <input type="text" id="name" placeholder="ProjetHub #12" required />
                        </div>

                        <div className={style.inputGroup}>
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" placeholder="projethub@gmail.com" required />
                        </div>

                        <div className={style.inputGroup}>
                            <label htmlFor="message">Votre message</label>
                            <textarea id="message" rows={5} placeholder="Comment pouvons-nous vous aider ?" required></textarea>
                        </div>

                        <button type="submit" className={style.btnSend}>Envoyer le message</button>
                    </form>
                </section>
            </main>

            <footer className={style.footer}>
                <p>© 2026 ProjetHub. Tous droits réservés.</p>
            </footer>
        </div>
    );
}

export default Contact;