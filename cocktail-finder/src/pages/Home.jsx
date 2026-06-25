import { useState, useEffect } from "react";
import { fetchCocktails } from "../services/cocktailApi";

export default function Home() {
  const [drinks, setDrinks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = () => {
    setSearchQuery(searchTerm.trim());
  };

  const handleSelectSuggestion = (title) => {
    setSearchTerm(title);
    setSearchQuery(title);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const cocktails = await fetchCocktails("Cocktail");
        setDrinks(
          cocktails.filter(
            (drink) => drink.category === "Cocktail" || drink.strCategory === "Cocktail"
          )
        );
      } catch (err) {
        setError("Could not load cocktails. Please make sure the backend server is running.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const visibleDrinks = searchQuery.trim()
    ? drinks.filter((drink) => {
        const title = (drink.name || drink.strDrink || "").toLowerCase();
        return title === searchQuery.toLowerCase();
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
        <p className="suggestions-label">Cocktail suggestions</p>
        <ul>
          {filteredSuggestions.map((drink) => {
            const title = drink.name || drink.strDrink;
            return (
              <li
                key={drink.id || drink.strDrink}
                onClick={() => handleSelectSuggestion(title)}
              >
                {title}
              </li>
            );
          })}
        </ul>
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading cocktails...</p>
      ) : error ? (
        <p style={{ textAlign: "center", color: "red" }}>{error}</p>
      ) : drinks.length === 0 ? (
        <p style={{ textAlign: "center", color: "gray" }}>No cocktails found.</p>
      ) : visibleDrinks.length === 0 ? (
        <p style={{ textAlign: "center", color: "gray" }}>No cocktails match your search.</p>
      ) : (
        <div className="category-list">
          <section className="category-section" key="Cocktail">
            <h2>Cocktail</h2>
            <div className="products-grid">
              {visibleDrinks.map((drink, index) => {
                const title = drink.name || drink.strDrink;
                const ingredients = drink.ingredients || [];
                return (
                  <div className="product-card" key={drink.id || drink.strDrink || index}>
                    <div className="product-card-inner">
                      { (drink.image || drink.strDrinkThumb) && (
                        <div className="product-image-wrapper">
                          <img
                            src={drink.image || drink.strDrinkThumb}
                            alt={title}
                            className="product-image"
                          />
                          <div className="product-image-overlay">
                            <h3>{title}</h3>
                          </div>
                        </div>
                      ) }
                      <div className="product-body">
                        <div className="product-header">
                          <span>{drink.strAlcoholic || drink.alcoholic || "Alcoholic"}</span>
                        </div>
                        <p>{drink.instructions || drink.instruction || "No instructions available."}</p>
                        <div className="ingredient-block">
                          <strong>Ingredients</strong>
                          <ul>
                            {ingredients.length > 0 ? (
                              ingredients.map((ingredient, idx) => (
                                <li key={`${drink.id || drink.strDrink}-${idx}`}>{ingredient}</li>
                              ))
                            ) : (
                              <li>No ingredients listed.</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
