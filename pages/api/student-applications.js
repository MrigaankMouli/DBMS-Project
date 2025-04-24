import mysql from "mysql2/promise";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { S_ID } = req.query;

  const connection = await mysql.createConnection({ host: "localhost",      // Replace with your database host (e.g., 127.0.0.1 or a remote host)
    user: "root",  // Replace with your database username
    password: "Ruex@0696", // Replace with your database password
    database: "coursereg", // Replace with your database name
    port: 3306,    });

  try {
    const [rows] = await connection.execute(
      "SELECT a.Application_ID, c.Course_Name, a.Status " +
      "FROM Application a " +
      "JOIN Course c ON a.Course_ID = c.Course_ID " +
      "WHERE a.S_ID = ?",
      [S_ID]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Failed to fetch applications." });
  } finally {
    connection.end();
  }
}