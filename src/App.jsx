// src/App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { verifyUser } from "./services/users";
import Navigation from "./components/Navigation";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import LiteratureList from "./pages/LiteratureList";
import LiteratureDetail from "./pages/LiteratureDetail";
import CreateLiterature from "./pages/CreateLiterature";
import Home from "./pages/Home";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await verifyUser();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Verification failed:", error);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div style={styles.app}>
        <Navigation user={user} setUser={setUser} />
        <div style={styles.content}>
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<SignUp setUser={setUser} />} />
            <Route
              path="/literature"
              element={
                <PrivateRoute user={user}>
                  <LiteratureList user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path="/literature/:id"
              element={
                <PrivateRoute user={user}>
                  <LiteratureDetail user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-literature"
              element={
                <PrivateRoute user={user}>
                  <CreateLiterature user={user} />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f8f9fa",
  },
  loading: {
    fontSize: "1.5rem",
    color: "#495057",
  },
};

export default App;