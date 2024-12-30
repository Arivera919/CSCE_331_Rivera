import { Link } from "react-router-dom";
import Navi from "../Navi";
import { useContext, useEffect } from "react";
import { orderContext } from "..";
import "./Combo.css";

//Combo page for app
function Combo() {
    const { addItem, addPrice, menuItems, setContainer, translations, language, translatedMenu} = useContext(orderContext);

    //updates current order array and sets the current container being ordered
    function updateOrder(item, translatedItem=null) {
        if (translatedItem === null) {
            addItem(item.name)
        } else {
            const itemNames = {
                itemID: item.menuitemid,
                englishName: item.name,
                translatedName: translatedItem.name
            }
            addItem(itemNames)
        }
        addPrice(item.price);
        setContainer(item.name)
    }

    //default image if item image does not exist
    const imgSrc = "/images/panda_transparent.png"

    return (
        <div>
                <Navi />
                <h2 className="combo-header">1. {translations.combo_header || 'Select Your Combo'}:</h2>
                <div className="combo-container">
                    {menuItems.map(item => {
                        if (item.iscontainer) {
                            {/*Displays current selection of items, in english or chosen language*/}
                            if (language !== "EN" && language !== "") {
                                const translatedItem = translatedMenu.find(element => element.id === item.menuitemid)

                                return (
                                    <Link to={"/customer/sides"}><button className="comboButton" onClick={() => updateOrder(item, translatedItem)}><img className="combo-image" src={item.image} alt={`Image of ${translatedItem.name}`} onError={e => e.target.src = imgSrc}/><h3>{translatedItem.name}</h3></button></Link>                            
                                )
                            } else {
                                return (
                                    <Link to={"/customer/sides"}><button className="comboButton" onClick={() => updateOrder(item)}><img className="combo-image" src={item.image} alt={`Image of ${item.name}`} onError={e => e.target.src = imgSrc}/><h3>{item.name}</h3></button></Link>                            
                                )
                            }
                            
                        }
                    })}
                </div>
        </div>
    )
}

export default Combo;