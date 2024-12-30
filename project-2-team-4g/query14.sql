-- Regular Query #10: "Check to see if an employee is a manager"
-- Pseudocode: select ismanager from employees where the name is a given name
SELECT name, ismanager 
FROM employee 
WHERE name = 'Professor';
