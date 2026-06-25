import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import DrinkDetails from "./pages/DrinkDetails";
import CocktailForm from "./pages/CocktailForm";
import Favorites from "./pages/Favorites";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/drink/new" element={<CocktailForm />} />
        <Route path="/drink/:id/edit" element={<CocktailForm />} />
        <Route path="/drink/:id" element={<DrinkDetails />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>

      <footer
        style={{
          textAlign: "center",
          padding: "20px",
          marginTop: "30px",
          color: "#888",
          fontSize: "14px",
        }}
      >
        Cocktail Finder © 2026
      </footer>
    </div>
  );
}

export default App;
