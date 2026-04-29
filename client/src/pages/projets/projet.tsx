import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./projet.module.css"


function Projet() {
    const navigate = useNavigate()

    // Composants disponibles et sélectionnés
    const [composantsDisponibles, setComposantsDisponibles] = useState([
        { id: 1, nom: "Pi pico W"},
        { id: 2, nom: "HC-SR04"},
        { id: 3, nom: "écran LCD"},
        { id: 4, nom: "Afficheur 7 segment"},
        { id: 5, nom: "décodeur 74HCT451" },
        { id: 6, nom: "bouton"},
        { id: 7, nom: "trensistor 2n2222" },
        { id: 8, nom: "resistance 330" },
        { id: 9, nom: "led RGB" },
        { id: 10, nom: "led" },
        { id: 11, nom: "boite ultra style" }

    ])
    const [composantsSelectionnes, setComposantsSelectionnes] = useState([])

    // Déplacer un composant vers la sélection
    const ajouterComposantSelection = (composant) => {
        setComposantsSelectionnes([...composantsSelectionnes, composant])
        setComposantsDisponibles(composantsDisponibles.filter(c => c.id !== composant.id))
    }

    // Remettre un composant dans la liste disponible
    const retirerComposantSelection = (composant) => {
        setComposantsDisponibles([...composantsDisponibles, composant])
        setComposantsSelectionnes(composantsSelectionnes.filter(c => c.id !== composant.id))
    }
    return (
        <div className={styles.projetPage}>
            <header className={styles.pageHeader}>
                <div className={styles.logoContainer}>
                    <img src="./logo.png" alt="logo" />
                    <h2>ProjetHub</h2>
                </div>
                <div>
                    <button className={styles.btnConnection} onClick={function () { navigate("/") }}>Accueil</button>
                </div>
            </header>

            <div className={styles.projetColumns}>
                <div className={styles.projetInfo}>
                    <p><button class="btnConnection">⭐​</button></p>
                    <img className={styles.avatarImage} src="" alt="img du projet" />
                    <h1 className={styles.projetPseudo}>Titre du projet</h1>
                    <div className={styles.projetBio}>
                        <h3>Description</h3>
                        <span className={styles.projetDescription}>
                            description du projet
                        </span>
                        <div id="projetTableMatier">
                            <h3>Table des matieres</h3>
                            <ol>
                                <li>
                                    <a href="#PE1">Étape 1 : bla bla bla</a>
                                </li>
                                <li>
                                    <a href="#PE2">Étape 2 : bla bla bla</a>
                                </li>
                                <li>
                                    <a href="#PE3">Étape 3 : bla bla bla</a>
                                </li>
                                <li>
                                    <a href="#PE4">Étape 4 : bla bla bla</a>
                                </li>
                            </ol>
                        </div>

                        
                    </div>
                </div>
                <div className={styles.projetFenetre}>
                    <h1>Titre du projet</h1>
                    <h3>Description</h3>
                    <video src="" controls></video>
                    <p><a href="">lien de la vidéo</a></p>
                    <hr />
                    <section id="PE1">
                        <h2>Titre de l'étape 1</h2>
                        <img src="" alt="imgEtape1" />
                        <div>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eleifend non tellus cursus elementum. In massa sapien, convallis eu elit ut, maximus volutpat lectus. Quisque in enim malesuada ipsum semper pharetra maximus mollis augue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum vehicula vehicula orci in dictum. Proin viverra mattis diam, vulputate bibendum nisl mattis et. In sodales leo at ligula volutpat lobortis. Phasellus eleifend risus vitae neque semper rhoncus.
                            </p>
                            <p>
                                Maecenas pretium tellus nisl, nec finibus mi ultricies a. Nunc facilisis libero sit amet eros interdum viverra. Nunc malesuada venenatis enim sit amet accumsan. Fusce at risus erat. Mauris justo nisl, condimentum at semper ac, dignissim sit amet nisl. Donec magna nibh, faucibus non eros non, dapibus rhoncus lectus. Praesent scelerisque vel elit ut maximus. Nunc vel massa facilisis, faucibus velit sodales, vulputate mauris. Quisque malesuada lorem libero, nec maximus sem venenatis sit amet. Proin consectetur metus nibh, at gravida enim tristique et. Duis ac eros ac est bibendum aliquam vitae ullamcorper massa. Suspendisse rutrum malesuada malesuada.
                            </p>
                            <p>
                                Mauris quam leo, pretium id lacus quis, hendrerit bibendum mi. Praesent augue tortor, mattis id purus id, ornare tristique purus. Quisque vel sapien nisl. Fusce at nisi quis neque sagittis hendrerit eu a ante. Aliquam erat volutpat. Aenean scelerisque odio sed condimentum egestas. Phasellus sed nulla ligula. Aenean blandit urna in sapien venenatis, eu aliquet ex tempus. Donec feugiat venenatis gravida. Ut et luctus lacus. Nullam nec diam vel libero mattis posuere. Cras id auctor augue. Vivamus eu dictum augue. Cras varius tortor nec aliquet tristique.
                            </p>
                            <p>
                                Phasellus at velit fringilla, convallis mi ut, mollis massa. Nulla laoreet pharetra erat, sit amet bibendum tortor blandit dictum. Integer nulla nulla, mattis eu rutrum nec, placerat ultrices nunc. Morbi accumsan elit justo, in pretium lectus tempus sit amet. Curabitur posuere neque sem. Etiam semper accumsan nisi vitae finibus. Vestibulum eu ultricies augue. Aliquam tempus tincidunt mi.
                            </p>
                            <p>
                                Vestibulum vestibulum vehicula dignissim. Sed sagittis magna vehicula, commodo est sit amet, feugiat eros. Interdum et malesuada fames ac ante ipsum primis in faucibus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus ut volutpat arcu. Praesent quis lacus ac nisi finibus porta eu ac dolor. Aenean volutpat libero quis mauris ultricies eleifend. Donec ornare urna nibh, at luctus risus ultricies nec. Nulla sit amet nibh orci. Ut convallis erat eget erat facilisis, rutrum bibendum tortor vestibulum. Mauris libero lectus, ullamcorper et orci quis, posuere bibendum felis. Mauris euismod luctus ex, eu blandit felis convallis quis.
                            </p>
                        </div>
                    </section>
                    <hr />
                    <section id="PE2">
                        <h2>Titre de l'étape 2</h2>
                        <img src="" alt="imgEtape2" />
                        <div>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eleifend non tellus cursus elementum. In massa sapien, convallis eu elit ut, maximus volutpat lectus. Quisque in enim malesuada ipsum semper pharetra maximus mollis augue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum vehicula vehicula orci in dictum. Proin viverra mattis diam, vulputate bibendum nisl mattis et. In sodales leo at ligula volutpat lobortis. Phasellus eleifend risus vitae neque semper rhoncus.
                            </p>
                            <p>
                                Maecenas pretium tellus nisl, nec finibus mi ultricies a. Nunc facilisis libero sit amet eros interdum viverra. Nunc malesuada venenatis enim sit amet accumsan. Fusce at risus erat. Mauris justo nisl, condimentum at semper ac, dignissim sit amet nisl. Donec magna nibh, faucibus non eros non, dapibus rhoncus lectus. Praesent scelerisque vel elit ut maximus. Nunc vel massa facilisis, faucibus velit sodales, vulputate mauris. Quisque malesuada lorem libero, nec maximus sem venenatis sit amet. Proin consectetur metus nibh, at gravida enim tristique et. Duis ac eros ac est bibendum aliquam vitae ullamcorper massa. Suspendisse rutrum malesuada malesuada.
                            </p>
                            <p>
                                Mauris quam leo, pretium id lacus quis, hendrerit bibendum mi. Praesent augue tortor, mattis id purus id, ornare tristique purus. Quisque vel sapien nisl. Fusce at nisi quis neque sagittis hendrerit eu a ante. Aliquam erat volutpat. Aenean scelerisque odio sed condimentum egestas. Phasellus sed nulla ligula. Aenean blandit urna in sapien venenatis, eu aliquet ex tempus. Donec feugiat venenatis gravida. Ut et luctus lacus. Nullam nec diam vel libero mattis posuere. Cras id auctor augue. Vivamus eu dictum augue. Cras varius tortor nec aliquet tristique.
                            </p>
                            <p>
                                Phasellus at velit fringilla, convallis mi ut, mollis massa. Nulla laoreet pharetra erat, sit amet bibendum tortor blandit dictum. Integer nulla nulla, mattis eu rutrum nec, placerat ultrices nunc. Morbi accumsan elit justo, in pretium lectus tempus sit amet. Curabitur posuere neque sem. Etiam semper accumsan nisi vitae finibus. Vestibulum eu ultricies augue. Aliquam tempus tincidunt mi.
                            </p>
                            <p>
                                Vestibulum vestibulum vehicula dignissim. Sed sagittis magna vehicula, commodo est sit amet, feugiat eros. Interdum et malesuada fames ac ante ipsum primis in faucibus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus ut volutpat arcu. Praesent quis lacus ac nisi finibus porta eu ac dolor. Aenean volutpat libero quis mauris ultricies eleifend. Donec ornare urna nibh, at luctus risus ultricies nec. Nulla sit amet nibh orci. Ut convallis erat eget erat facilisis, rutrum bibendum tortor vestibulum. Mauris libero lectus, ullamcorper et orci quis, posuere bibendum felis. Mauris euismod luctus ex, eu blandit felis convallis quis.
                            </p>
                        </div>
                    </section>
                    <hr />
                    <section id="PE3">
                        <h2>Titre de l'étape 3</h2>
                        <img src="" alt="imgEtape3" />
                        <div>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eleifend non tellus cursus elementum. In massa sapien, convallis eu elit ut, maximus volutpat lectus. Quisque in enim malesuada ipsum semper pharetra maximus mollis augue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum vehicula vehicula orci in dictum. Proin viverra mattis diam, vulputate bibendum nisl mattis et. In sodales leo at ligula volutpat lobortis. Phasellus eleifend risus vitae neque semper rhoncus.
                            </p>
                            <p>
                                Maecenas pretium tellus nisl, nec finibus mi ultricies a. Nunc facilisis libero sit amet eros interdum viverra. Nunc malesuada venenatis enim sit amet accumsan. Fusce at risus erat. Mauris justo nisl, condimentum at semper ac, dignissim sit amet nisl. Donec magna nibh, faucibus non eros non, dapibus rhoncus lectus. Praesent scelerisque vel elit ut maximus. Nunc vel massa facilisis, faucibus velit sodales, vulputate mauris. Quisque malesuada lorem libero, nec maximus sem venenatis sit amet. Proin consectetur metus nibh, at gravida enim tristique et. Duis ac eros ac est bibendum aliquam vitae ullamcorper massa. Suspendisse rutrum malesuada malesuada.
                            </p>
                            <p>
                                Mauris quam leo, pretium id lacus quis, hendrerit bibendum mi. Praesent augue tortor, mattis id purus id, ornare tristique purus. Quisque vel sapien nisl. Fusce at nisi quis neque sagittis hendrerit eu a ante. Aliquam erat volutpat. Aenean scelerisque odio sed condimentum egestas. Phasellus sed nulla ligula. Aenean blandit urna in sapien venenatis, eu aliquet ex tempus. Donec feugiat venenatis gravida. Ut et luctus lacus. Nullam nec diam vel libero mattis posuere. Cras id auctor augue. Vivamus eu dictum augue. Cras varius tortor nec aliquet tristique.
                            </p>
                            <p>
                                Phasellus at velit fringilla, convallis mi ut, mollis massa. Nulla laoreet pharetra erat, sit amet bibendum tortor blandit dictum. Integer nulla nulla, mattis eu rutrum nec, placerat ultrices nunc. Morbi accumsan elit justo, in pretium lectus tempus sit amet. Curabitur posuere neque sem. Etiam semper accumsan nisi vitae finibus. Vestibulum eu ultricies augue. Aliquam tempus tincidunt mi.
                            </p>
                            <p>
                                Vestibulum vestibulum vehicula dignissim. Sed sagittis magna vehicula, commodo est sit amet, feugiat eros. Interdum et malesuada fames ac ante ipsum primis in faucibus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus ut volutpat arcu. Praesent quis lacus ac nisi finibus porta eu ac dolor. Aenean volutpat libero quis mauris ultricies eleifend. Donec ornare urna nibh, at luctus risus ultricies nec. Nulla sit amet nibh orci. Ut convallis erat eget erat facilisis, rutrum bibendum tortor vestibulum. Mauris libero lectus, ullamcorper et orci quis, posuere bibendum felis. Mauris euismod luctus ex, eu blandit felis convallis quis.
                            </p>
                        </div>
                    </section>
                    <hr />
                    <section id="PE4">
                        <h2>Titre de l'étape 4</h2>
                        <img src="" alt="imgEtape4" />
                        <div>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eleifend non tellus cursus elementum. In massa sapien, convallis eu elit ut, maximus volutpat lectus. Quisque in enim malesuada ipsum semper pharetra maximus mollis augue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum vehicula vehicula orci in dictum. Proin viverra mattis diam, vulputate bibendum nisl mattis et. In sodales leo at ligula volutpat lobortis. Phasellus eleifend risus vitae neque semper rhoncus.
                            </p>
                            <p>
                                Maecenas pretium tellus nisl, nec finibus mi ultricies a. Nunc facilisis libero sit amet eros interdum viverra. Nunc malesuada venenatis enim sit amet accumsan. Fusce at risus erat. Mauris justo nisl, condimentum at semper ac, dignissim sit amet nisl. Donec magna nibh, faucibus non eros non, dapibus rhoncus lectus. Praesent scelerisque vel elit ut maximus. Nunc vel massa facilisis, faucibus velit sodales, vulputate mauris. Quisque malesuada lorem libero, nec maximus sem venenatis sit amet. Proin consectetur metus nibh, at gravida enim tristique et. Duis ac eros ac est bibendum aliquam vitae ullamcorper massa. Suspendisse rutrum malesuada malesuada.
                            </p>
                            <p>
                                Mauris quam leo, pretium id lacus quis, hendrerit bibendum mi. Praesent augue tortor, mattis id purus id, ornare tristique purus. Quisque vel sapien nisl. Fusce at nisi quis neque sagittis hendrerit eu a ante. Aliquam erat volutpat. Aenean scelerisque odio sed condimentum egestas. Phasellus sed nulla ligula. Aenean blandit urna in sapien venenatis, eu aliquet ex tempus. Donec feugiat venenatis gravida. Ut et luctus lacus. Nullam nec diam vel libero mattis posuere. Cras id auctor augue. Vivamus eu dictum augue. Cras varius tortor nec aliquet tristique.
                            </p>
                            <p>
                                Phasellus at velit fringilla, convallis mi ut, mollis massa. Nulla laoreet pharetra erat, sit amet bibendum tortor blandit dictum. Integer nulla nulla, mattis eu rutrum nec, placerat ultrices nunc. Morbi accumsan elit justo, in pretium lectus tempus sit amet. Curabitur posuere neque sem. Etiam semper accumsan nisi vitae finibus. Vestibulum eu ultricies augue. Aliquam tempus tincidunt mi.
                            </p>
                            <p>
                                Vestibulum vestibulum vehicula dignissim. Sed sagittis magna vehicula, commodo est sit amet, feugiat eros. Interdum et malesuada fames ac ante ipsum primis in faucibus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus ut volutpat arcu. Praesent quis lacus ac nisi finibus porta eu ac dolor. Aenean volutpat libero quis mauris ultricies eleifend. Donec ornare urna nibh, at luctus risus ultricies nec. Nulla sit amet nibh orci. Ut convallis erat eget erat facilisis, rutrum bibendum tortor vestibulum. Mauris libero lectus, ullamcorper et orci quis, posuere bibendum felis. Mauris euismod luctus ex, eu blandit felis convallis quis.
                            </p>
                        </div>
                    </section>
                </div>

                <div className={styles.projetComposants}>
                    <section className={styles.compoNess}>
                        <h3>Composants nécessaires :</h3>
                        <div className={styles.composantsList}>
                            {composantsDisponibles.map(composant => (
                                <div 
                                    key={composant.id} 
                                    className={styles.composantItem}
                                    onClick={() => ajouterComposantSelection(composant)}
                                >
                                    <span className={styles.composantIcon}></span>
                                    <span>{composant.nom}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section className={styles.compoPoss}>
                        <h3>Composants possedé :</h3>
                        <div className={styles.composantsList}>
                            {composantsSelectionnes.length === 0 ? (
                                <p className={styles.emptyMessage}>Aucun composant sélectionné</p>
                            ) : (
                                composantsSelectionnes.map(composant => (
                                    <div 
                                        key={composant.id} 
                                        className={styles.composantItemSelected}
                                        onClick={() => retirerComposantSelection(composant)}
                                    >
                                        <span className={styles.composantIcon}></span>
                                        <span>{composant.nom}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default Projet