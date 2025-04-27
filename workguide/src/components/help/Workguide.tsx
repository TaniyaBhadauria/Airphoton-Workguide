import { Header } from "../Header";
import { Navigation } from "../Navigation";
import styles from "../styles.module.css";

const WorkInstructionsPage = () => {
  return (
    <div className={styles.container}>
      <Header />
      <Navigation />
      <div className={styles.heroImage} role="img" aria-label="Hero image">
        <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Work Instructions Portal</h1>

          <h2 style={{ fontSize: "1.5rem", marginTop: "2rem" }}>How to Use</h2>

          {/* Demo Video Section */}
          <div style={{ marginTop: "1rem" }}>
            <video
              width="50%"
              controls
              style={{ borderRadius: "8px", border: "1px solid #ccc" }}
            >
              <source src="/Workguide Demo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <p style={{ marginTop: "2rem" }}>
            <strong>1. Login/Register:</strong> Users must create an account and log in to access the platform.
          </p>
          <p style={{ marginTop: "1rem" }}>
            <strong>2. View Work Instructions:</strong> Search for a work instruction and click to view details.
          </p>
          <p style={{ marginTop: "1rem" }}>
            <strong>3. Submit Feedback:</strong> Provide feedback to help improve the instructions.
          </p>
          <p style={{ marginTop: "1rem" }}>
            <strong>4. Create or Edit Instructions:</strong> Create new or edit existing instructions.
          </p>
          <p style={{ marginTop: "1rem" }}>
            <strong>5. Download Instructions:</strong> Download PDFs for offline access.
          </p>
          <p style={{ marginTop: "1rem" }}>
            <strong>6. Role Management:</strong> Users can request roles via their profile settings.
          </p>
          <p style={{ marginTop: "1rem" }}>
            <strong>7. Manage Feedback:</strong> Admins can review and resolve feedback.
          </p>
          <p style={{ marginTop: "1rem" }}>
            <strong>8. Versions:</strong> Admins can compare different instruction versions.
          </p>

          {/* About Section */}
          <h2 style={{ fontSize: "1.5rem", marginTop: "2rem" }}>About</h2>
          <p style={{ marginTop: "0.5rem" }}>
            Smart content management system designed to streamline work instructions.
          </p>
          <a
            href="https://airphoton-workguide.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#007bff", marginTop: "1rem", display: "inline-block" }}
          >
            Visit Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default WorkInstructionsPage;
