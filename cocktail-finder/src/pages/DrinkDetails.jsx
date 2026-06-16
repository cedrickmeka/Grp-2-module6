import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCocktailById } from "../services/cocktailApi";

export default function DrinkDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cocktail, setCocktail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const drink = await getCocktailById(id);
        setCocktail(drink);
        const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
        setIsFav(favs.some((f) => f.idDrink === id));
      } catch (error) {
        console.error("Could not get recipe details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const toggleFavorite = () => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    let updated;
    if (isFav) {
      updated = favs.filter((f) => f.idDrink !== cocktail.idDrink);
    } else {
      updated = [...favs, { idDrink: cocktail.idDrink, strDrink: cocktail.strDrink, strDrinkThumb: cocktail.strDrinkThumb, strCategory: cocktail.strCategory, strAlcoholic: cocktail.strAlcoholic }];
    }
    localStorage.setItem("favorites", JSON.stringify(updated));
    setIsFav(!isFav);
  };

  const getIngredients = () => {
    const list = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = cocktail[`strIngredient${i}`];
      const measure = cocktail[`strMeasure${i}`];
      if (ingredient) list.push(`${measure ? measure.trim() : ""} ${ingredient}`.trim());
    }
    return list;
  };

  if (loading) return <p style={{ textAlign: "center", padding: "50px" }}>Reading recipe book...</p>;
  if (!cocktail) return <p style={{ textAlign: "center", padding: "50px" }}>Recipe not found!</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "30px auto", padding: "20px", fontFamily: "sans-serif", border: "1px solid #eee", borderRadius: "10px", background: "#fff" }}>
      <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>

      <img src={cocktail.strDrinkThumb} alt={cocktail.strDrink} style={{ width: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "8px" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
        <h1 style={{ margin: 0 }}>{cocktail.strDrink}</h1>
        <button className="btn-save" onClick={toggleFavorite} style={{ background: isFav ? "#ff6b6b" : "#eee", color: isFav ? "white" : "#333" }}>
          {isFav ? "❤️ Saved" : "🤍 Save"}
        </button>
      </div>

      <p style={{ background: "#fceded", color: "#ff6b6b", display: "inline-block", padding: "5px 10px", borderRadius: "5px", fontSize: "14px", fontWeight: "bold" }}>
        {cocktail.strAlcoholic}
      </p>

      <h3>Ingredients Needed:</h3>
      <ul>
        {getIngredients().map((item, index) => (
          <li key={index} style={{ marginBottom: "5px" }}>{item}</li>
        ))}
      </ul>

      <h3>How to Mix:</h3>
      <p style={{ lineHeight: "1.6", color: "#555" }}>{cocktail.strInstructions}</p>
    </div>
  );
}
