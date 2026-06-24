import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createCocktail, getCocktailById, updateCocktail } from "../services/cocktailApi";

export default function CocktailForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [alcoholic, setAlcoholic] = useState("Alcoholic");
  const [glass, setGlass] = useState("");
  const [image, setImage] = useState("");
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadCocktail = async () => {
      setLoading(true);
      try {
        const cocktail = await getCocktailById(id);
        setName(cocktail.name || "");
        setCategory(cocktail.category || "");
        setAlcoholic(cocktail.alcoholic || "Alcoholic");
        setGlass(cocktail.glass || "");
        setImage(cocktail.image || "");
        setInstructions(cocktail.instructions || "");
        setIngredients((cocktail.ingredients || []).join(", "));
      } catch (err) {
        setError("Unable to load cocktail details.");
      } finally {
        setLoading(false);
      }
    };

    loadCocktail();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!name.trim() || !instructions.trim()) {
      setError("Name and instructions are required.");
      return;
    }

    const payload = {
      name: name.trim(),
      category: category.trim(),
      alcoholic,
      glass: glass.trim(),
      image: image.trim(),
      instructions: instructions.trim(),
      ingredients: ingredients
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      setLoading(true);
      if (id) {
        await updateCocktail(id, payload);
      } else {
        await createCocktail(payload);
      }
      navigate(id ? `/drink/${id}` : "/");
    } catch (err) {
      setError("Unable to save cocktail. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "30px auto", padding: "20px", borderRadius: "12px", background: "#fff", boxShadow: "0 15px 30px rgba(0,0,0,0.08)" }}>
      <button className="btn-back" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h1 style={{ margin: "20px 0" }}>{id ? "Edit Cocktail" : "Add New Cocktail"}</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
        <input
          type="text"
          value={name}
          placeholder="Cocktail name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          value={category}
          placeholder="Category (e.g. Cocktail, Ordinary Drink)"
          onChange={(e) => setCategory(e.target.value)}
        />
        <select value={alcoholic} onChange={(e) => setAlcoholic(e.target.value)}>
          <option value="Alcoholic">Alcoholic</option>
          <option value="Non alcoholic">Non alcoholic</option>
          <option value="Optional alcohol">Optional alcohol</option>
        </select>
        <input
          type="text"
          value={glass}
          placeholder="Glass type"
          onChange={(e) => setGlass(e.target.value)}
        />
        <input
          type="text"
          value={image}
          placeholder="Image URL"
          onChange={(e) => setImage(e.target.value)}
        />
        <textarea
          value={instructions}
          placeholder="Mixing instructions"
          rows={5}
          onChange={(e) => setInstructions(e.target.value)}
        />
        <input
          type="text"
          value={ingredients}
          placeholder="Ingredients separated by commas"
          onChange={(e) => setIngredients(e.target.value)}
        />
        <button type="submit" className="btn-save" disabled={loading}>
          {loading ? "Saving..." : id ? "Update Cocktail" : "Create Cocktail"}
        </button>
      </form>
    </div>
  );
}
