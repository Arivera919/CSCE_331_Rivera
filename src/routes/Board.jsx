import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Board.css";
import pandaLogo from "../images/panda_transparent.png";
import bowlImage from "../images/bowl.png"
import plateImage from "../images/plate.png"
import biggerPlateImage from "../images/biggerplate.png"

import orangechicken from "../images/orangechicken.png"
import kungpaochicken from "../images/kungpaochicken.png"
import beijingbeef from "../images/beijingbeef.png"
import beyondorangechicken from "../images/beyondorangechicken.png"
import blackpepperchicken from "../images/blackpepperchicken.png"
import blackpeppersirloinsteak from "../images/blackpeppersirloinsteak.png"
import broccolibeef from "../images/broccolibeef.png"
import honeysesamechicken from "../images/honeysesamechicken.png"
import honeywalnutshrimp from "../images/honeywalnutshrimp.png"
import hotblazingbourbonchicken from "../images/hotonesblazingbourbonchicken.png"
import mushroomchicken from "../images/mushroomchicken.png"
import stringbeanchicken from "../images/stringbeanchicken.png"
import supergreen from "../images/supergreen.png"
import teriyakichicken from "../images/teriyakichicken.png"

import chickeneggroll from "../images/chickeneggroll.png"
import cheeserangoon from "../images/cheeserangoon.png"
import veggiespringroll from "../images/veggiespringroll.png"
import applepieroll from "../images/applepieroll.png"
import drink from "../images/drink.png"

function Board() {
    //sets the weather
    const [weather, setWeather] = useState("Loading...");
    //loads some of the entree data that needs to ne shown on the menu board
    const entrees = [
        { name: "The Original Orange Chicken", image: orangechicken, calories: 510, allergens: "Sesame, Milk, Eggs, Soybeans, Wheat", premium: false },
        { name: "Kung Pao Chicken", image: kungpaochicken, calories: 320, allergens: "Sesame, Peanuts, Soybeans, Wheat", premium: false },
        { name: "Beijing Beef", image: beijingbeef, calories: 480, allergens: "Soybeans, Wheat", premium: false },
        { name: "Beyond Orange Chicken", image: beyondorangechicken, calories: 440, allergens: "Sesame, Milk, Eggs, Soybeans, Wheat", premium: true },
        { name: "Black Pepper Chicken", image: blackpepperchicken, calories: 180, allergens: "Sesame, Soybeans, Wheat", premium: false },
        { name: "Black Pepper Sirloin Steak", image: blackpeppersirloinsteak, calories: 180, allergens: "Soybeans, Wheat", premium: true },
        { name: "Broccoli Beef", image: broccolibeef, calories: 150, allergens: "Soybeans, Wheat", premium: false },
        { name: "Honey Sesame Chicken Breast", image: honeysesamechicken, calories: 340, allergens: "Sesame", premium: false },
        { name: "Honey Walnut Shrimp", image: honeywalnutshrimp, calories: 430, allergens: "Milk, Eggs, Shellfish, Soybeans, Wheat, Treenuts", premium: true },
        { name: "Hot Blazing Bourbon Chicken", image: hotblazingbourbonchicken, calories: 400, allergens: "Eggs, Milk, Sesame, Soybeans, Wheat", premium: false },
        { name: "Mushroom Chicken", image: mushroomchicken, calories: 220, allergens: "Sesame, Soybeans, Wheat", premium: false },
        { name: "String Bean Chicken Breast", image: stringbeanchicken, calories: 210, allergens: "Sesame, Soybeans, Wheat", premium: false },
        { name: "Super Greens", image: supergreen, calories: 130, allergens: "Wheat, Soybeans, Sesame", premium: false },
        { name: "Grilled Teriyaki Chicken", image: teriyakichicken, calories: 275, allergens: "Soybeans, Wheat, Sesame", premium: false },
    ];    
  //loads some of the appetizer data
    const appetizers = [
        { name: "Chicken Egg Roll", image: chickeneggroll, price: "$2.00", calories: 190, allergens: "Egg, Soy, Wheat" },
        { name: "Cheese Rangoon", image: cheeserangoon, price: "$2.00", calories: 190, allergens: "Egg, Soy, Wheat" },
        { name: "Veggie Spring Roll", image: veggiespringroll, price: "$2.00", calories: 190, allergens: "Soy, Wheat" },
        { name: "Apple Pie Roll", image: applepieroll, price: "$2.00", calories: 190, allergens: "Soy, Wheat" },
    ];
    
    // Fetch weather data
    useEffect(() => {
        const fetchWeather = async () => {
            try {
                //fetch for college station only
                //30.6280° N, 96.3344° W
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=30.6280&lon=-96.3344&units=imperial&appid=1ad63d7a812ecc314c907e0d9ca5eb8f`;
                
                const response = await fetch(url);
                if (!response.ok) throw new Error("Weather data not available");
                
                const data = await response.json();
                const temp = Math.round(data.main.temp);
                const description = data.weather[0].description;

                const weatherMessage = `${temp}°F, ${description}`;

                let creative;
                if (temp < 60) creative = "It's cold outside! Try our spicy options to warm you up!";
                else if (temp > 80) creative = "It's hot outside! Get yourself a refreshing drink!";
                else creative = "It's nice outside! Treat yourself to some of our appetizers!";
    
                setWeather(`${weatherMessage} <br /> ${creative}`);
            } catch (error) {
                setWeather("Unable to fetch weather");
                console.error(error);
            }
        };

        fetchWeather();
    }, []);

    return (
        <div className="menu-board">
            {/* Header part with logo and shows current weather */}
            <div className="header">
                <img src={pandaLogo} alt="Panda Express logo" className="logo" />
                <div className="weather" dangerouslySetInnerHTML={{ __html: `College Station: ${weather}` }}></div>
            </div>

            <div className="menu">
                {/* Left Section */}
                <div className="menu-section combos">
                    <h2>Select Your Combo</h2>

                    <div className="combo-item">
                        <img src={bowlImage} alt="Bowl" />
                        <div className="combo-details">
                            <h3>Bowl</h3>
                            <p>A bowl with your choice of 1 entree and 1 side.</p>
                            <span className="price">$8.30</span>
                        </div>
                    </div>
                    <div className="combo-item">
                        <img src={plateImage} alt="Plate" />
                        <div className="combo-details">
                            <h3>Plate</h3>
                            <p>A plate with your choice of 2 entrees and 1 side.</p>
                            <span className="price">$9.80</span>
                        </div>
                    </div>
                    <div className="combo-item">
                        <img src={biggerPlateImage} alt="Bigger Plate" />
                        <div className="combo-details">
                            <h3>Bigger Plate</h3>
                            <p>A bigger plate with your choice of 3 entrees and 1 side.</p>
                            <span className="price">$11.30</span>
                        </div>
                    </div>
                    <div className="combo-item">
                        <img src={drink} alt="Drink" />
                        <div className="combo-details">
                            <h3>Drink</h3>
                            <p>A drink of your choice on the side.</p>
                            <span className="price">$1.50</span>
                        </div>
                    </div>
                </div>

                {/* Middle Section */}
                <div className="menu-section entrees">
                    <h2>Entree Choices</h2>
                    <div className="entree-grid">
                        {entrees.map((entree) => (
                            <div className="entree-item" key={entree.name}>
                                <img src={entree.image} alt={entree.name} />
                                <div className="entree-details">
                                    <h3>{entree.name}{entree.premium && (<span className="premium-label"> P</span>)}</h3>
                                    <p>Allergens: {entree.allergens}</p>
                                    <p>Calories: {entree.calories} cal</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Section */}
                <div className="menu-section appetizers">
                    <h2>Appetizers</h2>
                    {appetizers.map((appetizer) => (
                        <div className="appetizer-item" key={appetizer.name}>
                            <img src={appetizer.image} alt={appetizer.name} />
                            <div className="entree-details">
                                <span className="price">{appetizer.price}</span>
                                <h3>{appetizer.name}</h3>
                                    <p>Allergens: {appetizer.allergens}</p>
                                    <p>Calories: {appetizer.calories} cal</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Board;
