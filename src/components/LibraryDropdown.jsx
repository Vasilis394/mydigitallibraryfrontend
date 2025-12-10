
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllLibraries, createLibrary } from "../services/literatures";

function LibraryDropdown({ user }) {
  const [libraries, setLibraries] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newLibraryName, setNewLibraryName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && isOpen) {
      fetchLibraries();
    }
  }, [user, isOpen]);

  const fetchLibraries = async () => {
    try {
      const data = await getAllLibraries();
      setLibraries(data);
    } catch (error) {
      console.error("Failed to fetch libraries:", error);
    }
  };

  
const handleCreateLibrary = async (e) => {
  e.preventDefault();
  if (!newLibraryName.trim()) return;
  
  try {
    setLoading(true);
    
    await createLibrary({ name: newLibraryName });
    setNewLibraryName("");
    setShowCreateForm(false);
    fetchLibraries();
  } catch (error) {
    console.error("Failed to create library:", error);
    
  } finally {
    setLoading(false);
  }
};

  if (!user) return null;

  return (
    <div style={styles.dropdownContainer}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={styles.dropdownButton}
      >
        My Libraries ▾
      </button>
      
      {isOpen && (
        <div style={styles.dropdownMenu}>
          <div style={styles.dropdownHeader}>
            <h4 style={styles.dropdownTitle}>My Libraries</h4>
            <button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              style={styles.createButton}
            >
              {showCreateForm ? "Cancel" : "+ New"}
            </button>
          </div>
          
          {showCreateForm && (
            <form onSubmit={handleCreateLibrary} style={styles.createForm}>
              <input
                type="text"
                value={newLibraryName}
                onChange={(e) => setNewLibraryName(e.target.value)}
                placeholder="Library name"
                style={styles.createInput}
                required
              />
              <button 
                type="submit" 
                style={styles.submitButton}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </form>
          )}
          
          <div style={styles.libraryList}>
            {libraries.length === 0 ? (
              <div style={styles.emptyMessage}>
                No libraries yet. Create one!
              </div>
            ) : (
              libraries.map((library) => (
                <Link
                  key={library.id}
                  to={`/libraries/${library.id}`}
                  style={styles.libraryItem}
                  onClick={() => setIsOpen(false)}
                >
                  {library.name}
                  <span style={styles.libraryCount}>
                    ({library.literature_count || 0})
                  </span>
                </Link>
              ))
            )}
          </div>
          
          <div style={styles.dropdownFooter}>
            <Link 
              to="/libraries" 
              style={styles.viewAllLink}
              onClick={() => setIsOpen(false)}
            >
              View All Libraries →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  dropdownContainer: {
    position: "relative",
    display: "inline-block",
  },
  dropdownButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#495057",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.2s",
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    left: "0",
    backgroundColor: "white",
    border: "1px solid #dee2e6",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    minWidth: "280px",
    maxHeight: "400px",
    overflowY: "auto",
    zIndex: "1000",
    marginTop: "0.5rem",
  },
  dropdownHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    borderBottom: "1px solid #dee2e6",
  },
  dropdownTitle: {
    margin: "0",
    fontSize: "1rem",
    fontWeight: "600",
    color: "#212529",
  },
  createButton: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "0.25rem 0.75rem",
    borderRadius: "4px",
    fontSize: "0.875rem",
    cursor: "pointer",
  },
  createForm: {
    padding: "1rem",
    borderBottom: "1px solid #dee2e6",
    display: "flex",
    gap: "0.5rem",
  },
  createInput: {
    flex: "1",
    padding: "0.5rem",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    fontSize: "0.875rem",
  },
  submitButton: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    fontSize: "0.875rem",
    cursor: "pointer",
  },
  libraryList: {
    maxHeight: "250px",
    overflowY: "auto",
  },
  libraryItem: {
    display: "block",
    padding: "0.75rem 1rem",
    color: "#495057",
    textDecoration: "none",
    borderBottom: "1px solid #f8f9fa",
    transition: "background-color 0.2s",
    fontSize: "0.9rem",
  },
  libraryCount: {
    float: "right",
    color: "#6c757d",
    fontSize: "0.8rem",
  },
  emptyMessage: {
    padding: "1rem",
    textAlign: "center",
    color: "#6c757d",
    fontSize: "0.9rem",
  },
  dropdownFooter: {
    padding: "0.75rem 1rem",
    borderTop: "1px solid #dee2e6",
    backgroundColor: "#f8f9fa",
  },
  viewAllLink: {
    color: "#007bff",
    textDecoration: "none",
    fontSize: "0.875rem",
    fontWeight: "500",
  },
};


const addDropdownStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    .dropdown-button:hover {
      background-color: #f8f9fa;
    }
    .library-item:hover {
      background-color: #f8f9fa;
    }
    .create-button:hover {
      background-color: #0056b3;
    }
    .submit-button:hover {
      background-color: #218838;
    }
  `;
  document.head.appendChild(style);
};

addDropdownStyles();

export default LibraryDropdown;