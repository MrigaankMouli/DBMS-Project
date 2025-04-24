import mysql from "mysql2/promise";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    courseName,
    courseCode,
    description,
    credit,
    depId,
    maxStudents,
    isElective,
    facultyId,
    schedule,
  } = req.body;

  if (
    !courseName ||
    !courseCode ||
    !description ||
    !credit ||
    !depId ||
    !maxStudents ||
    !facultyId ||
    !schedule.day ||
    !schedule.timeStart ||
    !schedule.timeEnd ||
    !schedule.roomNo ||
    !schedule.building
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Ruex@0696",
    database: "coursereg",
    port: 3306,
  });

  try {
    await connection.beginTransaction();

    const [courseResult] = await connection.execute(
      `
      INSERT INTO Course 
        (Course_Name, Course_Code, Description, Credit, Dep_ID, Max_Students, Is_Elective) 
      VALUES 
        (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        courseName,
        courseCode,
        description,
        credit,
        depId,
        maxStudents,
        isElective ? 1 : 0,
      ]
    );

    const courseId = courseResult.insertId; 

    await connection.execute(
      `
      INSERT INTO Schedule 
        (Course_ID, Day, Time_Start, Time_End, Room_No, Building) 
      VALUES 
        (?, ?, ?, ?, ?, ?)
      `,
      [
        courseId,
        schedule.day,
        schedule.timeStart,
        schedule.timeEnd,
        schedule.roomNo,
        schedule.building,
      ]
    );

    await connection.execute(
      `
      INSERT INTO Teaches 
        (Faculty_ID, Course_ID) 
      VALUES 
        (?, ?)
      `,
      [facultyId, courseId]
    );

    await connection.commit();

    res.status(200).json({ message: "Course, schedule, and faculty added successfully!" });
  } catch (error) {
    console.error("Error adding course, schedule, or faculty:", error);

    await connection.rollback();

    res.status(500).json({ message: "Failed to add course, schedule, or faculty." });
  } finally {
    connection.end();
  }
}