-- Special Query #4: "Menu Item Inventory"
-- pseudocode: select count of inventory items from inventory and menu grouped by menu item
-- about: given a specific menu item, how many items from the inventory does that menu item use?
-- example: "chicken fingers uses 12 items"
SELECT menu.name, mi.menuitemid, COUNT(mi.inventoryitemid) AS ingredient_count
FROM menuitemingredients mi
JOIN menuitem menu ON menu.menuitemid = mi.menuitemid
GROUP BY menu.name, mi.menuitemid; 