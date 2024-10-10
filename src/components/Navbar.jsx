import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import React, { useState, useEffect } from "react";
import styles from "../CSS/Navbar.module.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTouchingNavbar, setIsTouchingNavbar] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false); // Etat d'authentification
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si un token est présent dans le localStorage
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true); // L'utilisateur est connecté
    } else {
      setIsAuthenticated(false); // L'utilisateur n'est pas connecté
    }
  }, []);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleLogout = () => {
    // Supprimer le token lors de la déconnexion
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login"); // Redirection vers la page de connexion après déconnexion
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    const handleScroll = () => setScrolled(window.scrollY > 800);

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      isMobile && (isOpen || isTouchingNavbar) ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isMobile, isOpen, isTouchingNavbar]);

  const handleTouchStart = () => isMobile && setIsTouchingNavbar(true);
  const handleTouchEnd = () => isMobile && setIsTouchingNavbar(false);

  return (
    <nav
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      id={styles.navbar}
    >
      <div
        className={`${styles.navContainer} ${
          isOpen ? styles.active : styles.notActive
        } ${scrolled ? styles.scrolled : ""}`}
      >
        <div className={styles.logoContainer}>
          <img
            src={logo}
            alt="logo"
            className={`${styles.logo} ${
              isOpen ? styles.active : styles.notActive
            } ${scrolled ? styles.scrolled : ""}`}
          />

          <a
            href="/"
            className={`${styles.logoTitle} ${
              isOpen ? styles.active : styles.notActive
            } ${scrolled ? styles.scrolled : ""}`}
          >
            Petit Creux
          </a>
        </div>

        <div
          className={`${styles.linkContainer} ${
            isOpen ? styles.active : styles.notActive
          }`}
        >
          <div className={styles.navlinkContainer}>
            <ul>
              <li>
                <NavLink to="">Créer un article</NavLink>
              </li>
              <li>
                <NavLink to="">Parcourir</NavLink>
              </li>
              <li>
                <NavLink to="">Nos ustensiles</NavLink>
              </li>
              <li>
                <NavLink to="">Nous contacter</NavLink>
              </li>
            </ul>
          </div>

          <div className={styles.navBtnContainer}>
            {/* Vérification de l'authentification */}
            {isAuthenticated ? (
              <>
                {/* L'utilisateur est connecté, afficher "Voir mon profil" et "Déconnexion" */}
                <a href="/profile" className={styles.login}>
                  Voir mon profil
                </a>
                <button onClick={handleLogout} className={styles.signout}>
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                {/* L'utilisateur n'est pas connecté, afficher "Se connecter" et "Créer un compte" */}
                <a href="/login" className={styles.login}>
                  Se connecter
                </a>
                <a href="/register" className={styles.signin}>
                  Créer un compte
                </a>
              </>
            )}
          </div>
        </div>
        <div className={styles.burgerMenu}>
          <div className={styles.burgerContainer} onClick={toggleMenu}>
            <div
              className={`${styles.burgerBar} ${styles.topBar} ${
                isOpen ? styles.open : ""
              } ${scrolled ? styles.scrolled : ""}`}
            ></div>
            <div
              className={`${styles.burgerBar} ${styles.middleBar} ${
                isOpen ? styles.open : ""
              } ${scrolled ? styles.scrolled : ""}`}
            ></div>
            <div
              className={`${styles.burgerBar} ${styles.bottomBar} ${
                isOpen ? styles.open : ""
              } ${scrolled ? styles.scrolled : ""}`}
            ></div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
