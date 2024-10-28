import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../CSS/Browse.module.css"; // Specific CSS for the Browse page

// URL to access all recipes
const recipesUrl = "http://localhost:5000/api/v1/recipes/all";

function Browse() {
  const [allRecipes, setAllRecipes] = useState([]); // State for storing recipes
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error messages

  // Function to fetch all recipes
  const fetchAllRecipes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(recipesUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.recipes); // Log the recipes data for debugging
      setAllRecipes(response.data.recipes); // Ensure the response path is correct
      setLoading(false);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des recettes :",
        error.response ? error.response.data : error.message
      );
      if (error.response && error.response.status === 401) {
        setError("Vous devez être connecté pour accéder à cette ressource.");
      } else {
        setError("Erreur lors de la récupération des recettes.");
      }
      setLoading(false);
    }
  };

  // Fetch recipes when the component mounts
  useEffect(() => {
    fetchAllRecipes();
  }, []);

  // Render loading state
  if (loading) {
    return <div>Chargement...</div>;
  }

  // Render error state
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <main id={styles.browseMain}>
      <h1>Parcourir les recettes</h1>
      <section>
        {allRecipes.length > 0 ? (
          allRecipes.map((recipe) => (
            <article key={recipe._id}>
              <a href={`/recipes/${recipe._id}`}>
                <div>
                  <img src={recipe.imageUrl} alt={recipe.title} />
                </div>
                <div>
                  <span>{recipe.title}</span>
                  <p>
                    {Array.isArray(recipe.categories)
                      ? recipe.categories.join(", ")
                      : recipe.categories || "Aucune catégorie"}
                  </p>
                  <p>{recipe.description}</p>
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

export default Browse;
