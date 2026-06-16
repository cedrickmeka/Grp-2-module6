import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchCocktails } from "../services/cocktailApi";
import DrinkCard from "../components/DrinkCard";

export default function Home() {
  const [drinks, setDrinks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("margarita");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrinks = async () => {
      setLoading(true);
      try {
        const results = await searchCocktails(searchTerm);
        setDrinks(results);
      } catch (error) {
        console.error("Could not get drinks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDrinks();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm) return;
    setLoading(true);
    try {
      const results = await searchCocktails(searchTerm);
      setDrinks(results);
    } catch (error) {
      console.error("Could not get drinks:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a cocktail..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Mixing your drinks...</p>
      ) : drinks.length === 0 ? (
        <p style={{ textAlign: "center", color: "gray" }}>No drinks found!</p>
      ) : (
        <div className="drinks-grid">
          {drinks.map((drink, index) => (
            <div key={drink.idDrink} onClick={() => navigate(`/drink/${drink.idDrink}`)} style={{ cursor: "pointer" }}>
              <DrinkCard drink={drink} index={index} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
