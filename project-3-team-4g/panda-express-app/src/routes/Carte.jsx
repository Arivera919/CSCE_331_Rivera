import { Link } from "react-router-dom";
import Navi from "../Navi";
import { useContext, useEffect, useState } from "react";
import { orderContext } from "..";
import Footer from "../Footer";
import "./Carte.css";

//A la Carte page for app
function Carte() {
    const {addItem, addMultItem, menuItems, addPrice, translations, translatedMenu, language} = useContext(orderContext)
    const [openFooter, setFooter] = useState(false)//determines whether footer is visible
    const [selectedEntrees, setEntrees] = useState([]);//tracks which items have been selected

    //Once at least one item has been selected, footer becomes visible
    useEffect(() => {
        if (selectedEntrees.length !== 0) {
            setFooter(true)
        } else {
            setFooter(false)
        }

    }, [selectedEntrees]);

    //recieves a string or a string plus an object
    //translatedItem is not null when website is in a language other than english
    //updates selectedEntrees array
    function updateEntrees(item, translatedItem=null) {
        const entree = document.getElementById(`button-${item.menuitemid}`)

        if (translatedItem === null) {
            //if item has already been selected, remove from array
            if (entree.classList.contains("selected")) {
                entree.classList.remove("selected")
                setEntrees(prevState => {
                    const removed = prevState.findIndex(element => element.name === item.name)
                    return prevState.filter((_, i) => i !== removed)
                })
            } else {
                entree.classList.add("selected");
                setEntrees(prevState => ([...prevState, item]))
            }
        } else {
            if (entree.classList.contains("selected")) {
                entree.classList.remove("selected")
                setEntrees(prevState => {
                    const removed = prevState.findIndex(element => element.menuitemid === translatedItem.id)
                    return prevState.filter((_, i) => i !== removed)
                })
            } else {
                entree.classList.add("selected");
                const itemNames = {...item, translatedName: translatedItem.name}
                setEntrees(prevState => ([...prevState, itemNames]))
            }          
        }

    }
    
    //takes array of selected items and adds them to the current order array
    function updateOrder(items) {
        items.forEach(item => {
            let number = document.getElementById(`quantity-${item.menuitemid}`)
            let quantity = parseInt(number.innerText);
            let itemNames

            if(quantity > 1) {
                //if property exists, pushes an object rather than a string to order array
                if (item.translatedName) {
                    itemNames = {
                        itemID: item.menuitemid,
                        englishName: `${item.name} (A la Carte)`, //differentiate carte items from regular items by adding (A la Carte)
                        translatedName: `${item.translatedName} (${translations.carte_button})`
                    }
                    addMultItem(itemNames, quantity);
                }   else {
                    addMultItem(`${item.name} (A la Carte)`, quantity);
                }          
                const cartePrice = Number.parseFloat(item.price) + 4.40
                addPrice(cartePrice * quantity);
            } else if (quantity === 1) {
                if (item.translatedName) {
                    itemNames = {
                        itemID: item.menuitemid,
                        englishName: `${item.name} (A la Carte)`,
                        translatedName: `${item.translatedName} (${translations.carte_button})`
                    }
                    addItem(itemNames)
                } else {
                    addItem(`${item.name} (A la Carte)`)
                }
                
                const cartePrice = Number.parseFloat(item.price) + 4.40
                addPrice(cartePrice)
            }
        })
    }

    //increments quantity of selected item
    function add(itemID) {
        const number = document.getElementById(`quantity-${itemID}`);
        let increment = parseInt(number.innerText);
        number.innerText = increment + 1
    }

    //decrements quantity of selected item and removes item from selectedEntrees if number reaches 0
    function subtract(itemID) {
        const number = document.getElementById(`quantity-${itemID}`);
        let increment = parseInt(number.innerText);
        if (increment - 1 >= 1) {
            number.innerText = increment - 1;
        } else if (increment - 1 == 0) {
            const entree = document.getElementById(`button-${itemID}`)
            entree.classList.remove("selected")
            setEntrees(prevState => {
                const removed = prevState.findIndex(element => element.menuitemid === itemID)
                return prevState.filter((_, i) => i !== removed)
            })
        }
    }

    //default image if item image does not exist
    const imgSrc = "/images/panda_transparent.png"

    return (
        <div className="carte-body">
            <Navi />
            <h2 className="combo-header">{translations.carte_header || 'Select Your Item'}:</h2>
            <div className="entree-container">
                {menuItems.map(item => {
                    if (item.isentree || item.isside) {
                        {/*If curent language is not english, display translated text*/}
                        if (language !== "EN" && language !== "") {
                            const translatedItem = translatedMenu.find(element => element.id === item.menuitemid)
                            return (
                                <div className="entree-display" id={`button-${item.menuitemid}`} key={item.menuitemid}>
                                    <button className="entreeButton" onClick={() => updateEntrees(item, translatedItem)}><img className="item-image" src={item.image} alt={`Image of ${translatedItem.name}`} onError={e => e.target.src = imgSrc}/><h3>{translatedItem.name}</h3></button>
                                </div>
                            )    
                        } else {
                            return (
                                <div className="entree-display" id={`button-${item.menuitemid}`} key={item.menuitemid}>
                                    <button className="entreeButton" onClick={() => updateEntrees(item)}><img className="item-image" src={item.image} alt={`Image of ${item.name}`} onError={e => e.target.src = imgSrc}/><h3>{item.name}</h3></button>
                                </div>    
                            )
                        }
                    }
                    })}
            </div>
            <Footer isOpen={openFooter}>
                <div className="footer-display">
                    <div className="carte-list">
                        {selectedEntrees.map(item => (
                            <div key={item.menuitemid} className="selectedEntree-display">
                                <p>{item.translatedName || item.name}</p>
                                <div className="number-display">
                                    <button onClick={() => subtract(item.menuitemid)}>-</button>
                                    <p id={`quantity-${item.menuitemid}`}>1</p>
                                    <button onClick={() => add(item.menuitemid)}>+</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link to={"/customer"}><button className="confirm-button" onClick={() => updateOrder(selectedEntrees)}>{translations.footer_button || 'Confirm'}</button></Link>
                </div>
            </Footer>
        </div>
    )
}

export default Carte;