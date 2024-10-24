import { NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Import du contexte
import axios from "axios"; // Import Axios
import styles from "../CSS/Navbar.module.css";

function Navbar() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext); // Utilisation du contexte
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [profileImage, setProfileImage] = useState(null); // State for storing profile image
  const [userId, setUserId] = useState(null); // State for user ID
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get the current route

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
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

    window.addEventListener("resize", handleResize);

    if (isAuthenticated) {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const storedUserId = decodedToken.userId;
        setUserId(storedUserId);
        fetchUserProfile(storedUserId);
      }
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    // Add or remove no-scroll class on body when menu is opened/closed
    if (isOpen) {
      document.body.classList.add(styles.noScroll);
    } else {
      document.body.classList.remove(styles.noScroll);
    }

    return () => {
      // Clean up when the component unmounts
      document.body.classList.remove(styles.noScroll);
    };
  }, [isOpen]);

  const handleCreateArticleClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate("/share"); // Si l'utilisateur est connecté, redirige vers la page de création d'article
    } else {
      navigate("/login"); // Sinon, redirige vers la page de connexion
    }
  };

  // Determine the background color of the logo based on the current page
  const logoBackgroundColor =
    location.pathname === "/"
      ? "var(--clr-primary-500)"
      : location.pathname === "/share"
      ? "orange"
      : "var(--clr-secondary-500)";
  return (
    <nav id={styles.navbar}>
      <div
        className={`${styles.navContainer} ${
          isOpen ? styles.active : styles.notActive
        }`}
      >
        <div className={styles.logoContainer}>
          <img
            src={logo}
            alt="logo"
            className={`${styles.logo} 
             
             ${isOpen ? styles.active : styles.notActive}`}
            style={{ backgroundColor: logoBackgroundColor }} // Dynamically set background color
          />
          <a
            href="/"
            className={`${styles.logoTitle} ${
              isOpen ? styles.active : styles.notActive
            }`}
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
                <a href="#" onClick={handleCreateArticleClick}>
                  Créer un article
                </a>
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
                <button onClick={handleLogout} className={styles.signout}>
                  <i className="fa-solid fa-power-off"></i>
                </button>
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
              }`}
            ></div>
            <div
              className={`${styles.burgerBar} ${styles.middleBar} ${
                isOpen ? styles.open : ""
              }`}
            ></div>
            <div
              className={`${styles.burgerBar} ${styles.bottomBar} ${
                isOpen ? styles.open : ""
              }`}
            ></div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
