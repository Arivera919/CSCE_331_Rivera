import { Link } from "react-router-dom";
import { useEffect } from "react";
import Navi from "../Navi";
import "./Customer.css";
import { useContext } from "react";
import { orderContext } from "..";
import { useState } from 'react';
import ReactDOM from 'react-dom/client';

import comboimg from "../images/plate.png"
import drinkimg from "../images/drink.png"
import carteimg from "../images/alacarte.png"
import appimg from "../images/appetizer.png"

//landing page for customer interface
function Customer() {
  const { setMenu, menuItems, translatedMenu, language } = useContext(orderContext);
  const [issueText, setIssueText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [reviewText, setReviewText] = useState("");
  const [selectedMenuItem, setSelectedMenuItem] = useState("");

  const [textZoomLevel, setTextZoomLevel] = useState(100);
  const [buttonZoomLevel, setButtonZoomLevel] = useState(100);


  const { translations } = useContext(orderContext)

  //updates database with issue report left by customer
  const handleIssueSubmit = async () => {
    if (!issueText.trim()) {
      const alertString = `${translations.blank}.` || "Report is blank."
      alert(alertString);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/submitIssue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: issueText }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit issue');
      }

      setIssueText("");
      
      let alertString

      if (translations.thanks) {
        alertString = `${translations.thanks}.`
      } else {
        alertString = "Thank you."
      }

      alert(alertString);
    } catch (error) {
      const alertString = translations.submit_fail || "Failed to submit issue. Please try again later."
      alert(alertString);
    } finally {
      setIsSubmitting(false);
    }
  };

  //updates database with item review left by customer
  const handleReviewSubmit = async () => {
    if (!reviewText.trim() || !selectedMenuItem) {
      const alertString = `${translations.blank_menu}.` || "Please select a menu item and write a review."
      alert(alertString);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/submitmenuIssue/${selectedMenuItem}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: reviewText }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      setReviewText("");
      setSelectedMenuItem("");
      let alertString

      if (translations.thanks_review) {
        alertString = `${translations.thanks_review}.`
      } else {
        alertString = "Thank you for your review."
      }
       
      alert(alertString);
    } catch (error) {
      const alertString = translations.review_fail || "Failed to submit review. Please try again later."
      alert(alertString);
    } finally {
      setIsSubmitting(false);
    }
  };


  //updates zoom state of page
  const handleZoom = (increment) => {
    setTextZoomLevel((prevZoom) => Math.max(50, prevZoom + increment));
    setButtonZoomLevel((prevZoom) => Math.max(50, prevZoom + (increment/5)));
  };

  const rootStyle = {
    fontSize: `${textZoomLevel}%`,
  };

  const buttonStyle = {
    padding: `${buttonZoomLevel / 10}px`,
    fontSize: `${buttonZoomLevel / 100}rem`,
  };

    return (
    <div className="customer-body" style={rootStyle}>
      <Navi />

      {/*Links to various item category pages*/}
      <div className="customer-container">
          <Link to={"/customer/combos"}><button className="customer-button" style={buttonStyle}><img src={comboimg} alt="" /><h2 className="button-label">{translations.combo_button || 'Combos'}</h2></button></Link>
          <Link to={"/customer/a_la_carte"}><button className="customer-button" style={buttonStyle}><img src={carteimg} alt="" /><h2 className="button-label">{translations.carte_button || 'A la Carte'}</h2></button></Link>
          <Link to={"/customer/appetizers"}><button className="customer-button" style={buttonStyle}><img src={appimg} alt="" /><h2 className="button-label">{translations.app_button || 'Appetizers'}</h2></button></Link>
          <Link to={"/customer/drinks"}><button className="customer-button" style={buttonStyle}><img src={drinkimg} alt="" /><h2 className="button-label">{translations.drink_button || 'Drinks'}</h2></button></Link>
      </div>

      <div className="issue-report-container">
          {/* Text field for reporting issues or complaints */}
          <div className="issue-label">{translations.issues || 'Have any complaints or issues? Send them here and an employee will take a look:'}</div>
          <textarea className="issue-textarea" value={issueText} onChange={(e) => setIssueText(e.target.value)}
            placeholder={translations.placeholder || "Describe the issue here..."}/>
          <button onClick={handleIssueSubmit} className="issue-submit-button">
          {translations.submit_button || 'Submit Issue'}
          </button>
      </div>

      {/* Review Submission Section */}
      <div className="review-report-container">
        {/* Label for the section */}
        <label htmlFor="menuitem-dropdown" className="review-label">
        {translations.review_label || "Leave a review for a menu item"}:
        </label>

        {/* Dropdown for selecting menu item */}
        <select
          id="menuitem-dropdown" // Unique ID to associate with the label
          className="menuitem-dropdown"
          value={selectedMenuItem}
          onChange={(e) => setSelectedMenuItem(e.target.value)}
        >
        {/* Default placeholder option */}
        <option value="" disabled>
          {translations.select_item || "Select a menu item"}
        </option>

        {/* Dynamically render menu items */}
        {menuItems &&
          menuItems.map((item) => {
          if (language !== "EN" && language !== "") {
            const translatedItem = translatedMenu.find(
              (element) => element.id === item.menuitemid
            );

            return (
              <option key={item.menuitemid} value={item.menuitemid}>
                {translatedItem?.name || item.name}
              </option>
            );
          } else {
            return (
              <option key={item.menuitemid} value={item.menuitemid}>
                {item.name}
              </option>
            );
          }
          })}
          </select>
        

        {/* Text area for review */}
        <textarea
          className="review-textarea"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder={`${translations.review_placeholder || "Write your review here"}...`}
        />
        <button onClick={handleReviewSubmit} className="issue-submit-button">
          {translations.submit_review || 'Submit Review'}
        </button>
      </div>
    </div>
            
    )
}

export default Customer;
