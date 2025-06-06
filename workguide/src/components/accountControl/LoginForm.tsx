import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import styles from "./LoginForm.module.css";
import { InputField } from "./InputField";
import { useDispatch } from "react-redux";
import { setActiveUser } from "../../redux/userNameSlice";

export const LoginForm: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
      const response = await fetch(`https://y-eta-lemon.vercel.app/get_user?username=${username}&password=${password}`, {
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
          localStorage.setItem("username", username);

          const response = await fetch(`https://y-eta-lemon.vercel.app/api/user?username=${username}`);
          if (!response.ok) throw new Error("User not found or an error occurred");

          const data = await response.json();

                  // localStorage to set user data
          localStorage.setItem("role", data.role);
        navigate("/lib"); // Redirect to the home page
      } else {
          alert("Invalid password. Please try again.")
        setError("Invalid password. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error); // Log any errors that occur
      setError("An error occurred. Please try again later.");
       alert("Invalid password. Please try again.")
    }
  };

  return (
    <section className={styles.loginFormSection}>
      <div className={styles.formContainer}>
        <header className={styles.header}>
          <h2 className={styles.title}>Login into WorkGuide</h2>
          <p className={styles.subtitle}>
            <span className={styles.signupText}>Don't have an account? </span>
            <button className={styles.signupButton} onClick={() => navigate("/create")}>Sign up</button>
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

          <div className={styles.rememberMe}>
            <label className={styles.checkboxLabel}>
              <div className={styles.checkbox}>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/fe3c521611e952dde220f113a42b839bf30bba70?placeholderIfAbsent=true&apiKey=60aae364d73645da910bcd623ed1d086"
                  alt="Checkbox"
                  className={styles.checkboxIcon}
                />
              </div>
              <span className={styles.checkboxText}>Remember Me</span>
            </label>
          </div>

          <button type="submit" className={styles.submitButton}>
            Sign In
          </button>
        </form>
      </div>
    </section>
  );
};
