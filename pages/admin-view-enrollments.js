import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function AdminViewEnrollments() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch courses and their enrolled students
  useEffect(() => {
    async function fetchEnrollments() {
      try {
        const response = await fetch("/api/enrollments");
        const data = await response.json();

        if (!response.ok || !data) {
          throw new Error("Failed to fetch enrollment data.");
        }

        setCourses(data);
      } catch (error) {
        console.error("Error fetching enrollment data:", error.message);
        setError(error.message);
      }
    }

    fetchEnrollments();
  }, []);

  // Handle course selection
  function handleCourseChange(event) {
    const courseId = event.target.value;
    const course = courses.find((c) => c.Course_ID === parseInt(courseId));
    setSelectedCourse(course);
  }

  // Navigate back to the Admin Dashboard
  function goToAdminDashboard() {
    router.push("/admin-dashboard");
  }

  return (
    <div style={styles.container}>
      <h1>Enrolled Students by Course</h1>

      {error && <div style={styles.error}>{error}</div>}

      {/* Dropdown menu to select a course */}
      {courses.length > 0 ? (
        <div style={styles.dropdownContainer}>
          <label htmlFor="courseSelect" style={styles.label}>
            Select a Course:
          </label>
          <select
            id="courseSelect"
            style={styles.dropdown}
            onChange={handleCourseChange}
          >
            <option value="">-- Select a Course --</option>
            {courses.map((course) => (
              <option key={course.Course_ID} value={course.Course_ID}>
                {course.Course_Name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p>No courses found with enrolled students.</p>
      )}

      {/* Display students for the selected course */}
      {selectedCourse && (
        <div style={styles.courseCard}>
          <h2>{selectedCourse.Course_Name}</h2>
          <p>
            <strong>Course Code:</strong> {selectedCourse.Course_Code}
          </p>
          <p>
            <strong>Total Enrolled:</strong>{" "}
            {selectedCourse.Enrolled_Students.length}
          </p>
          <div style={styles.studentList}>
            <h3>Enrolled Students:</h3>
            {selectedCourse.Enrolled_Students.length > 0 ? (
              selectedCourse.Enrolled_Students.map((student) => (
                <p key={student.S_ID}>
                  - {student.Name} (ID: {student.S_ID})
                </p>
              ))
            ) : (
              <p>No students enrolled in this course.</p>
            )}
          </div>
        </div>
      )}

      {/* Back to Admin Dashboard Button */}
      <button style={styles.button} onClick={goToAdminDashboard}>
        Back to Admin Dashboard
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
    padding: "20px",
  },
  dropdownContainer: {
    marginBottom: "20px",
  },
  label: {
    marginRight: "10px",
    fontSize: "16px",
  },
  dropdown: {
    width: "200px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    backgroundColor: "#ffffff",
    color: "#000000",
  },
  courseCard: {
    backgroundColor: "#1a1a1a",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
    textAlign: "left",
    width: "80%",
  },
  studentList: {
    marginTop: "10px",
    paddingLeft: "20px",
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