import { Link, useLocation, useNavigate } from "react-router-dom";
import "./ManagerTable.css";
import { useContext } from "react";
import {inventoryContext} from "../index";

function Inventory() {
    const location = useLocation();
    const navigate = useNavigate();

    const {inventoryItems, addInventoryItem, deleteInventoryItem, updateInventoryItem} = useContext(inventoryContext);
//added inventory items based on the answers to the window prompt
    const addInventoryItems = () => {
        const name = window.prompt("Enter name of inventory item");
        const quantity = window.prompt("Enter how many of this item we have on hand right now");
        const comingIn = window.prompt("Enter how many of this item we have on the way or are in transit");

        const id = 0;

        const newInventoryItem = {
            id,
            name,
            quantity,
            comingIn
        }

        addInventoryItem(newInventoryItem);
    }
//updated inventory items based on the window prompts
    const updatedInventoryItems = () => {
        const id = window.prompt("Enter the id of the item you wish to update");
        const name = window.prompt("Enter new name of inventory item");
        const quantity = window.prompt("Enter how many of this item we have on hand right now");
        const comingin = window.prompt("Enter how many of this item we have on the way or are in transit");

        const updatedInventoryItem = {
            id,
            name,
            quantity,
            comingin
        }
        updateInventoryItem(updatedInventoryItem);
    }
//deleted inventory items based on which ID was put into the window
    const deleteInventoryItems = () => 
    {
        const id = window.prompt("Enter the id of the inventory item you would like to remove");

        deleteInventoryItem(id);
    }
//displays the inventory options on the manager interface
    return (
        <div>
            <div className="header">
                <div>
                    <h1>Panda Express</h1>
                    {location.pathname !== "/inventory" && <button onClick={() => navigate(-1)}>Back</button>}
                </div>
            </div>
            <div className="button-container">
                <button class = "inventory-button" onClick = {addInventoryItems}>Add Inventory Item</button>
                <button class = "inventory-button" onClick = {updatedInventoryItems}>Update Inventory Item</button>
                <button class = "inventory-button" onClick = {deleteInventoryItems}>Delete Inventory Item</button>
            </div>
            <div className="inventory-body">
                <table>
                    <thead>
                        <th>Item ID</th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Coming in</th>
                    </thead>
                    <tbody>
                    {inventoryItems.map((item) => (
                        <tr key={item.inventoryitemid}>
                            <td>{item.inventoryitemid}</td>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.comingin}</td>
                        </tr>
                    ))}
            </tbody>
                </table>
            </div>
        </div>
    );
}

export default Inventory;
