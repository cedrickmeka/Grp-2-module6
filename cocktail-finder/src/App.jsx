import { useState } from "react";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import DrinkCard from "./components/DrinkCard";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [drinks, setDrinks] = useState([]);

  const searchDrinks = async () => {
    if (!searchTerm) return;

    const response = await fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`
    );

    const data = await response.json();
    setDrinks(data.drinks || []);
  };

  return (
    <div className="app">
      <Navbar />

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchDrinks={searchDrinks}
      />

      <div className="drinks-grid">
        {drinks.map((drink, index) => (
          <DrinkCard
            key={drink.idDrink}
            drink={drink}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

export default App;