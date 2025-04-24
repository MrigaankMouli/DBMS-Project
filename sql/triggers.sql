DELIMITER //

CREATE TRIGGER AfterApplicationAccepted
AFTER UPDATE ON Application
FOR EACH ROW
BEGIN
    DECLARE v_Course_Credit INT DEFAULT 0;

    IF NEW.Status = 'Accepted' AND OLD.Status != 'Accepted' THEN  
        SELECT Credit INTO v_Course_Credit
        FROM Course
        WHERE Course_ID = NEW.Course_ID;

        UPDATE Student
        SET Total_Credit = Total_Credit + v_Course_Credit
        WHERE S_ID = NEW.S_ID;
    END IF;
END//

DELIMITER ;


DELIMITER //

CREATE TRIGGER AddtoAcceptedApplications
AFTER UPDATE ON Application
FOR EACH ROW
BEGIN
    IF NEW.Status = 'Accepted' THEN
        INSERT INTO AcceptedApplications (S_ID, Course_ID, Faculty_ID)
        VALUES (NEW.S_ID, NEW.Course_ID, NEW.Faculty_ID);
    END IF;
END//

DELIMITER ;