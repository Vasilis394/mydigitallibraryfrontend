// src/components/Navigation.jsx
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "../services/users";

function Navigation({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.navContainer}>
        <div style={styles.logo}>
          <Link to="/" style={styles.logoLink}>
            📚 Digital Library
          </Link>
        </div>
        <div style={styles.links}>
          {user ? (
            <>
              <Link to="/literature" style={styles.link}>
                My Literature
              </Link>
              <Link to="/create-literature" style={styles.link}>
                Add New
              </Link>
              <span style={styles.user}>Hello, {user.username}</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>
                Login
              </Link>
              <Link to="/signup" style={styles.link}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: "#fff",
    borderBottom: "1px solid #dee2e6",
    padding: "0 1rem",
  },
  navContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "64px",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  logoLink: {
    textDecoration: "none",
    color: "#212529",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
  },
  link: {
    textDecoration: "none",
    color: "#495057",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    transition: "background-color 0.2s",
  },
  user: {
    color: "#6c757d",
    padding: "0 0.5rem",
  },
  logoutBtn: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "background-color 0.2s",
  },
};

// Add hover styles
const addNavHoverStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    .nav-link:hover { background-color: #f8f9fa; }
    .logout-btn:hover { background-color: #c82333; }
  `;
  document.head.appendChild(style);
};

addNavHoverStyles();

export default Navigation;