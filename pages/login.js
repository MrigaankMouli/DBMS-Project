import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [formData, setFormData] = useState({
    S_ID: '',
    Name: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/login-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save S_ID, Name, and Dep_ID in localStorage
      localStorage.setItem('S_ID', data.user.S_ID);
      localStorage.setItem('Name', data.user.Name);
      localStorage.setItem('Dep_ID', data.user.Dep_ID);

      console.log("Stored S_ID:", localStorage.getItem('S_ID'));
      console.log("Stored Name:", localStorage.getItem('Name'));
      console.log("Stored Dep_ID:", localStorage.getItem('Dep_ID'));

      // Navigate to the register-course page
      router.push(`/register-course`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSwitchToRegister() {
    router.push('/register-student');
  }

  function handleSwitchToAdminLogin() {
    router.push('/admin-login');
  }

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Welcome Back!</h1>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="S_ID"
            placeholder="Student ID"
            value={formData.S_ID}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="Name"
            placeholder="Name"
            value={formData.Name}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <button onClick={handleSwitchToRegister} style={styles.registerButton}>
          Switch to Student Registration
        </button>
        <button onClick={handleSwitchToAdminLogin} style={styles.adminLoginButton}>
          Switch to Admin Login
        </button>
      </div>
      <div style={styles.imageContainer}>
        <img
          src="/Manipal_Logo.png"
          alt="Manipal University Logo"
          style={styles.image}
        />
      </div>
    </div>
  );
}

// Styles remain unchanged
const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#000',
    color: '#fff',
    fontFamily: "'Arial', sans-serif",
  },
  formContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  error: {
    color: 'red',
    marginBottom: '1rem',
  },
  form: {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    fontSize: '1.2rem',
    padding: '0.8rem',
    margin: '0.5rem 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '100%',
  },
  button: {
    fontSize: '1.2rem',
    padding: '0.8rem',
    margin: '1rem 0',
    borderRadius: '5px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  registerButton: {
    fontSize: '1rem',
    padding: '0.6rem',
    marginTop: '0.5rem',
    borderRadius: '5px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  adminLoginButton: {
    fontSize: '1rem',
    padding: '0.6rem',
    marginTop: '0.5rem',
    borderRadius: '5px',
    backgroundColor: '#FFA500',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  imageContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  image: {
    maxWidth: '90%',
    maxHeight: '90%',
    objectFit: 'cover',
  },
};