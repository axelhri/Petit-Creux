import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "../CSS/SingleRecipe.module.css";

const singleRecipesUrl = "http://localhost:5000/api/v1/recipes/";
const userUrl = "http://localhost:5000/api/v1/auth/";

function SingleRecipe() {
  const { id } = useParams(); // Get the id from the route parameters
  const [recipeData, setRecipeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [eaters, setEaters] = useState(0); // Initialize to 0 and set it later

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        // Fetch Recipe
        const recipeResponse = await axios.get(`${singleRecipesUrl}${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRecipeData(recipeResponse.data);
        setEaters(recipeResponse.data.recipe.eaters); // Set initial eaters from recipe data

        // Fetch User Profile
        const userResponse = await axios.get(
          `${userUrl}${recipeResponse.data.recipe.createdBy}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(userResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response) {
          console.error("Server responded with:", error.response.status);
          console.error("Response data:", error.response.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleIncreaseEaters = () => {
    setEaters((prevEaters) => prevEaters + 1);
  };

  const handleDecreaseEaters = () => {
    setEaters((prevEaters) => Math.max(prevEaters - 1, 1)); // Minimum of 1 eater
  };

  if (loading) return <p>Loading...</p>;

  // Calculate adjusted ingredients
  const adjustedIngredients = recipeData
    ? recipeData.recipe.ingredients.map((ingredient) => ({
        ...ingredient,
        quantity: Math.round(
          (ingredient.quantity * eaters) / recipeData.recipe.eaters
        ), // Arrondir la quantité
      }))
    : [];

  const formatQuantity = (quantity) => {
    return Number.isInteger(quantity)
      ? quantity.toString()
      : quantity.toFixed(2).replace(/\.?0+$/, ""); // Remove trailing zeros and decimal point if necessary
  };

  return (
    <>
      {recipeData ? (
        <main id={styles.singleRecipeMain}>
          <header>
            <div className={styles.userCategoryBox}>
              {userData ? (
                <div className={styles.userImgBox}>
                  <img
                    src={userData.user.imageUrl}
                    alt={`${recipeData.recipe.createdBy.name}'s profile`}
                  />
                  <p>{userData.user.name}</p>
                </div>
              ) : (
                <p>Utilisateur introuvable</p>
              )}
              <p>Catégorie : {recipeData.recipe.categories}</p>
            </div>
          </header>
          <div id={styles.singleRecipeContainer}>
            <section className={styles.singleRecipeTopSection}>
              <div className={styles.imgDescBox}>
                <div className={styles.imgDateBox}>
                  {recipeData.recipe.imageUrl && (
                    <img
                      src={recipeData.recipe.imageUrl}
                      alt={recipeData.recipe.title}
                    />
                  )}
                  <div className={styles.createdAtRecipe}>
                    <p>créer le</p>{" "}
                    <span>
                      {new Date(recipeData.recipe.createdAt).toLocaleDateString(
                        "fr-FR"
                      )}
                    </span>
                  </div>
                </div>
                <div className={styles.titleDescBox}>
                  <h1>{recipeData.recipe.title}</h1>
                  <p>{recipeData.recipe.description}</p>
                </div>
              </div>
            </section>
            <div className={styles.singleRecipeIng}>
              <p>
                <i className="fa-solid fa-plate-wheat"></i> ingredients
              </p>
              <div className={styles.sectionLine}></div>
            </div>
            <section className={styles.singleRecipeBottomSection}>
              <div className={styles.eatersBox}>
                <button onClick={handleDecreaseEaters}>-</button>
                <div className={styles.persNumber}>
                  <p>{eaters}</p>
                  <span>{eaters > 1 ? "personnes" : "personne"}</span>{" "}
                </div>
                <button onClick={handleIncreaseEaters}>+</button>
              </div>
              {adjustedIngredients.length > 0 ? (
                <div className={styles.ingredientList}>
                  {adjustedIngredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className={styles.recipeIngredientContainer}
                    >
                      <p>{ingredient.name}</p>
                      <span>
                        {formatQuantity(ingredient.quantity)} {ingredient.unit}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Aucun ingrédient trouvé.</p>
              )}
            </section>
          </div>
        </main>
      ) : (
        <p>Recette introuvable.</p>
      )}
    </>
  );
}

export default SingleRecipe;
