import { Link } from "react-router-dom";
import Navi from "../Navi";
import { useContext, useEffect, useState } from "react";
import { orderContext } from "..";
import Footer from "../Footer";
import "./Appetizer.css";
import Modal from "../Modal";

//Appetizer page for the app
function Appetizer() {
    const {addItem, addMultItem, menuItems, addPrice, translations, language, translatedMenu} = useContext(orderContext)
    const [openFooter, setFooter] = useState(false); //determines whether footer is visible
    const [selectedEntrees, setEntrees] = useState([]); //tracks which items have been selected

    const [isModalOpen, setIsModalOpen] = useState(false);//determines whether modal is open
    const [modalContent, setIsModalClose] = useState("");//object containing all information to be presented in modal



    //Once at least one item has been selected, footer becomes visible
    useEffect(() => {
        if (selectedEntrees.length !== 0) {
            setFooter(true)
        } else {
            setFooter(false)
        }
    }, [selectedEntrees])

    
    //sets modal content and opens modal
    const handleOpenModal = (item, translatedName=null) => {
        
        if (translatedName !== null) {
            const itemNames = {...item, translatedName: translatedName}
            setIsModalClose(itemNames)
        } else {
            setIsModalClose(item);
        }
         
        setIsModalOpen(true); 
    };

//closes modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsModalClose(null); 

    };
    

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
                entree.classList.add("selected")
                const itemNames = {...item, translatedName: translatedItem.name}
                setEntrees(prevState => ([...prevState, itemNames]))
            }
        }

    }
    
    //takes array of selected items and adds them to the current order array
    function updateOrder(items) {
        items.forEach(item => {
            let number = document.getElementById(`quantity-${item.menuitemid}`)
            let quantity = parseInt(number.innerText)
            let itemNames

            if(quantity > 1) {
                //if property exists, pushes an object rather than a string to order array
                if (item.translatedName) {
                    itemNames = {
                        itemID: item.menuitemid,
                        englishName: item.name,
                        translatedName: item.translatedName
                    }
                    addMultItem(itemNames, quantity)
                } else {
                    addMultItem(item.name, quantity);
                }
                addPrice(item.price * quantity)

            } else if(quantity === 1) {
                if (item.translatedName) {
                    itemNames = {
                        itemID: item.menuitemid,
                        englishName: item.name,
                        translatedName: item.translatedName
                    }
                    addItem(itemNames)
                } else {
                    addItem(item.name)
                }                
                addPrice(item.price)
                
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
            const appetizer = document.getElementById(`button-${itemID}`)
            appetizer.classList.remove("selected")
            setEntrees(prevState => {
                const removed = prevState.findIndex(element => element.menuitemid === itemID)
                return prevState.filter((_, i) => i !== removed)
            })
        }
    }

    //default image if item image does not exist
    const imgSrc = "/images/panda_transparent.png"

    return (
        <div>
            <Navi />
            <h2 className="combo-header">{translations.app_header || 'Select Your Appetizer'}:</h2>
            <div className="app-container">
                {menuItems.map(item => {
                    if (item.isappetizer) {
                        {/*If curent language is not english, display translated text*/}
                        if (language !== "EN" && language !== "") {
                            const translatedItem = translatedMenu.find(element => element.id === item.menuitemid)
                            return (
                                <div id={`button-${item.menuitemid}`}>
                                    <button className="app-button" onClick={() => updateEntrees(item, translatedItem)}><img className="item-image" src={item.image} alt={`Image of ${translatedItem.name}`} onError={e => e.target.src = imgSrc}/><h3>{translatedItem.name}</h3></button>
                                <button onClick={() => handleOpenModal(item, translatedItem.name)}>ℹ️</button>

                                <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                                <h2>{translations.nutrition_header || 'Nutrition Guide'}</h2>
                                {/*this part displays the modal */}
                                {modalContent && (
                                <>
                                    <p>{translations.nutrition_name || 'Name'}: {modalContent.translatedName || modalContent.name}</p>
                                    <p>{translations.calories || 'Calories'}: {modalContent.calories} cal</p>
                                    <p>{translations.saturated_fat || 'Saturated Fat'}: {modalContent.saturatedfat}g</p>
                                    <p>{translations.carbohydrates || 'Carbohydrates'}: {modalContent.carbs}g</p>
                                    <p>{translations.protein || 'Protein'}: {modalContent.protein}g</p>
                                    <p>{translations.serving_size || 'Serving Size'}: {modalContent.servingsize}g</p>
                                    <p>{translations.allergens || 'Allergens'}: {modalContent.allergy}</p>
                                    <p>{translations.review || 'Latest Review'}: {modalContent.review}</p>





                                 </>

)}
         <p className="click-anywhere-text">{translations.click || 'Click anywhere to close'}</p>

 {/* <p>Saturated Fat: 15</p><br></br>
 <p>Protein: 29</p><br></br>
 <p>Carbohydrages: 15</p><br></br> */}
</Modal>
                                </div>
                            )
                        } else {
                            return (
                                <div id={`button-${item.menuitemid}`}>
                                    <button className="app-button" onClick={() => updateEntrees(item)}><img className="item-image" src={item.image} alt={`Image of ${item.name}`} onError={e => e.target.src = imgSrc}/><h3>{item.name}</h3></button>
                                <button onClick={() => handleOpenModal(item)}>ℹ️</button>

                                <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                                <h2>Nutrition Guide</h2>
                                {modalContent && (
                                <>
                                    <p>Name: {modalContent.name}</p>
                                    <p>Calories: {modalContent.calories} cal</p>
                                    <p>Saturated Fat: {modalContent.saturatedfat}g</p>
                                    <p>Carbohydrates: {modalContent.carbs}g</p>
                                    <p>Protein: {modalContent.protein}g</p>
                                    <p>Serving Size: {modalContent.servingsize}g</p>
                                    <p>Allergens: {modalContent.allergy}</p>
                                    <p>Latest Review: {modalContent.review}</p>





                                 </>

)}
         <p className="click-anywhere-text">Click anywhere to close</p>

 {/* <p>Saturated Fat: 15</p><br></br>
 <p>Protein: 29</p><br></br>
 <p>Carbohydrages: 15</p><br></br> */}
</Modal>
                                </div>
                            )
                        }
                        
                    }
                })}
            </div>
            <Footer isOpen={openFooter}>
                <div className="footer-display">
                    <div className="app-list">
                        {selectedEntrees.map(item => (
                            <div key={item.menuitemid} className="selectedApp-display">
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

export default Appetizer;