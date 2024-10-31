import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../CSS/Browse.module.css"; // Specific CSS for the Browse page
import testImg from "../images/boreal.jpg";

const recipesUrl = "http://localhost:5000/api/v1/recipes/all";

// Category constants
const CATEGORIES = {
  appetizers: "entrée",
  meal: "plat",
  dessert: "dessert",
  drink: "boisson",
  lunch: "petit-déjeuner",
};

function Browse() {
  const [allRecipes, setAllRecipes] = useState([]); // State for storing recipes
  const [filteredRecipes, setFilteredRecipes] = useState([]); // State for filtered recipes based on search
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error messages

  const fetchAllRecipes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(recipesUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllRecipes(response.data.recipes);
      setFilteredRecipes(response.data.recipes); // Initialize filtered recipes with all recipes
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

  useEffect(() => {
    fetchAllRecipes();
  }, []);

  // Update filtered recipes whenever searchTerm or selectedCategory changes
  useEffect(() => {
    let filtered = allRecipes;

    // Filter by search term
    if (searchTerm.trim() !== "") {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((recipe) =>
        recipe.title.toLowerCase().includes(lowercasedTerm)
      );
    }

    // Filter by category
    if (selectedCategory !== "") {
      filtered = filtered.filter((recipe) =>
        Array.isArray(recipe.categories)
          ? recipe.categories.includes(selectedCategory)
          : recipe.categories === selectedCategory
      );
    }

    setFilteredRecipes(filtered);
  }, [searchTerm, selectedCategory, allRecipes]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <main id={styles.browseMain}>
      <header>
        <img src={testImg} alt="" />
        <div className={styles.headerContent}>
          <h1>Browse Recipes</h1>
          {/* Search bar */}
          <input
            type="text"
            placeholder="Rechercher des recettes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchBar}
          />
          {/* Category selection dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.categorySelect}
          >
            <option value="">Toutes les catégories</option>
            {Object.entries(CATEGORIES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </header>
      <section>
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
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
