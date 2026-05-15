import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CatalogPage.css'; 

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Cargar preferencia de tema
    const savedTheme = localStorage.getItem('catalog-theme');
    if (savedTheme === 'dark') setDarkMode(true);

    const fetchCatalog = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/catalog');
        setProducts(response.data);
      } catch (error) {
        console.error("Error cargando el catálogo:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('catalog-theme', newMode ? 'dark' : 'light');
  };

  if (loading) return <div className="p-10">Cargando Catálogo de Locotos...</div>;

  return (
    /* La Clase Maestra que evita que el CSS se escape a otras páginas */
    <div className={`catalog-theme-wrapper ${darkMode ? 'dark-mode' : ''}`}>
      <header>
        <h1>🎬 Catálogo de Contenido</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {darkMode ? '☀️ Claro' : '🌙 Oscuro'}
        </button>
      </header>

      <div className="grid">
        {products.map((c, index) => (
          <div key={c._id || index} className="card">
            <img 
              src={c.poster || c.imagen_url || 'https://via.placeholder.com/200x300'} 
              alt={c.titulo} 
              style={{ width: '100%', borderRadius: '10px' }} 
            />
            <h3>{c.titulo || c.name}</h3>
            <div className="tipo">{c.tipo || 'Pelicula'}</div>
            <div className="calificacion">⭐ {c.calificacion || '8.0'}</div>
          </div>
        ))}
      </div>

      <footer style={{ marginTop: '3rem', textAlign: 'center', opacity: 0.6 }}>
        <p>StreamFlix Catalog — Todos tus contenidos en un solo lugar</p>
      </footer>
    </div>
  );
};

export default CatalogPage;