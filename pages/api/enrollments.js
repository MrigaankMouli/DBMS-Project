import mysql from "mysql2/promise";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD || "Ruex@0696", // Use environment variable for password
    database: "coursereg",
  });

  try {
    // Fetch courses
    const [courses] = await connection.execute(`
      SELECT Course.Course_ID, Course.Course_Name, Course.Course_Code
      FROM Course
    `);

    // Fetch accepted students for each course
    const courseDetails = await Promise.all(
      courses.map(async (course) => {
        const [students] = await connection.execute(
          `
          SELECT Student.S_ID, Student.Name
          FROM AcceptedApplications
          JOIN Student ON AcceptedApplications.S_ID = Student.S_ID
          WHERE AcceptedApplications.Course_ID = ?
          `,
          [course.Course_ID]
        );

        return {
          ...course,
          Enrolled_Students: students,
        };
      })
    );

    res.status(200).json(courseDetails);
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    res.status(500).json({ message: "Internal server error." });
  } finally {
    await connection.end();
  }
}