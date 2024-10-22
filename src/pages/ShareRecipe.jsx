import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../CSS/Share.module.css";

const CreateRecipeForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eaters, setEaters] = useState(1);
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: 0, unit: "grammes" },
  ]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const ingredientsContainerRef = useRef(null);

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

  const nonDecimalUnits = [
    "cuillères à soupe",
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

  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      const updatedIngredients = ingredients.filter((_, i) => i !== index);
      setIngredients(updatedIngredients);
    }
  };

  const updateIngredient = (index, field, value) => {
    const updatedIngredients = [...ingredients];

    if (field === "quantity") {
      const currentUnit = updatedIngredients[index].unit;
      if (nonDecimalUnits.includes(currentUnit)) {
        value = Math.floor(value);
      }
    }

    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  useEffect(() => {
    document.body.className = styles.backgroundHomeShare;
    return () => {
      document.body.className = "";
    };
  }, []);

  useEffect(() => {
    if (ingredientsContainerRef.current) {
      ingredientsContainerRef.current.scrollTop =
        ingredientsContainerRef.current.scrollHeight;
    }
  }, [ingredients]);

  return (
    <main id={styles.mainShare}>
      <form onSubmit={handleSubmit} id={styles.shareForm}>
        <h1>Partagez vos recettes</h1>
        <div className={styles.formContainer}>
          <div className={styles.shareFormTopContainer}>
            <div
              className={`${styles.postImgContainer} ${
                imagePreview ? styles.noBorder : ""
              }`}
            >
              <i className="fa-solid fa-cloud-arrow-up"></i>
              <p>Insérer une image</p>
              {imagePreview && (
                <div className={styles.imagePreviewContainer}>
                  <img
                    src={imagePreview}
                    alt="Prévisualisation de l'image"
                    className={styles.imagePreview}
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <div className={styles.titleDescContainer}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={50}
                placeholder="Nom de recette"
              />
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
            <label className={styles.ingredientsTitle}>Ingrédients :</label>{" "}
            <div
              className={styles.testf}
              ref={ingredientsContainerRef}
              style={{ overflowY: "hidden", height: "auto" }}
            >
              {ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className={`${styles.ingredientsContainer} ${
                    index === ingredients.length - 2 ? styles.highlight : ""
                  }`}
                >
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
                    className={`${
                      index === ingredients.length - 2 ? styles.highlight : ""
                    }`}
                    value={ingredient.quantity}
                    onClick={(e) => {
                      if (e.target.value === "0") {
                        updateIngredient(index, "quantity", "");
                      }
                    }}
                    onBlur={(e) => {
                      if (e.target.value === "") {
                        updateIngredient(index, "quantity", 0);
                      }
                    }}
                    onChange={(e) =>
                      updateIngredient(
                        index,
                        "quantity",
                        parseFloat(e.target.value)
                      )
                    }
                    required
                    min={0}
                    step="any"
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
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)} // Appel de la fonction de suppression
                    className={styles.removeIngredientBtn}
                    disabled={ingredients.length <= 1} // Désactiver le bouton si un seul ingrédient
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
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
        </div>
      </form>
    </main>
  );
};

export default CreateRecipeForm;
