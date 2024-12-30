import { Link } from "react-router-dom";
import Navi from "../Navi";
import React, { useContext } from "react";
import { orderContext } from "..";
import "./Side.css";

function Side() {
    const {addItem, menuItems, translations, translatedMenu, language} = useContext(orderContext)

    //updates current order array with selected item
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
    }

    //default image if item image does not exist
    const imgSrc = "/images/panda_transparent.png"

    return (
        <div>
            <Navi />
            <h2 className="combo-header">2. {translations.side_header || 'Select Your Side'}:</h2>
            <div className="side-container">
                {menuItems.map(item => {
                    if (item.isside) {
                        {/*If curent language is not english, display translated text*/}
                        if (language !== "EN" && language !== "") {
                            const translatedItem = translatedMenu.find(element => element.id === item.menuitemid)

                            return (
                                <Link to={"/customer/entrees"}><button className="sideButton" onClick={() => updateOrder(item, translatedItem)}><img className="item-image" src={item.image} alt={`Image of ${translatedItem.name}`} onError={e => e.target.src = imgSrc}/><h3>{translatedItem.name}</h3></button></Link>                            
                            )
                        } else {
                            return (
                                <Link to={"/customer/entrees"}><button className="sideButton" onClick={() => updateOrder(item)}><img className="item-image" src={item.image} alt={`Image of ${item.name}`} onError={e => e.target.src = imgSrc}/><h3>{item.name}</h3></button></Link>
                            )
                        }
                        
                    }
                })}
            </div>
        </div>
    )
}

export default Side;