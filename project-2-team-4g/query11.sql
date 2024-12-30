-- Regular Query #7: "Find inventory items used in an order"
SELECT 
    i.name AS inventory_item_name,
    COUNT(i.inventoryitemid) AS count_needed
FROM 
    orders o
JOIN 
    UNNEST(STRING_TO_ARRAY(o.menuitem, ', ')) AS menu_item_name 
    ON o.orderid = 1
JOIN 
    menuitem m ON m.name = menu_item_name 
JOIN 
    menuitemingredients mi ON m.menuitemid = mi.menuitemid 
JOIN 
    inventoryitem i ON mi.inventoryitemid = i.inventoryitemid 
GROUP BY 
    i.inventoryitemid, i.name;
