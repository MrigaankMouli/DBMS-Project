-- Drop procedures if they already exist
DROP PROCEDURE IF EXISTS Register_Student_For_Course;
DROP PROCEDURE IF EXISTS AddApplication;
DROP PROCEDURE IF EXISTS UpdateApplicationStatus;

DELIMITER $$

CREATE PROCEDURE Register_Student_For_Course (
    IN p_S_ID INT,
    IN p_Course_ID INT,
    OUT p_Result VARCHAR(255)
)
BEGIN
    DECLARE v_Total_Credit INT DEFAULT 0;
    DECLARE v_Course_Credit INT DEFAULT 0;
    DECLARE v_Max_Credit INT DEFAULT 0;
    DECLARE v_Dep_ID INT DEFAULT 0;
    DECLARE v_Already_Applied INT DEFAULT 0;
    DECLARE v_Faculty_ID INT DEFAULT NULL;

    student_check: BEGIN

        IF NOT EXISTS (
            SELECT 1 FROM Student WHERE S_ID = p_S_ID
        ) THEN
            SET p_Result = 'Student does not exist.';
            LEAVE student_check;
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM Course WHERE Course_ID = p_Course_ID
        ) THEN
            SET p_Result = 'Course does not exist.';
            LEAVE student_check;
        END IF;

        SELECT Total_Credit, Dep_ID
        INTO v_Total_Credit, v_Dep_ID
        FROM Student
        WHERE S_ID = p_S_ID;

        SELECT Max_Credit
        INTO v_Max_Credit
        FROM Department
        WHERE Dep_ID = v_Dep_ID;

        SELECT Credit
        INTO v_Course_Credit
        FROM Course
        WHERE Course_ID = p_Course_ID;

        IF v_Total_Credit + v_Course_Credit > v_Max_Credit THEN
            SET p_Result = 'Max credits exceeded. Cannot apply for the course.';
            LEAVE student_check;
        END IF;

        SELECT COUNT(*)
        INTO v_Already_Applied
        FROM Application
        WHERE S_ID = p_S_ID AND Course_ID = p_Course_ID;

        IF v_Already_Applied > 0 THEN
            SET p_Result = 'Student has already applied for the selected course.';
            LEAVE student_check;
        END IF;

        SELECT Faculty_ID
        INTO v_Faculty_ID
        FROM Teaches
        WHERE Course_ID = p_Course_ID
        LIMIT 1;

        INSERT INTO Application (S_ID, Course_ID, Faculty_ID, Status)
        VALUES (p_S_ID, p_Course_ID, v_Faculty_ID, 'Pending');

        SET p_Result = 'Application successfully submitted for the course.';

    END student_check;
END$$

CREATE PROCEDURE UpdateApplicationStatus (
    IN p_Application_ID INT,
    IN p_Status VARCHAR(50)
)
BEGIN
    UPDATE Application
    SET Status = p_Status
    WHERE Application_ID = p_Application_ID;
END$$

DELIMITER ;
