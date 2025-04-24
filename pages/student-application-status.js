import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function StudentApplicationStatus() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch applications data
  useEffect(() => {
    async function fetchApplications() {
      try {
        const S_ID = localStorage.getItem("S_ID");

        if (!S_ID) {
          throw new Error("Missing S_ID in localStorage. Please log in again.");
        }

        const response = await fetch(`/api/student-applications?S_ID=${S_ID}`);
        const data = await response.json();

        if (!response.ok || !data) {
          throw new Error("Failed to fetch applications.");
        }

        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error.message);
        setError(error.message);
      }
    }

    fetchApplications();
  }, []);

  // Navigate back to the Register Course page
  function goToRegisterCourse() {
    router.push("/register-course"); // Update this path if the actual route is different
  }

  // Handle log out
  function handleLogout() {
    localStorage.removeItem("S_ID");
    localStorage.removeItem("Name");
    router.push("/login"); // Navigate to the login page
  }

  return (
    <div style={styles.container}>
      {/* Log Out Button */}
      <div style={styles.logoutContainer}>
        <button style={styles.logoutButton} onClick={handleLogout}>
          Log Out
        </button>
      </div>

      <h1>Application Status</h1>

      {error && <div style={styles.error}>{error}</div>}

      {applications.length > 0 ? (
        <div style={styles.table}>
          {applications.map((app) => (
            <div key={app.Application_ID} style={styles.row}>
              <p>
                <strong>Course:</strong> {app.Course_Name}
              </p>
              <p>
                <strong>Status:</strong> {app.Status}
              </p>
              <p>
                <strong>Application ID:</strong> {app.Application_ID}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No applications found.</p>
      )}

      {/* Back to Register Course Button */}
      <button style={styles.button} onClick={goToRegisterCourse}>
        Back to Register Course
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
    color: "#ffffff",
    height: "100vh",
    textAlign: "center",
    position: "relative",
  },
  logoutContainer: {
    position: "absolute",
    top: "20px",
    right: "20px",
  },
  logoutButton: {
    padding: "10px 15px",
    fontSize: "16px",
    backgroundColor: "#FF5733",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  table: {
    width: "80%",
    marginTop: "20px",
  },
  row: {
    backgroundColor: "#1a1a1a",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  button: {
    marginTop: "20px",
    padding: "10px 15px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};