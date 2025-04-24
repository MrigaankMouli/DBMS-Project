import mysql from "mysql2/promise";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { applicationId, status } = req.body;

  const connection = await mysql.createConnection({host: "localhost",      // Replace with your database host (e.g., 127.0.0.1 or a remote host)
    user: "root",  // Replace with your database username
    password: "Ruex@0696", // Replace with your database password
    database: "coursereg", // Replace with your database name
    port: 3306,    });

  try {
    await connection.execute("CALL UpdateApplicationStatus(?, ?)", [applicationId, status]);

    res.status(200).json({ message: `Application status updated to ${status}.` });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ message: "Failed to update application status." });
  } finally {
    connection.end();
  }
}