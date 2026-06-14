function DrinkCard({ drink, index }) {
  return (
    <div className="drink-card">
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
          <strong>Category:</strong>{" "}
          {drink.strCategory}
        </p>

        <span className="category">
          {drink.strAlcoholic}
        </span>
      </div>
    </div>
  );
}

export default DrinkCard;