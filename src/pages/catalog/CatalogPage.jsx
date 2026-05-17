import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importado para la navegación distribuida
import './CatalogPage.css'; 

const IconSun  = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>;
const IconMoon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate(); // Instanciado

  const dm = darkMode;

  useEffect(() => {
    const savedTheme = localStorage.getItem('catalog-theme');
    if (savedTheme) setDarkMode(savedTheme === 'dark');

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
    const newMode = !dm;
    setDarkMode(newMode);
    localStorage.setItem('catalog-theme', newMode ? 'dark' : 'light');
  };

  if (loading) return (
    <div className={`catalog-loading ${dm ? 'dark-mode' : ''}`}>
      <div className="loader-text">CARGANDO LOCO<span>TOS</span>...</div>
    </div>
  );

  return (
    <div className={`catalog-theme-wrapper ${dm ? 'dark-mode' : ''}`}>
      {/* Botón de cambio de Tema */}
      <button 
        type="button" 
        onClick={toggleTheme} 
        className="theme-toggle-fixed"
      >
        {dm ? <IconSun /> : <IconMoon />}
      </button>

      {/* BOTÓN INDEPENDIENTE DE SUSCRIPCIONES (Prueba de sistema distribuido) */}
      <button 
        type="button" 
        onClick={() => navigate('/subscription/manage')} 
        style={{
          position: 'fixed', top: '20px', right: '80px', zIndex: 1000,
          background: '#E182CB', color: '#fff', border: 'none',
          padding: '8px 16px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer'
        }}
      >
        💳 Mis Suscripciones
      </button>

      <header className="catalog-header">
        <div className="brand">
          <h1 className="logo-text">LOCO<span>TOS</span></h1>
          <p className="subtitle">Catálogo de Contenido</p>
        </div>
      </header>

      <main className="catalog-grid">
        {products.map((c, index) => (
          <div key={c._id || index} className="content-card">
            <div className="poster-container">
              <img 
                src={c.poster || c.imagen_url || 'https://via.placeholder.com/300x450'} 
                alt={c.titulo} 
                className="poster-img"
              />
              <div className="card-overlay">
                <span className="calificacion-badge">⭐ {c.calificacion || '8.0'}</span>
              </div>
            </div>
            <div className="card-info">
              <span className="content-type">{c.tipo || 'Película'}</span>
              <h3 className="content-title">{c.titulo || c.name}</h3>
            </div>
          </div>
        ))}
      </main>

      <footer className="catalog-footer">
        <p>© 2026 StreamFlix Catalog — Tu central de entretenimiento distribuida</p>
      </footer>
    </div>
  );
};

export default CatalogPage;