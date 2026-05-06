import { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./faq.module.css";

const FAQ_DATA = [
    {
        id: 1,
        question: "Comment créer un compte ?",
        reponse: "Pour créer un compte, cliquez sur le bouton 'Inscription' en haut à droite de la page d'accueil et remplissez le formulaire avec vos informations personnelles."
    },
    {
        id: 2,
        question: "Comment soumettre un projet ?",
        reponse: "Une fois connecté, cliquez sur 'Nouveau projet' dans votre profil, remplissez les détails de votre projet et soumettez-le pour que la communauté puisse le découvrir."
    },
    {
        id: 3,
        question: "Comment contacter le support ?",
        reponse: "Si vous avez besoin d'aide, n'hésitez pas à nous contacter via la page 'Contact' accessible depuis la page d'accueil."
    },
    {
        id: 4,
        question: "Comment modifier mon profil ?",
        reponse: "Pour modifier votre profil, cliquez sur 'Profil' dans le menu, puis sur 'Modifier mon profil' pour mettre à jour vos informations personnelles et vos préférences."
    }
];

function Faq() {
    const navigate = useNavigate();
    // État pour savoir quelle question est ouverte
    const [openId, setOpenId] = useState<number | null>(null);

    const toggleFaq = (id: number) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <div className={style.faqPage}>
            <header className={style.header}>
                <div className={style.logoContainer}>
                    <img src="./logo.png" alt="logo" />
                    <h2>ProjetHub</h2>
                </div>
                <button className={style.btnConnection} onClick={() => navigate("/")}>Accueil</button>
            </header>

            <main className={style.mainContent}>
                <section className={style.heroSection}>
                    <h1>Centre d'aide</h1>
                    <p>Vous avez des questions sur l'utilisation de ProjetHub ? Consultez notre FAQ ci-dessous.</p>
                </section>

                <div className={style.faqContainer}>
                    {FAQ_DATA.map((item) => (
                        <div 
                            key={item.id} 
                            className={`${style.faqItem} ${openId === item.id ? style.active : ""}`}
                            onClick={() => toggleFaq(item.id)}
                        >
                            <div className={style.faqQuestion}>
                                <h3>{item.question}</h3>
                                <span className={style.arrow}>{openId === item.id ? "−" : "+"}</span>
                            </div>
                            <div className={style.faqAnswer}>
                                <div className={style.answerContent}>
                                    <p>{item.reponse}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Section Autres Questions */}
                <section className={style.otherQuestions}>
                    <div className={style.divider}></div>
                    <h2>D'autres questions ?</h2>
                    <p>
                        Si vous n'avez pas trouvé la réponse à votre question, n'hésitez pas à nous contacter. 
                        Notre équipe est là pour vous aider !
                    </p>
                    <div className={style.contactOptions}>
                        <button className={style.btnContact} onClick={() => navigate("/contact")}>
                            Aller à la page Contact
                        </button>
                        <a href="mailto:support@projethub.be" className={style.mailLink}>
                            support@projethub.be
                        </a>
                    </div>
                </section>
            </main>

            <footer className={style.footer}>
                <p>© 2026 ProjetHub. Tous droits réservés.</p>
            </footer>
        </div>
    );
}

export default Faq;