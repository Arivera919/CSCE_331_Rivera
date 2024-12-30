import { Link } from "react-router-dom";
import Navi from "../Navi";
import React, { useContext, useEffect, useState } from "react";
import { orderContext } from "..";
import "./Entree.css";
import Footer from "../Footer";
import Modal from "../Modal";


function Entree() {
    const {addItem, addMultItem, menuItems, addPrice, currContainer, translations, translatedMenu, language} = useContext(orderContext)
    const [openFooter, setFooter] = useState(false);//determines whether footer is visible
    const [selectedEntrees, setEntrees] = useState([]);//tracks which items have been selected
    const [totalEntrees, setTotal] = useState(0);//tracks total number of items selected
    const [isModalOpen, setIsModalOpen] = useState(false);//determines whether modal is open
    const [completeOrder, setCompletion] = useState(false);//true when order requirements are met
    const [modalContent, setIsModalClose] = useState("");//object containing all information to be presented in modal
    const [neededEntrees, setReq] = useState(0);//tracks number of required items

    //sets required number of items and checks if requirements were met
    useEffect(() => {
        if (selectedEntrees.length !== 0) {
            setFooter(true)
        } else {
            setFooter(false)
        }

        if (currContainer === "Bowl") {
            setReq(1)
        } else if (currContainer === "Plate") {
            setReq(2)
        } else if (currContainer === "Bigger Plate") {
            setReq(3)
        }

        if ((selectedEntrees.length === 1 || totalEntrees === 1) && currContainer === "Bowl") {
            setCompletion(true)
        } else if ((selectedEntrees.length === 2 || totalEntrees === 2) && currContainer === "Plate") {
            setCompletion(true)
        } else if ((selectedEntrees.length === 3 || totalEntrees === 3) && currContainer === "Bigger Plate") {
            setCompletion(true)
        } else {
            setCompletion(false)
        }

    }, [selectedEntrees, totalEntrees]);

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

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsModalClose(null); 

    };

    //recieves a string or a string plus an object
    //translatedItem is not null when website is in a language other than english
    //updates selectedEntrees array
    function updateEntrees(item, translatedItem=null) {
        const entree = document.getElementById(`button-${item.menuitemid}`)

        if (entree.classList.contains("selected")) {
            entree.classList.remove("selected")
            const number = document.getElementById(`quantity-${item.menuitemid}`);
            const quantity = parseInt(number.innerText);
            setTotal(prevState => (prevState - quantity));
            if (translatedItem !== null) {
                setEntrees(prevState => {
                    const removed = prevState.findIndex(element => element.menuitemid === translatedItem.id)
                    return prevState.filter((_, i) => i !== removed)
                })
            } else {
                setEntrees(prevState => {
                    const removed = prevState.findIndex(element => element.name === item.name)
                    return prevState.filter((_, i) => i !== removed)
                })
            }
            
        } else {
            if (currContainer === "Bowl" && selectedEntrees.length < 1 && totalEntrees < 1) {
                entree.classList.add("selected");

                if (translatedItem !== null) {
                    const itemNames = {...item, translatedName: translatedItem.name}
                    setEntrees(prevState => ([...prevState, itemNames]))
                } else {
                    setEntrees(prevState => ([...prevState, item]))
                }

                setTotal(prevState => (prevState + 1))
            } else if (currContainer === "Plate" && selectedEntrees.length < 2 && totalEntrees < 2) {
                entree.classList.add("selected");

                if (translatedItem !== null) {
                    const itemNames = {...item, translatedName: translatedItem.name}
                    setEntrees(prevState => ([...prevState, itemNames]))
                } else {
                    setEntrees(prevState => ([...prevState, item]))
                }

                setTotal(prevState => (prevState + 1))
            } else if (currContainer === "Bigger Plate" && selectedEntrees.length < 3 && totalEntrees < 3) {
                entree.classList.add("selected");

                if (translatedItem !== null) {
                    const itemNames = {...item, translatedName: translatedItem.name}
                    setEntrees(prevState => ([...prevState, itemNames]))
                } else {
                    setEntrees(prevState => ([...prevState, item]))
                }

                setTotal(prevState => (prevState + 1))
            }
        }
        
    }

    //takes up to three items and adds them to the current order array
    function updateOrder(item1, item2=null, item3=null) {
        const number1 = document.getElementById(`quantity-${item1.menuitemid}`);
        const quantity1 = parseInt(number1.innerText);

        if (quantity1 > 1) {
            //if property exists, pushes an object rather than a string to order array
            if (item1.translatedName) {
                const itemNames = {
                    itemID: item1.menuitemid,
                    englishName: item1.name,
                    translatedName: item1.translatedName
                }

                addMultItem(itemNames, quantity1)
            } else {
                addMultItem(item1.name, quantity1);
            }
            
            addPrice(item1.price * quantity1);
        } else if (quantity1 === 1) {

            if (item1.translatedName) {
                const itemNames = {
                    itemID: item1.menuitemid,
                    englishName: item1.name,
                    translatedName: item1.translatedName
                }

                addItem(itemNames)
            } else {
                addItem(item1.name);
            }
            
            addPrice(item1.price)
        }
        
        if (item2 !== null) {
            const number2 = document.getElementById(`quantity-${item2.menuitemid}`);
            const quantity2 = parseInt(number2.innerText);

            if (quantity2 > 1) {

                if (item2.translatedName) {
                    const itemNames = {
                        itemID: item2.menuitemid,
                        englishName: item2.name,
                        translatedName: item2.translatedName
                    }
    
                    addMultItem(itemNames, quantity2)
                } else {
                    addMultItem(item1.name, quantity2);
                }

                addPrice(item2.price * quantity2);
            } else if (quantity2 === 1) {
                
                if (item2.translatedName) {
                    const itemNames = {
                        itemID: item2.menuitemid,
                        englishName: item2.name,
                        translatedName: item2.translatedName
                    }
    
                    addItem(itemNames)
                } else {
                    addItem(item2.name);
                }

                addPrice(item2.price)
            }

        }

        if (item3 !== null) {
            const number3 = document.getElementById(`quantity-${item3.menuitemid}`);
            const quantity3 = parseInt(number3.innerText);

            if (quantity3 > 1) {
                
                if (item3.translatedName) {
                    const itemNames = {
                        itemID: item3.menuitemid,
                        englishName: item3.name,
                        translatedName: item3.translatedName
                    }
    
                    addMultItem(itemNames, quantity3)
                } else {
                    addMultItem(item3.name, quantity3);
                }

                addPrice(item3.price * quantity3);
            } else if (quantity3 === 1) {
                
                if (item3.translatedName) {
                    const itemNames = {
                        itemID: item3.menuitemid,
                        englishName: item3.name,
                        translatedName: item3.translatedName
                    }
    
                    addItem(itemNames)
                } else {
                    addItem(item3.name);
                }

                addPrice(item3.price)
            }
        }

        
    }

    //increments quantity of selected item and adds to total
    function add(itemID) {
        const number = document.getElementById(`quantity-${itemID}`);
        let increment = parseInt(number.innerText);
        if (currContainer === "Bowl" && totalEntrees < 1) {
            number.innerText = increment + 1;
            setTotal(prevState => (prevState + 1))
        } else if (currContainer === "Plate" && totalEntrees < 2) {
            number.innerText = increment + 1;
            setTotal(prevState => (prevState + 1))
        } else if (currContainer === "Bigger Plate" && totalEntrees < 3) {
            number.innerText = increment + 1;
            setTotal(prevState => (prevState + 1))
        }
    }

    //decrements quantity of selected item and removes item from selectedEntrees if number reaches 0
    function subtract(itemID) {
        const number = document.getElementById(`quantity-${itemID}`);
        let increment = parseInt(number.innerText);
        if (increment - 1 >= 1) {
            number.innerText = increment - 1;
            setTotal(prevState => (prevState - 1))
        } else if (increment - 1 == 0) {
            const entree = document.getElementById(`button-${itemID}`)
            entree.classList.remove("selected")
            setTotal(prevState => (prevState - 1))
            setEntrees(prevState => {
                const removed = prevState.findIndex(element => element.menuitemid === itemID)
                return prevState.filter((_, i) => i !== removed)
            })
        }
    }

    //default image if item image does not exist
    const imgSrc = "/images/panda_transparent.png"

    return (
        <div className="entree-body">
            <Navi />
            <h2 className="combo-header">3. {translations.entree_header || 'Select Your Entrees'}:</h2>
            <div className="entree-container">
                {menuItems.map(item => {
                    if (item.isentree) {
                        {/*Displays current selection of items, in english or chosen language*/}
                        if (language !== "EN" && language !== "") {
                            const translatedItem = translatedMenu.find(element => element.id === item.menuitemid)

                            return (
                                <div className="entree-display" id={`button-${item.menuitemid}`} key={item.menuitemid}>
                                    <button className="entreeButton" onClick={() => updateEntrees(item, translatedItem)}><img className="item-image" src={item.image} alt={`Image of ${translatedItem.name}`} onError={e => e.target.src = imgSrc}/><h3>{translatedItem.name}</h3></button>
                                    <button onClick={() => handleOpenModal(item, translatedItem.name)}>ℹ️</button>
    
                                <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                                <h2>{translations.nutrition_header || 'Nutrition Guide'}</h2>
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
                                <div className="entree-display" id={`button-${item.menuitemid}`} key={item.menuitemid}>
                                    <button className="entreeButton" onClick={() => updateEntrees(item)}><img className="item-image" src={item.image} alt={`Image of ${item.name}`} onError={e => e.target.src = imgSrc}/><h3>{item.name}</h3></button>
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
                    <div className="entree-list">
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
                    {/*If selected items meet item requirements, user is allowed to move on*/}
                    {completeOrder ? (<Link to={"/customer"}><button className="confirm-button" onClick={() => {
                        
                        if (currContainer === "Bowl") {
                            updateOrder(selectedEntrees[0])
                        } else if (currContainer === "Plate") {
                            if (selectedEntrees.length === 2) {
                                updateOrder(selectedEntrees[0], selectedEntrees[1])
                            } else {
                                updateOrder(selectedEntrees[0])
                            }
                            
                        } else if (currContainer === "Bigger Plate") {
                            if (selectedEntrees.length === 3) {
                                updateOrder(selectedEntrees[0], selectedEntrees[1], selectedEntrees[2])
                            } else if (selectedEntrees.length === 2) {
                                updateOrder(selectedEntrees[0], selectedEntrees[1])
                            } else {
                                updateOrder(selectedEntrees[0])
                            }
                            
                        }
                    }}>{translations.footer_button || 'Confirm'}</button></Link>) : (<div>{totalEntrees}/{neededEntrees} {translations.selected || 'entrees selected'}</div>)}
                    
                </div>
            </Footer>
        </div>
    )
}

export default Entree;