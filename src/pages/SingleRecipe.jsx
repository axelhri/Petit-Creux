import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

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
        quantity: (ingredient.quantity * eaters) / recipeData.recipe.eaters, // Adjust quantity
      }))
    : [];

  const formatQuantity = (quantity) => {
    return Number.isInteger(quantity)
      ? quantity.toString()
      : quantity.toFixed(2).replace(/\.?0+$/, ""); // Remove trailing zeros and decimal point if necessary
  };

  return (
    <main>
      {recipeData ? (
        <>
          <div>
            {userData ? (
              <div>
                <img
                  src={userData.user.imageUrl}
                  alt={`${recipeData.recipe.createdBy.name}'s profile`}
                  style={{ width: "50px", borderRadius: "50%" }} // Adjust size and make it circular
                />
                <p>{userData.user.name}</p>
              </div>
            ) : (
              <p>Utilisateur introuvable</p>
            )}
            <span>{recipeData.recipe.createdBy.name}</span>
          </div>
          <h1>{recipeData.recipe.title}</h1>
          {recipeData.recipe.imageUrl && (
            <img
              src={recipeData.recipe.imageUrl}
              alt={recipeData.recipe.title}
            />
          )}
          <p>{recipeData.recipe.description}</p>
          <div>
            <p>Nombre de mangeurs : {eaters}</p>
            <button onClick={handleDecreaseEaters}>-</button>
            <button onClick={handleIncreaseEaters}>+</button>
          </div>
          <h2>Ingrédients :</h2>
          {adjustedIngredients.length > 0 ? (
            <ul>
              {adjustedIngredients.map((ingredient, index) => (
                <li key={index}>
                  {formatQuantity(ingredient.quantity)} {ingredient.unit}{" "}
                  {ingredient.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun ingrédient trouvé.</p>
          )}
        </>
      ) : (
        <p>Recette introuvable.</p>
      )}
    </main>
  );
}

export default SingleRecipe;
