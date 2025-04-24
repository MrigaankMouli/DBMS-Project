import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AdminDashboard() {
  const [applications, setApplications] = useState([]); // Applications data from API
  const [error, setError] = useState(null); // Error handling
  const [success, setSuccess] = useState(null); // Success message
  const [loading, setLoading] = useState(false); // Loading state for status update
  const router = useRouter(); // For navigation

  // Fetch applications data from API
  useEffect(() => {
    async function fetchApplications() {
      try {
        const response = await fetch("/api/students"); // API to fetch all student applications
        const data = await response.json();

        if (!response.ok || !data) {
          throw new Error("Failed to fetch applications.");
        }

        // Filter only pending applications
        const pendingApplications = data.filter(
          (app) => app.Status === "Pending"
        );

        // Map student data from the table and prepare for display
        const applicationsWithDetails = pendingApplications.map((app) => ({
          ...app,
          Semester: app.Seniority || "N/A", // Map Seniority to Semester
        }));

        setApplications(applicationsWithDetails);
      } catch (error) {
        console.error("Error fetching applications:", error.message);
        setError(error.message);
      }
    }

    fetchApplications();
  }, []);

  // Handle application status update
  async function handleUpdateStatus(applicationId, status) {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/update-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, status }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update application status.");
      }

      setSuccess(`Application updated to ${status}.`);
      setApplications((prev) =>
        prev.filter((app) => app.Application_ID !== applicationId) // Remove updated application
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Navigation functions for other admin functionalities
  function goToAddCourse() {
    router.push("/admin-add-course");
  }

  function goToAddFaculty() {
    router.push("/admin-add-faculty");
  }

  function goToAddDepartment() {
    router.push("/admin-add-department");
  }

  function goToEnrollmentsView() {
    router.push("/admin-view-enrollments");
  }

  // Log out and navigate back to the login page
  function handleLogout() {
    router.push("/login"); // Navigate to the login page
  }

  return (
    <div style={styles.container}>
      <h1>Admin Dashboard</h1>

      {/* Navigation buttons */}
      <div style={styles.buttonGroup}>
        <button style={styles.navigationButton} onClick={goToAddCourse}>
          Add Course
        </button>
        <button style={styles.navigationButton} onClick={goToAddFaculty}>
          Add Faculty
        </button>
        <button style={styles.navigationButton} onClick={goToAddDepartment}>
          Add Department
        </button>
        <button style={styles.navigationButton} onClick={goToEnrollmentsView}>
          View Enrollments
        </button>
        <button style={styles.logoutButton} onClick={handleLogout}>
          Log Out
        </button>
      </div>

      {/* Display error or success messages */}
      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      {/* Display pending applications if they exist */}
      {applications.length > 0 ? (
        <div style={styles.table}>
          {applications.map((app) => (
            <div key={app.Application_ID} style={styles.row}>
              <p>
                <strong>{app.Student_Name}</strong> applied for{" "}
                <strong>{app.Course_Name}</strong>
              </p>
              <p><strong>Status:</strong> {app.Status}</p>
              <p><strong>CGPA:</strong> {app.CGPA || "N/A"}</p>
              <p><strong>Semester:</strong> {app.Semester}</p>
              <div style={styles.buttonContainer}>
                <button
                  onClick={() =>
                    handleUpdateStatus(app.Application_ID, "Accepted")
                  }
                  style={styles.acceptButton}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Accept"}
                </button>
                <button
                  onClick={() =>
                    handleUpdateStatus(app.Application_ID, "Rejected")
                  }
                  style={styles.rejectButton}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Reject"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No pending applications to display at the moment.</p>
      )}
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
    padding: "20px",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },
  navigationButton: {
    padding: "10px 15px",
    fontSize: "16px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "200px",
    textAlign: "center",
  },
  logoutButton: {
    padding: "10px 15px",
    fontSize: "16px",
    backgroundColor: "#FF5733",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "200px",
    textAlign: "center",
    marginTop: "10px",
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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: "10px",
  },
  acceptButton: {
    padding: "10px 15px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
  },
  rejectButton: {
    padding: "10px 15px",
    fontSize: "16px",
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  success: {
    color: "green",
    textAlign: "center",
    marginTop: "20px",
  },
};