import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchCocktails } from "../services/cocktailApi";
import { useAuth } from "../context/AuthContext";
import DrinkCard from "../components/DrinkCard";

export default function Home() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drinks, setDrinks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  useEffect(() => {
    setSearchTerm("");
    setSearchQuery("");
  }, [location.key]);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        const cocktails = await fetchCocktails("");

        setDrinks(
          cocktails.filter(
            (drink) =>
              drink.category === "Cocktail" ||
              drink.strCategory === "Cocktail"
          )
        );
      } catch (err) {
        setError(
          "Could not load cocktails. Please make sure the backend server is running."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, navigate]);

  const handleSearch = () => {
    setSearchQuery(searchTerm.trim());
  };

  const handleSelectSuggestion = (title) => {
    setSearchTerm(title);
    setSearchQuery(title);
  };

  const visibleDrinks = searchQuery.trim()
    ? drinks.filter((drink) => {
        const title = (drink.name || drink.strDrink || "").toLowerCase();
        return title.includes(searchQuery.toLowerCase());
      })
    : drinks;

  const filteredSuggestions = drinks.filter((drink) => {
    const title = (drink.name || drink.strDrink || "").toLowerCase();
    return title.includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search cocktails by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="search-suggestions">
        <p className="suggestions-label" onClick={() => setSuggestionsOpen(o => !o)} style={{ cursor: "pointer", userSelect: "none" }}>
          Cocktail suggestions {suggestionsOpen ? "▲" : "▼"}
        </p>

        {suggestionsOpen && (
          <ul>
            {filteredSuggestions.map((drink) => {
              const title = drink.name || drink.strDrink;
              return (
                <li
                  key={drink.id || drink.idDrink}
                  onClick={() => handleSelectSuggestion(title)}
                >
                  {title}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading cocktails...</p>
      ) : error ? (
        <p style={{ textAlign: "center", color: "red" }}>{error}</p>
      ) : visibleDrinks.length === 0 ? (
        <p style={{ textAlign: "center" }}>No cocktails found.</p>
      ) : (
        <div className="products-grid">
          {visibleDrinks.map((drink, index) => (
            <DrinkCard
              key={drink.id || drink.idDrink}
              drink={drink}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}