// src/pages/LibrariesList.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllLibraries, deleteLibrary } from "../services/literatures";

function LibrariesList({ user }) {
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      fetchLibraries();
    }
  }, [user]);

  const fetchLibraries = async () => {
    try {
      const data = await getAllLibraries();
      setLibraries(data);
    } catch (error) {
      setError("Failed to fetch libraries");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete library "${name}"?`)) {
      try {
        await deleteLibrary(id);
        fetchLibraries();
      } catch (error) {
        console.error("Failed to delete library:", error);
        alert("Failed to delete library");
      }
    }
  };

  if (!user) {
    return (
      <div style={styles.unauthorizedContainer}>
        <div style={styles.unauthorized}>
          <h2>Authentication Required</h2>
          <p>You need to be logged in to view libraries.</p>
          <Link to="/login" style={styles.loginButton}>
            Login
          </Link>
          <Link to="/signup" style={styles.signupButton}>
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.loading}>Loading...</div>
    </div>
  );
  
  if (error) return (
    <div style={styles.errorContainer}>
      <div style={styles.error}>{error}</div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>My Libraries</h1>
        <div style={styles.actions}>
          <Link to="/literature" style={styles.backButton}>
            View Literature
          </Link>
        </div>
      </div>

      <div style={styles.grid}>
        {libraries.length === 0 ? (
          <div style={styles.empty}>
            <p>No libraries yet. Create your first library!</p>
            <Link to="/literature" style={styles.createLink}>
              Browse Literature to Add to Libraries
            </Link>
          </div>
        ) : (
          libraries.map((library) => (
            <div key={library.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.title}>{library.name}</h3>
                <span style={styles.count}>
                  {library.literature_count || 0} items
                </span>
              </div>
              
              <div style={styles.cardBody}>
                {library.description && (
                  <p style={styles.description}>{library.description}</p>
                )}
                
                <div style={styles.literaturePreview}>
                  {library.literature && library.literature.length > 0 ? (
                    library.literature.slice(0, 3).map((item, index) => (
                      <div key={index} style={styles.previewItem}>
                        <Link to={`/literature/${item.id}`} style={styles.previewLink}>
                          {item.title}
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p style={styles.emptyLibrary}>No literature added yet</p>
                  )}
                </div>
              </div>
              
              <div style={styles.cardFooter}>
                <div style={styles.actions}>
                  <Link to={`/libraries/${library.id}`} style={styles.viewButton}>
                    View Library
                  </Link>
                  <Link to={`/libraries/${library.id}/edit`} style={styles.editButton}>
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(library.id, library.name)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  unauthorizedContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "60vh",
    padding: "0 1rem",
  },
  unauthorized: {
    textAlign: "center",
    padding: "3rem",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    maxWidth: "500px",
    width: "100%",
  },
  loginButton: {
    display: "inline-block",
    backgroundColor: "#007bff",
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "4px",
    textDecoration: "none",
    margin: "0.5rem",
  },
  signupButton: {
    display: "inline-block",
    backgroundColor: "#28a745",
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "4px",
    textDecoration: "none",
    margin: "0.5rem",
  },
  container: {
    padding: "2rem 0",
    width: "100%",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    padding: "0 1rem",
  },
  backButton: {
    backgroundColor: "#6c757d",
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "4px",
    textDecoration: "none",
    fontSize: "0.9rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "1.5rem",
    padding: "0 1rem",
  },
  card: {
    backgroundColor: "white",
    border: "1px solid #dee2e6",
    borderRadius: "8px",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1rem",
  },
  title: {
    margin: "0",
    fontSize: "1.25rem",
    color: "#212529",
    flex: "1",
  },
  count: {
    backgroundColor: "#e9ecef",
    padding: "0.25rem 0.5rem",
    borderRadius: "4px",
    fontSize: "0.875rem",
    color: "#495057",
    marginLeft: "0.5rem",
  },
  cardBody: {
    flex: "1",
    marginBottom: "1rem",
  },
  description: {
    color: "#6c757d",
    marginBottom: "1rem",
    lineHeight: "1.5",
  },
  literaturePreview: {
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
    padding: "1rem",
  },
  previewItem: {
    marginBottom: "0.5rem",
    paddingBottom: "0.5rem",
    borderBottom: "1px solid #e9ecef",
  },
  previewLink: {
    color: "#007bff",
    textDecoration: "none",
    fontSize: "0.875rem",
  },
  emptyLibrary: {
    color: "#6c757d",
    fontSize: "0.875rem",
    textAlign: "center",
  },
  cardFooter: {
    marginTop: "auto",
  },
  actions: {
    display: "flex",
    gap: "0.5rem",
  },
  viewButton: {
    flex: "1",
    backgroundColor: "#007bff",
    color: "white",
    textDecoration: "none",
    padding: "0.5rem",
    borderRadius: "4px",
    textAlign: "center",
    fontSize: "0.875rem",
  },
  editButton: {
    flex: "1",
    backgroundColor: "#6c757d",
    color: "white",
    textDecoration: "none",
    padding: "0.5rem",
    borderRadius: "4px",
    textAlign: "center",
    fontSize: "0.875rem",
  },
  deleteButton: {
    flex: "1",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "0.5rem",
    borderRadius: "4px",
    fontSize: "0.875rem",
    cursor: "pointer",
  },
  empty: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "3rem",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
  },
  createLink: {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "500",
    marginTop: "1rem",
    display: "inline-block",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "300px",
  },
  loading: {
    fontSize: "1.25rem",
    color: "#6c757d",
  },
  errorContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "300px",
    padding: "0 1rem",
  },
  error: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "1.5rem",
    borderRadius: "8px",
    textAlign: "center",
    width: "100%",
    maxWidth: "500px",
  },
};

export default LibrariesList;