import { useState } from "react";
import styles from "../../CSS/HomeModules/HomeContact.module.css";

function HomeContact() {
  const [focusedField, setFocusedField] = useState(null);

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  return (
    <section id={styles.homeContact}>
      <h5>
        <span>Contacter-</span>nous
      </h5>
      <form className={styles.contactForm}>
        <div className={styles.nameContainer}>
          <div
            className={`${styles.formRow} ${
              focusedField === "nom" ? styles.focused : ""
            }`}
          >
            <input
              type="text"
              required
              id="name"
              onFocus={() => handleFocus("nom")}
              onBlur={handleBlur}
              name="name"
            />
            <label htmlFor="name">Nom *</label>
            <i className="fa-solid fa-address-card"></i>
          </div>
          <div
            className={`${styles.formRow} ${
              focusedField === "prenom" ? styles.focused : ""
            }`}
          >
            <input
              type="text"
              id="lastname"
              name="lastname"
              onFocus={() => handleFocus("prenom")}
              onBlur={handleBlur}
            />
            <label htmlFor="lastname">Prénom</label>
            <i className="fa-solid fa-address-card"></i>
          </div>
        </div>
        <div
          className={`${styles.formRow} ${
            focusedField === "email" ? styles.focused : ""
          }`}
        >
          <input
            type="email"
            id="email"
            name="email"
            required
            onFocus={() => handleFocus("email")}
            onBlur={handleBlur}
          />
          <label htmlFor="email">Email</label>
          <i className="fa-solid fa-envelope"></i>
        </div>
        <div
          className={`${styles.formMsg} ${
            focusedField === "message" ? styles.focused : ""
          }`}
        >
          <textarea
            id="formmsg"
            name="formmsg"
            required
            onFocus={() => handleFocus("message")}
            onBlur={handleBlur}
          ></textarea>
          <label htmlFor="formmsg">Message *</label>
          <i className="fa-solid fa-message"></i>
        </div>
        <div className={styles.submitBtn}>
          <button type="submit" className={styles.contactSubmit}>
            Envoyer
          </button>
        </div>
      </form>
    </section>
  );
}

export default HomeContact;
