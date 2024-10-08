import { useEffect } from "react";
import styles from "../CSS/Home.module.css";

function Home() {
  useEffect(() => {
    document.body.className = styles.backgroundHome;

    return () => {
      document.body.className = "";
    };
  }, []);

  return (
    <>
      <header id={styles.header}>
        <div className={styles.headerContainer}>
          <h1 className={styles.headerTitle}>
            Partagez vos recettes au monde entier !
          </h1>
          <div className={styles.headerBtnContainer}>
            <a href="" className={styles.getStartedBtn}>
              Je commence<i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </header>
      <main id={styles.homeMain}>
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
