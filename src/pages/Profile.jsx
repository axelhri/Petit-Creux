import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Import useParams for fetching URL parameters
import styles from "../CSS/Profile.module.css";

const recipesUrl = "http://localhost:5000/api/v1/recipes/test/?createdBy="; // URL de l'API des recettes

function Profile() {
  const { userId } = useParams(); // Get userId from URL parameters
  const [userData, setUserData] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]); // Pour stocker les recettes de l'utilisateur
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour récupérer les données utilisateur et les recettes
  const fetchUserProfileAndRecipes = async () => {
    try {
      // Requête pour obtenir les infos de l'utilisateur
      const response = await axios.get(
        `http://localhost:5000/api/v1/auth/${userId}`
      );
      setUserData(response.data.user);

      // Requête pour obtenir les recettes partagées par l'utilisateur
      const recipesResponse = await axios.get(`${recipesUrl}${userId}`);

      // Stocker les recettes dans l'état
      setUserRecipes(recipesResponse.data.recipes);
      setLoading(false);
    } catch (error) {
      setError(
        "Erreur lors de la récupération des informations utilisateur ou des recettes."
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserProfileAndRecipes();
    } else {
      setError("Aucun utilisateur spécifié.");
      setLoading(false);
    }
  }, [userId]); // Add userId to dependency array

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <main id={styles.profileMain}>
      <section className={styles.profileTopSection}>
        <div className={styles.settings}>
          <i className="fa-solid fa-gear"></i>
          <div className={styles.profileDesc}>
            {userData && (
              <img
                src={userData.imageUrl}
                alt="Profile"
                className={styles.profileImage}
              />
            )}
          </div>
        </div>
      </section>
      <div className={styles.userNameBox}>
        <h1 className={styles.username}>
          {userData ? userData.name : "Visiteur"}
        </h1>
        <h2 className={styles.sharedRecipesTitle}>
          Recettes partagées par {userData ? userData.name : "l'utilisateur"} :
        </h2>
      </div>
      <section className={styles.profileBottomSection}>
        {userRecipes.length > 0
          ? userRecipes.map((recipe) => (
              <article key={recipe._id}>
                <a href={`/recipes/${recipe._id}`}>
                  <div className={styles.articleImgContainer}>
                    <img src={recipe.imageUrl} alt={recipe.title} />
                  </div>
                  <div className={styles.articleDesc}>
                    <div className={styles.nameCategoryBox}>
                      <span className={styles.articleRecipeName}>
                        {recipe.title}
                      </span>
                      <p>{recipe.categories}</p>
                    </div>
                    <div className={styles.recipeDesc}>
                      <p>{recipe.description}</p>
                    </div>
                    <div className={styles.articleBtnContainer}>
                      <button className={styles.articleBtn}>Voir plus</button>
                    </div>
                  </div>
                </a>
              </article>
            ))
          : null}
      </section>
      {userRecipes.length === 0 && (
        <div className={styles.noRecipesBox}>
          <p>Vous n'avez pas encore de recette</p>
          <a href="/share">Création de recette</a>
        </div>
      )}
    </main>
  );
}

export default Profile;
