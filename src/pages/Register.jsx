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
      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/register",
        formData
      );
      console.log("User registered", res.data);
      // Redirection ou autre traitement après succès
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
        <h1 className={styles.formTitle}>Se connecter</h1>
        <div className={styles.inputContainer}>
          <div className={styles.inputBox}>
            <input
              type="text"
              name="name"
              value={name}
              className={styles.formInput}
              onChange={onChange}
              placeholder="Name"
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
          Vous n'avez pas de compte ? <a href="">Créer un compte</a>
        </span>
      </form>
    </main>
  );
};

export default Register;
