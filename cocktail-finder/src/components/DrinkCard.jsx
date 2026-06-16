import { useState } from "react";
import { useNavigate } from "react-router-dom";

function DrinkCard({ drink, index, onRemove }) {
  const navigate = useNavigate();
  const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
  const [isFav, setIsFav] = useState(favs.some((f) => f.idDrink === drink.idDrink));

  const toggleFavorite = (e) => {
    e.stopPropagation();
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
    let updated;
    if (isFav) {
      updated = stored.filter((f) => f.idDrink !== drink.idDrink);
    } else {
      updated = [...stored, { idDrink: drink.idDrink, strDrink: drink.strDrink, strDrinkThumb: drink.strDrinkThumb, strCategory: drink.strCategory, strAlcoholic: drink.strAlcoholic }];
    }
    localStorage.setItem("favorites", JSON.stringify(updated));
    setIsFav(!isFav);
    if (isFav && onRemove) onRemove(drink.idDrink);
  };

  return (
    <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
      <div className="drink-card" onClick={() => navigate(`/drink/${drink.idDrink}`)} style={{ cursor: "pointer" }}>
        <div className="drink-number">{index + 1}</div>
        <img src={drink.strDrinkThumb} alt={drink.strDrink} />
        <div className="drink-info">
          <h3>{drink.strDrink}</h3>
          <p><strong>Category:</strong> {drink.strCategory}</p>
          <span className="category">{drink.strAlcoholic}</span>
        </div>
      </div>
      <button
        className={`fav-btn${isFav ? " active" : ""}`}
        onClick={toggleFavorite}
      >
        {isFav ? "♥" : "♡"}
      </button>
    </div>
  );
}

export default DrinkCard;
