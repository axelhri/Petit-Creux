import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Import du contexte
import styles from "../CSS/login.module.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { email, password } = formData;
  const { setIsAuthenticated } = useContext(AuthContext); // Accéder au setter de l'authentification
  const navigate = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        formData
      );
      console.log("Login successful", res.data);

      // Récupérer le token et l'ID de l'utilisateur
      const { token, user } = res.data;

      // Stocker le token et l'ID utilisateur dans le localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.userId); // Stocker l'ID de l'utilisateur

      setIsAuthenticated(true); // Mettre à jour l'état d'authentification

      navigate("/"); // Rediriger vers la page d'accueil ou une autre page
    } catch (error) {
      console.error("Login error", error.response.data);
    }
  };

  useEffect(() => {
    document.body.className = styles.backgroundHome;

    return () => {
      document.body.className = "";
    };
  }, []);

  return (
    <main id={styles.loginMain}>
      <form onSubmit={onSubmit} id={styles.form}>
        <h1 className={styles.formTitle}>Se connecter</h1>
        <div className={styles.inputContainer}>
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
              placeholder="Password"
              required
            />
            <i className="fa-solid fa-lock"></i>
          </div>
        </div>

        <button type="submit" className={styles.submitBtn}>
          connexion
        </button>
        <span className={styles.formAlt}>
          Vous n'avez pas de compte ? <a href="/register">Créer un compte</a>
        </span>
      </form>
    </main>
  );
};

export default Login;
