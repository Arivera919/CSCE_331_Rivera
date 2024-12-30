import Navi from "../Navi";
import { useContext, useState } from "react";
import { orderContext } from "..";
import "./Checkout.css";
import Modal from "../Modal";

//Checkout page for app
function Checkout() {
    const { order, removeItem, subtractPrice, price, clearOrder, clearPrice, menuItems, translations, addOrder, removeInventory, addCash, addDining, addCard } = useContext(orderContext);
    const [isOpen, setOpen] = useState(false);//determines whether payment window is visible
    const [paymentMethod, setMethod] = useState('');//tracks which payment method was chosen

    //removes selected item from order array
    const updateOrder = (index) => {
        const item = order[index];
        if (item.translatedName) {
            const isCarte = item.englishName.indexOf('(A la Carte)')
            let itemPrice
            
            //checks whether item is a la carte and updates price accordingly
            if (isCarte === -1) {
                //removes container and all items within it
                if (item.englishName === "Bowl") {
                    for (let i = 0; i < 3; i++) {
                        itemPrice = menuItems.find(element => element.menuitemid === order[index + i].itemID)
                        subtractPrice(itemPrice.price)
                        removeItem(index)
                    }
                } else if (item.englishName === "Plate") {
                    for (let i = 0; i < 4; i++) {
                        itemPrice = menuItems.find(element => element.menuitemid === order[index + i].itemID)
                        subtractPrice(itemPrice.price)
                        removeItem(index)
                    }
                } else if (item.englishName === "Bigger Plate") {
                    for (let i = 0; i < 5; i++) {
                        itemPrice = menuItems.find(element => element.menuitemid === order[index + i].itemID)
                        subtractPrice(itemPrice.price)
                        removeItem(index)
                    }
                } else {
                    itemPrice = menuItems.find(element => element.menuitemid === order[index].itemID)
                    subtractPrice(itemPrice.price)
                    removeItem(index)
                }
            } else {
                const itemName = item.englishName.substring(0, isCarte - 1)
                itemPrice = menuItems.find(element => element.name === itemName)
                subtractPrice(Number.parseFloat(itemPrice.price) + 4.40)
                removeItem(index)
            }
            
        } else {
            const isCarte = item.indexOf('(A la Carte)')
            let itemPrice;
            if (isCarte === -1) {
                
                if (item === "Bowl") {
                    for (let i = 0; i < 3; i++) {
                        itemPrice = menuItems.find(element => element.name === order[index + i])
                        subtractPrice(itemPrice.price)
                        removeItem(index)
                    }
                } else if (item === "Plate") {
                    for (let i = 0; i < 4; i++) {
                        itemPrice = menuItems.find(element => element.name === order[index + i])
                        subtractPrice(itemPrice.price)
                        removeItem(index)
                    }
                } else if (item === "Bigger Plate") {
                    for (let i = 0; i < 5; i++) {
                        itemPrice = menuItems.find(element => element.name === order[index + i])
                        subtractPrice(itemPrice.price)
                        removeItem(index)
                    }
                } else {
                    itemPrice = menuItems.find(element => element.name === order[index])
                    subtractPrice(itemPrice.price)
                    removeItem(index)
                }
            } else {
                const itemName = item.substring(0, isCarte - 1);
                itemPrice = menuItems.find(element => element.name === itemName)
                subtractPrice(Number.parseFloat(itemPrice.price) + 4.40);
                removeItem(index);
            }
        }
        
        
        
    }

    //takes the order array and prepares a request to update the PSQL database
    const finishOrder = async () => {
        
        //gets current date and time at moment of finishing order
        const date = new Date();

        let day = String(date.getDate()).padStart(2, '0');
        let month = String(date.getMonth() + 1).padStart(2, '0');
        let year = date.getFullYear();

        let dateof = `${year}-${month}-${day}`;

        let hours = String(date.getHours()).padStart(2, '0');
        let minutes = String(date.getMinutes()).padStart(2, '0');
        let seconds = String(date.getSeconds()).padStart(2, '0');

        let time = `${hours}:${minutes}:${seconds}`

        //makes sure payment method has been selected
        if(paymentMethod !== "") {
            let itemList = [] //array of menu items bought
            let comboList = [] // array of various containers found in order
            let itemIDs = []//array of IDs for every single item contained in order array
            let found
            let isCarte

            //updates above arrays for each item in array
            for (const item of order) {

                if (item.translatedName) {
                    isCarte = item.englishName.indexOf('(A la Carte)')
                    if (isCarte === -1) {
                        found = menuItems.find(element => item.itemID === element.menuitemid)

                        if (found.iscontainer) {
                            comboList.push(found.name)
                        } else if (found.isappetizer) {
                            comboList.push("Appetizer")
                            itemList.push(found.name)
    
                        } else {
                            itemList.push(found.name)
                        }
                        itemIDs.push(found.menuitemid)

                    } else {
                        found = menuItems.find(element => item.itemID === element.menuitemid)
                        comboList.push("A la Carte")
                        itemList.push(found.name)
                        itemIDs.push(found.menuitemid)
                    }
                } else {
                    isCarte = item.indexOf('(A la Carte)')
                    if (isCarte === -1) {
                        found = menuItems.find(element => item === element.name)

                        if (found.iscontainer) {
                            comboList.push(found.name)
                        } else if (found.isappetizer) {
                            comboList.push("Appetizer")
                            itemList.push(found.name)
    
                        } else {
                            itemList.push(found.name)
                        }
                        itemIDs.push(found.menuitemid)

                    } else {
                        found = menuItems.find(element => item.substring(0, isCarte - 1) === element.name)
                        comboList.push("A la Carte")
                        itemList.push(found.name)
                        itemIDs.push(found.menuitemid)
                    }
                }
                
            }

            if(paymentMethod.toLowerCase() == "cash") {
                addCash(price);
            } else if (paymentMethod.toLowerCase() == "dining") {
                addDining(price);
            } else {
                addCard(price);
            }

            //object containing all the information needed to update database
            const orderDetails = {
                orderid: null,
                cost: price,
                combolist: comboList,
                menuitem: itemList,
                numcombos: comboList.length,
                nummenuitems: itemList.length,
                dateof: dateof,
                time: time,
                cashierid: 10
            }

            try {
                addOrder(orderDetails, itemIDs)
                removeInventory(itemIDs)

                clear()
            } catch (error) {
                console.error('Error completing order:', error);
            }
        } else {
            const alertString = translations.alert || "Please Select a Payment Method"
            alert(alertString)
        }




    }

    //resets order array and order price
    const clear = () => {
        clearOrder();
        clearPrice();
    }

    return (
        <div className="order-body">
            <Navi />
            <div className="order-container">
                {order.map((item, index) => {

                    let found

                    if (item.translatedName) {
                        found = menuItems.find(element => element.name === item.englishName)
                    } else {
                        found = menuItems.find(element => element.name === item)
                    }
                    
                    
                    {/*Displays list of ordered items, in english or chosen language*/}
                    if (found !== undefined && (found.isside || found.isentree)) {

                        if (item.translatedName) {
                            return (
                                <div className="item-container"><h4 key={index} className="container-item">{item.translatedName}</h4></div>
                            )
                        } else {
                            return (
                                <div className="item-container"><h4 key={index} className="container-item">{item}</h4></div>
                            )
                        }
                        
                    } else {
                        if (item.translatedName) {
                            return (
                                <div className="item-container"><h3 key={index} className="order-item">{item.translatedName}</h3><button className="cancel-button" onClick={() => updateOrder(index)}>X</button></div>
                            )
                        } else {
                            return (
                                <div className="item-container"><h3 key={index} className="order-item">{item}</h3><button className="cancel-button" onClick={() => updateOrder(index)}>X</button></div>
                            )
                        }
                    }

                    
                    
                })}
            </div>
            <h1 className="checkout-price">{translations.price || 'Total'}: ${price}</h1>
            <button className="checkout-button" onClick={() => setOpen(true)}>{translations.checkout_button || 'Checkout'}</button>
            <Modal isOpen={isOpen}>
                <form>
                    <fieldset>
                        <legend>{translations.payment || 'Select A Payment Method'}:</legend>
                        <div onChange={(e) => setMethod(e.target.value)}>
                            <input type="radio" name="method" value="cash" />
                            <label htmlFor="cash">{translations.cash || 'Cash'}</label>
                            <input type="radio" name="method" value="card" />
                            <label htmlFor="card">{translations.card || 'Card'}</label>
                            <input type="radio" name="method" value="dining" />
                            <label htmlFor="dining">{translations.dining || 'Dining Dollars'}</label>
                        </div>
                        <div className="payment-buttons">
                            <button type="submit" id="payment" className="checkout-button" onSubmit={() => {
                                setOpen(false)
                                finishOrder()
                                }}>{translations.checkout_submit || 'Submit'}</button>
                            <button id="payment" className="checkout-button" onClick={() => setOpen(false)}>{translations.cancel || 'Cancel'}</button>
                        </div>
                        
                    </fieldset>
                </form>
            </Modal>
        </div>
    )
}

export default Checkout;