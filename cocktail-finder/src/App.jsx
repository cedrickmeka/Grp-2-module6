import { useState } from "react";

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
      <h1>🍹 Cocktail Finder</h1>

      <div>
        <input
          type="text"
          placeholder="Search for a cocktail..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button onClick={searchDrinks}>
          Search
        </button>
      </div>

      <div>
        {drinks.map((drink) => (
          <div key={drink.idDrink}>
            <h3>{drink.strDrink}</h3>

            <img
              src={drink.strDrinkThumb}
              alt={drink.strDrink}
              width="200"
            />

            <p>{drink.strCategory}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;