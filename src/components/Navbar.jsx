import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav id="navbar">

      <span className="logo-container">
      <i class="fa-solid fa-utensils"></i>
      <p className="logo-title">Petit Creux</p>
      </span>

      <ul className="navlink-list">
        <li>
          <NavLink to="/">Créer un article</NavLink>
        </li>
        <li>
          <NavLink to="/about">Parcourir</NavLink>
        </li>
        <li>
          <NavLink to="/newsletter">Nos ustensiles</NavLink>
        </li>
        <li>
          <NavLink to="/newsletter">Nous contacter</NavLink>
        </li>
      </ul>

      <a href="/signin" className="signin-button">Connexion</a>
    </nav>
  );
}
export default Navbar;
