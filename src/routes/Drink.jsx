import { Link } from "react-router-dom";
import Navi from "../Navi";
import { useContext } from "react";
import { orderContext } from "..";
import "./Drink.css";

//Drink page for app
function Drink() {
    const {addItem, menuItems, addPrice, translations, translatedMenu, language} = useContext(orderContext)

    //adds selected item to order array
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
    }

    const imgSrc = "/images/panda_transparent.png"

    return (
        <div>
            <Navi />
            <h2 className="combo-header">{translations.drink_header || 'Select Your Drink'}:</h2>
            <div className="drink-container">
                {menuItems.map(item => {
                    if (!item.isentree && !item.isappetizer && !item.isside && !item.iscontainer) {
                        {/*Displays current selection of items, in english or chosen language*/}
                        if (language !== "EN" && language !== "") {
                            const translatedItem = translatedMenu.find(element => element.id === item.menuitemid)

                            return (<Link to={"/customer"}><button className="drink-button" onClick={() => updateOrder(item, translatedItem)}><img className="item-image" src={item.image} alt={`Image of ${translatedItem.name}`} onError={e => e.target.src = imgSrc}/><h3>{translatedItem.name}</h3></button></Link>)
                        } else {
                            return(
                                <Link to={"/customer"}><button className="drink-button" onClick={() => updateOrder(item)}><img className="item-image" src={item.image} alt={`Image of ${item.name}`} onError={e => e.target.src = imgSrc}/><h3>{item.name}</h3></button></Link>
                            )
                        }
                    }
                })}
            </div>
        </div>
    )
}

export default Drink;