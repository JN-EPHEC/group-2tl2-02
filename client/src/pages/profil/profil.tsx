import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./profil.css"

function Profil() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("projets")

    return (
        <div className="profil-page">
            <header>
                <button className="profilBoutton back-button" onClick={function (){ navigate("/")}}>retours</button>
                <h1>Votre profil</h1>
            </header>
            <div className="profil-columns">
                <div id="profilInfo">
                    <img className="avatar-image" src="" alt="pdp" />
                    <h1 id="profilPseudo">LE PSEUUUUUUUUUUUUUUUUUUUUDO</h1>
                    <h3 id="profilStatus">le tstatus (inventeur passionner)</h3>
                    <table id="profilTabInfo">
                        <thead>
                            <tr><td>42</td><td>25</td><td>6</td></tr>
                        </thead>
                        <tbody>
                            <tr><td>Projets</td><td>Favorits</td><td>nBadges</td></tr>
                        </tbody>
                    </table>
                    <div id="profilBio">
                        <h3>Bio</h3>
                        <span id="profilDescription">
                            en sah joyeux annif rayan
                        </span>
                    </div>
                    <button className="profilBoutton">Modifier le profil</button>
                </div>
                <div id="profilFenetre">
                    <span id="profilBoutton" className="tabs-row">
                    <button
                        className={`profilBoutton tab-button ${activeTab === "projets" ? "active" : ""}`}
                        onClick={function (){setActiveTab("projets")}}
                    >Mes projets</button>
                    <button
                        className={`profilBoutton tab-button ${activeTab === "favorits" ? "active" : ""}`}
                        onClick={function (){ setActiveTab("favorits")}}
                    >Mes Favorits</button>
                    <button
                        className={`profilBoutton tab-button ${activeTab === "badges" ? "active" : ""}`}
                        onClick={function (){setActiveTab("badges")}}
                    >Mes badges</button>
                </span>
                <section id="profilProjet" className={`tab-panel ${activeTab === "projets" ? "visible" : "hidden"}`} style={{ display: activeTab === "projets" ? "grid" : "none" }}>
                    <div className="profilProjetProjet">
                        <img src="" alt="img du projet" />
                        <h2>titre du projet</h2>
                        <span>modification temps</span>
                        <button className="profilBoutton">Modifier</button>
                        <button className="profilBoutton secondary">supprimer</button>
                    </div>
                    <div className="profilProjetProjet">
                        <img src="" alt="img du projet" />
                        <h2>titre du projet</h2>
                        <span>modification temps</span>
                        <button className="profilBoutton">Modifier</button>
                        <button className="profilBoutton secondary">supprimer</button>
                    </div>
                    <div className="profilProjetProjet">
                        <img src="" alt="img du projet" />
                        <h2>titre du projet</h2>
                        <span>modification temps</span>
                        <button className="profilBoutton">Modifier</button>
                        <button className="profilBoutton secondary">supprimer</button>
                    </div>
                </section>
                <section id="profilFavorit" className={`tab-panel ${activeTab === "favorits" ? "visible" : "hidden"}`} style={{ display: activeTab === "favorits" ? "grid" : "none" }}>
                    <div className="profilFavoritProjet">
                        <img src="" alt="img du projet" />
                        <h2>titre du projet</h2>
                        <span>modification temps</span>
                        <button className="profilBoutton">Modifier</button>
                        <button className="profilBoutton secondary">supprimer</button>
                    </div>
                    <div className="profilFavoritProjet">
                        <img src="" alt="img du projet" />
                        <h2>titre du projet</h2>
                        <span>modification temps</span>
                        <button className="profilBoutton">Modifier</button>
                        <button className="profilBoutton secondary">supprimer</button>
                    </div>
                    <div className="profilFavoritProjet">
                        <img src="" alt="img du projet" />
                        <h2>titre du projet</h2>
                        <span>modification temps</span>
                        <button className="profilBoutton">Modifier</button>
                        <button className="profilBoutton secondary">supprimer</button>
                    </div>
                </section>
                <section id="profilBadge" className={`tab-panel ${activeTab === "badges" ? "visible" : "hidden"}`} style={{ display: activeTab === "badges" ? "grid" : "none" }}>
                    <div className="badge-card">
                        <h2>Badge 1</h2>
                        <p>Description du badge</p>
                    </div>
                    <div className="badge-card">
                        <h2>Badge 2</h2>
                        <p>Description du badge</p>
                    </div>
                </section>
            </div>
        </div>
        </div>
    )
}

export default Profil
