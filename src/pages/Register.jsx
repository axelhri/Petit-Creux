import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../CSS/login.module.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { name, email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Envoie de la requête au backend pour enregistrer l'utilisateur
      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/register",
        formData
      );
      console.log("User registered", res.data);

      // Si le back-end retourne un token, on peut l'utiliser ici
      const token = res.data.token;

      // Stocker le token dans le localStorage pour rester connecté
      localStorage.setItem("token", token);

      // Redirection vers la page d'accueil ou une autre page sécurisée
      navigate("/");
    } catch (err) {
      console.error(err.response.data);
    }
  };

  useEffect(() => {
    document.body.className = styles.backgroundHomeRegister;

    return () => {
      document.body.className = "";
    };
  }, []);

  return (
    <main id={styles.loginMain}>
      <form onSubmit={onSubmit} id={styles.form}>
        <h1 className={styles.formTitle}>Créer un compte</h1>
        <div className={styles.inputContainer}>
          <div className={styles.inputBox}>
            <input
              type="text"
              name="name"
              value={name}
              className={styles.formInput}
              onChange={onChange}
              placeholder="Nom"
              required
            />
            <i className="fa-regular fa-user"></i>
          </div>

          <div className={styles.inputBox}>
            <input
              type="email"
              name="email"
              value={email}
              className={styles.formInput}
              onChange={onChange}
              placeholder="Email"
              required
            />
            <i className="fa-regular fa-envelope"></i>
          </div>
          <div className={styles.inputBox}>
            <input
              type="password"
              name="password"
              value={password}
              className={styles.formInput}
              onChange={onChange}
              placeholder="Mot de passe"
              required
            />
            <i className="fa-solid fa-lock"></i>
          </div>
        </div>

        <button type="submit" className={styles.submitBtn}>
          Créer un compte
        </button>
        <span className={styles.formAlt}>
          Vous avez déjà un compte ? <a href="/login">Se connecter</a>
        </span>
      </form>
    </main>
  );
};

export default Register;
