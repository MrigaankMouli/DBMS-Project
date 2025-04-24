import mysql from "mysql2/promise";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { S_ID, Name, Department, CGPA, Semester, Total_Credit } = req.body;

  if (!S_ID || !Name || !Department || CGPA === undefined || !Semester) {
    return res.status(400).json({
      message: "S_ID, Name, Department, CGPA, and Semester are required.",
    });
  }

  if (CGPA < 0 || CGPA > 10) {
    return res
      .status(400)
      .json({ message: "CGPA must be between 0.00 and 10.00." });
  }
  if (Semester < 0) {
    return res
      .status(400)
      .json({ message: "Semester must be a non-negative value." });
  }

  const totalCredit = Total_Credit !== undefined ? Total_Credit : 0;

  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Ruex@0696",
    database: "coursereg",
  });

  try {
    await connection.execute(
      "INSERT INTO Student (S_ID, Name, Dep_ID, CGPA, Seniority, Total_Credit) VALUES (?, ?, ?, ?, ?, ?)",
      [S_ID, Name, Department, CGPA, Semester, totalCredit]
    );

    res.status(201).json({ message: "Student registered successfully!" });
  } catch (error) {
    console.error("Error registering student:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ message: "A student with this S_ID already exists." });
    }

    res.status(500).json({ message: "Failed to register student." });
  } finally {
    connection.end();
  }
}