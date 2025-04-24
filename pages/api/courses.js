import mysql from "mysql2/promise";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { Dep_ID } = req.query;

  if (!Dep_ID) {
    return res.status(400).json({ message: "Dep_ID is required." });
  }

  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Ruex@0696", 
    database: "coursereg",
  });

  try {
    const [rows] = await connection.execute(
      `SELECT 
        Course.Course_ID,
        Course.Course_Name,
        Course.Course_Code,
        Course.Credit,
        Course.Description,
        Course.Max_Students,
        Faculty.Faculty_Name,
        Schedule.Day,
        Schedule.Time_Start,
        Schedule.Time_End,
        Schedule.Room_No,
        Schedule.Building
      FROM Course
      LEFT JOIN Teaches ON Course.Course_ID = Teaches.Course_ID
      LEFT JOIN Faculty ON Teaches.Faculty_ID = Faculty.Faculty_ID
      LEFT JOIN Schedule ON Course.Course_ID = Schedule.Course_ID
      WHERE Course.Dep_ID = ?`,
      [Dep_ID]
    );

    res.status(200).json({ courses: rows });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Internal server error." });
  } finally {
    await connection.end();
  }
}