import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Cashier.css";
import { useState, useContext } from "react";
import { orderContext } from "../index";

function Cashier() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [order, setOrder] = useState([]); // tracks full order
    const [currentCombo, setCurrentCombo] = useState(null); // tracks current combo
    const [price, setPrice] = useState(0.0); 

    const [combolist, setComboList] = useState([]);
    const [menulist, setMenuList] = useState([]);
    const [menuidlist, setMenuIDList] = useState([]);
    const [numCombos, setNumCombos] = useState(0);
    const [numMenuItems, setNumMenu] = useState(0);
   
    const { addOrder,removeInventory } = useContext(orderContext);

    function addItemToOrder (item) {

        // when in middle of putting in combo
        if (currentCombo) {
            if (item.isentree === true || item.isside === true){
                setNumMenu((numMenuItems) => numMenuItems + 1);
                setMenuList((menulist) => [...menulist, item.name]);
                setMenuIDList((menuidlist) => [...menuidlist, item.menuitemid]);
                if (currentCombo.remainingCount > 0) {
                    setPrice((prevPrice) => parseFloat(prevPrice) + parseFloat(item.price));
                    setOrder((prevOrder) => [
                        ...prevOrder,
                        { name: item.name, isIndented: true, isCompleted: false },
                    ]);
                
                    setCurrentCombo((prevCombo) => ({
                        ...prevCombo,
                        remainingCount: prevCombo.remainingCount - 1,
                    }));
        
                    if (currentCombo.remainingCount - 1 === 0) {
                        setOrder((prevOrder) =>
                            prevOrder.map((orderItem) =>
                                orderItem.name === currentCombo.comboName
                                    ? { ...orderItem, isCompleted: true }
                                    : orderItem
                            )
                        );
                        setCurrentCombo(null);
                    }
                }
            }         
        // normal items
        } else {
            if(!item.isentree && !item.isside){
                //add price if not in combo
                setNumCombos((numCombos) => numCombos + 1);
                setNumMenu((numMenuItems) => numMenuItems + 1);
                setMenuList((menulist) => [...menulist, item.name]);
                setMenuIDList((menuidlist) => [...menuidlist, item.menuitemid]);
                if (item.isappetizer) {
                    setComboList((combolist) => [...combolist, "Appetizer"]);
                } else{
                    setComboList((combolist) => [...combolist, item.name])
                }
                setPrice((prevPrice) => parseFloat(prevPrice) + parseFloat(item.price));
                setOrder((prevOrder) => [...prevOrder, { name: item.name }]);
            }   
        }
    };
//adding a combo to an order
    function addComboToOrder (comboName, count, comboPrice) {
        if (!currentCombo){
            setNumCombos((numCombos) => numCombos + 1);
            combolist.push(comboName)
            
            setOrder((prevOrder) => [
                ...prevOrder,
                { name: comboName, isIndented: false, isCompleted: false, remainingCount: count },
            ]);
            setCurrentCombo({ comboName, remainingCount: count });
            setPrice((prevPrice) => prevPrice + comboPrice); 
        }
        
    };
//if you cancel an order
    function resetOrder () {
        setOrder([]);
        setCurrentCombo(null);
        setPrice(0.0);
        setComboList([]);
        setMenuList([]);
        setMenuIDList([]);
        setNumCombos(0);
        setNumMenu(0);
    };

    const { menuItems, addCash, addDining, addCard } = useContext(orderContext);    
//adds the order to the database
    async function completeOrder () {

        const date = new Date();

        let day = String(date.getDate()).padStart(2, '0');
        let month = String(date.getMonth() + 1).padStart(2, '0');
        let year = date.getFullYear();

        let dateof = `${year}-${month}-${day}`;

        let hours = String(date.getHours()).padStart(2, '0');
        let minutes = String(date.getMinutes()).padStart(2, '0');
        let seconds = String(date.getSeconds()).padStart(2, '0');

        let time = `${hours}:${minutes}:${seconds}`

        let paymentMethod = window.prompt("Enter the payment method (Cash, Card, or Dining): ");

        if(paymentMethod.toLowerCase() == "cash")
        {
            addCash(price);
        }
        else if (paymentMethod.toLowerCase() == "dining")
        {
            addDining(price);
        }
        else
        {
            addCard(price);
        }

        const orderDetails = {
            orderid: null, 
            cost: price, 
            combolist: combolist, 
            menuitem: menulist, 
            numcombos: numCombos, 
            nummenuitems: numMenuItems, 
            dateof: dateof,
            time: time,
            cashierid: 9
        };
    
        try {
            // console.log("menuidlist:", menuidlist);

            addOrder(orderDetails, menuidlist);
            removeInventory(menuidlist);

            resetOrder();
        } catch (error) {
            console.error('Error completing order:', error);
        }

    }

    return (
        <div>
            <div className="cashier-header">
                <div>
                    <h1>Panda Express</h1>
                    {location.pathname !== "/Cashier" && <button onClick={() => navigate(-1)}>Back</button>}
                </div>
            </div>
            <div className="cashier-container">
                <div className="cashier-order">
                    <h2>Current Order:</h2>
                    <ul>
                        {order.map((item, index) => (
                            <li key={index} className={item.isIndented ? "indented-item" : ""}>
                                {item.name}
                            </li>
                        ))}
                    </ul>
                    <h2>Current Price: ${price.toFixed(2)}</h2>
                    <button className="cashier-checkout" onClick={() => {completeOrder();}}>Checkout</button>
                    <button className="cashier-checkout" onClick={() => resetOrder()}>Reset Order</button>
                </div>
                <div className="cashier-menu">
                    <div className="cashier-combos">
                   
                                                    {/* //shows different combos you can get */}

                        <button className="cashier-combo-button" onClick={() => addComboToOrder("Bowl", 2, 8.30)}>Bowl</button>
                        <button className="cashier-combo-button" onClick={() => addComboToOrder("Plate", 3, 9.80)}>Plate</button>
                        <button className="cashier-combo-button" onClick={() => addComboToOrder("Bigger Plate", 4, 11.30)}>Bigger Plate</button>
                        <button className="cashier-combo-button" onClick={() => addComboToOrder("A La Carte", 1, 4.30)}>A La Carte</button>
                    </div>
                    <div className="cashier-menu-items">
                        {menuItems.map((item, index) => (
                            item.iscontainer !== true && (
                                <button
                                    key={index}
                                    className="cashier-menu-button"
                                    onClick={() => addItemToOrder(item)}
                                >
                                    {item.name}
                                </button>
                            )
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cashier;
