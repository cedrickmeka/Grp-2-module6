import React, { useState, useEffect } from 'react';

export default function Home() {
  const [drinks, setDrinks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('margarita'); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDrinks = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://thecocktaildb.com{searchTerm}`);
        const data = await response.json();
        setDrinks(data.drinks || []);
      } catch (error) {
        console.error("Could not get drinks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDrinks();
  }, [searchTerm]);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#ff6b6b' }}>🍹 The Cocktail Lounge</h1>
      
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Type a drink name... (e.g., mojito)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '10px', width: '60%', maxWidth: '400px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </div>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Mixing your drinks... please wait...</p>
      ) : drinks.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'gray' }}>No drinks found! Try searching for something else.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {drinks.map((drink) => (
            <div 
              key={drink.idDrink} 
              style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '10px', textAlign: 'center', cursor: 'pointer', background: '#fff' }}
            >
              <img src={drink.strDrinkThumb} alt={drink.strDrink} style={{ width: '100%', borderRadius: '5px' }} />
              <h3 style={{ margin: '10px 0 5px 0' }}>{drink.strDrink}</h3>
              <span style={{ fontSize: '12px', color: 'gray' }}>{drink.strCategory}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
