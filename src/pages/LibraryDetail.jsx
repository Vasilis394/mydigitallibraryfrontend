// src/pages/LibraryDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  getOneLibrary, 
  updateLibrary, 
  deleteLibrary,
  removeFromLibrary 
} from "../services/literatures";

function LibraryDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [library, setLibrary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (user) {
      fetchLibrary();
    }
  }, [id, user]);

  const fetchLibrary = async () => {
    try {
      const data = await getOneLibrary(id);
      setLibrary(data);
      setFormData(data);
    } catch (error) {
      setError("Failed to fetch library details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateLibrary(id, formData);
      setIsEditing(false);
      fetchLibrary();
    } catch (error) {
      setError("Failed to update library");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this library?")) {
      try {
        await deleteLibrary(id);
        navigate("/libraries");
      } catch (error) {
        setError("Failed to delete library");
      }
    }
  };

  const handleRemoveFromLibrary = async (literatureId) => {
    if (window.confirm("Remove this literature from the library?")) {
      try {
        await removeFromLibrary(literatureId, id);
        alert("Removed successfully!");
        fetchLibrary(); // Refresh the library
      } catch (error) {
        console.error("Failed to remove:", error);
        alert("Failed to remove from library");
      }
    }
  };

  if (!user) {
    return (
      <div style={styles.unauthorizedContainer}>
        <div style={styles.unauthorized}>
          <h2>Authentication Required</h2>
          <p>You need to be logged in to view library details.</p>
          <button onClick={() => navigate("/login")} style={styles.loginButton}>
            Login
          </button>
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
  
  if (!library) return (
    <div style={styles.errorContainer}>
      <div style={styles.error}>Library not found</div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        {isEditing ? (
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            style={styles.titleInput}
            required
          />
        ) : (
          <h1>{library.name}</h1>
        )}
        <div style={styles.actions}>
          {!isEditing ? (
            <>
              <button onClick={() => setIsEditing(true)} style={styles.editBtn}>
                Edit
              </button>
              <button onClick={handleDelete} style={styles.deleteBtn}>
                Delete
              </button>
              <button onClick={() => navigate("/libraries")} style={styles.backBtn}>
                Back to Libraries
              </button>
            </>
          ) : (
            <>
              <button type="submit" form="library-form" style={styles.saveBtn}>
                Save
              </button>
              <button onClick={() => {
                setIsEditing(false);
                setFormData(library);
              }} style={styles.cancelBtn}>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <form id="library-form" onSubmit={handleSubmit} style={styles.form}>
        {isEditing && (
          <div style={styles.formGroup}>
            <label htmlFor="description" style={styles.label}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows="3"
              style={styles.textarea}
              placeholder="Add a description for this library..."
            />
          </div>
        )}

        {!isEditing && library.description && (
          <div style={styles.description}>
            <p>{library.description}</p>
          </div>
        )}

        <div style={styles.content}>
          <h3 style={styles.contentTitle}>
            Literature in this library ({library.literature ? library.literature.length : 0})
          </h3>
          
          {library.literature && library.literature.length > 0 ? (
            <div style={styles.literatureList}>
              {library.literature.map((item) => (
                <div key={item.id} style={styles.literatureItem}>
                  <div style={styles.itemContent}>
                    <h4 style={styles.itemTitle}>{item.title}</h4>
                    <p style={styles.itemAuthors}>by {item.authors}</p>
                    <p style={styles.itemDescription}>
                      {item.description && item.description.length > 150
                        ? `${item.description.substring(0, 150)}...`
                        : item.description || "No description"}
                    </p>
                  </div>
                  <div style={styles.itemActions}>
                    <button 
                      onClick={() => navigate(`/literature/${item.id}`)}
                      style={styles.viewItemButton}
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleRemoveFromLibrary(item.id)}
                      style={styles.removeItemButton}
                      title="Remove from library"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyLibrary}>
              <p>No literature in this library yet.</p>
              <button 
                onClick={() => navigate("/literature")}
                style={styles.browseButton}
              >
                Browse Literature
              </button>
            </div>
          )}
        </div>
      </form>
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
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "1rem",
  },
  container: {
    padding: "2rem 0",
    width: "100%",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    padding: "0 1rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  titleInput: {
    fontSize: "2rem",
    fontWeight: "bold",
    padding: "0.5rem",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    width: "100%",
    maxWidth: "400px",
  },
  actions: {
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap",
  },
  editBtn: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "background-color 0.2s",
  },
  deleteBtn: {
    backgroundColor: "#dc3545",
    color: "white",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "background-color 0.2s",
  },
  backBtn: {
    backgroundColor: "#6c757d",
    color: "white",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "background-color 0.2s",
  },
  saveBtn: {
    backgroundColor: "#28a745",
    color: "white",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "background-color 0.2s",
  },
  cancelBtn: {
    backgroundColor: "#6c757d",
    color: "white",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "background-color 0.2s",
  },
  form: {
    backgroundColor: "#f8f9fa",
    padding: "2rem",
    borderRadius: "8px",
    margin: "0 1rem",
  },
  formGroup: {
    marginBottom: "1.5rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "600",
    color: "#495057",
  },
  textarea: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    fontSize: "1rem",
    resize: "vertical",
    minHeight: "80px",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  description: {
    backgroundColor: "white",
    padding: "1rem",
    borderRadius: "4px",
    marginBottom: "2rem",
    borderLeft: "4px solid #007bff",
  },
  content: {
    marginTop: "2rem",
  },
  contentTitle: {
    fontSize: "1.5rem",
    marginBottom: "1.5rem",
    color: "#212529",
  },
  literatureList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  literatureItem: {
    backgroundColor: "white",
    border: "1px solid #dee2e6",
    borderRadius: "4px",
    padding: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    transition: "box-shadow 0.2s",
  },
  itemContent: {
    flex: "1",
  },
  itemTitle: {
    margin: "0 0 0.5rem 0",
    fontSize: "1.1rem",
    color: "#212529",
  },
  itemAuthors: {
    margin: "0 0 0.5rem 0",
    color: "#6c757d",
    fontSize: "0.9rem",
  },
  itemDescription: {
    margin: "0",
    color: "#495057",
    fontSize: "0.875rem",
    lineHeight: "1.5",
  },
  itemActions: {
    marginLeft: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    minWidth: "120px",
  },
  viewItemButton: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.875rem",
    transition: "background-color 0.2s",
  },
  removeItemButton: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.875rem",
    transition: "background-color 0.2s",
  },
  emptyLibrary: {
    textAlign: "center",
    padding: "3rem",
    backgroundColor: "white",
    borderRadius: "4px",
    border: "2px dashed #dee2e6",
  },
  browseButton: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    marginTop: "1rem",
    transition: "background-color 0.2s",
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

// Add hover effects
const addHoverEffects = () => {
  const style = document.createElement('style');
  style.textContent = `
    .edit-btn:hover {
      background-color: #0056b3;
    }
    .delete-btn:hover {
      background-color: #c82333;
    }
    .back-btn:hover {
      background-color: #545b62;
    }
    .save-btn:hover {
      background-color: #218838;
    }
    .cancel-btn:hover {
      background-color: #545b62;
    }
    .view-item-btn:hover {
      background-color: #0056b3;
    }
    .remove-item-btn:hover {
      background-color: #c82333;
    }
    .browse-btn:hover {
      background-color: #0056b3;
    }
    .literature-item:hover {
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
  `;
  document.head.appendChild(style);
};

addHoverEffects();

export default LibraryDetail;