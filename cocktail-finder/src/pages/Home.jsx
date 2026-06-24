import { useState, useEffect } from "react";
import { fetchCocktails } from "../services/cocktailApi";
import DrinkCard from "../components/DrinkCard";

export default function Home() {
  const [drinks, setDrinks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCocktails = async () => {
      setLoading(true);
      setError("");
      try {
        const results = await fetchCocktails();
        setDrinks(results);
      } catch (err) {
        setError("Could not load cocktails. Please make sure the backend server is running.");
      } finally {
        setLoading(false);
      }
    };

    loadCocktails();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const results = await fetchCocktails(searchTerm);
      setDrinks(results);
    } catch (err) {
      setError("Could not search cocktails. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search cocktails by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading cocktails...</p>
      ) : error ? (
        <p style={{ textAlign: "center", color: "red" }}>{error}</p>
      ) : drinks.length === 0 ? (
        <p style={{ textAlign: "center", color: "gray" }}>No cocktails found.</p>
      ) : (
        <div className="drinks-grid">
          {drinks.map((drink, index) => (
            <DrinkCard key={drink.id} drink={drink} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
