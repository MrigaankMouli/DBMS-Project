import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function RegisterCourse() {
  const [user, setUser] = useState(null); // User data from API
  const [courses, setCourses] = useState([]); // Courses data from API
  const [selectedCourse, setSelectedCourse] = useState(null); // Selected course
  const [error, setError] = useState(null); // Error handling
  const [success, setSuccess] = useState(null); // Success message
  const [loading, setLoading] = useState(false); // Loading state for registration
  const router = useRouter();

  // Fetch user data from API
  useEffect(() => {
    async function fetchUser() {
      try {
        const S_ID = localStorage.getItem("S_ID");
        const Name = localStorage.getItem("Name");

        if (!S_ID || !Name) {
          throw new Error("Missing S_ID or Name in localStorage. Please log in again.");
        }

        const response = await fetch("/api/login-student", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ S_ID, Name }),
        });

        const userData = await response.json();

        if (!response.ok || !userData) {
          throw new Error(userData.message || "Failed to fetch user data.");
        }

        setUser(userData.user); // Assuming the API response has `user` object
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        setError(error.message);
        setTimeout(() => router.push("/login"), 3000); // Redirect to login after 3 seconds
      }
    }

    fetchUser();
  }, [router]);

  // Fetch courses data from API
  useEffect(() => {
    async function fetchCourses() {
      if (user) {
        try {
          const response = await fetch(`/api/courses?Dep_ID=${user.Dep_ID}`);
          const data = await response.json();

          if (!response.ok || !data) {
            throw new Error(data.message || "Failed to fetch courses.");
          }

          setCourses(data.courses);
        } catch (error) {
          console.error("Error fetching courses:", error.message);
          setError(error.message);
        }
      }
    }

    fetchCourses();
  }, [user]);

  // Handle course registration
  async function handleRegister() {
    if (!selectedCourse) {
      alert("Please select a course first.");
      return;
    }

    const confirmRegistration = window.confirm(
      `Are you sure you want to apply for the course: ${selectedCourse.Course_Name}?`
    );

    if (!confirmRegistration) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/register-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          S_ID: user.S_ID, // Use the correct user ID from the user object
          Course_ID: selectedCourse.Course_ID,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to register for the course.");
      }

      setSuccess(result.message);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Navigate to Application Status page
  function goToApplicationStatus() {
    router.push("/student-application-status"); // Navigate to the application status page
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

      {/* User Information */}
      {error ? (
        <div style={styles.error}>
          <p>{error}</p>
        </div>
      ) : user ? (
        <div style={styles.userInfo}>
          <h1>Welcome, {user.Name || "N/A"}</h1>
          <p>Registration Number: {user.S_ID || "N/A"}</p>
          <p>Total Credits: {user.Total_Credit || 0}</p>
          <button style={styles.statusButton} onClick={goToApplicationStatus}>
            Go to Application Status
          </button>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}

      {/* Main Content */}
      {user && courses.length > 0 ? (
        <div style={styles.content}>
          <div style={styles.dropdownSection}>
            <h2>Select a Course</h2>
            <select
              style={styles.dropdown}
              onChange={(e) =>
                setSelectedCourse(
                  courses.find((course) => course.Course_ID === parseInt(e.target.value))
                )
              }
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.Course_ID} value={course.Course_ID}>
                  {course.Course_Name}
                </option>
              ))}
            </select>
          </div>
          <div style={styles.descriptionSection}>
            {selectedCourse ? (
              <>
                <h2>{selectedCourse.Course_Name || "N/A"}</h2>
                <p>{selectedCourse.Description || "No description available"}</p>
                <p>Credits: {selectedCourse.Credit || "N/A"}</p>
                <p>Faculty: {selectedCourse.Faculty_Name || "N/A"}</p>
                <p>Schedule: {selectedCourse.Day || "N/A"} {selectedCourse.Time_Start || "N/A"} - {selectedCourse.Time_End || "N/A"}</p>
                <p>Room: {selectedCourse.Room_No || "N/A"}, {selectedCourse.Building || "N/A"}</p>
                <button
                  style={styles.button}
                  onClick={handleRegister}
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </>
            ) : (
              <p>Select a course to see the details.</p>
            )}
          </div>
        </div>
      ) : user && courses.length === 0 ? (
        <p>No courses available for your department.</p>
      ) : null}

      {/* Success Message */}
      {success && <div style={styles.success}>{success}</div>}
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
  userInfo: {
    marginBottom: "20px",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
  },
  dropdownSection: {
    marginBottom: "20px",
  },
  dropdown: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    backgroundColor: "#ffffff",
    color: "#000000",
  },
  descriptionSection: {
    backgroundColor: "#1a1a1a",
    padding: "20px",
    borderRadius: "10px",
    width: "100%",
    textAlign: "center",
  },
  button: {
    marginTop: "10px",
    padding: "10px 15px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  statusButton: {
    marginTop: "10px",
    padding: "10px 15px",
    fontSize: "16px",
    backgroundColor: "#007BFF",
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