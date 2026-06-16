const BASE_URL = "https://www.thecocktaildb.com/api/json/v1/1";

export const getTrendingCocktails = async () => {
  const terms = ["margarita", "mojito", "martini"];
  const results = await Promise.all(terms.map((t) => searchCocktails(t)));
  return results.flat().slice(0, 12);
};

export const searchCocktails = async (term) => {
  const res = await fetch(`${BASE_URL}/search.php?s=${term}`);
  const data = await res.json();
  return data.drinks || [];
};

export const getCocktailById = async (id) => {
  const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
  const data = await res.json();
  return data.drinks ? data.drinks[0] : null;
};
