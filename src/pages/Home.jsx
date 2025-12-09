
import { Link } from "react-router-dom";

function Home({ user }) {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.title}>Welcome to Digital Library</h1>
          <p style={styles.subtitle}>
            Organize your books, articles, and research papers in one place
          </p>
          
          {user ? (
            <div style={styles.authenticated}>
              <p style={styles.welcome}>Welcome back, {user.username}!</p>
              <Link to="/literature" style={styles.ctaButton}>
                Go to My Library
              </Link>
            </div>
          ) : (
            <div style={styles.authOptions}>
              <Link to="/signup" style={styles.ctaButton}>
                Get Started
              </Link>
              <Link to="/login" style={styles.secondaryButton}>
                Login
              </Link>
            </div>
          )}
        </div>
      </div>

      <div style={styles.featuresContainer}>
        <h2 style={styles.featuresTitle}>Features:</h2>
        <div style={styles.featureGrid}>
          <div style={styles.feature}>
            
            <h3>Organize Literature</h3>
            <p>Keep track of books, articles, papers, and more</p>
          </div>
          <div style={styles.feature}>
            
            <h3>Save URLs</h3>
            <p>Store links to online resources for easy access</p>
          </div>
          <div style={styles.feature}>
            
            <h3>Categorize</h3>
            <p>Organize by type and custom libraries</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
  },
  hero: {
    textAlign: "center",
    padding: "4rem 1rem",
    backgroundColor: "#f8f9fa",
    marginBottom: "3rem",
  },
  heroContent: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
    color: "#212529",
  },
  subtitle: {
    fontSize: "1.25rem",
    color: "#6c757d",
    marginBottom: "2rem",
    lineHeight: "1.5",
  },
  authenticated: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
  },
  welcome: {
    fontSize: "1.25rem",
    color: "#495057",
    marginBottom: "1rem",
  },
  authOptions: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    flexWrap: "wrap",
  },
  ctaButton: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "0.75rem 2rem",
    borderRadius: "4px",
    textDecoration: "none",
    fontSize: "1.1rem",
    fontWeight: "500",
    display: "inline-block",
    transition: "background-color 0.2s",
  },
  secondaryButton: {
    backgroundColor: "#6c757d",
    color: "white",
    padding: "0.75rem 2rem",
    borderRadius: "4px",
    textDecoration: "none",
    fontSize: "1.1rem",
    fontWeight: "500",
    display: "inline-block",
    transition: "background-color 0.2s",
  },
  featuresContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1rem 4rem",
  },
  featuresTitle: {
    textAlign: "center",
    fontSize: "2rem",
    marginBottom: "3rem",
    color: "#212529",
    

  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
    justifyContent: "center",
  },
  feature: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    transition: "transform 0.2s",
    
  },
  featureIcon: {
    fontSize: "3rem",
    marginBottom: "1rem",
  },
};


const addHoverStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    .ctaButton:hover { background-color: #0056b3; }
    .secondaryButton:hover { background-color: #545b62; }
    .feature:hover { transform: translateY(-5px); }
  `;
  document.head.appendChild(style);
};


addHoverStyles();

export default Home;