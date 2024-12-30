-- Regular Query #9: "Stock remaining of a certain inventory item"
SELECT name, quantity
FROM inventoryitem
WHERE name = 'Chicken'