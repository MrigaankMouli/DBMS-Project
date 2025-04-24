const ADMIN_CREDENTIALS = {
    username: "admin", // Replace with your desired admin username
    password: "admin1234", // Replace with your desired admin password
  };
  
  export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }
  
    // Validate the provided credentials
    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      return res.status(200).json({ message: "Login successful." });
    } else {
      return res.status(401).json({ error: "Invalid username or password." });
    }
  }