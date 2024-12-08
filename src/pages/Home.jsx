import { useEffect, useContext, useRef, useState } from "react";
import styles from "../CSS/Home.module.css";
import { AuthContext } from "../context/AuthContext"; // Import du contexte
import HomeShare from "./HomeModules/HomeShare";
import HomeBrowse from "./HomeModules/HomeBrowse";
import HomeContact from "./HomeModules/HomeContact";
import LoginForm from "./Login";

function Home() {
  const { isAuthenticated } = useContext(AuthContext); // Utilisation du contexte
  const recipeSectionRef = useRef(null);
  const [isLoginVisible, setIsLoginVisible] = useState(false);

  useEffect(() => {
    document.body.className = styles.backgroundHome;

    return () => {
      document.body.className = "";
    };
  }, []);

  const handleGetStartedClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      const topOffset =
        recipeSectionRef.current.getBoundingClientRect().top +
        window.scrollY -
        50;
      window.scrollTo(0, topOffset);
    } else {
      setIsLoginVisible((prev) => !prev);
    }
  };

  useEffect(() => {
    if (isLoginVisible) {
      document.body.classList.add(styles.noScroll);
    } else {
      document.body.classList.remove(styles.noScroll);
    }

    return () => {
      document.body.classList.remove(styles.noScroll);
    };
  }, [isLoginVisible]);

  return (
    <>
      {isLoginVisible && <LoginForm onClose={handleGetStartedClick} />}
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
        <div id="shareSectionRef" ref={recipeSectionRef}>
          <HomeShare />
        </div>
        <HomeBrowse />
        <div id="contactSectionRef">
          <HomeContact />
        </div>
      </main>
    </>
  );
}

export default Home;
