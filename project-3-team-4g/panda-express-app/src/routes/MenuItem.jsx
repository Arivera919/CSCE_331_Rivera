import { Link, useLocation, useNavigate } from "react-router-dom";
import "./ManagerTable.css";
import { useContext } from "react";
import { menuItemContext } from "../index";

function MenuItem() {
    const location = useLocation();
    const navigate = useNavigate();

    const {menuItems, addMenuItem, deleteMenuItem, updateMenuItem} = useContext(menuItemContext);
//function for adding menu items to the POS system based on how you answer the window prompts
    const addMenuItems = () => {
        const name = window.prompt("Enter name of item");
        const price = window.prompt("Enter price of item");
        const isEntree = window.prompt("Is this an entree? Answer True or False").toLowerCase() == "true";
        const isAppetizer = window.prompt("Is this an appetizer? Answer True or False").toLowerCase() == "true";
        const isSide = window.prompt("Is this a side? Answer True or False").toLowerCase() == "true";
        const isContainer = window.prompt("Is this a container/combo? Answer True or False").toLowerCase() == "true";
        let ingredientsList = []

        while(true)
        {
            const ingredient = window.prompt("Enter Ingredient for Item (Type \"Stop\" or Leave the Box Empty if Done)");
            if(ingredient == "Stop" || ingredient == "stop" || ingredient == "")
            {
                break;
            }
            ingredientsList.push(ingredient);
        }
        const id = 0;

        const newItem = {
            id,
            name,
            price,
            isEntree,
            isAppetizer,
            isSide,
            isContainer
        };

        addMenuItem(newItem, ingredientsList);
    }
//deleted menuitems based on the window prompts
    const deleteMenuItems = () => 
    {
        const id = window.prompt("Enter the id of the menu item you would like to delete");

        deleteMenuItem(id);
    }
//updates menuitems based on window prompts
    const updateMenuItems = () =>
    {
        const id = window.prompt("Enter the Menu Item ID you wish to update:");
        const name = window.prompt("Enter new name of item");
        const price = window.prompt("Enter new price of item");
        const isEntree = window.prompt("Is this an entree? Answer True or False").toLowerCase() == "true";
        const isAppetizer = window.prompt("Is this an appetizer? Answer True or False").toLowerCase() == "true";
        const isSide = window.prompt("Is this a side? Answer True or False").toLowerCase() == "true";
        const isContainer = window.prompt("Is this a container/combo? Answer True or False").toLowerCase() == "true";
        let ingredientsList = []

        while(true)
        {
            const ingredient = window.prompt("Enter Ingredient for updated Item (Type \"Stop\" or Leave the Box Empty if Done)");
            if(ingredient == "Stop" || ingredient == "stop" || ingredient == "")
            {
                break;
            }
            ingredientsList.push(ingredient);
        }

        const updatedItem = {
            id,
            name,
            price,
            isEntree,
            isAppetizer,
            isSide,
            isContainer
        };

        updateMenuItem(updatedItem, ingredientsList);
    }
    //This parts displays the buttons for creating,updating,deleting menuitems
    return (
        <div>
            <div className="header">
                <div>
                    <h1>Panda Express</h1>
                    {location.pathname !== "/manager/MenuItem" && <button onClick={() => navigate(-1)}>Back</button>}
                </div>
            </div>
            <div className="button-container">
                <button class = "inventory-button" onClick = {addMenuItems}>Add Menu Item</button>
                <button class = "inventory-button" onClick = {updateMenuItems}>Update Menu Item</button>
                <button class = "inventory-button" onClick = {deleteMenuItems}>Delete Menu Item</button>
            </div>
            <div className="menu-body">
                <table>
                    <thead>
                        <th>Menu ID</th>
                        <th>Name</th>
                        <th>Price</th>
                    </thead>
                <tbody>
                    {menuItems.map((item) => (
                        <tr key={item.menuitemid}>
                            <td>{item.menuitemid}</td>
                            <td>{item.name}</td>
                            <td>{item.price}</td>
                        </tr>
                    ))}
            </tbody>
                </table>
            </div>
        </div>
    );
}

export default MenuItem;
