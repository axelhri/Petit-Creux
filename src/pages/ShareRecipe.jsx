import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../CSS/Share.module.css";
import cornerImg from "../images/form-corner.jpg";

const CreateRecipeForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eaters, setEaters] = useState(1);
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: 0, unit: "grammes" },
  ]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // New state for image preview
  const navigate = useNavigate();

  const ingredientUnits = [
    "grammes",
    "litres",
    "cuillères à soupe",
    "kilogrammes",
    "milligrammes",
    "millilitres",
    "centilitres",
    "cuillères à café",
    "tasse",
    "pincée",
    "pièce",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("eaters", eaters);
    if (image) {
      formData.append("image", image);
    }

    ingredients.forEach((ingredient, index) => {
      formData.append(`ingredients[${index}][name]`, ingredient.name);
      formData.append(`ingredients[${index}][quantity]`, ingredient.quantity);
      formData.append(`ingredients[${index}][unit]`, ingredient.unit);
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/recipes",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Recette créée avec succès !");
      navigate("/recipes");
    } catch (error) {
      console.error("Erreur lors de la création de la recette :", error);
      alert("Erreur lors de la création de la recette. Veuillez réessayer.");
    }
  };

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { name: "", quantity: 0, unit: "grammes" },
    ]);
  };

  const updateIngredient = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  // Handle image file selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Generate a preview URL for the image
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl); // Update the image preview state
    } else {
      setImagePreview(null); // Clear the preview if no file is selected
    }
  };

  useEffect(() => {
    document.body.className = styles.backgroundHomeShare;
    return () => {
      document.body.className = "";
    };
  }, []);

  return (
    <main id={styles.mainShare}>
      <form onSubmit={handleSubmit} id={styles.shareForm}>
        <img src={cornerImg} alt="" className={styles.cornerImg} />
        <div className={styles.titleBox}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={50}
            placeholder="Nom de recette"
            className={styles.shareTitle}
          />
        </div>

        <div className={styles.imgDescBox}>
          <div className={styles.shareImg}>
            <i className="fa-solid fa-cloud-arrow-up"></i>
            Insérer une image
            {imagePreview && (
              <div className={styles.imagePreviewContainer}>
                <img
                  src={imagePreview}
                  alt="Prévisualisation de l'image"
                  className={styles.imagePreview}
                />
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <div className={styles.shareDesc}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Description"
            />
          </div>
        </div>

        <div className={styles.eatersBox}>
          <div className={styles.eatersControl}>
            <button
              type="button"
              onClick={() => setEaters(eaters > 1 ? eaters - 1 : 1)}
              className={styles.eatersBtnLeft}
            >
              -
            </button>
            <div className={styles.numberContainer}>
              <input
                type="number"
                value={eaters}
                onChange={(e) => setEaters(Number(e.target.value))}
                required
                min={1}
                className={styles.eatersInput}
              />
              <span className={styles.eatersText}>
                {eaters > 1 ? "personnes" : "personne"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setEaters(eaters + 1)}
              className={styles.eatersBtnRight}
            >
              +
            </button>
          </div>
        </div>

        <div className={styles.formIngredients}>
          <label className={styles.ingredientsTitle}>Ingrédients :</label>
          {ingredients.map((ingredient, index) => (
            <div key={index} className={styles.ingredientsContainer}>
              <input
                type="text"
                placeholder="Nom de l'ingrédient"
                className={styles.ingredientsName}
                value={ingredient.name}
                onChange={(e) =>
                  updateIngredient(index, "name", e.target.value)
                }
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
                min={0}
              />
              <select
                value={ingredient.unit}
                onChange={(e) =>
                  updateIngredient(index, "unit", e.target.value)
                }
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

          <button
            type="button"
            onClick={addIngredient}
            className={styles.moreIngredients}
          >
            Ajouter un ingrédient
          </button>
        </div>

        <button type="submit" className={styles.shareSubmit}>
          <i className="fa-regular fa-circle-check"></i>Créer la recette
        </button>
      </form>
    </main>
  );
};

export default CreateRecipeForm;
