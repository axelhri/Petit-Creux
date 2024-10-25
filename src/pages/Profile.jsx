import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import styles from "../CSS/Profile.module.css"; // Assurez-vous de créer un fichier CSS spécifique pour cette page
import chef from "../images/icons8-chef-96.png";

const recipesUrl = "http://localhost:5000/api/v1/recipes/"; // URL de l'API des recettes

function Profile() {
  const { isAuthenticated } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]); // Pour stocker les recettes de l'utilisateur
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer l'ID de l'utilisateur depuis le token
  const fetchUserProfileAndRecipes = async () => {
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

        // Récupérer les recettes de l'utilisateur
        const recipesResponse = await axios.get(
          `${recipesUrl}?createdBy=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserRecipes(recipesResponse.data.recipes); // Assurez-vous que le backend retourne les recettes sous `recipes`
        setLoading(false);
      }
    } catch (error) {
      setError(
        "Erreur lors de la récupération des informations utilisateur ou des recettes."
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfileAndRecipes();
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
          <i className="fa-solid fa-gear"></i>{" "}
          <div className={styles.profileDesc}>
            <img
              src={userData.imageUrl}
              alt="Profile"
              className={styles.profileImage}
            />
          </div>
        </div>
      </section>
      <div className={styles.userNameBox}>
        <h1 className={styles.username}>{userData.name}</h1>
        <h2 className={styles.sharedRecipesTitle}>
          Recettes partagées par {userData.name} :
        </h2>
      </div>
      <section className={styles.profileBottomSection}>
        {userRecipes.length > 0 ? (
          userRecipes.map((recipe) => (
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
        ) : (
          <p>Aucune recette trouvée.</p>
        )}
      </section>
    </main>
  );
}

export default Profile;
