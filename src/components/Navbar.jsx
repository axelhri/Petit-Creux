import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  // State pour suivre si le menu est ouvert ou fermé
  const [isOpen, setIsOpen] = useState(false);

  // Fonction pour basculer le menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={`navbar ${isOpen ? "active" : ""}`}>
      <span className="logo-container">
        <img
          src={logo}
          className={`logo ${isOpen ? "active" : "not-active"}`}
          alt="Petit Creux's Logo"
        />
        <p className={`logo-title ${isOpen ? "active" : "not-active"}`}>
          Petit Creux
        </p>
      </span>

      <div className={`navlink-list ${isOpen ? "active" : "not-active"}`}>
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

      <div className="burger-container" onClick={toggleMenu}>
        <button className="burger-btn">
          {isOpen ? (
            <FaTimes className="fa-times" />
          ) : (
            <FaBars className="fa-bars" />
          )}
        </button>
      </div>
    </nav>
  );
}
export default Navbar;
