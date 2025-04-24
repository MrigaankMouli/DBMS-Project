    DROP TABLE IF EXISTS Schedule;
    DROP TABLE IF EXISTS Application;
    DROP TABLE IF EXISTS Status;
    DROP TABLE IF EXISTS Enrolled;
    DROP TABLE IF EXISTS Enrollment;
    DROP TABLE IF EXISTS Teaches;
    DROP TABLE IF EXISTS Course;
    DROP TABLE IF EXISTS Student;
    DROP TABLE IF EXISTS Faculty;
    DROP TABLE IF EXISTS Department;
    DROP TABLE IF EXISTS AcceptedApplications;

    CREATE TABLE Department (
        Dep_ID INT AUTO_INCREMENT PRIMARY KEY,
        Dep_Name VARCHAR(255) NOT NULL,
        HOD VARCHAR(255) NOT NULL,
        Max_Credit INT NOT NULL
    );


    CREATE TABLE Faculty (
        Faculty_ID INT AUTO_INCREMENT PRIMARY KEY,
        Faculty_Name VARCHAR(255) NOT NULL,
        Dep_ID INT NOT NULL,
        FOREIGN KEY (Dep_ID) REFERENCES Department(Dep_ID) ON DELETE CASCADE
    );

    CREATE TABLE Student (
        S_ID INT AUTO_INCREMENT PRIMARY KEY,
        Name VARCHAR(255) NOT NULL,
        CGPA DECIMAL(3,2) CHECK (CGPA >= 0 AND CGPA <= 10),
        Dep_ID INT NOT NULL,
        Seniority INT CHECK (Seniority >= 0),
        Total_Credit INT DEFAULT 0 CHECK (Total_Credit >= 0),
        FOREIGN KEY (Dep_ID) REFERENCES Department(Dep_ID) ON DELETE CASCADE
    );


    CREATE TABLE Course (               
        Course_ID INT AUTO_INCREMENT PRIMARY KEY,
        Course_Name VARCHAR(255) NOT NULL,
        Course_Code VARCHAR(20) NOT NULL UNIQUE,
        Credit INT NOT NULL CHECK (Credit > 0),
        Dep_ID INT NOT NULL,
        Max_Students INT NOT NULL CHECK (Max_Students > 0),
        Description TEXT,
        FOREIGN KEY (Dep_ID) REFERENCES Department(Dep_ID) ON DELETE CASCADE
    );

    CREATE TABLE Teaches (
        Faculty_ID INT,
        Course_ID INT,
        PRIMARY KEY (Faculty_ID, Course_ID),
        FOREIGN KEY (Faculty_ID) REFERENCES Faculty(Faculty_ID) ON DELETE CASCADE,
        FOREIGN KEY (Course_ID) REFERENCES Course(Course_ID) ON DELETE CASCADE
    );

    CREATE TABLE Schedule (
        Sched_ID INT AUTO_INCREMENT PRIMARY KEY,
        Course_ID INT NOT NULL,
        Day VARCHAR(20) NOT NULL,
        Time_Start TIME NOT NULL,
        Time_End TIME NOT NULL,
        Room_No VARCHAR(10) NOT NULL,
        Building VARCHAR(255) NOT NULL,
        FOREIGN KEY (Course_ID) REFERENCES Course(Course_ID) ON DELETE CASCADE
    );

    CREATE TABLE Application (
        Application_ID INT AUTO_INCREMENT PRIMARY KEY,
        S_ID INT NOT NULL,
        Course_ID INT NOT NULL,
        Faculty_ID INT NOT NULL,
        Status ENUM('Pending', 'Accepted', 'Rejected') DEFAULT 'Pending',
        Applied_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (S_ID) REFERENCES Student(S_ID) ON DELETE CASCADE,
        FOREIGN KEY (Course_ID) REFERENCES Course(Course_ID) ON DELETE CASCADE,
        FOREIGN KEY (Faculty_ID) REFERENCES Faculty(Faculty_ID) ON DELETE CASCADE
    );

CREATE TABLE AcceptedApplications (
    Accepted_ID INT AUTO_INCREMENT PRIMARY KEY,
    S_ID INT NOT NULL,
    Course_ID INT NOT NULL,
    Faculty_ID INT NOT NULL,
    FOREIGN KEY (S_ID) REFERENCES Student(S_ID) ON DELETE CASCADE,
    FOREIGN KEY (Course_ID) REFERENCES Course(Course_ID) ON DELETE CASCADE,
    FOREIGN KEY (Faculty_ID) REFERENCES Faculty(Faculty_ID) ON DELETE CASCADE
);
