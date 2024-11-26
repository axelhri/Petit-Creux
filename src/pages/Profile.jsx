import React, { useEffect, useState, useRef } from "react";
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
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // New password state
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  const [editableFields, setEditableFields] = useState({
    name: false,
    email: false,
    password: false, // New editable field for password
  });
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
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

  const toggleEditField = (field) => {
    setEditableFields((prev) => ({ ...prev, [field]: !prev[field] }));
    setTimeout(() => {
      if (field === "name" && nameInputRef.current) {
        nameInputRef.current.focus();
        nameInputRef.current.select();
      }
      if (field === "email" && emailInputRef.current) {
        emailInputRef.current.focus();
        emailInputRef.current.select();
      }
      if (field === "password" && passwordInputRef.current) {
        // Handle password focus
        passwordInputRef.current.focus();
      }
    }, 0);
  };

  const fetchUserProfileAndRecipes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/auth/${userId}`
      );
      setUserData(response.data.user);
      setName(response.data.user.name);
      setEmail(response.data.user.email);
      setProfilePreview(response.data.user.imageUrl);

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
    if (password) {
      // Add password to form data if it exists
      formData.append("password", password);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const closeUpdateForm = () => {
    setShowUpdateForm(false);
    setEditableFields({ name: false, email: false, password: false });
    setProfileImage(null);
    setProfilePreview(userData.imageUrl);
    setPassword(""); // Reset password field
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

        {showUpdateForm && (
          <form className={styles.formUpdate} onSubmit={handleUpdateProfile}>
            <div className={styles.modifyProfileContainer}>
              <button
                type="button"
                className={styles.closeFormButton}
                onClick={closeUpdateForm}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              <span className={styles.editFormTitle}>Modifier le profil</span>
              <div className={styles.formGroup}>
                <div className={styles.userImgContainer}>
                  <img
                    src={profilePreview}
                    alt="Aperçu de la nouvelle image de profil"
                    className={styles.profileImagePreview}
                  />
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              <div className={styles.editContainer}>
                <div className={styles.formGroup}>
                  <p>Nom :</p>

                  <input
                    style={{ fontSize: "1rem", fontWeight: "300" }}
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    readOnly={!editableFields.name}
                    ref={nameInputRef}
                    className={`${styles.borderlessInput} ${
                      editableFields.name ? styles.editableInput : ""
                    }`}
                    required
                  />

                  <i
                    className="fa-solid fa-pen"
                    onClick={() => toggleEditField("name")}
                  ></i>
                </div>
                <div className={styles.formGroup}>
                  <p>Email :</p>

                  <input
                    style={{ fontSize: "1rem", fontWeight: "300" }}
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    readOnly={!editableFields.email}
                    ref={emailInputRef}
                    className={`${styles.borderlessInput} ${
                      editableFields.email ? styles.editableInput : ""
                    }`}
                    required
                  />

                  <i
                    className="fa-solid fa-pen"
                    onClick={() => toggleEditField("email")}
                  ></i>
                </div>
              </div>

              <div className={styles.formGroup && styles.passwordBox}>
                <p>Changer de mot de passe</p>
                <input
                  style={{ fontSize: "1rem", fontWeight: "300" }}
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className={styles.updateProfile}>
                Mettre à jour le profil
              </button>
            </div>
          </form>
        )}

        {showDeleteBox && (
          <div className={styles.deleteBox}>
            <i className="fa-solid fa-xmark" onClick={handleCloseDeleteBox}></i>
            <div className={styles.deleteBoxContent}>
              <p>
                Êtes-vous sûr de vouloir supprimer votre compte ? Cette action
                est irréversible.
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
