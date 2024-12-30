-- Regular Query #8: "How much did a certain employee work in the year"
SELECT 
    e.name,
    SUM(t.timeClockedOut - t.timeClockedIn) AS total_time_worked
FROM 
    employee e
JOIN 
    timesheets t ON e.employeeId = t.cashierId
GROUP BY 
    e.employeeId, e.name;