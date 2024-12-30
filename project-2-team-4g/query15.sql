-- Regular Query #11: "List all employees who worked on a holiday"
-- Pseudocode : list all employee who worked on christmas and their clockin/clock out time
SELECT name, cashierid, timeClockedIn, timeClockedOut
FROM timesheets
JOIN employee
ON cashierid = employeeid
WHERE dateof = '2023-12-25';