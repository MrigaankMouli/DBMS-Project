import { useState } from "react";
import { useRouter } from "next/router";

export default function AddCourse() {
  const [formData, setFormData] = useState({
    courseName: "",
    courseCode: "",
    description: "",
    credit: 0,
    depId: "",
    maxStudents: 0,
    facultyId: "", 
    schedule: {
      day: "",
      timeStart: "",
      timeEnd: "",
      roomNo: "",
      building: "",
    }, 
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const actualValue = type === "checkbox" ? checked : value;

    if (name.startsWith("schedule.")) {
      const scheduleKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        schedule: { ...prev.schedule, [scheduleKey]: actualValue },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: actualValue }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/add-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add course.");
      }

      setSuccess("Course, schedule, and faculty added successfully!");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const goToAdminDashboard = () => {
    router.push("/admin-dashboard");
  };

  return (
    <div style={styles.container}>
      <h1>Add Course</h1>

      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="courseName"
          placeholder="Course Name"
          value={formData.courseName}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="text"
          name="courseCode"
          placeholder="Course Code"
          value={formData.courseCode}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <textarea
          name="description"
          placeholder="Course Description"
          value={formData.description}
          onChange={handleChange}
          style={styles.textarea}
          required
        />
        <input
          type="number"
          name="credit"
          placeholder="Credits"
          value={formData.credit}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="text"
          name="depId"
          placeholder="Department ID"
          value={formData.depId}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="number"
          name="maxStudents"
          placeholder="Max Students"
          value={formData.maxStudents}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="text"
          name="facultyId"
          placeholder="Faculty ID"
          value={formData.facultyId}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <h3>Schedule Details</h3>
        <input
          type="text"
          name="schedule.day"
          placeholder="Day (e.g., Monday)"
          value={formData.schedule.day}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="time"
          name="schedule.timeStart"
          placeholder="Start Time"
          value={formData.schedule.timeStart}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="time"
          name="schedule.timeEnd"
          placeholder="End Time"
          value={formData.schedule.timeEnd}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="text"
          name="schedule.roomNo"
          placeholder="Room Number"
          value={formData.schedule.roomNo}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="text"
          name="schedule.building"
          placeholder="Building"
          value={formData.schedule.building}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Adding Course..." : "Add Course"}
        </button>
      </form>

      <button style={styles.backButton} onClick={goToAdminDashboard}>
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
  },
  form: {
    width: "80%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "10px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "10px",
    minHeight: "100px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
    fontSize: "16px",
  },
  checkbox: {
    marginRight: "10px",
  },
  button: {
    padding: "10px 15px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  backButton: {
    marginTop: "20px",
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