import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../CSS/Browse.module.css";
import img1 from "../images/browseimg1.jpg";
import img2 from "../images/browseimg2.jpg";

const recipesUrl = "http://localhost:5000/api/v1/recipes/all";
const userUrl = "http://localhost:5000/api/v1/auth/";

function Browse() {
  const [allRecipes, setAllRecipes] = useState([]); // State for storing recipes
  const [filteredRecipes, setFilteredRecipes] = useState([]); // State for filtered recipes
  const [categories, setCategories] = useState([]); // State for available categories
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error messages
  const [searchTerm, setSearchTerm] = useState(""); // State for search bar input
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
  const [userProfiles, setUserProfiles] = useState({}); // Store creator profiles

  const fetchAllRecipes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(recipesUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const recipes = response.data.recipes;
      setAllRecipes(recipes);
      setFilteredRecipes(recipes); // Initialize filtered recipes with all recipes

      // Extract unique categories
      const uniqueCategories = [
        ...new Set(recipes.flatMap((recipe) => recipe.categories || [])),
      ];
      setCategories(uniqueCategories);

      // Fetch user profiles for the creators
      const userIds = [...new Set(recipes.map((recipe) => recipe.createdBy))];
      const userResponses = await Promise.all(
        userIds.map(
          (id) =>
            axios
              .get(`${userUrl}${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .catch((err) => null) // Ignore errors for unavailable users
        )
      );
      const profiles = userResponses.reduce((acc, res) => {
        if (res && res.data) {
          acc[res.data.user._id] = res.data.user; // Map user ID to user data
        }
        return acc;
      }, {});
      setUserProfiles(profiles);

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

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    filterRecipes(e.target.value, selectedCategory);
  };

  // Handle category selection change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    filterRecipes(searchTerm, e.target.value);
  };

  // Function to filter recipes based on search term and category
  const filterRecipes = (term, category) => {
    const filtered = allRecipes.filter((recipe) => {
      const matchesSearch = recipe.title
        .toLowerCase()
        .includes(term.toLowerCase());
      const matchesCategory = category
        ? recipe.categories && recipe.categories.includes(category)
        : true;
      return matchesSearch && matchesCategory;
    });
    setFilteredRecipes(filtered);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    filterRecipes(e.target.value, selectedCategory);
  };

  // Handle category selection change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    filterRecipes(searchTerm, e.target.value);
  };

  // Function to filter recipes based on search term and category
  const filterRecipes = (term, category) => {
    const filtered = allRecipes.filter((recipe) => {
      const matchesSearch = recipe.title
        .toLowerCase()
        .includes(term.toLowerCase());
      const matchesCategory = category
        ? recipe.categories && recipe.categories.includes(category)
        : true;
      return matchesSearch && matchesCategory;
    });
    setFilteredRecipes(filtered);
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
      {/* Search and Filter Section */}
      <section className={styles.filterSection}>
        <img src={img1} alt="" className={styles.browseImg1} />
        <div className={styles.skew}>
          <div className={styles.searchBox}>
            <h1>Parcourir les recettes</h1>
            <div className={styles.searchBar}>
              <input
                type="text"
                placeholder="Rechercher une recette..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <i class="fa-solid fa-magnifying-glass"></i>
            </div>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className={styles.categoryFilter}
            >
              <option value="">Toutes les catégories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        <img src={img2} alt="" className={styles.browseImg2} />
      </section>

      {/* Recipes Section */}
      <section className={styles.recipesSection}>
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <a href={`/recipes/${recipe._id}`} key={recipe._id}>
              <article
                className={styles.recipeCard}
                style={{ backgroundImage: `url(${recipe.imageUrl})` }}
              >
                <div className={styles.overlay}>
                  <span className={styles.cardTitle}>{recipe.title}</span>
                  <p className={styles.cardCategory}>
                    {Array.isArray(recipe.categories)
                      ? recipe.categories.join(", ")
                      : recipe.categories || "Aucune catégorie"}
                  </p>
                  <p className={styles.cardDescription}>{recipe.description}</p>
                  {userProfiles[recipe.createdBy] ? (
                    <div className={styles.cardUserContainer}>
                      <img
                        src={userProfiles[recipe.createdBy].imageUrl}
                        alt=""
                      />
                      <p className={styles.cardCreator}>
                        {userProfiles[recipe.createdBy].name}
                      </p>
                    </div>
                  ) : (
                    <p className={styles.cardCreator}>Auteur inconnu</p>
                  )}
                </div>
              </article>
            </a>
          ))
        ) : (
          <p>Aucune recette trouvée.</p>
        )}
      </section>
    </main>
  );
}

export default Browse;
