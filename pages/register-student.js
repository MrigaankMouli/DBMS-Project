import { useState } from "react";
import { useRouter } from "next/router";

export default function RegisterStudent() {
  const [formData, setFormData] = useState({
    S_ID: "",
    Name: "",
    Department: "",
    CGPA: "",
    Semester: "",
    Total_Credit: "0", 
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/register-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to register student.");
      }

      localStorage.setItem("S_ID", formData.S_ID);
      localStorage.setItem("Name", formData.Name);

      setSuccess("Student registered successfully!");
      setTimeout(() => router.push("/login"), 3000); 
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Register Student</h1>

      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="S_ID"
          placeholder="Student ID"
          value={formData.S_ID}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="text"
          name="Name"
          placeholder="Name"
          value={formData.Name}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="text"
          name="Department"
          placeholder="Department"
          value={formData.Department}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="number"
          step="0.01"
          name="CGPA"
          placeholder="CGPA (0.00 - 10.00)"
          value={formData.CGPA}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="number"
          name="Semester"
          placeholder="Semester"
          value={formData.Semester}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="number"
          name="Total_Credit"
          placeholder="Total Credit (default: 0)"
          value={formData.Total_Credit}
          onChange={handleChange}
          style={styles.input}
          disabled 
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
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
  button: {
    padding: "10px 15px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
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