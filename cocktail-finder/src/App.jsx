import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import DrinkCard from "./components/DrinkCard";
import DrinkDetails from "./pages/DrinkDetails";
import Favorites from "./pages/Favorites";
import { getTrendingCocktails } from "./services/cocktailApi";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [drinks, setDrinks] = useState([]);

  useEffect(() => {
    getTrendingCocktails().then(setDrinks);
  }, []);

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

      <Routes>
        <Route
          path="/"
          element={
            <>
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
            </>
          }
        />
        <Route path="/drink/:id" element={<DrinkDetails />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </div>
  );
}

export default App;
