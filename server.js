const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs')
const axios = require('axios');
const { Pool } = require('pg');
const { error } = require('console');
const dotenv = require('dotenv').config({path: '../.env'});

const app = express();
const port = process.env.PORT || 5000;

const API_KEY = process.env.TRANSLATE_API_KEY
const API_URL = 'https://api-free.deepl.com/v2'

const pool = new Pool({
  user: process.env.PSQL_USER,
  host: process.env.PSQL_HOST,
  database: process.env.PSQL_DATABASE,
  password: process.env.PSQL_PASSWORD,
  port: process.env.PSQL_PORT,
  ssl: {rejectUnauthorized: false}
});

app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, '../build')));

app.get('/server_test', async (req, res) => {
  res.json({message: "Hello from Server!"});
})

//sends requests to DeepL API to translate given lines of text to the specified language
const translateText = async (text, targetLanguage) => {
  try {
    const response = await axios.post(`${API_URL}/translate`, null, {
      params: {
        auth_key: API_KEY,
        text: text,
        target_lang: targetLanguage,
      },
    });
  
    return response.data.translations[0].text;
  } catch (error) {
    throw new Error(`Translation error: ${error.response ? error.response.data.error.message : error.message}`);
  }
}

//Recieves requests for translation from frontend and forwards them to the translation API
app.post('/translate', async (req, res) => {
  const { language, textKeys } = req.body

  const English = JSON.parse(fs.readFileSync('./en.json', 'utf-8'))

  if (!language || !textKeys || !Array.isArray(textKeys)) {
    return res.status(400).json({ error: 'Language and text are required' });
  }

  try {
    const translatedText = {};
    for (const line of textKeys) {
      if (English[line]) {
        const translated = await translateText(English[line], language);
        translatedText[line] = translated;
      }
    }

    res.json({ translatedText });
  } catch (error) {
    console.error('Error during translation:', error);
    res.status(500).json({ error: 'Failed to translate text' });
  }

})

//For a given language, queries the PSQL database for the names and ids of each
//menu item and translates them to that language
app.post('/translatedMenu', async (req, res) => {
  const { language } = req.body


  if (!language) {
    return res.status(400).json({ error: 'Language is required' });
  }

  try {
    const result = await pool.query('SELECT menuitemid,name FROM menuitem;');
    
    const translatedItems = []

    for (const item of result.rows) {
      const translated = await translateText(item.name, language);
      let translatedItem = {
        id: item.menuitemid,
        name: translated  
      }
      translatedItems.push(translatedItem)
    }

    res.json({ translatedItems })
  } catch (error) {
    console.error('Error during translation:', error);
    res.status(500).json({ error: 'Failed to translate text' });
  }
})

//queries PSQL database for the all the items contained in the menuitem table
app.get('/menuItems', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM menuitem;');
    //console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query:', err.message);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
})

app.get('/inventoryItems', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inventoryItem;');
    //console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query:', err.message);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
})

app.get('/employees', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employee;');
    //console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query:', err.message);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
})
app.get('/nutrition', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM nutrition;');
    //console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query:', err.message);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
})

app.get('/productUsageChart', async (req, res) => {
  try {
    const {startDate, endDate} = req.query;
    //console.log(startDate);
    //console.log(endDate);

    const query = "SELECT inventoryitem.name AS ingredient, SUM(orders.nummenuitems) AS total_quantity FROM orders JOIN LATERAL unnest(string_to_array(orders.menuitem, ', ')) AS menuitem_name ON TRUE JOIN menuitem ON menuitem.name = menuitem_name JOIN menuitemingredients ON menuitem.menuitemid = menuitemingredients.menuitemid JOIN inventoryitem ON menuitemingredients.inventoryitemid = inventoryitem.inventoryitemid WHERE orders.dateof BETWEEN CAST($1 AS date) AND CAST($2 AS date) GROUP BY inventoryitem.name ORDER BY inventoryitem.name;";

    const values = [startDate, endDate]

    const result = await pool.query(query, values);
    //console.log("Query result:", result);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing product usage chart query:', err.message);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

app.get('/xReport', async (req, res) => {
  try {
    const query = "SELECT EXTRACT(HOUR FROM time) AS hour, COUNT(orderID) AS order_count, SUM(cost) AS sales, SUM(numcombos) AS combos_sold, SUM(nummenuitems) AS menu_items_sold FROM orders WHERE dateof = CURRENT_DATE GROUP BY EXTRACT(HOUR FROM time) ORDER BY hour;";

    const result = await pool.query(query);
    //console.log("Query result:", result);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing product usage chart query:', err.message);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

app.get('/salesReport', async (req, res) => {
  try {
    const {startDate, startTime, endDate, endTime} = req.query;
    //console.log(startDate);
    //console.log(endDate);

    const query =  `
      SELECT menuitem.name AS menu_item, SUM(orders.nummenuitems) AS total_quantity
      FROM orders
      JOIN LATERAL unnest(string_to_array(orders.menuitem, ', ')) AS menuitem_name ON TRUE
      JOIN menuitem ON menuitem.name = menuitem_name
      WHERE orders.dateof BETWEEN CAST($1 AS date) AND CAST($2 AS date)
      AND orders.time BETWEEN CAST($3 AS time) AND CAST($4 AS time)
      GROUP BY menuitem.name
      ORDER BY menuitem.name;
    `;

    const values = [startDate, endDate, startTime, endTime]

    const result = await pool.query(query, values);
    //console.log("Query result:", result);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing product usage chart query:', err.message);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

app.get('/menuToInventory', async (req, res) => {
  try {
    const {menuitemid} = req.query;
    const result = await pool.query('SELECT * FROM menuitemingredients WHERE menuitemid = $1;', [menuitemid]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query:', err.message);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
})

app.post('/removeOneInventory', async (req, res) => {
  const {inventoryItemID} = req.body;

  try {
    const query = `UPDATE inventoryitem 
      SET quantity = quantity - 1 
      WHERE inventoryitemid = $1 
      RETURNING *;
    `;
    const values = [inventoryItemID];

    const result = await pool.query(query, values);

    console.log('Updated inventory item:', result.rows[0]);  // Log the updated result

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({ error: 'An error occurred while updating inventory item.' });
  }
});

app.post('/addInventoryItem', async (req, res) => {
  const {InvnetoryID, name, quantity, comingIn} = req.body;

  const highestInventoryItemID = await getHighestInventoryItemID();
  const id = highestInventoryItemID + 1;

  try {
    const query = `
      INSERT INTO inventoryitem (inventoryitemid, name, quantity, comingin)
      VALUES ($1, $2, $3, $4)
      RETURNING *;`;
    const values = [id, name, quantity, comingIn];

    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding inventory item:', error);
    res.status(500).json({ error: 'An error occurred while adding the inventory item.' });
  }
});

app.post('/updateInventoryItem', async (req, res) => {
  const {id, name, quantity, comingin} = req.body;

  try {
    const query = `UPDATE inventoryitem SET name = $1, quantity = $2, comingin = $3 WHERE inventoryitemid = $4 RETURNING *`;
    const values = [name, quantity, comingin, id];

    const result = await pool.query(query, values);

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({ error: 'An error occurred while updating inventory item.' });
  }
});

app.post('/deleteInventoryItem', async (req, res) => {
  const {inventoryitemid} = req.body;

  try {
    const query = `DELETE FROM inventoryitem WHERE inventoryitemid = $1;`;
    const values = [inventoryitemid];

    await pool.query(query, values);

    res.status(200).json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    res.status(500).json({ error: 'An error occurred while deleting inventory item.' });
  }
});

app.post('/addEmployee', async (req, res) => {
  const {name, employeeid, isManager} = req.body;

  const highestEmployeeID = await getHighestEmployeeID();
  const id = highestEmployeeID + 1;

  try {
    const query = `
      INSERT INTO employee (name, employeeid, ismanager)
      VALUES ($1, $2, $3)
      RETURNING *;`;
    const values = [name, id, isManager];

    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ error: 'An error occurred while adding the employee.' });
  }
});



app.post('/updateEmployee', async (req, res) => {
  const {name, id, isManager} = req.body;

  try {
    const query = `UPDATE employee SET name = $1, ismanager = $2 WHERE employeeid = $3 RETURNING *`;
    const values = [name, isManager, id];

    const result = await pool.query(query, values);

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'An error occurred while updating employee.' });
  }
});

app.post('/deleteEmployee', async (req, res) => {
  const {employeeid} = req.body;

  try {
    const query = `DELETE FROM employee WHERE employeeid = $1;`;
    const values = [employeeid];

    await pool.query(query, values);

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'An error occurred while deleting employee.' });
  }
});

app.post('/addMenuItem', async (req, res) => {
  const { menuitemid, name, price, isEntree, isAppetizer, isSide, isContainer} = req.body;

  const highestMenuItemID = await getHighestMenuItemID();
  const id = highestMenuItemID + 1;

  try {
    const query = `
      INSERT INTO menuItem (menuitemid, name, price, isentree, isappetizer, isside, iscontainer)
      VALUES ($1, $2, $3, $4, $5, $6, $7\

      RETURNING *;
    `;
    const values = [id, name, price, isEntree, isAppetizer, isSide, isContainer];

    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding menu item:', error);
    res.status(500).json({ error: 'An error occurred while adding the menu item.' });
  }
});

app.post('/updateMenuItem', async (req, res) => {
  const {id, name, price, isEntree, isAppetizer, isSide, isContainer} = req.body;

  try {
    const query = `UPDATE menuitem SET name = $1, price = $2, isentree = $3, isappetizer = $4, isside = $5, iscontainer = $6 WHERE menuitemid = $7 RETURNING *`;
    const values = [name, price, isEntree, isAppetizer, isSide, isContainer, id];

    const result = await pool.query(query, values);

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding menu item:', error);
    res.status(500).json({ error: 'An error occurred while adding the menu item.' });
  }
});

app.post('/addMenuItemDependencies', async (req, res) => {
  const {menuItemName, ingredientsList} = req.body;
    try {
      const menuID = await getMenuItemIDByName(menuItemName);
      const highestMenuItemIngredientID = await getHighestMenuItemIngredientsID();

      const query = `DELETE FROM menuitemingredients WHERE menuitemid = $1`;
      const values = [menuID];
      await pool.query(query, values);

      const ingredientIds = await Promise.all(
        ingredientsList.map(async (ingredientName) => {
            const result = await pool.query('SELECT inventoryitemid FROM inventoryItem WHERE name = $1',[ingredientName]);
            if (result.rows.length > 0) {
                return result.rows[0].inventoryitemid;
            } else {
                console.log(`Ingredient not found: ${ingredientName}`);
                return null;
            }
        })
    );

    const validIngredientIds = ingredientIds.filter(id => id !== null);

    const insertPromises = validIngredientIds.map((ingredientId, index) => {
      const newId = highestMenuItemIngredientID + index + 1; 
      return pool.query(
        'INSERT INTO menuItemIngredients (id, menuitemid, inventoryitemid) VALUES ($1, $2, $3)',
        [newId, menuID, ingredientId]
      );
    });

    await Promise.all(insertPromises);

    } catch (error) {
      console.error('Error adding menu item:', error);
      res.status(500).json({ error: 'An error occurred while adding the menu item.' });
    }
});

app.post('/deleteMenuItem', async (req, res) => {
  const {menuitemid} = req.body;

  try {
    const query = `DELETE FROM menuItem WHERE menuitemid = $1;`;
    const values = [menuitemid];

    await pool.query(query, values);

    const query2 = 'DELETE FROM menuitemingredients WHERE menuitemid = $1';
    const values2 = [menuitemid];

    await pool.query(query2, values2);

    res.status(200).json({ message: 'Menu Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ error: 'An error occurred while deleting menu item.' });
  }
});

app.post('/submitIssue', async (req, res) => {
  const { description } = req.body;

  try {
    const query = `INSERT INTO issues (description) VALUES ($1) RETURNING *;`;
    const values = [description];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error submitting issue:', error);
    res.status(500).json({ error: 'An error occurred while submitting the issue.' });
  }
});
app.post('/submitmenuIssue/:id', async (req, res) => {
  const { description } = req.body;
  const { id } = req.params;

  try {
    const query = ` UPDATE menuitem 
      SET review = $1 
      WHERE menuitemid = $2 
      RETURNING menuitemid, name, review;`;
    const values = [description,id];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error submitting issue:', error);
    res.status(500).json({ error: 'An error occurred while submitting the issue.' });
  }
});


app.post('/addOrder', async (req, res) => {
  const { orderid, cost, combolist, menuitem, numcombos, nummenuitems, dateof, time, cashierid} = req.body;

  const highestMenuOrderID = await getHighestOrderID();
  const id = highestMenuOrderID + 1;

  try {
    const query = `
      INSERT INTO orders (orderid, cost, combolist, menuitem, numcombos, nummenuitems, dateof, time, cashierid)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const values = [id, cost, combolist, menuitem, numcombos, nummenuitems, dateof, time, cashierid];

    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding order:', error);
    res.status(500).json({ error: 'An error occurred while adding the order.' });
  }
});

const getHighestOrderID = async () => {
  try {
    const result = await pool.query('SELECT MAX(orderid) AS maxId FROM orders;');
    return result.rows[0].maxid || 0;
  } catch (error) {
    console.error("Error retrieving the highest orderID:", error.message);
    throw error;
  }
};

app.post('/addOrderToMenu', async (req, res) => {
  const { ordertomenuid, menuitemid, orderid} = req.body;

  const id = await getHighestOrderID();
  const highestOTMid = await getHighestOrderToMenuID();
  const otmid = highestOTMid + 1;

  try {
    const query = `
      INSERT INTO ordertomenuitem (ordertomenuid, menuitemid, orderid)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [otmid, menuitemid, id];

    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding order to menu:', error);
    res.status(500).json({ error: 'An error occurred while adding the order to menu.' });
  }
});

const getHighestOrderToMenuID = async () => {
  try {
    const result = await pool.query('SELECT MAX(ordertomenuid) AS maxId FROM ordertomenuitem;');
    return result.rows[0].maxid || 0;
  } catch (error) {
    console.error("Error retrieving the highest orderToMenuID:", error.message);
    throw error;
  }
};

const getHighestMenuItemID = async () => {
  try {
    const result = await pool.query('SELECT MAX(menuitemid) AS maxId FROM menuItem;');
    return result.rows[0].maxid || 0;
  } catch (error) {
    console.error("Error retrieving the highest menuItemID:", error.message);
    throw error;
  }
};

const getMenuItemIDByName = async (name) => {
  const query = 'SELECT menuitemid FROM menuitem WHERE name = $1';

  const values = [name];
  try {
    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      return result.rows[0].menuitemid; 
    } else {
      return null; 
    }
  } catch (error) {
    console.error('Error finding menu item ID:', error);
    throw error; 
  }
};

const getHighestMenuItemIngredientsID = async () => {
  try {
    const result = await pool.query('SELECT MAX(id) AS maxId FROM menuitemingredients;');
    return result.rows[0].maxid || 0;
  } catch (error) {
    console.error("Error retrieving the highest menuItemID:", error.message);
    throw error;
  }
};

const getHighestEmployeeID = async () => {
  try {
    const result = await pool.query('SELECT MAX(employeeid) AS maxId FROM employee;');
    return result.rows[0].maxid || 0;
  } catch (error) {
    console.error("Error retrieving the highest employeeid:", error.message);
    throw error;
  }
}

const getHighestInventoryItemID = async () => {
  try {
    const result = await pool.query('SELECT MAX(inventoryitemid) AS maxId FROM inventoryitem;');
    return result.rows[0].maxid || 0;
  } catch (error) {
    console.error("Error retrieving the highest inventoryitemid:", error.message);
    throw error;
  }
}

//MAKE SURE THAT ANY API ROUTES YOU CREATE ARE DEFINED BEFORE THIS LINE!!!!!!!!!!!!!!!!!
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
})

process.on('SIGINT', function() {
  pool.end();
  console.log("Shutdown Successful")
  process.exit(0);
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
