import { useState, useEffect } from "react";
import DrinkCard from "../components/DrinkCard";
import { getFavorites, removeFavoriteById } from "../utils/favorites";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const removeFavorite = (id) => {
    const updated = removeFavoriteById(id);
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
