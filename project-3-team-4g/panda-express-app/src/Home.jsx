import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import pandaLogo from "./images/panda_transparent.png";
import "./Home.css";
import { orderContext } from ".";

//landing page of app
function Home() {
  const [showDropdown, setShowDropdown] = useState(false);
  const {language, setLanguage, translations, setTranslations, loading, setLoading, setTranslatedMenu} = useContext(orderContext)

  //array of all the keys contained in en.json, with their corresponding value being a line of static text written in english
  const textKeys = ['cart_button', 'checkout_button', 'back_button', 'panda', 'greeting', 'order_button', 'home_options_button', 'employees_button', 'board_button',
     'manager_button', 'combo_button', 'carte_button', 'app_button', 'drink_button', 'issues', 'submit_button', 'placeholder', 'entree_header', 'nutrition_header', 'nutrition_name', 
     'calories', 'saturated_fat', 'carbohydrates', 'protein', 'serving_size', 'allergens', 'footer_button', 'selected', 'combo_header', 'side_header', 'app_header', 'carte_header', 
     'drink_header', 'price', 'select', 'english', 'french', 'spanish', 'japanese', 'chinese', 'arabic', 'german', 'portuguese', 'korean', 'payment', 'cash', 'card', 'dining', 'checkout_submit', 
     'cancel', 'review', 'review_label', 'select_item', 'review_placeholder', 'submit_review', 'zoom_in', 'zoom_out', 'blank', 'blank_menu', 'thanks', 'thanks_review', 'submit_fail', 'review_fail']

  //updates language of website to whatever is selected by user
  useEffect(() => {
    if (language === 'EN' || language === "") {
      setTranslations({});
      setTranslatedMenu([]);
      return;
    }

    //fetches translations for static text of website
    const fetchTranslations = async () => {
      setLoading(true);
      try {
        const response = await fetch('/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ language, textKeys }),
        });
        const data = await response.json();
        setTranslations(data.translatedText || {});
      } catch (error) {
        console.error('Error fetching translations:', error);
      }
    };

    //fetches array of menu items translated to target language
    const fetchTranslatedMenu = async () => {
      try {
        const response = await fetch('/translatedMenu', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ language })
        })
        const data = await response.json()
        setTranslatedMenu(data.translatedItems || [])
      } catch (error) {
        console.error('Error fetching translations:', error);
      }
      
      setLoading(false);
      
    }

    
    fetchTranslations();
    fetchTranslatedMenu();
    
  }, [language]);

  return (
    <div className="home-container">
      {loading ? (<p>Loading...</p>) : 
      (
      <div className="background-overlay">
        <h1 className="landing-text">{translations.greeting || 'WELCOME TO PANDA EXPRESS!'}</h1>
        <img src={pandaLogo} alt="Panda Express logo" className="logo" />
        
        <Link to="/customer">
          <button className="order-button">{translations.order_button || 'Order Now'}</button>
        </Link>

        <div className="dropdown">
          <button className="dropdown-button" onClick={() => setShowDropdown(!showDropdown)}>
            {translations.home_options_button || 'More Options'}
          </button>
          {showDropdown && (
            <div className="dropdown-menu">
              <Link to="/board">
                <button className="dropdown-item">{translations.board_button || 'Display Board'}</button>
              </Link>
              <Link to="/login" state={{ redirectTo: "/manager" }}>
                <button className="dropdown-item">{translations.manager_button || 'Managers'}</button>
              </Link>
              <Link to="/login" state={{ redirectTo: "/cashier" }}>
                <button className="dropdown-item">{translations.employees_button || 'Cashiers'}</button>
              </Link>
            </div>
          )}
        </div>

        <div className="language">
          <select onChange={(e) => {
            if (e.target.value !== language) {
              setLanguage(e.target.value)
            }
          }} value={language}>
            <option value="" aria-label="Select a language">{translations.select || 'Select a language'}</option>
            <option value="EN" aria-label="English">{translations.english || 'English'}</option>
            <option value="FR" aria-label="French">{translations.french || 'French'}</option>
            <option value="ES" aria-label="Spanish">{translations.spanish || 'Spanish'}</option>
            <option value="JA" aria-label="Japanese">{translations.japanese || 'Japanese'}</option>
            <option value="ZH-HANS" aria-label="Chinese (simplified)">{translations.chinese || 'Chinese (simplified)'}</option>
            <option value="AR" aria-label="Arabic">{translations.arabic || 'Arabic'}</option>
            <option value="DE" aria-label="German">{translations.german || 'German'}</option>
            <option value="PT-BR" aria-label="Portuguese (Brazilian)">{translations.portuguese || 'Portuguese (Brazilian)'}</option>
            <option value="KO" aria-label="Korean">{translations.korean || 'Korean'}</option>
          </select>
        </div>

      </div>
      )}
    </div>
        
  );
}

export default Home;
