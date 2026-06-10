import { useState } from "react";
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
      <header>
        <h1>🍹 Cocktail Finder</h1>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search for a cocktail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchDrinks();
              }
            }}
          />

          <button onClick={searchDrinks}>
            Search
          </button>
        </div>
      </header>

      <div className="drinks-grid">
        {drinks.map((drink, index) => (
          <div className="drink-card" key={drink.idDrink}>
            <div className="drink-number">
              {index + 1}
            </div>

            <img
              src={drink.strDrinkThumb}
              alt={drink.strDrink}
            />

            <div className="drink-info">
              <h3>{drink.strDrink}</h3>

              <p>
                <strong>Category:</strong> {drink.strCategory}
              </p>

              <span className="category">
                {drink.strAlcoholic}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;