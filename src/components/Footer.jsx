import { useLocation, useNavigate, Link } from "react-router-dom";
import styles from "../CSS/Footer.module.css";
import logo from "../assets/logo.png";

function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  // scroll to section

  const handleSectionLink = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId } });
    } else {
      document.getElementById(sectionId)?.scrollIntoView();
    }
  };

  return (
    <footer id={styles.footer}>
      <div className={styles.footerLogoContainer}>
        <img src={logo} alt="logo" className={`${styles.logo}`} />
        <Link to="/" className={`${styles.logoTitle}`}>
          Petit Creux
        </Link>
      </div>
      <div className={styles.footerLinks}>
        <ul>
          <li>
            <Link to="/">Accueil</Link>
          </li>
          <li>
            <Link
              to=""
              onClick={() => handleSectionLink("shareSectionRef")}
              style={{ cursor: "pointer" }}
            >
              Partager
            </Link>
          </li>
          <li>
            <Link href="/browse">Parcourir</Link>
          </li>
          <li>
            <Link
              to=""
              onClick={() => handleSectionLink("contactSectionRef")}
              style={{ cursor: "pointer" }}
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>

      <div className={styles.footerSocials}>
        <ul>
          <li>
            <a href="https://x.com/" target="blank">
              <i className="fa-brands fa-x-twitter"></i>
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/" target="blank">
              <i className="fa-brands fa-instagram"></i>
            </a>
          </li>
          <li>
            <a href="https://www.facebook.com/" target="blank">
              <i className="fa-brands fa-facebook"></i>
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
