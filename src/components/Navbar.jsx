import { NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import styles from "../CSS/Navbar.module.css";
import { ToastContainer } from "react-toastify";
import LoginForm from "../pages/Login";
import RegisterForm from "../pages/Register";

function Navbar() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(false); // État pour gérer le formulaire de connexion
  const [isRegisterVisible, setIsRegisterVisible] = useState(false); // État pour gérer le formulaire de connexion
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [profileImage, setProfileImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const handleLoginToggle = () => {
    setIsLoginVisible((prev) => !prev);
  };

  const handleRegisterToggle = () => {
    setIsRegisterVisible((prev) => !prev);
  };

  const fetchUserProfile = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get(
          `http://localhost:5000/api/v1/auth/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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
    if (isOpen) {
      document.body.classList.add(styles.noScroll);
    } else {
      document.body.classList.remove(styles.noScroll);
    }

    return () => {
      document.body.classList.remove(styles.noScroll);
    };
  }, [isOpen]);

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

  useEffect(() => {
    if (isRegisterVisible) {
      document.body.classList.add(styles.noScroll);
    } else {
      document.body.classList.remove(styles.noScroll);
    }

    return () => {
      document.body.classList.remove(styles.noScroll);
    };
  }, [isRegisterVisible]);

  return (
    <nav id={styles.navbar}>
      <ToastContainer position="top-center" autoClose={3000} />

      <div
        className={`${styles.navContainer} ${
          isOpen ? styles.active : styles.notActive
        }`}
      >
        <div className={styles.logoContainer}>
          <img
            src={logo}
            alt="logo"
            className={`${styles.logo} ${
              isOpen ? styles.active : styles.notActive
            }`}
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
                <a href="/">Accueil</a>
              </li>
              <li>
                <a href="#shareSectionRef">Partager</a>
              </li>
              <li>
                <a href="/browse">Parcourir</a>
              </li>
              <li>
                <a href="#contactSectionRef">Contact</a>
              </li>
            </ul>
          </div>
          <div className={styles.navBtnContainer}>
            {isAuthenticated ? (
              <>
                <div className={styles.profileSection}>
                  <a href={`/profile/${userId}`} className={styles.showProfile}>
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
                  Se déconnecter
                </button>
              </>
            ) : (
              <>
                <button onClick={handleLoginToggle} className={styles.login}>
                  Se connecter
                </button>
                <button
                  onClick={handleRegisterToggle}
                  className={styles.signin}
                >
                  Créer un compte
                </button>
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
      {isLoginVisible && <LoginForm onClose={handleLoginToggle} />}
      {isRegisterVisible && <RegisterForm onClose={handleRegisterToggle} />}
    </nav>
  );
}

export default Navbar;
