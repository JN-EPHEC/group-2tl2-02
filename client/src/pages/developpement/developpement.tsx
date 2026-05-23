import { useNavigate } from "react-router-dom";
import style from "./developpement.module.css";

function Developpement() {
  const navigate = useNavigate();

  return (
    <div className={style.page}>
      <div className={style.card}>
        <h1 className={style.title}>Page en développement</h1>
        <p className={style.text}>
          Cette page est actuellement en cours de développement. Revenez bientôt pour
          découvrir son contenu !
        </p>
        <button className={style.btn} onClick={() => navigate("/")}>
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}

export default Developpement;
