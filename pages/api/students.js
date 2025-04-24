import mysql from "mysql2/promise";

export default async function handler(req, res) {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Ruex@0696",
    database: "coursereg",
  });

  try {
    // Fetch applications from the Application table and join with Student and Course tables
    const [rows] = await connection.execute(`
      SELECT 
        Application.Application_ID,
        Student.Name AS Student_Name,
        Student.CGPA,
        Student.Seniority AS Semester,
        Course.Course_Name,
        Application.Status
      FROM Application
      INNER JOIN Student ON Application.S_ID = Student.S_ID
      INNER JOIN Course ON Application.Course_ID = Course.Course_ID
    `);

    // Map seniority to semester for each row
    const applications = rows.map((row) => ({
      ...row,
      Semester: row.Semester || "N/A", // Map Seniority as Semester, default to "N/A" if null
    }));

    // Return the applications with GPA and Semester details
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Error fetching applications." });
  } finally {
    await connection.end();
  }
}