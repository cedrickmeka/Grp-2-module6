import { useState, useEffect } from "react";
import DrinkCard from "../components/DrinkCard";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(favs);
  }, []);

  const removeFavorite = (idDrink) => {
    const updated = favorites.filter((f) => f.idDrink !== idDrink);
    localStorage.setItem("favorites", JSON.stringify(updated));
    setFavorites(updated);
  };

  return (
    <div className="favorites-page">
      <h2>❤️ Favorite Cocktails</h2>

      {favorites.length === 0 ? (
        <p>You haven't saved any favorite cocktails yet.</p>
      ) : (
        <div className="drinks-grid">
          {favorites.map((drink, index) => (
            <DrinkCard key={drink.idDrink} drink={drink} index={index} onRemove={removeFavorite} />
          ))}
        </div>
      )}
    </div>
  );
}
