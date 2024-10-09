import { NavLink } from "react-router-dom";
import styles from "../CSS/Footer.module.css";

function Footer() {
  return (
    <footer>
      <div className={styles.footerContainer}>
        <div className={styles.socialIcons}>
          <a href="">
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a href="">
            <i className="fa-brands fa-twitter"></i>
          </a>
        </div>
        <div className={styles.footerNav}>
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
      </div>
      <div className={styles.footerBottom}>
        <p>
          Copyright &copy;2024, Designed by
          <span className={styles.designer}> Axel</span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
