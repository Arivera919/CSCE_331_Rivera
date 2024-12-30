import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navi.css";
import pandaLogo from "./images/panda_transparent.png";
import { useContext } from "react";
import { orderContext } from ".";
import { useState } from "react";
import Modal from "./Modal";
import Home from "./Home";
import { ZoomContext } from './ZoomContext';

//Navbar component appears at top of screen
function Navi() {
    const history = useNavigate();
    const location = useLocation();
    const {order, subtractPrice, removeItem, menuItems, translations, zoom} = useContext(orderContext);
    const [isOpen, setOpen] = useState(false);
    const { zoomLevel, handleZoom } = useContext(ZoomContext);

    //goes to previous page and undoes most recent selection of depending on what current page is
    const goBack = () => {
        if (location.pathname !== "/customer/checkout" && location.pathname !== "/customer/a_la_carte" && location.pathname !== "/customer/drinks" && location.pathname !== "/customer/appetizers" && location.pathname !== "/customer/combos") {
            const popped = order.pop();
            const itemPrice = menuItems.find(element => element.name === popped)
            subtractPrice(itemPrice.price)
        }
        history(-1);
    }

    const updateOrder = (index) => {
        const item = order[index];
        const isCarte = item.indexOf("(A la Carte)")
        let itemPrice;
        if (isCarte === -1) {
            itemPrice = menuItems.find(element => element.name === item)
            subtractPrice(itemPrice.price)
        } else {
            const itemName = item.substring(0, isCarte - 1);
            itemPrice = menuItems.find(element => element.name === itemName)
            subtractPrice(Number.parseFloat(itemPrice.price) + 4.40);
        }
        
        removeItem(index);
    }
    

    return (
        <div className="header">
            <div className="left">
                <div>
                    <Link to={"/"}><img className= "logo" src={pandaLogo} alt={`Image of Panda Express Logo`}></img></Link>
                </div>
                <div>
                    {location.pathname !== "/customer" && <button onClick={goBack} className = "back-button">{translations.back_button || 'Back'}</button>}
                </div>
            </div>
            <div className="navi-buttons">            
                <div className="zoom-controls">
                    <span className="zoom-level">{zoomLevel}%</span>
                    <button className="zoom-button" onClick={() => handleZoom(20)} disabled={zoomLevel >= 150}>
                        {translations.zoom_in || 'Zoom In'}
                    </button>
                    <button className="zoom-button" onClick={() => handleZoom(-20)} disabled={zoomLevel <= 80}>
                        {translations.zoom_out || 'Zoom Out'}
                    </button>
                </div>
                <Link to={"/customer/checkout"}><button id = "checkout-button">{translations.checkout_button || 'Cart'}</button></Link>
            </div>
        </div>
    )
}

export default Navi;
