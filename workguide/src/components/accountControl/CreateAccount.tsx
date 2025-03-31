import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setActiveUser } from "../../redux/userNameSlice"; // Import the action
import styles from "./LoginForm.module.css";
import selectStyles from "./InputField.module.css";
import { InputField } from "./InputField";

export const CreateAccountForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Access the Redux dispatch function
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    localStorage.setItem("username", username);

    if (!username || !password || !role || !email) {
      setError("All fields are required.");
      return;
    }

    try {
      let base64ProfilePic = "";
      if (profilePic) {
        const reader = new FileReader();
        reader.readAsDataURL(profilePic);
        await new Promise((resolve) => (reader.onload = resolve));
        base64ProfilePic = reader.result?.toString().split(",")[1] || "";
      }

      const response = await fetch("http://127.0.0.1:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role, email, profilepic: base64ProfilePic }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Account created successfully! Redirecting...");

        // Dispatch the action to set the username globally using Redux
         // Set the global userName in Redux

        setTimeout(() => navigate("/lib"), 2000); // Redirect to /lib
      } else {
        setError(data.error || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <section className={styles.loginFormSection}>
      <div className={styles.formContainer}>
        <header className={styles.header}>
          <h2 className={styles.title}>Sign Up Now</h2>
          <p className={styles.subtitle}>
            <span className={styles.signupText}>Already have an account? </span>
            <button className={styles.signupButton} onClick={() => navigate("/")}>Sign in</button>
          </p>
        </header>

        <form className={styles.form} onSubmit={handleSignup}>
          <InputField label="User name" value={username} onChange={(e) => setUsername(e.target.value)} />
          <InputField label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} showPasswordToggle />

          <div className={selectStyles.inputContainer}>
            <label className={selectStyles.label}>Role</label>
            <select className={selectStyles.input} value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="" disabled>Select the role</option>
              <option value="admin">Admin</option>
              <option value="intern">Intern</option>
              <option value="technician">Technician</option>
            </select>
          </div>

          <div className={selectStyles.inputContainer}>
            <label className={selectStyles.label}>Profile Picture</label>
            <input type="file" accept="image/*" onChange={(e) => setProfilePic(e.target.files?.[0] || null)} />
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}
          {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

          <button type="submit" className={styles.submitButton}>Sign Up</button>
        </form>
      </div>
    </section>
  );
};
