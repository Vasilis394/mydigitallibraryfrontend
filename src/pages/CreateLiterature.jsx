// src/pages/CreateLiterature.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createLiterature } from "../services/literatures";

function CreateLiterature({ user }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    description: "",
    url: "",
    literature_type: 1,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await createLiterature(formData);
      navigate("/literature");
    } catch (error) {
      console.error("Error creating literature:", error);
      setError(error.response?.data?.message || "Failed to create literature. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Add New Literature</h1>
        <button 
          onClick={() => navigate("/literature")} 
          style={styles.backButton}
          disabled={isSubmitting}
        >
          ← Back to List
        </button>
      </div>

      {error && (
        <div style={styles.error}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="title" style={styles.label}>
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter the title of the literature"
              disabled={isSubmitting}
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
              value={formData.authors}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter authors (separate with commas if multiple)"
              disabled={isSubmitting}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="description" style={styles.label}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              style={styles.textarea}
              placeholder="Enter a description or summary"
              disabled={isSubmitting}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="url" style={styles.label}>
              URL (Optional)
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              style={styles.input}
              placeholder="https://example.com/article"
              disabled={isSubmitting}
            />
            <small style={styles.helpText}>
              Link to the online version or source
            </small>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="literature_type" style={styles.label}>
              Type *
            </label>
            <select
              id="literature_type"
              name="literature_type"
              value={formData.literature_type}
              onChange={handleChange}
              required
              style={styles.select}
              disabled={isSubmitting}
            >
              <option value={1}>Book</option>
              <option value={2}>Article</option>
              <option value={3}>Journal</option>
              <option value={4}>Conference Paper</option>
              <option value={5}>Thesis</option>
            </select>
          </div>

          <div style={styles.buttonGroup}>
            <button 
              type="submit" 
              style={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Literature"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/literature")}
              style={styles.cancelButton}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>

        <div style={styles.instructions}>
          <h3 style={styles.instructionsTitle}>Tips for adding literature:</h3>
          <ul style={styles.instructionsList}>
            <li>Make sure the title accurately represents the content</li>
            <li>Include all authors for proper attribution</li>
            <li>Add a URL if the literature is available online</li>
            <li>You can organize literature into libraries after creation</li>
            <li>All users can view literature, but only you can edit or delete your entries</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "2rem 1rem",
    minHeight: "calc(100vh - 200px)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  backButton: {
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    textDecoration: "none",
    display: "inline-block",
  },
  error: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "1rem",
    borderRadius: "4px",
    marginBottom: "1.5rem",
    border: "1px solid #f5c6cb",
  },
  formContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 300px",
    gap: "2rem",
    alignItems: "start",
  },
  form: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  formGroup: {
    marginBottom: "1.5rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "600",
    color: "#495057",
    fontSize: "0.95rem",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    fontSize: "1rem",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  textarea: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    fontSize: "1rem",
    resize: "vertical",
    fontFamily: "inherit",
    boxSizing: "border-box",
    minHeight: "120px",
    transition: "border-color 0.2s",
  },
  select: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    fontSize: "1rem",
    backgroundColor: "white",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  helpText: {
    display: "block",
    marginTop: "0.25rem",
    color: "#6c757d",
    fontSize: "0.875rem",
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    marginTop: "2rem",
    paddingTop: "1.5rem",
    borderTop: "1px solid #e9ecef",
  },
  submitButton: {
    flex: 2,
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "0.875rem 1.5rem",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "500",
    transition: "background-color 0.2s",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    padding: "0.875rem 1.5rem",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "500",
    transition: "background-color 0.2s",
  },
  instructions: {
    backgroundColor: "#e7f1ff",
    padding: "1.5rem",
    borderRadius: "8px",
    border: "1px solid #cfe2ff",
  },
  instructionsTitle: {
    marginTop: 0,
    marginBottom: "1rem",
    color: "#084298",
    fontSize: "1.1rem",
  },
  instructionsList: {
    margin: 0,
    paddingLeft: "1.5rem",
    color: "#495057",
    lineHeight: "1.6",
  },
};

// Disabled state styling
Object.assign(styles.input, {
  ":disabled": {
    backgroundColor: "#e9ecef",
    cursor: "not-allowed",
  },
});

Object.assign(styles.textarea, {
  ":disabled": {
    backgroundColor: "#e9ecef",
    cursor: "not-allowed",
  },
});

Object.assign(styles.select, {
  ":disabled": {
    backgroundColor: "#e9ecef",
    cursor: "not-allowed",
  },
});

Object.assign(styles.submitButton, {
  ":disabled": {
    backgroundColor: "#94d3a2",
    cursor: "not-allowed",
  },
});

Object.assign(styles.cancelButton, {
  ":disabled": {
    backgroundColor: "#a7aeb5",
    cursor: "not-allowed",
  },
});

export default CreateLiterature;