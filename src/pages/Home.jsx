import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../CSS/Home.module.css";
import { AuthContext } from "../context/AuthContext"; // Import du contexte

function Home() {
  const { isAuthenticated } = useContext(AuthContext); // Utilisation du contexte
  const navigate = useNavigate(); // Utilisation de useNavigate pour la redirection

  useEffect(() => {
    document.body.className = styles.backgroundHome;

    return () => {
      document.body.className = "";
    };
  }, []);

  const handleGetStartedClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate("/share"); // Si l'utilisateur est connecté, redirige vers la page de création d'article
    } else {
      navigate("/login"); // Sinon, redirige vers la page de connexion
    }
  };

  return (
    <>
      <header id={styles.header}>
        <div className={styles.headerContainer}>
          <h1 className={styles.headerTitle}>
            Partagez vos recettes au monde entier !
          </h1>
          <div className={styles.headerBtnContainer}>
            <a
              href="#"
              onClick={handleGetStartedClick}
              className={styles.getStartedBtn}
            >
              Je commence<i className="fa-solid fa-arrow-right"></i>
              <div className={styles.btnBgw}></div>
              <div className={styles.btnBg}></div>
            </a>
          </div>
        </div>
        <div className={styles.arrowContainer}>
          <a href="#homeMain">
            défilez vers le bas
            <i className="fa-solid fa-chevron-down"></i>
          </a>
        </div>
      </header>
      <main id="homeMain">
        <section id="create-article-section">
          <div className="create-article-container">
            <h2>TITRE</h2>
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;
