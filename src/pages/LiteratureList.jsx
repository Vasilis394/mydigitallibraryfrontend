// src/pages/LiteratureList.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllLiterature, deleteLiterature } from "../services/literatures";

function LiteratureList({ user }) {
  const [literature, setLiterature] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLiterature();
  }, []);

  const fetchLiterature = async () => {
    try {
      const data = await getAllLiterature();
      setLiterature(data);
    } catch (error) {
      setError("Failed to fetch literature");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteLiterature(id);
        fetchLiterature(); 
      } catch (error) {
        console.error("Failed to delete:", error);
        alert("Failed to delete item");
      }
    }
  };

  const getTypeName = (typeId) => {
    const types = {
      1: "Book",
      2: "Article",
      3: "Journal",
      4: "Conference Paper",
      5: "Thesis",
    };
    return types[typeId] || "Unknown";
  };

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
        <h1>All Literature</h1>
        <Link to="/create-literature" style={styles.addButton}>
          + Add New Literature
        </Link>
      </div>

      {literature.length === 0 ? (
        <div style={styles.emptyContainer}>
          <div style={styles.empty}>
            <p>No literature found. Add your first item!</p>
            <Link to="/create-literature" style={styles.addLink}>
              Add Literature
            </Link>
          </div>
        </div>
      ) : (
        <div style={styles.grid}>
          {literature.map((item) => (
            <div key={item.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.title}>{item.title}</h3>
                <span style={styles.type}>{getTypeName(item.literature_type)}</span>
              </div>
              <p style={styles.description}>
                {item.description && item.description.length > 100
                  ? `${item.description.substring(0, 100)}...`
                  : item.description || "No description"}
              </p>
              <p style={styles.authors}>
                <strong>Authors:</strong> {item.authors}
              </p>
              <div style={styles.cardFooter}>
  <div style={styles.actions}>
    <Link to={`/literature/${item.id}`} style={styles.viewButton}>
      View
    </Link>
    
    
    {user && item.user === user.id && (
      <>
        
        <button
          onClick={() => handleDelete(item.id)}
          style={styles.deleteButton}
        >
          Delete
        </button>
      </>
    )}
  </div>
</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
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
  addButton: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "4px",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "0.9rem",
  },
  emptyContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "300px",
  },
  empty: {
    textAlign: "center",
    padding: "3rem",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "500px",
  },
  addLink: {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "500",
    marginTop: "1rem",
    display: "inline-block",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
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
    margin: 0,
    fontSize: "1.25rem",
    color: "#212529",
    flex: 1,
  },
  type: {
    backgroundColor: "#e9ecef",
    padding: "0.25rem 0.5rem",
    borderRadius: "4px",
    fontSize: "0.875rem",
    color: "#495057",
    marginLeft: "0.5rem",
  },
  description: {
    color: "#6c757d",
    marginBottom: "1rem",
    flex: 1,
    lineHeight: "1.5",
  },
  authors: {
    color: "#495057",
    marginBottom: "1rem",
    fontSize: "0.9rem",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
  },
  actions: {
    display: "flex",
    gap: "0.75rem",
    width: "100%",
  },
  viewButton: {
    flex: 1,
    backgroundColor: "#007bff",
    color: "white",
    textDecoration: "none",
    padding: "0.5rem",
    borderRadius: "4px",
    textAlign: "center",
    fontSize: "0.875rem",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "0.5rem",
    borderRadius: "4px",
    fontSize: "0.875rem",
    cursor: "pointer",
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


const addCardHover = () => {
  const style = document.createElement('style');
  style.textContent = `
    .literature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
  `;
  document.head.appendChild(style);
};

addCardHover();

export default LiteratureList;