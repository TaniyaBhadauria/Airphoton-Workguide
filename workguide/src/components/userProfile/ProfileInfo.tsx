import React, { useState, useEffect } from "react";
import styles from "./ProfileInfo.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: string;
  profilepic: string | null;
}

export const ProfileInfo: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [editableProfile, setEditableProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string>("");

  const username = localStorage.getItem("username");
  const activeScreen = useSelector((state: RootState) => state.userScreen.activeScreen);

  useEffect(() => {
    if (!username) {
      setError("User is not logged in.");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`https://y-eta-lemon.vercel.app/api/user?username=${username}`);
        if (!response.ok) throw new Error("User not found or an error occurred");

        const data = await response.json();
        setUserProfile(data);
        setEditableProfile(data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchUserProfile();
  }, [username]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editableProfile) return;
    const { name, value } = e.target;
    setEditableProfile({ ...editableProfile, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditableProfile((prev) =>
          prev ? { ...prev, profilepic: (reader.result as string).split(",")[1] } : prev
        );
      };
      reader.readAsDataURL(file); // Converts to base64
    }
  };

  const handleEditToggle = () => setIsEditing(true);
  const handleCancel = () => {
    setEditableProfile(userProfile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!editableProfile) return;
    try {
      const response = await fetch(`https://y-eta-lemon.vercel.app/api/user/${editableProfile.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editableProfile),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedProfile = await response.json();
      setUserProfile(updatedProfile);
      setEditableProfile(updatedProfile);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (!editableProfile) return <p>Loading...</p>;

  return (
    <section className={styles.profileInfo}>
      <div className={styles.profilePicContainer}>
        <img
          src={
            editableProfile.profilepic
              ? `data:image/png;base64,${editableProfile.profilepic}`
              : "https://cdn.builder.io/api/v1/image/assets/TEMP/6876b92a217cbcff4fbbb8d2743c2e9a73cd9a74?placeholderIfAbsent=true&apiKey=60aae364d73645da910bcd623ed1d086"
          }
          alt="Profile"
          className={styles.profileImage}
        />
        {isEditing && (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.fileInput}
          />
        )}
      </div>

      <div className={styles.details}>
        <div className={styles.info}>
          <strong>Name:</strong>{" "}
          {isEditing ? (
            <input
              type="text"
              name="username"
              value={editableProfile.username}
              onChange={handleInputChange}
              className={styles.input}
            />
          ) : (
            editableProfile.username
          )}
          <br />
          <br />
          <strong>Email:</strong>{" "}
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={editableProfile.email}
              onChange={handleInputChange}
              className={styles.input}
            />
          ) : (
            editableProfile.email
          )}
          <br />
          <br />
          <strong>Current Role:</strong>{" "}
          {isEditing ? (
            <input
              type="text"
              name="role"
              value={editableProfile.role}
              onChange={handleInputChange}
              className={styles.input}
            />
          ) : (
            editableProfile.role
          )}
        </div>
      </div>

      {activeScreen === "My Profile" && (
        <div className={styles.editButtons}>
          {isEditing ? (
            <>
              <button className={styles.saveButton} onClick={handleSave}>Save</button>
              <button className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
            </>
          ) : (
            <button className={styles.editButton} onClick={handleEditToggle}>
              Edit Profile
            </button>
          )}
        </div>
      )}
    </section>
  );
};
