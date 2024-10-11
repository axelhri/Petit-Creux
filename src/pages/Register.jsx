import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../CSS/login.module.css";
import { useNavigate } from "react-router-dom";
import defaultImg from "../images/user.png";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [image, setImage] = useState(null); // État pour l'image sélectionnée
  const [previewImage, setPreviewImage] = useState(defaultImg); // Pour prévisualiser l'image

  const navigate = useNavigate();
  const { name, email, password } = formData;

  // Gérer le changement des valeurs du texte
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Gérer le changement de l'image sélectionnée
  const onImageChange = (e) => {
    const file = e.target.files[0]; // Récupérer l'image
    if (file) {
      setImage(file); // Enregistrer l'image dans l'état
      // Prévisualisation de l'image
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Gérer l'envoi du formulaire
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Créer un objet FormData pour inclure les fichiers
      const data = new FormData();
      data.append("name", name);
      data.append("email", email);
      data.append("password", password);
      if (image) {
        data.append("image", image); // Ajouter l'image au formData
      }

      // Envoie de la requête au backend pour enregistrer l'utilisateur avec l'image
      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/register",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important pour les fichiers
          },
        }
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
          <div className={styles.uploadImage}>
            <img
              src={previewImage} // Afficher l'image sélectionnée en tant que prévisualisation
              alt="Profil"
              className={styles.userImage}
            />
            <i className="fa-solid fa-camera"></i>
            <input
              type="file"
              name="image"
              id="image"
              accept="image/*"
              onChange={onImageChange} // Gérer la sélection de l'image
            />
          </div>
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
