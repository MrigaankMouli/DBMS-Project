import mysql from "mysql2/promise";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { S_ID, Name } = req.body;

  if (!S_ID || !Name) {
    return res.status(400).json({ message: "S_ID and Name are required." });
  }

  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password:"Ruex@0696", // Use environment variable for password
    database: "coursereg",
  });

  try {
    console.log("Attempting login for:", { S_ID, Name });

    // Trim the Name and use case-insensitive comparison
    const [rows] = await connection.execute(
      `SELECT S_ID, Name, Dep_ID, Total_Credit 
       FROM Student 
       WHERE S_ID = ? 
       AND TRIM(Name) COLLATE utf8mb4_general_ci = ?`,
      [S_ID, Name]
    );

    // Log the query result
    console.log("Query result:", rows);

    if (rows.length === 0) {
      console.log("Login failed - Invalid credentials:", { S_ID, Name });
      return res.status(401).json({ message: "Invalid credentials." });
    }

    console.log("Login successful. User data:", rows[0]);

    res.status(200).json({
      message: "Login successful.",
      user: rows[0], // Return the entire row (S_ID, Name, Dep_ID, Total_Credit)
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error." });
  } finally {
    await connection.end();
  }
}