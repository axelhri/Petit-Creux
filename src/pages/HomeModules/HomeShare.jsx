import styles from "../../CSS/HomeModules/HomeShare.module.css";

import img1 from "../../images/shareImg.jpg";
import img2 from "../../images/homeShare.jpg";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../../context/AuthContext.jsx";

function HomeShare() {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  const handleGetStartedClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate("/share");
    } else {
      navigate("/login");
    }
  };

  return (
    <section id={styles.homeShare}>
      <h2>
        <span>Partager</span> vos recettes
      </h2>
      <div className={styles.homeShareFlex}>
        <div className={styles.homeShareText}>
          <span>Vos recettes, votre inspiration</span>
          <p>
            Partagez vos créations culinaires et inspirez notre communauté de
            passionnés de cuisine. Chaque recette a une histoire, et la vôtre
            pourrait devenir la préférée de quelqu'un !
          </p>
          <a href="/share" onClick={handleGetStartedClick}>
            Partager une recette
          </a>
        </div>
        <div className={styles.homeShareImage}>
          <img src={img1} alt="" />
          <img src={img2} alt="" />
        </div>
      </div>
    </section>
  );
}

export default HomeShare;
