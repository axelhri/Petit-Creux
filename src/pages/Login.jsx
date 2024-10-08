import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import de useNavigate
import styles from "../CSS/login.module.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { email, password } = formData;

  const navigate = useNavigate(); // Initialisation de useNavigate

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Mise à jour de l'URL vers ton endpoint sur Postman
      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        formData
      );
      console.log("Login successful", res.data);

      // Stocker le token JWT dans le localStorage
      localStorage.setItem("token", res.data.token);

      // Rediriger vers la page d'accueil ou une autre page après la connexion
      navigate("/"); // Par exemple, rediriger vers la page d'accueil "/"
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
        <h1 className={styles.formTitle}>Login</h1>
        <div className={styles.inputContainer}>
          <input
            type="email"
            name="email"
            value={email}
            className={styles.formInput}
            onChange={onChange}
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="password"
            value={password}
            className={styles.formInput}
            onChange={onChange}
            placeholder="Password"
            required
          />
        </div>

        <button type="submit" className={styles.submitBtn}>
          Login
        </button>
        <span className={styles.formAlt}>
          Vous n'avez pas de compte ? <a href="">Créer un compte</a>
        </span>
      </form>
    </main>
  );
};

export default Login;
