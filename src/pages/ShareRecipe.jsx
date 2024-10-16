import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateRecipeForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: 0, unit: "grammes" },
  ]);
  const navigate = useNavigate();

  const ingredientUnits = [
    "grammes",
    "litres",
    "cuillères à soupe",
    "kilogrammes",
    "milligrammes",
    "millilitres",
    "cuillères à café",
    "tasse",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const recipeData = {
      title,
      description,
      ingredients,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/recipes",
        recipeData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Recette créée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la création de la recette :", error);
      alert("Erreur lors de la création de la recette. Veuillez réessayer.");
    }
  };

  // Ajouter un nouvel ingrédient
  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { name: "", quantity: 0, unit: "grammes" },
    ]);
  };

  // Mettre à jour les champs d'ingrédients
  const updateIngredient = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Titre de la recette :</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={50}
        />
      </div>

      <div>
        <label>Description :</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          maxLength={100}
        />
      </div>

      <div>
        <label>Ingrédients :</label>
        {ingredients.map((ingredient, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Nom de l'ingrédient"
              value={ingredient.name}
              onChange={(e) => updateIngredient(index, "name", e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Quantité"
              value={ingredient.quantity}
              onChange={(e) =>
                updateIngredient(index, "quantity", Number(e.target.value))
              }
              required
            />
            <select
              value={ingredient.unit}
              onChange={(e) => updateIngredient(index, "unit", e.target.value)}
              required
            >
              {ingredientUnits.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        ))}

        <button type="button" onClick={addIngredient}>
          Ajouter un ingrédient
        </button>
      </div>

      <button type="submit">Créer la recette</button>
    </form>
  );
};

export default CreateRecipeForm;
