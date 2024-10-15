import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateRecipe = () => {
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    ingredients: [{ name: "", quantity: 0, unit: "g" }],
  });
  const [error, setError] = useState("");

  // Gérer les changements dans les champs du formulaire
  const handleChange = (e) => {
    setRecipe({
      ...recipe,
      [e.target.name]: e.target.value,
    });
  };

  // Gérer les changements pour les ingrédients
  const handleIngredientChange = (index, e) => {
    const ingredients = [...recipe.ingredients];
    ingredients[index][e.target.name] = e.target.value;
    setRecipe({ ...recipe, ingredients });
  };

  // Ajouter un nouvel ingrédient
  const addIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [
        ...recipe.ingredients,
        { name: "", quantity: 0, unit: "g" },
      ],
    });
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Utilisateur non authentifié. Veuillez vous connecter.");
        return;
      }

      // Afficher les données pour vérification
      console.log("Données envoyées :", recipe);

      const response = await axios.post(
        "http://localhost:5000/api/v1/recipes",
        recipe,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Réponse serveur :", response);

      if (response.status === 201) {
        navigate("/recipes"); // Redirige vers la page des recettes après succès
      } else {
        setError("Erreur lors de la création de la recette.");
      }
    } catch (err) {
      console.error("Erreur de soumission :", err);
      setError("Erreur lors de la création de la recette. Veuillez réessayer.");
    }
  };

  return (
    <div className="create-recipe">
      <h1>Créer une recette</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Titre de la recette</label>
          <input
            type="text"
            name="title"
            value={recipe.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={recipe.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <h3>Ingrédients</h3>
          {recipe.ingredients.map((ingredient, index) => (
            <div key={index}>
              <label>Nom de l'ingrédient</label>
              <input
                type="text"
                name="name"
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(index, e)}
                required
              />
              <label>Quantité</label>
              <input
                type="number"
                name="quantity"
                value={ingredient.quantity}
                onChange={(e) => handleIngredientChange(index, e)}
                required
              />
              <label>Unité</label>
              <select
                name="unit"
                value={ingredient.unit}
                onChange={(e) => handleIngredientChange(index, e)}
                required
              >
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="ml">ml</option>
                <option value="l">l</option>
                <option value="tbsp">tbsp</option>
                <option value="tsp">tsp</option>
                <option value="cup">cup</option>
              </select>
            </div>
          ))}
          <button type="button" onClick={addIngredient}>
            Ajouter un ingrédient
          </button>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Créer la recette</button>
      </form>
    </div>
  );
};

export default CreateRecipe;
