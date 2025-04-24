import mysql from "mysql2/promise";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { departmentName, hodName, maxCredits } = req.body;

  if (!departmentName || !hodName || !maxCredits) {
    return res
      .status(400)
      .json({ message: "Department Name, HOD, and Max Credits are required." });
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
      INSERT INTO Department (Dep_Name, HOD, Max_Credit) 
      VALUES (?, ?, ?)
      `,
      [departmentName, hodName, maxCredits]
    );

    res.status(200).json({ message: "Department added successfully!" });
  } catch (error) {
    console.error("Error adding department:", error);

    res.status(500).json({ message: "Failed to add department." });
  } finally {
    connection.end();
  }
}