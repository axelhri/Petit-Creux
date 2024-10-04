import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import React, { useState, useEffect } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

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

  return (
    <nav
      id="navbar"
      className={`navbar ${isOpen ? "active" : "not-active"} ${
        scrolled ? "scrolled" : ""
      }`}
    >
      <span className="logo-container">
        <img
          src={logo}
          className={`logo ${isOpen ? "active" : "not-active"} ${
            scrolled ? "scrolled" : ""
          }`}
          alt="Petit Creux's Logo"
        />
        <p
          className={`logo-title ${isOpen ? "active" : "not-active"} ${
            scrolled ? "scrolled" : ""
          }`}
        >
          Petit Creux
        </p>
      </span>

      <div className={`navlink-container ${isOpen ? "active" : "not-active"}`}>
        <div className="navlink-content">
          <ul>
            <li>
              <NavLink to="/">Créer un article</NavLink>
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
          <div className="navlink-btn-container">
            <a href="" className="login">
              Se connecter
            </a>
            <a href="" className="signin">
              Créer un compte
            </a>
          </div>
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
    </nav>
  );
}

export default Navbar;
