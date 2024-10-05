import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import React, { useState, useEffect } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isTouchingNavbar, setIsTouchingNavbar] = useState(false); // New state to track touch interactions
  const [isMobile, setIsMobile] = useState(false); // State to track if the screen is mobile

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Check if the screen size is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768); // Define mobile as screen width <= 768px
    };

    checkIsMobile(); // Initial check

    // Add event listener to update when window is resized
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 900) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Disable or enable scroll based on touch interactions and screen size
  useEffect(() => {
    if (isMobile && (isOpen || isTouchingNavbar)) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = ""; // Re-enable scrolling
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, isOpen, isTouchingNavbar]);

  return (
    <nav
      onTouchStart={() => isMobile && setIsTouchingNavbar(true)} // Trigger when user touches the screen
      onTouchEnd={() => isMobile && setIsTouchingNavbar(false)} // Release scroll when touch ends
    >
      <div
        className={`nav-container ${isOpen ? "active" : "not-active"} ${
          scrolled ? "scrolled" : ""
        }`}
      >
        <div className="logo-container">
          <div>
            <img
              src={logo}
              alt=""
              className={`logo ${isOpen ? "active" : "not-active"} ${
                scrolled ? "scrolled" : ""
              }`}
            />
          </div>
          <span
            className={`logo-title ${isOpen ? "active" : "not-active"} ${
              scrolled ? "scrolled" : ""
            }`}
          >
            Petit Creux
          </span>
        </div>

        <div className={`link-container ${isOpen ? "active" : "not-active"}`}>
          <div className="navlink-container">
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

          <div className="nav-btn-container">
            <a href="" className="login">
              Se connecter
            </a>
            <a href="" className="signin">
              Créer un compte
            </a>
          </div>
        </div>

        <div className="burger-container" onClick={toggleMenu}>
          <div
            className={`burger-bar top-bar ${isOpen ? "open" : ""} ${
              scrolled ? "scrolled" : ""
            }`}
          ></div>
          <div
            className={`burger-bar middle-bar ${isOpen ? "open" : ""} ${
              scrolled ? "scrolled" : ""
            }`}
          ></div>
          <div
            className={`burger-bar bottom-bar ${isOpen ? "open" : ""} ${
              scrolled ? "scrolled" : ""
            }`}
          ></div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
