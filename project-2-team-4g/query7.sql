-- Regular Query #3: "Find 5 inventory items with least quantity"
-- Pseudocode: select 5 inventory items with the least inventory
SELECT name, quantity
FROM inventoryitem
ORDER BY quantity ASC
LIMIT 5;