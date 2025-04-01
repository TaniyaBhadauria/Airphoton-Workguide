// "use client" enables the component to run on the client-side (React-specific behavior)
"use client";

import * as React from "react"; // Importing React to enable JSX and component functionality
import styles from "./InstallationGuide.module.css"; // Importing CSS module for styling the component

// Defining the prop types for the ImageGallery component
interface ImageGalleryProps {
  mainImage: string; // URL for the main image
  thumbnails: string[]; // Array of URLs for thumbnail images
}

// ImageGallery component displaying a main image and a grid of thumbnail images
export const ImageGallery: React.FC<ImageGalleryProps> = ({
  mainImage,
  thumbnails,
}) => {
  return (
    <div className={styles.galleryContainer}> {/* Container for the whole gallery */}

      {/* Main image container */}
      <figure className={styles.mainImageContainer}>
        {/* Display the main image */}
        <img
          src={mainImage} // Source of the main image
          alt="Installation Step" // Alt text for accessibility
          className={styles.mainImage} // Applying styles to the main image
        />
      </figure>

      {/* Grid of thumbnail images */}
      <div className={styles.thumbnailGrid}>
        {/* Map over the thumbnails array and render each thumbnail */}
        {thumbnails.map((thumbnail, index) => (
          <img
            key={index} // Using the index as a key for list items
            src={thumbnail} // Source of each thumbnail image
            alt={`Detail ${index + 1}`} // Descriptive alt text for each thumbnail
            className={styles.thumbnail} // Applying styles to each thumbnail
          />
        ))}
      </div>
    </div>
  );
};
