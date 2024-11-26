import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../CSS/Profile.module.css";

const recipesUrl = "http://localhost:5000/api/v1/recipes/test/?createdBy=";

function Profile() {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteBox, setShowDeleteBox] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false); // État pour afficher le formulaire
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleDeleteClick = () => {
    setShowDeleteBox(true);
  };

  const handleCloseDeleteBox = () => {
    setShowDeleteBox(false);
  };

  const fetchUserProfileAndRecipes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/auth/${userId}`
      );
      setUserData(response.data.user);
      setName(response.data.user.name); // Initialiser l'état avec les données récupérées
      setEmail(response.data.user.email); // Initialiser l'état avec les données récupérées

      const recipesResponse = await axios.get(`${recipesUrl}${userId}`);
      setUserRecipes(recipesResponse.data.recipes);
      setLoading(false);
    } catch (error) {
      setError(
        "Erreur lors de la récupération des informations utilisateur ou des recettes."
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserProfileAndRecipes();
    } else {
      setError("Aucun utilisateur spécifié.");
      setLoading(false);
    }
  }, [userId]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (profileImage) {
      formData.append("image", profileImage);
    }

    try {
      await axios.put(`http://localhost:5000/api/v1/auth/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUserData((prev) => ({
        ...prev,
        name,
        email,
        imageUrl: profileImage
          ? URL.createObjectURL(profileImage)
          : prev.imageUrl,
      }));
      setError(null);
    } catch (error) {
      setError("Erreur lors de la mise à jour du profil.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/auth/${userId}`);
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      setError("Erreur lors de la suppression du compte.");
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const currentUserId = localStorage.getItem("userId");

  return (
    <main id={styles.profileMain}>
      <section className={styles.profileTopSection}>
        <div className={styles.settings}>
          {currentUserId === userId && (
            <div className={styles.settingsBox}>
              <button onClick={toggleMenu}>
                <i className="fa-solid fa-gear"></i>
              </button>
              <div
                className={`${styles.settingsMenu} ${
                  menuOpen ? styles.open : ""
                }`}
              >
                <ul className={styles.settingsList}>
                  <li className={styles.modifyAccount}>
                    <button onClick={() => setShowUpdateForm(!showUpdateForm)}>
                      Modifier le profil
                    </button>
                  </li>
                  <li className={styles.deleteAccount}>
                    <button onClick={handleDeleteClick}>
                      Supprimer le compte
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
          <div className={styles.profileDesc}>
            {userData && (
              <img
                src={userData.imageUrl}
                alt="Profile"
                className={styles.profileImage}
              />
            )}
          </div>
        </div>

        {/* Formulaire de mise à jour de profil */}
        {showUpdateForm && (
          <form
            id={styles.form}
            className={styles.fo}
            onSubmit={handleUpdateProfile}
          >
            <div className={styles.modifyProfileContainer}>
              <div className={styles.formGroup}>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={(e) => setProfileImage(e.target.files[0])}
                />
              </div>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <i class="fa-solid fa-pencil"></i>
              </div>
              <div className={styles.formGroup}>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <i class="fa-solid fa-pencil"></i>
              </div>

              <button type="submit">Mettre à jour le profil</button>
            </div>
          </form>
        )}

        {showDeleteBox && (
          <div className={styles.deleteBox}>
            <i className="fa-solid fa-xmark" onClick={handleCloseDeleteBox}></i>
            <div className={styles.deleteBoxContent}>
              <p>
                Êtes-vous sûr de vouloir supprimer définitivement votre compte ?
              </p>
              <button onClick={handleDeleteAccount}>
                Supprimer<i className="fa-solid fa-triangle-exclamation"></i>
              </button>
            </div>
          </div>
        )}
      </section>
      <div className={styles.userNameBox}>
        <h1 className={styles.username}>
          {userData ? userData.name : "Visiteur"}
        </h1>
        <h2 className={styles.sharedRecipesTitle}>
          {userRecipes.length >= 0
            ? `Recette partagée par ${
                userData ? userData.name : "l'utilisateur"
              } :`
            : `Recettes partagées par ${
                userData ? userData.name : "l'utilisateur"
              } :`}
        </h2>
      </div>
      <section className={styles.profileBottomSection}>
        {userRecipes.length > 0
          ? userRecipes.map((recipe) => (
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
          : null}
      </section>
      {userRecipes.length === 0 && (
        <div className={styles.noRecipesBox}>
          {currentUserId === userId ? (
            <>
              <p>Vous n'avez pas encore de recette.</p>
              <a href="/share">Création de recette</a>
            </>
          ) : (
            <p>Aucune recette partagée par cet utilisateur.</p>
          )}
        </div>
      )}
    </main>
  );
}

export default Profile;
