import mysql from "mysql2/promise";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { facultyName, departmentId } = req.body;

  if (!facultyName || !departmentId) {
    return res.status(400).json({ message: "Faculty Name and Department ID are required." });
  }

  const connection = await mysql.createConnection({
    host: "localhost", 
    user: "root", 
    password: "Ruex@0696", 
    database: "coursereg", 
    port: 3306,
  });

  try {
    await connection.execute(
      `
      INSERT INTO Faculty (Faculty_Name, Dep_ID) 
      VALUES (?, ?)
      `,
      [facultyName, departmentId]
    );

    res.status(200).json({ message: "Faculty added successfully!" });
  } catch (error) {
    console.error("Error adding faculty:", error);

    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      res.status(400).json({ message: "Invalid Department ID. It does not exist in the Department table." });
    } else {
      res.status(500).json({ message: "Failed to add faculty." });
    }
  } finally {
    connection.end();
  }
}