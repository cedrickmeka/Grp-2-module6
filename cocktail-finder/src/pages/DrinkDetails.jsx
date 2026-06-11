import React, { useState, useEffect } from 'react';

export default function DrinkDetails() {
  const [cocktail, setCocktail] = useState(null);
  const [loading, setLoading] = useState(true);

  // Using a standard ID for now to make sure the page loads perfectly without crashing
  const id = "11007"; 

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`https://thecocktaildb.com{id}`);
        const data = await response.json();
        setCocktail(data.drinks ? data.drinks[0] : null); 
      } catch (error) {
        console.error("Could not get recipe details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) return <p style={{ textAlign: 'center', padding: '50px' }}>Reading recipe book...</p>;
  if (!cocktail) return <p style={{ textAlign: 'center', padding: '50px' }}>Recipe not found!</p>;

  const getIngredients = () => {
    let list = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = cocktail[`strIngredient${i}`];
      const measure = cocktail[`strMeasure${i}`];
      if (ingredient) {
        list.push(`${measure ? measure : ''} ${ingredient}`);
      }
    }
    return list;
  };

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto', padding: '20px', fontFamily: 'sans-serif', border: '1px solid #eee', borderRadius: '10px', background: '#fff' }}>
      <img src={cocktail.strDrinkThumb} alt={cocktail.strDrink} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }} />
      
      <h1 style={{ marginTop: '20px' }}>{cocktail.strDrink}</h1>
      <p style={{ background: '#fceded', color: '#ff6b6b', display: 'inline-block', padding: '5px 10px', borderRadius: '5px', fontSize: '14px', fontWeight: 'bold' }}>
        {cocktail.strAlcoholic}
      </p>

      <h3>Ingredients Needed:</h3>
      <ul>
        {getIngredients().map((item, index) => (
          <li key={index} style={{ marginBottom: '5px' }}>{item}</li>
        ))}
      </ul>

      <h3>How to Mix:</h3>
      <p style={{ lineHeight: '1.6', color: '#555' }}>{cocktail.strInstructions}</p>
    </div>
  );
}
