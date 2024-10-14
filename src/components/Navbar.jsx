import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Import du contexte
import axios from "axios"; // Import Axios
import styles from "../CSS/Navbar.module.css";

function Navbar() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext); // Utilisation du contexte
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [profileImage, setProfileImage] = useState(null); // State for storing profile image
  const [userId, setUserId] = useState(null); // State for user ID
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false); // Mise à jour de l'état d'authentification
    navigate("/login"); // Redirection vers la page de connexion après déconnexion
  };

  // Fetch the user profile data including the profile image
  const fetchUserProfile = async (id) => {
    try {
      const token = localStorage.getItem("token"); // Assume token is stored in localStorage
      if (token) {
        const response = await axios.get(
          `http://localhost:5000/api/v1/auth/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Assuming the image URL is located in response.data.user.imageUrl
        setProfileImage(response.data.user.imageUrl);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    const handleScroll = () => setScrolled(window.scrollY > 1);

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    if (isAuthenticated) {
      // Supposons que le token JWT soit stocké dans localStorage ou sessionStorage
      const token = localStorage.getItem("token"); // ou sessionStorage
      if (token) {
        // Décoder le JWT pour obtenir l'ID utilisateur
        const decodedToken = JSON.parse(atob(token.split(".")[1])); // Attention : ceci est une méthode simplifiée
        const storedUserId = decodedToken.userId; // Remplacez 'userId' par le bon nom de champ de l'ID dans votre JWT
        setUserId(storedUserId);
        fetchUserProfile(storedUserId);
      }
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isAuthenticated]);

  return (
    <nav id={styles.navbar}>
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
            {isAuthenticated ? (
              <>
                <div className={styles.profileSection}>
                  <a href="/profile" className={styles.showProfile}>
                    Mes recettes{" "}
                    {profileImage && (
                      <img
                        src={profileImage}
                        alt="profile"
                        className={styles.profileImage}
                      />
                    )}
                  </a>
                </div>
                {/* <button onClick={handleLogout} className={styles.signout}>
                  Déconnexion
                </button> */}
              </>
            ) : (
              <>
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
          <div
            className={styles.burgerContainer}
            onClick={() => setIsOpen((prev) => !prev)}
          >
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
