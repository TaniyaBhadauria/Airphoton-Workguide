import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import styles from "./LoginForm.module.css";
import selectStyles from "./InputField.module.css";
import { InputField } from "./InputField";

export const CreateAccountForm: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(""); // Clear previous errors

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      // Fetch the data from the backend and await the response
      const response = await fetch(`http://localhost:5000/get_user?username=${username}&password=${password}`, {
        method: "GET",
      });

      // Check if the response is okay (status code 200)
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error("An error occurred. Please try again later.");
      }

      // Parse the response body as JSON
      const data = await response.json();
      console.log("Parsed data:", data);

      // Check if the password matches the response password
      if (data.password === password) {
        navigate("/lib"); // Redirect to the home page
      } else {
        setError("Invalid password. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error); // Log any errors that occur
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <section className={styles.loginFormSection}>
      <div className={styles.formContainer}>
        <header className={styles.header}>
          <h2 className={styles.title}>Sign Up now</h2>
          <p className={styles.subtitle}>
            <span className={styles.signupText}>Already have an account? </span>
            <button className={styles.signupButton} onClick={() => navigate("/")}>Sign in</button>
          </p>
        </header>

        <form className={styles.form} onSubmit={handleLogin}>
          <InputField label="User name"
          value={username}
          onChange={(e) => setUsername(e.target.value)} />
          <InputField label="Email address" type="email"
           value={email}
                     onChange={(e) => setEmail(e.target.value)}/>
          <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showPasswordToggle
          />

          <div className={selectStyles.inputContainer}>
          <label className={selectStyles.label}>Role</label>
          <select className={selectStyles.input} value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="" disabled>Select the role</option>
            <option value="admin">Admin</option>
            <option value="intern">Intern</option>
            <option value="technician">Technician</option>
          </select>
          </div>

          <button type="submit" className={styles.submitButton}>
            Sign Up
          </button>
        </form>
      </div>
    </section>
  );
};
