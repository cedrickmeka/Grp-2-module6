import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h2>🍹 Cocktail Finder</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/drink/new">Add Cocktail</Link>
        <Link to="/favorites">Favorites</Link>
      </div>
    </nav>
  );
}

export default Navbar;