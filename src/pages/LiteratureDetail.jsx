// src/pages/LiteratureDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  getOneLiterature, 
  updateLiterature, 
  deleteLiterature,
  addToLibrary,
  removeFromLibrary
} from "../services/literatures";

function LiteratureDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [literature, setLiterature] = useState(null);
  const [availableLibraries, setAvailableLibraries] = useState([]);
  const [userAssociatedLibraries, setUserAssociatedLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [showLibraryDropdown, setShowLibraryDropdown] = useState(false);

  useEffect(() => {
    fetchLiterature();
  }, [id, user]);

  const fetchLiterature = async () => {
    try {
      setLoading(true);
      const data = await getOneLiterature(id);
      console.log("Fetched literature data:", data);
      
      setLiterature(data.literature);
      setFormData(data.literature);
      
      if (user) {
        setAvailableLibraries(data.libraries_not_associated || []);
        setUserAssociatedLibraries(data.user_associated_libraries || []);
      }
    } catch (error) {
      console.error("Failed to fetch literature details:", error);
      setError("Failed to fetch literature details");
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
    
    // Ensure literature_type is a number
    const dataToSend = {
      ...formData,
      literature_type: parseInt(formData.literature_type) || formData.literature_type
    };
    
    try {
      const response = await updateLiterature(id, dataToSend);
      console.log("Update successful:", response);
      setIsEditing(false);
      fetchLiterature();
      alert("Literature updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to update literature";
      setError("Failed to update literature: " + errorMsg);
      alert("Failed to update: " + errorMsg);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this literature?")) {
      try {
        await deleteLiterature(id);
        navigate("/literature");
      } catch (error) {
        console.error("Delete failed:", error);
        setError("Failed to delete literature");
        alert("Failed to delete literature");
      }
    }
  };

  const handleAddToLibrary = async (libraryId) => {
    if (!user) {
      alert("Please login to add literature to libraries");
      navigate("/login");
      return;
    }

    try {
      await addToLibrary(id, libraryId);
      alert("Added to library successfully!");
      fetchLiterature();
      setShowLibraryDropdown(false);
    } catch (error) {
      console.error("Failed to add to library:", error);
      const errorMsg = error.response?.data?.error || "Failed to add to library. Please try again.";
      alert(errorMsg);
    }
  };

  const handleRemoveFromLibrary = async (libraryId) => {
    if (!user) {
      alert("Please login to manage libraries");
      navigate("/login");
      return;
    }

    try {
      await removeFromLibrary(id, libraryId);
      alert("Removed from library successfully!");
      fetchLiterature();
    } catch (error) {
      console.error("Failed to remove from library:", error);
      const errorMsg = error.response?.data?.error || "Failed to remove from library. Please try again.";
      alert(errorMsg);
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
      <button onClick={() => navigate("/literature")} style={styles.backButton}>
        Back to Literature List
      </button>
    </div>
  );
  
  if (!literature) return (
    <div style={styles.errorContainer}>
      <div style={styles.error}>Literature not found</div>
      <button onClick={() => navigate("/literature")} style={styles.backButton}>
        Back to Literature List
      </button>
    </div>
  );

  const canEdit = user && literature.user === user.id;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        {isEditing ? (
          <input
            type="text"
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            style={styles.titleInput}
            required
          />
        ) : (
          <h1>{literature.title}</h1>
        )}
        <div style={styles.actions}>
          {canEdit && !isEditing && (
            <>
              <button onClick={() => setIsEditing(true)} style={styles.editBtn}>
                Edit
              </button>
              <button onClick={handleDelete} style={styles.deleteBtn}>
                Delete
              </button>
            </>
          )}
          <button onClick={() => navigate("/literature")} style={styles.backBtn}>
            Back to List
          </button>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="title" style={styles.label}>
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="authors" style={styles.label}>
              Authors *
            </label>
            <input
              type="text"
              id="authors"
              name="authors"
              value={formData.authors || ""}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="description" style={styles.label}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows="4"
              style={styles.textarea}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="url" style={styles.label}>
              URL
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url || ""}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="literature_type" style={styles.label}>
              Type *
            </label>
            <select
              id="literature_type"
              name="literature_type"
              value={formData.literature_type || 1}
              onChange={handleChange}
              required
              style={styles.select}
            >
              <option value={1}>Book</option>
              <option value={2}>Article</option>
              <option value={3}>Journal</option>
              <option value={4}>Conference Paper</option>
              <option value={5}>Thesis</option>
            </select>
          </div>

          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.saveBtn}>
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFormData(literature);
              }}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div style={styles.details}>
          <div style={styles.detailRow}>
            <strong>Authors:</strong> {literature.authors}
          </div>
          <div style={styles.detailRow}>
            <strong>Type:</strong> {getTypeName(literature.literature_type)}
          </div>
          <div style={styles.detailRow}>
            <strong>Description:</strong>
            <p style={styles.description}>{literature.description || "No description provided"}</p>
          </div>
          {literature.url && (
            <div style={styles.detailRow}>
              <strong>URL:</strong>
              <a
                href={literature.url}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.url}
              >
                {literature.url.length > 50 ? `${literature.url.substring(0, 50)}...` : literature.url}
              </a>
            </div>
          )}
          
          {/* Library Management Section - Only for logged in users */}
          {user && (
            <div style={styles.librarySection}>
              <h3 style={styles.sectionTitle}>Library Management</h3>
              
              {/* Add to Library Button */}
              <div style={styles.addToLibrary}>
                <button 
                  onClick={() => setShowLibraryDropdown(!showLibraryDropdown)}
                  style={styles.addButton}
                >
                  {showLibraryDropdown ? "Cancel" : "+ Add to My Library"}
                </button>
                
                {showLibraryDropdown && (
                  <div style={styles.libraryDropdown}>
                    {availableLibraries.length === 0 ? (
                      <p style={styles.noLibraries}>
                        You have no libraries available. <br />
                        <a 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            navigate("/libraries");
                          }}
                          style={styles.createLibraryLink}
                        >
                          Create a library first
                        </a>
                      </p>
                    ) : (
                      <>
                        <p style={styles.dropdownTitle}>Select one of your libraries:</p>
                        <div style={styles.libraryList}>
                          {availableLibraries.map((library) => (
                            <div key={library.id} style={styles.libraryOption}>
                              <button
                                onClick={() => handleAddToLibrary(library.id)}
                                style={styles.librarySelectButton}
                              >
                                {library.name}
                              </button>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {/* Show user's libraries that contain this literature */}
              {userAssociatedLibraries.length > 0 && (
                <div style={styles.currentLibraries}>
                  <h4 style={styles.currentTitle}>In your libraries:</h4>
                  <div style={styles.libraryChips}>
                    {userAssociatedLibraries.map((library) => (
                      <div key={library.id} style={styles.libraryChip}>
                        <span>{library.name}</span>
                        <button
                          onClick={() => handleRemoveFromLibrary(library.id)}
                          style={styles.removeChipButton}
                          title="Remove from my library"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div style={styles.detailRow}>
            <strong>Created:</strong> {new Date(literature.created_at).toLocaleDateString()}
          </div>
          
          {user && (
            <div style={styles.ownershipInfo}>
              <small>
                {canEdit ? "You own this literature" : "You don't own this literature"}
              </small>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem 0",
    width: "100%",
    maxWidth: "800px",
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
  input: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    fontSize: "1rem",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    fontSize: "1rem",
    resize: "vertical",
    minHeight: "120px",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    fontSize: "1rem",
    backgroundColor: "white",
    boxSizing: "border-box",
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    marginTop: "2rem",
  },
  saveBtn: {
    flex: 1,
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "0.75rem",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    padding: "0.75rem",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  details: {
    backgroundColor: "#f8f9fa",
    padding: "2rem",
    borderRadius: "8px",
    margin: "0 1rem",
  },
  detailRow: {
    marginBottom: "1.5rem",
    fontSize: "1.1rem",
    lineHeight: "1.6",
  },
  description: {
    marginTop: "0.5rem",
    color: "#495057",
    lineHeight: "1.6",
    padding: "0.5rem 0",
  },
  url: {
    color: "#007bff",
    textDecoration: "none",
    wordBreak: "break-all",
    display: "block",
    marginTop: "0.5rem",
    padding: "0.25rem 0",
    transition: "text-decoration 0.2s",
  },
  ownershipInfo: {
    marginTop: "1rem",
    padding: "0.5rem",
    backgroundColor: "#e9ecef",
    borderRadius: "4px",
    textAlign: "center",
    color: "#6c757d",
  },
  librarySection: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    margin: "2rem 0",
    border: "1px solid #dee2e6",
  },
  sectionTitle: {
    marginTop: "0",
    marginBottom: "1rem",
    color: "#495057",
    fontSize: "1.25rem",
  },
  addToLibrary: {
    marginBottom: "1.5rem",
  },
  addButton: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "background-color 0.2s",
  },
  libraryDropdown: {
    backgroundColor: "#f8f9fa",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    padding: "1rem",
    marginTop: "1rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  dropdownTitle: {
    marginTop: "0",
    marginBottom: "0.75rem",
    color: "#495057",
    fontSize: "0.95rem",
  },
  libraryList: {
    maxHeight: "200px",
    overflowY: "auto",
  },
  libraryOption: {
    marginBottom: "0.5rem",
  },
  librarySelectButton: {
    width: "100%",
    textAlign: "left",
    backgroundColor: "white",
    border: "1px solid #dee2e6",
    padding: "0.75rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.95rem",
    color: "#495057",
    transition: "all 0.2s",
  },
  noLibraries: {
    color: "#6c757d",
    textAlign: "center",
    margin: "0",
    lineHeight: "1.5",
  },
  createLibraryLink: {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "500",
    transition: "text-decoration 0.2s",
  },
  currentLibraries: {
    borderTop: "2px solid #e9ecef",
    paddingTop: "1.5rem",
  },
  currentTitle: {
    marginTop: "0",
    marginBottom: "1rem",
    color: "#495057",
    fontSize: "1.1rem",
  },
  libraryChips: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  libraryChip: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#007bff",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    fontSize: "0.9rem",
    gap: "0.5rem",
  },
  removeChipButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontSize: "1.25rem",
    padding: "0",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
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
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "300px",
    padding: "0 1rem",
    gap: "1rem",
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
  backButton: {
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
  },
};

// Add hover effects
const addHoverEffects = () => {
  const style = document.createElement('style');
  style.textContent = `
    .edit-btn:hover { background-color: #0056b3; }
    .delete-btn:hover { background-color: #c82333; }
    .back-btn:hover { background-color: #545b62; }
    .save-btn:hover { background-color: #218838; }
    .cancel-btn:hover { background-color: #545b62; }
    .add-button:hover { background-color: #218838; }
    .library-select-button:hover { 
      background-color: #e9ecef; 
      border-color: #adb5bd;
    }
    .url:hover { text-decoration: underline; }
    .create-library-link:hover { text-decoration: underline; }
    .remove-chip-button:hover { background-color: rgba(255,255,255,0.2); }
  `;
  document.head.appendChild(style);
};

addHoverEffects();

export default LiteratureDetail;