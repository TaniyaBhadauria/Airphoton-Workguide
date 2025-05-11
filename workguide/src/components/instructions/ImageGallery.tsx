"use client";

import React, { useState, useEffect } from "react";
import styles from "./InstallationGuide.module.css";

interface ImageGalleryProps {
  mainImage: string;
  thumbnails: string[];
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  mainImage,
  thumbnails,
}) => {
  const [selectedImage, setSelectedImage] = useState(mainImage);

  // Reset selected image when the main image changes (i.e., on step change)
  useEffect(() => {
    setSelectedImage(mainImage);
  }, [mainImage]);

  // Combine all images and filter out the currently selected one
  const allImages = [mainImage, ...thumbnails].filter(
    (img) => img !== selectedImage
  );

  return (
    <div className={styles.galleryContainer}>
      {/* Main image */}
      <figure className={styles.mainImageContainer}>
        <img
          src={selectedImage}
          alt="Installation Step"
          className={styles.mainImage}
        />
      </figure>

      {/* Thumbnails (excluding selected image) */}
      <div className={styles.thumbnailGrid}>
        {allImages.map((thumbnail, index) => (
          <img
            key={index}
            src={thumbnail}
            alt={`Detail ${index + 1}`}
            className={styles.thumbnail}
            onClick={() => setSelectedImage(thumbnail)}
          />
        ))}
      </div>
    </div>
  );
};
