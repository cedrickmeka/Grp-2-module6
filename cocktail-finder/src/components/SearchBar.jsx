function SearchBar({
  searchTerm,
  setSearchTerm,
  searchDrinks,
}) {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search for a cocktail..."
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(e.target.value)
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            searchDrinks();
          }
        }}
      />

      <button onClick={searchDrinks}>
        Search
      </button>
    </div>
  );
}

export default SearchBar;