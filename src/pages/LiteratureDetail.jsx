// src/pages/LiteratureDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOneLiterature, updateLiterature, deleteLiterature } from "../services/literatures";

function LiteratureDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [literature, setLiterature] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchLiterature();
  }, [id]);

  const fetchLiterature = async () => {
    try {
      const data = await getOneLiterature(id);
      setLiterature(data.literature);
      setFormData(data.literature);
    } catch (error) {
      setError("Failed to fetch literature details");
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
      await updateLiterature(id, formData);
      setIsEditing(false);
      fetchLiterature(); // Refresh data
    } catch (error) {
      setError("Failed to update literature");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this literature?")) {
      try {
        await deleteLiterature(id);
        navigate("/literature");
      } catch (error) {
        setError("Failed to delete literature");
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
  
  if (!literature) return (
    <div style={styles.errorContainer}>
      <div style={styles.error}>Literature not found</div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>{literature.title}</h1>
        <div style={styles.actions}>
  {user && literature.user === user.id && !isEditing && (
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
              Title
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
              Authors
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
              Type
            </label>
            <select
              id="literature_type"
              name="literature_type"
              value={formData.literature_type || 1}
              onChange={handleChange}
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
          <div style={styles.detailRow}>
            <strong>Created:</strong> {new Date(literature.created_at).toLocaleDateString()}
          </div>
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
  },
  deleteBtn: {
    backgroundColor: "#dc3545",
    color: "white",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  backBtn: {
    backgroundColor: "#6c757d",
    color: "white",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
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
    .edit-btn:hover { background-color: #0056b3; }
    .delete-btn:hover { background-color: #c82333; }
    .back-btn:hover { background-color: #545b62; }
    .save-btn:hover { background-color: #218838; }
    .cancel-btn:hover { background-color: #545b62; }
    .url:hover { text-decoration: underline; }
  `;
  document.head.appendChild(style);
};

addHoverEffects();

export default LiteratureDetail;