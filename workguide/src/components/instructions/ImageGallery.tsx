"use client";
import * as React from "react";
import styles from "./InstallationGuide.module.css";

interface ImageGalleryProps {
  mainImage: string;
  thumbnails: string[];
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  mainImage,
  thumbnails,
}) => {
  return (
    <div className={styles.galleryContainer}>
      <figure className={styles.mainImageContainer}>
        <img
          src={mainImage}
          alt="Installation Step"
          className={styles.mainImage}
        />
      </figure>
      <div className={styles.thumbnailGrid}>
        {thumbnails.map((thumbnail, index) => (
          <img
            key={index}
            src={thumbnail}
            alt={`Detail ${index + 1}`}
            className={styles.thumbnail}
          />
        ))}
      </div>
    </div>
  );
};
