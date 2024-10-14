import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import styles from "../CSS/Profile.module.css"; // Assurez-vous de créer un fichier CSS spécifique pour cette page
import test from "../images/pexels-marceloverfe-16743489.jpg";

function Profile() {
  const { isAuthenticated } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer l'ID de l'utilisateur depuis le token
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const userId = decodedToken.userId;

        // Faire une requête pour obtenir les infos de l'utilisateur
        const response = await axios.get(
          `http://localhost:5000/api/v1/auth/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data.user);
        setLoading(false);
      }
    } catch (error) {
      setError("Erreur lors de la récupération des informations utilisateur");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [isAuthenticated]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <div>Utilisateur non trouvé</div>;
  }

  return (
    <main id={styles.profileMain}>
      <section className={styles.profileTopSection}>
        <div className={styles.settings}>
          <i class="fa-solid fa-gear"></i>
        </div>
        <div className={styles.profileDesc}>
          <img
            src={userData.imageUrl}
            alt="Profile"
            className={styles.profileImage}
          />
          <h1 className={styles.username}>{userData.name}</h1>
        </div>
      </section>
      <h2 className={styles.sharedRecipesTitle}>
        Recettes partagé par {userData.name} :
      </h2>
      <section className={styles.profileBottomSection}>
        <article>
          <a href="">
            <img src={test} alt="" />
            <div className={styles.articleDesc}>
              <span className={styles.articleRecipeName}>
                Paella a l'ancienne
              </span>
              <div className={styles.articleDate}>Date de création :</div>
              <button className={styles.articleBtn}>Voir plus</button>
            </div>
          </a>
        </article>
      </section>
    </main>
  );
}

export default Profile;
