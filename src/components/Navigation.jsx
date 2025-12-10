
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "../services/users";
import LibraryDropdown from "./LibraryDropdown";

function Navigation({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      navigate("/");
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
          <Link to="/literature" style={styles.link}>
            Browse Literature
          </Link>
          
          {user ? (
            <>
              <LibraryDropdown user={user} />
              
              
              
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
              <Link to="/signup" style={styles.signupLink}>
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
    position: "sticky",
    top: "0",
    zIndex: "100",
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
    fontSize: "0.95rem",
  },
  addLink: {
    textDecoration: "none",
    backgroundColor: "#28a745",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    transition: "background-color 0.2s",
    fontSize: "0.95rem",
  },
  signupLink: {
    textDecoration: "none",
    backgroundColor: "#007bff",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    transition: "background-color 0.2s",
    fontSize: "0.95rem",
  },
  user: {
    color: "#6c757d",
    padding: "0 0.5rem",
    fontSize: "0.9rem",
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


const addNavHoverStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    .nav-link:hover {
      background-color: #f8f9fa;
    }
    .add-link:hover {
      background-color: #218838;
    }
    .signup-link:hover {
      background-color: #0056b3;
    }
    .logout-btn:hover {
      background-color: #c82333;
    }
  `;
  document.head.appendChild(style);
};

addNavHoverStyles();

export default Navigation;