INSERT INTO Department (Dep_Name, HOD, Max_Credit)
VALUES
('Computer Science and Engineering', 'Dr. Rajesh Sharma', 20),
('Electrical Engineering', 'Dr. Anuradha Mehta', 18),
('Mechanical Engineering', 'Dr. Suresh Kumar', 22),
('Civil Engineering', 'Dr. Ramesh Gupta', 18),
('Electronics and Communication Engineering', 'Dr. Priya Nair', 20);

INSERT INTO Faculty (Faculty_Name, Dep_ID)
VALUES
('Prof. Arjun Verma', 1),
('Prof. Kavita Iyer', 1),
('Prof. Manish Singh', 2),
('Prof. Seema Bhattacharya', 2),
('Prof. Rohit Chatterjee', 3),
('Prof. Neha Agarwal', 3),
('Prof. Ramesh Bhat', 4),
('Prof. Anjali Deshpande', 4),
('Prof. Amitabh Mishra', 5),
('Prof. Shruti Das', 5);

INSERT INTO Course (Course_Name, Credit, Dep_ID, Max_Students, Is_Elective)
VALUES
('Data Structures', 4, 1, 60, 0),
('Algorithms', 4, 1, 60, 0),
('Operating Systems', 3, 1, 60, 0),
('Database Management Systems', 4, 1, 60, 0),
('Computer Networks', 3, 1, 60, 0),
('Circuit Analysis', 4, 2, 50, 0),
('Electromagnetics', 3, 2, 50, 0),
('Control Systems', 4, 2, 50, 0),
('Power Systems', 3, 2, 50, 0),
('Electrical Machines', 4, 2, 50, 0),
('Thermodynamics', 4, 3, 40, 0),
('Fluid Mechanics', 3, 3, 40, 0),
('Heat Transfer', 4, 3, 40, 0),
('Machine Design', 3, 3, 40, 0),
('Manufacturing Processes', 4, 3, 40, 0),
('Structural Analysis', 4, 4, 30, 0),
('Construction Materials', 3, 4, 30, 0),
('Geotechnical Engineering', 4, 4, 30, 0),
('Hydraulics', 3, 4, 30, 0),
('Environmental Engineering', 4, 4, 30, 0),
('Digital Signal Processing', 4, 5, 50, 0),
('Analog Circuits', 3, 5, 50, 0),
('Communication Systems', 4, 5, 50, 0),
('Microelectronics', 3, 5, 50, 0),
('VLSI Design', 4, 5, 50, 0);

INSERT INTO Offers (Faculty_ID, Course_ID)
VALUES
(1, 1), (1, 2),
(2, 3), (2, 4),
(3, 6), (3, 7),
(4, 8), (4, 9),
(5, 11), (5, 12),
(6, 13), (6, 14),
(7, 16), (7, 17),
(8, 18), (8, 19),
(9, 21), (9, 22),
(10, 23), (10, 24);

INSERT INTO Schedule (Course_ID, Day, Time_Start, Time_End, Room_No, Building)
VALUES
(1, 'Monday', '09:00:00', '10:30:00', '101', 'Engineering Block A'),
(2, 'Tuesday', '11:00:00', '12:30:00', '102', 'Engineering Block A'),
(3, 'Wednesday', '14:00:00', '15:30:00', '103', 'Engineering Block A'),
(4, 'Thursday', '16:00:00', '17:30:00', '104', 'Engineering Block A'),
(5, 'Friday', '10:00:00', '11:30:00', '105', 'Engineering Block A'),
(6, 'Monday', '09:00:00', '10:30:00', '201', 'Electrical Block'),
(7, 'Tuesday', '11:00:00', '12:30:00', '202', 'Electrical Block'),
(8, 'Wednesday', '14:00:00', '15:30:00', '203', 'Electrical Block'),
(9, 'Thursday', '16:00:00', '17:30:00', '204', 'Electrical Block'),
(10, 'Friday', '10:00:00', '11:30:00', '205', 'Electrical Block'),
(11, 'Monday', '09:00:00', '10:30:00', '301', 'Mechanical Block'),
(12, 'Tuesday', '11:00:00', '12:30:00', '302', 'Mechanical Block'),
(13, 'Wednesday', '14:00:00', '15:30:00', '303', 'Mechanical Block'),
(14, 'Thursday', '16:00:00', '17:30:00', '304', 'Mechanical Block'),
(15, 'Friday', '10:00:00', '11:30:00', '305', 'Mechanical Block'),
(16, 'Monday', '09:00:00', '10:30:00', '401', 'Civil Block'),
(17, 'Tuesday', '11:00:00', '12:30:00', '402', 'Civil Block'),
(18, 'Wednesday', '14:00:00', '15:30:00', '403', 'Civil Block'),
(19, 'Thursday', '16:00:00', '17:30:00', '404', 'Civil Block'),
(20, 'Friday', '10:00:00', '11:30:00', '405', 'Civil Block'),
(21, 'Monday', '09:00:00', '10:30:00', '501', 'Electronics Block'),
(22, 'Tuesday', '11:00:00', '12:30:00', '502', 'Electronics Block'),
(23, 'Wednesday', '14:00:00', '15:30:00', '503', 'Electronics Block'),
(24, 'Thursday', '16:00:00', '17:30:00', '504', 'Electronics Block'),
(25, 'Friday', '10:00:00', '11:30:00', '505', 'Electronics Block');