import React, { createContext, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ZoomProvider } from './ZoomContext';
import './index.css';
import Home from "./Home"
import Checkout from "./routes/Checkout"
import Combo from "./routes/Combo"
import Customer from "./routes/Customer"
import Cashier from "./routes/Cashier"
import Entree from "./routes/Entree"
import Side from "./routes/Side"
import Drink from './routes/Drink';
import Appetizer from './routes/Appetizer';
import Manager from './routes/Manager'
import Inventory from './routes/Inventory';
import MenuItem from './routes/MenuItem';
import Employee from './routes/Employee';
import Report from './routes/Report';
import Board from './routes/Board';
import Carte from './routes/Carte';
import Login from './routes/Login';

const orderContext = createContext();
const inventoryContext = createContext();
const employeeContext = createContext();
const menuItemContext = createContext();
const reportContext = createContext();

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {
  const [order, setOrder] = useState([]);//array of items selected to be bought
  const [price, setPrice] = useState("0.00");//price of current order
  const [menuItems, setMenu] = useState([]);//array of objects containing information on menu items
  const [inventoryItems, setInventory] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [reportRows, setReportRows] = useState([]);
  const [reportCols, setReportCols] = useState([]);
  const [cardSales, setCardSales] = useState("0.00");
  const [cashSales, setCashSales] = useState("0.00");
  const [diningSales, setDiningSales] = useState("0.00");
  const [language, setLanguage] = useState('EN');//current language of website
  const [translations, setTranslations] = useState({});//object containing all translated text in website
  const [translatedMenu, setTranslatedMenu] = useState([]);//array of objects containing english and translated name of menu items
  const [loading, setLoading] = useState(false);


  const [currContainer, setContainer] = useState("");//name of most recently selected container item
  
  //fetches array of menu items from database
  useEffect(() => {
    fetch('/menuItems').then(res => res.json()).then(data => {
      for (const item of data) {
        let toImport = `/images/${item.name.toLowerCase().split(" ").join("")}.png`
        item['image'] = toImport
      }
      setMenu(data)
    })
  }, []);

  useEffect(() => {
    fetch('/inventoryItems').then(res => res.json()).then(data => setInventory(data))
  }, []);

  useEffect(() => {
    fetch('/employees').then(res => res.json()).then(data => setEmployees(data))
  }, []);

  //adds an item to the order array
  const addItem = (newItem) => {
    setOrder(prevState => [...prevState, newItem]);
  };

  //adds multiple of the same item to order array
  const addMultItem = (newItem, count) => {
    setOrder(prevState => [...prevState, ...Array(count).fill(newItem)]);
  }

  //removes a single item from order array
  const removeItem = (index) => {

    setOrder(prevState => {
      const newOrder = prevState.filter((_, i) => i !== index);
      return newOrder
    });

  }

  //empties order array
  const clearOrder = () => {
    setOrder([]);
  }

  //adds price given to total order price
  const addPrice = (newPrice) => {
    setPrice(prevState => {
      const sum = Number.parseFloat(prevState) + Number.parseFloat(newPrice);
      return Number.parseFloat(sum).toFixed(2)
    });
  }

  //subtracts given price from total order price
  const subtractPrice = (newPrice) => {
    setPrice(prevState => {
      const diff = Number.parseFloat(prevState) - Number.parseFloat(newPrice);
      return Number.parseFloat(diff).toFixed(2)
    });
  }

  //resets order price back to 0
  const clearPrice = () => {
    setPrice("0.00");
  }
//function to show product usage chart
  const productUsageChart = async (startDate, endDate) => {
    try {
      const query = new URLSearchParams({startDate, endDate}).toString();
    
      const response = await fetch(`/productUsageChart?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
  
      if (response.ok)
      {
        setReportCols(["Inventory", "Total Quantity"]);
        setReportRows(data);
        console.log("Product usage chart query successful")
      }
      else
      {
        console.error("Product usage chart query failed")
      }

    } catch (error) {
      console.error('Error fetching product usage chart:', error);
    }
  };
//function to show sales report
  const salesReport = async (startDate, startTime, endDate, endTime) => {
    try {
      const query = new URLSearchParams({startDate, startTime, endDate, endTime}).toString();
    
      const response = await fetch(`/salesReport?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
  
      if (response.ok)
      {
        setReportCols(["Item", "Units sold in time period"]);
        setReportRows(data);
        console.log("Sales Report query successful")
      }
      else
      {
        console.error("Product usage chart query failed")
      }

    } catch (error) {
      console.error('Error fetching product usage chart:', error);
    }
  };
//function to show x report
  const xReport = async () => {
    try {
      const response = await fetch(`/xReport`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
  
      if (response.ok)
      {
        setReportCols(["Hour", "Order Count", "Sales", "Combos Sold", "Menu Items Sold"]);
        setReportRows(data);
        console.log("X Report query successful")
      }
      else
      {
        console.error("X Report query failed")
      }

    } catch (error) {
      console.error('Error fetching X Report:', error);
    }
  };
//function to add to card sales
  const addCard = (price) => {
    setCardSales((prevSales) => (Number(prevSales) + Number(price)).toFixed(2));
  };
  //function to add cash sales
  const addCash = (price) => {
    setCashSales((prevSales) => (Number(prevSales) + Number(price)).toFixed(2));
  };
  //function to add dining dollars sales
  const addDining = (price) => {
    setDiningSales((prevSales) => (Number(prevSales) + Number(price)).toFixed(2));
  };
  
//function to add inventory item to databse
  const addInventoryItem = async (newInventoryItem) => {
    try {
      const response = await fetch('/addInventoryItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newInventoryItem),
      });
      const data = await response.json();

      if (response.ok) {
        console.log('Inventory item added:', data);
        setInventory([...inventoryItems, data]);
      } else {
        console.error('Failed to add inventory item:', data.error);
      }
    } catch (error) {
      console.error('Error adding inventory item:', error);
    }
  }
//function to update inventory item in database
  const updateInventoryItem = async (updatedInventoryItem) => {
    try {
      const response = await fetch('/updateInventoryItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedInventoryItem),
      });
      const data = await response.json();

      if (response.ok) {
        console.log('Inventory Item updated:', data);
        //console.log("Employee id to be removed: ", Number(updatedEmployee.id))
        const newInventoryItems = inventoryItems.filter(inventoryItem => inventoryItem.inventoryitemid !== Number(updatedInventoryItem.id));
        setInventory([...newInventoryItems, data]);
      } else {
        console.error('Failed to update Inventory Item:', data.error);
      }
  
    } catch (error) {
      console.error('Error updating Inventory Item:', error);
    }
  }
//function to delete inventory item in database
  const deleteInventoryItem = async(inventoryItemID) => {
    try {
      const response = await fetch('/deleteInventoryItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({inventoryitemid: inventoryItemID}),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Inventory item deleted:', data);
        const newInventory = inventoryItems.filter(inventoryItem => inventoryItem.inventoryitemid !== Number(inventoryItemID));
        setInventory(newInventory);
      } else {
        console.error('Failed to delete inventory item:', data.error);
      }
    }
    catch (error) {
      console.error('Error deleting inventory item:', error);
    }
  }
//function to add employee to database
  const addEmployee = async (newEmployee) => {
    try {
      const response = await fetch('/addEmployee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployee),
      });
      const data = await response.json();

      if (response.ok) {
        console.log('Employee added:', data);
        setEmployees([...employees, data]);
      } else {
        console.error('Failed to add Employee:', data.error);
      }
    } catch (error) {
      console.error('Error adding Employee:', error);
    }
  }
//function to delete employee from database
  const deleteEmployee = async(employeeID) => {
    try {
      const response = await fetch('/deleteEmployee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({employeeid: employeeID}),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Employee deleted:', data);
        const newEmployees = employees.filter(employee => employee.employeeid !== Number(employeeID));
        setEmployees(newEmployees);
      } else {
        console.error('Failed to delete Employee:', data.error);
      }
    }
    catch (error) {
      console.error('Error deleting Employee:', error);
    }
  }
//function to update employee in the database
  const updateEmployee = async (updatedEmployee) => {
    try {
      const response = await fetch('/updateEmployee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEmployee),
      });
      const data = await response.json();

      if (response.ok) {
        console.log('Employee updated:', data);
        //console.log("Employee id to be removed: ", Number(updatedEmployee.id))
        const newEmployees = employees.filter(employee => employee.employeeid !== Number(updatedEmployee.id));
        setEmployees([...newEmployees, data]);
      } else {
        console.error('Failed to update Employee:', data.error);
      }
  
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  }

//function to add menuitem to database
  const addMenuItem = async (newItem, ingredientsList) => {
    try {
      const response = await fetch('/addMenuItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Menu item added:', data);
        setMenu([...menuItems, data]);
      } else {
        console.error('Failed to add menu item:', data.error);
      }
    } catch (error) {
      console.error('Error adding menu item:', error);
    }

    try {
      const response = await fetch('/addMenuItemDependencies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          menuItemName: newItem.name, 
          ingredientsList: ingredientsList,
        }),
      });
    }
    catch (error) {
      console.error('Error adding menu item dependencies:', error);
    }
  }
//function to delete menuitem from database
  const deleteMenuItem = async(menuItemID) => {
    try {
      const response = await fetch('/deleteMenuItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({menuitemid: menuItemID}),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Menu item deleted:', data);
        const newMenuItems = menuItems.filter(menuitem => menuitem.menuitemid !== Number(menuItemID));
        setMenu(newMenuItems);
      } else {
        console.error('Failed to delete menu item:', data.error);
      }
    }
    catch(error)
    {
      console.error('Error deleting menu item:', error);
    }
  }
  
//function to update menuitem in database
  const updateMenuItem = async (updatedItem, ingredientsList) => {
    try {
      const response = await fetch('/updateMenuItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Menu item updated:', data);
        //console.log("Menu Item id to be removed: ", Number(updatedEmployee.id))
        const newMenu = menuItems.filter(menuItem => menuItem.menuitemid !== Number(updatedItem.id));
        setMenu([...newMenu, data]);
      } else {
        console.error('Failed to update Employee:', data.error);
      }
    } catch (error) {
      console.error('Error adding menu item:', error);
    }

    try {
      const response = await fetch('/addMenuItemDependencies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          menuItemName: updatedItem.name, 
          ingredientsList: ingredientsList,
        }),
      });
    }
    catch (error) {
      console.error('Error adding menu item dependencies:', error);
    }
  }
//function to add order to the database
  const addOrder = async (orderDetails, menuidlist) => {
    try {
      //add order deatils to order table
      const response = await fetch('/addOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails),
      });
  
      if (!response.ok) {
        throw new Error('Failed to complete order');
      }
  
      const result = await response.json();


      //add every menu item id in order to ordertomenu table
      for (const menuitemid of menuidlist) {
        try {
          const menuResponse = await fetch('/addOrderToMenu', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ordertomenuid: null, 
              menuitemid: menuitemid,
              orderid: null,
            }),
          });
  
          if (!menuResponse.ok) {
            throw new Error(`Failed to add menu item ${menuitemid} to order`);
          }
  
        } catch (menuError) {
          console.error(`Error adding menu item ${menuitemid} to order:`, menuError);
        }
      }
    } catch (error) {
      console.error('Error completing order:', error);
    }
  };
//function to remove inventory item from the database
  const removeInventory = async (menuidlist) => {
    try {
      for (const menuitemid of menuidlist) {
        const menuToInventoryResponse = await fetch(`/menuToInventory?menuitemid=${menuitemid}`, {
          method: 'GET',
        });
  
        if (!menuToInventoryResponse.ok) {
          throw new Error(`Failed to fetch inventory IDs for menuitemid ${menuitemid}`);
        }
  
        const menuToInventoryData = await menuToInventoryResponse.json();
        const inventoryItemIDs = menuToInventoryData.map(item => item.inventoryitemid);
        console.log(`Inventory IDs for menuitemid ${menuitemid}:`, inventoryItemIDs);
  
        for (const inventoryItemID of inventoryItemIDs) {
          const removeOneInventoryResponse = await fetch('/removeOneInventory', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inventoryItemID }),
          });
  
          if (!removeOneInventoryResponse.ok) {
            const errorDetails = await removeOneInventoryResponse.json();
            throw new Error(`Failed to decrement inventory for inventoryID ${inventoryItemID}: ${errorDetails.error}`);
          }
        }
      }
  
      console.log('Successfully decremented inventory for all menu items.');
    } catch (error) {
      console.error('Error in removeInventory:', error.message);
    }
  };
  

  return (
    <ZoomProvider>
    {/*Allows for all state variables related to ordering food to be accessible for relevant pages*/}
    <orderContext.Provider value={{order, menuItems, addItem, addMultItem, removeItem, clearOrder, price, addPrice, subtractPrice, clearPrice, currContainer, setContainer, addOrder, removeInventory, cashSales, cardSales, diningSales, addDining, addCash, addCard, setCardSales, setCashSales, setDiningSales, translations, setTranslations, loading, setLoading, language, setLanguage, translatedMenu, setTranslatedMenu}}>
    <inventoryContext.Provider value = {{inventoryItems, addInventoryItem, updateInventoryItem, deleteInventoryItem}}>
    <employeeContext.Provider value = {{employees, setEmployees, addEmployee, deleteEmployee, updateEmployee}}>
    <menuItemContext.Provider value = {{menuItems, addMenuItem, deleteMenuItem, updateMenuItem}}>
    <reportContext.Provider value = {{reportRows, reportCols, productUsageChart, salesReport, xReport, setReportCols, setReportRows}}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/customer" element={<Customer />} />
          <Route path='/customer/combos' element={<Combo />} />
          <Route path='/customer/sides' element={<Side />} />
          <Route path='/customer/entrees' element={<Entree />} />
          <Route path='/customer/a_la_carte' element={<Carte />} />
          <Route path='/customer/checkout' element={<Checkout />} />
          <Route path='/customer/appetizers' element={<Appetizer />} />
          <Route path='/customer/drinks' element={<Drink />} />
          <Route path='/login' element={<Login />} />
          <Route path='/cashier' element={<Cashier />} />
          <Route path='/manager' element={<Manager />} />
          <Route path='/manager/inventory' element={<Inventory />} />
          <Route path='/manager/menuitem' element={<MenuItem />} />
          <Route path='/manager/employee' element={<Employee />} />
          <Route path='/manager/report' element={<Report />} />
          <Route path='/board' element={<Board />} />
        </Routes>
      </BrowserRouter>
    </reportContext.Provider>
    </menuItemContext.Provider>
    </employeeContext.Provider>
    </inventoryContext.Provider>
    </orderContext.Provider>
    </ZoomProvider>
  )
}

export {orderContext, inventoryContext, employeeContext, menuItemContext, reportContext};

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={clientId}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
    </GoogleOAuthProvider>
)