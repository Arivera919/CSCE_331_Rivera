-- Regular Query #5: "Find orders with drinks"
-- Pseudocode: Select orders that have drink in comboList attribute 
SELECT * 
FROM orders 
WHERE comboList LIKE '%Drink%';
