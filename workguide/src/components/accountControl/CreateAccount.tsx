import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Hook for navigation
import { useDispatch } from "react-redux"; // Hook to interact with Redux store
import styles from "./LoginForm.module.css"; // Importing CSS module for styles
import selectStyles from "./InputField.module.css"; // Importing CSS module for input field styles
import { InputField } from "./InputField"; // Reusable InputField component for form fields

export const CreateAccountForm: React.FC = () => {
  // State hooks for the form fields and messages
  const navigate = useNavigate(); // To navigate programmatically after form submission
  const [username, setUsername] = useState(""); // Username input
  const [password, setPassword] = useState(""); // Password input
  const [role, setRole] = useState(""); // Role input (Admin, Intern, Technician)
  const [email, setEmail] = useState(""); // Email input
  const [profilePic, setProfilePic] = useState<File | null>(null); // Profile picture upload
  const [error, setError] = useState(""); // Error message
  const [successMessage, setSuccessMessage] = useState(""); // Success message after account creation

  // Handles the signup form submission
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setError(""); // Clear any existing errors
    setSuccessMessage(""); // Clear any existing success messages
    localStorage.setItem("username", username); // Optionally store username in localStorage for future use

    // Check if all fields are filled in
    if (!username || !password || !role || !email) {
      setError("All fields are required.");
      return; // Stop execution if fields are missing
    }

    try {
      let base64ProfilePic = ""; // Prepare a variable for the base64 encoded profile picture
      if (profilePic) {
        // Convert profile picture to base64 string if uploaded
        const reader = new FileReader();
        reader.readAsDataURL(profilePic);
        await new Promise((resolve) => (reader.onload = resolve)); // Wait for the conversion to complete
        base64ProfilePic = reader.result?.toString().split(",")[1] || ""; // Get base64 string without metadata
      }

      // Send the form data to the server to create a new user
      const response = await fetch("https://airphoton-workguide.onrender.com/api/users", {
        method: "POST", // POST request to create a new user
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role, email, profilepic: base64ProfilePic }), // Send the form data as JSON
      });

      const data = await response.json(); // Parse the response

      if (response.ok) {
        // If the response is successful, show success message and redirect
        setSuccessMessage("Account created successfully! Redirecting...");
        setTimeout(() => navigate("/lib"), 2000); // Redirect to the '/lib' page after 2 seconds
      } else {
        setError(data.error || "Signup failed. Please try again."); // Show error message if the request failed
      }
    } catch (error) {
      console.error("Error:", error); // Log error to console for debugging
      setError("An error occurred. Please try again later."); // Show error message if something goes wrong
    }
  };

  return (
    <section className={styles.loginFormSection}>
      <div className={styles.formContainer}>
        <header className={styles.header}>
          <h2 className={styles.title}>Sign Up Now</h2>
          <p className={styles.subtitle}>
            <span className={styles.signupText}>Already have an account? </span>
            {/* Navigate to the login page */}
            <button className={styles.signupButton} onClick={() => navigate("/")}>Sign in</button>
          </p>
        </header>

        {/* Form for account creation */}
        <form className={styles.form} onSubmit={handleSignup}>
          {/* Reusable InputField component for username */}
          <InputField label="User name" value={username} onChange={(e) => setUsername(e.target.value)} />

          {/* Reusable InputField component for email */}
          <InputField label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

          {/* Reusable InputField component for password with toggle visibility */}
          <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} showPasswordToggle />

          {/* Dropdown for selecting the user's role */}
          <div className={selectStyles.inputContainer}>
            <label className={selectStyles.label}>Role</label>
            <select className={selectStyles.input} value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="" disabled>Select the role</option>
              <option value="admin">Admin</option>
              <option value="intern">Intern</option>
              <option value="technician">Technician</option>
            </select>
          </div>

          {/* File input for profile picture */}
          <div className={selectStyles.inputContainer}>
            <label className={selectStyles.label}>Profile Picture</label>
            <input type="file" accept="image/*" onChange={(e) => setProfilePic(e.target.files?.[0] || null)} />
          </div>

          {/* Display error or success message */}
          {error && <p className={styles.errorMessage}>{error}</p>}
          {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

          {/* Submit button */}
          <button type="submit" className={styles.submitButton}>Sign Up</button>
        </form>
      </div>
    </section>
  );
};
