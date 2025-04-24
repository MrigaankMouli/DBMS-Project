import mysql from "mysql2/promise";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  const { S_ID, Course_ID } = req.body;

  if (!S_ID || !Course_ID) {
    return res.status(400).json({ message: "S_ID and Course_ID are required." });
  }

  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD || "Ruex@0696", // Use environment variable for password
    database: "coursereg",
  });

  try {
    // Check if the student has already applied for the course
    const [existingApplication] = await connection.execute(
      `SELECT * FROM Application WHERE S_ID = ? AND Course_ID = ?`,
      [S_ID, Course_ID]
    );

    if (existingApplication.length > 0) {
      return res
        .status(409)
        .json({ message: "You have already applied for this course." });
    }

    // Insert a new application
    await connection.execute(
      `INSERT INTO Application (S_ID, Course_ID, Faculty_ID, Status) 
      SELECT ?, ?, Faculty_ID, 'Pending' 
      FROM Teaches
      WHERE Course_ID = ? LIMIT 1`,
      [S_ID, Course_ID, Course_ID]
    );

    res.status(201).json({ message: "Course application submitted successfully." });
  } catch (error) {
    console.error("Error registering course:", error);
    res.status(500).json({ message: "Internal server error." });
  } finally {
    await connection.end();
  }
}