import { useState } from "react";
import { useNavigate } from "react-router-dom";

function DrinkCard({ drink, index, onRemove }) {
  const navigate = useNavigate();

  const id = drink.idDrink || drink.id;
  const title = drink.strDrink || drink.name;
  const image = drink.strDrinkThumb || drink.image;
  const category = drink.strCategory || drink.category || "Cocktail";
  const alcoholic = drink.strAlcoholic || drink.alcoholic || "Alcoholic";

  const favourites = JSON.parse(localStorage.getItem("favorites") || "[]");

  const [isFav, setIsFav] = useState(
    favourites.some((f) => (f.id || f.idDrink) === id)
  );

  const toggleFavorite = (e) => {
    e.stopPropagation();

    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");

    let updated;

    if (isFav) {
      updated = stored.filter((f) => (f.id || f.idDrink) !== id);
    } else {
      updated = [
        ...stored,
        {
          id,
          idDrink: id,
          strDrink: title,
          strDrinkThumb: image,
          strCategory: category,
          strAlcoholic: alcoholic,
        },
      ];
    }

    localStorage.setItem("favorites", JSON.stringify(updated));
    setIsFav(!isFav);

    if (isFav && onRemove) {
      onRemove(id);
    }
  };

  return (
    <div
      className="drink-card"
      onClick={() => navigate(`/drink/${id}`)}
      style={{ cursor: "pointer", position: "relative" }}
    >
      <button
        className={`fav-btn ${isFav ? "active" : ""}`}
        onClick={toggleFavorite}
      >
        {isFav ? "♥" : "♡"}
      </button>

      <img src={image} alt={title} />

      <div className="drink-info">
        <h3>{title}</h3>

        <p>
          <strong>Category:</strong> {category}
        </p>

        <p>{alcoholic}</p>
      </div>
    </div>
  );
}

export default DrinkCard;