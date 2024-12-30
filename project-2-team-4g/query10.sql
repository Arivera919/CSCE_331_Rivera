-- Regular Query #6: "Find orders with appetizers"
-- Pseudocode: Select orders that have appetizer in comboList attribute 
SELECT * 
FROM orders 
WHERE comboList LIKE '%Appetizer%';
