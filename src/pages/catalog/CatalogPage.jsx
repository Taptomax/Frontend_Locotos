import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CatalogPage.css'; 

const IconSun  = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>;
const IconMoon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;

const IconBell = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>;

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const navigate = useNavigate();
  const dm = darkMode;
  const storedUser = JSON.parse(localStorage.getItem('user'));

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

  // FUNCIÓN de la campanita
  const handleBellClick = async () => {
    setShowNotifications(!showNotifications);
    
    if (!showNotifications && storedUser?.id_usuario) {
      try {
        const res = await axios.get(`http://localhost:3003/notifications/user/${storedUser.id_usuario}?limit=5`);
        setNotifications(res.data.notificaciones || []);
      } catch (error) {
        console.error("Error recuperando alertas de Redis:", error);
      }
    }
  };

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

      {/* CONTENEDOR FLOTANTE DE BOTONES DE CONTROL DISTRIBUIDOS */}
      <div style={{ position: 'fixed', top: '20px', right: '80px', zIndex: 1000, display: 'flex', gap: '12px', alignItems: 'center' }}>
        
        {/* BOTÓN DE NOTIFICACIONES (CAMPANITA) */}
        <div style={{ position: 'relative' }}>
          <button 
            type="button" 
            onClick={handleBellClick} 
            style={{
              background: '#8AD5DF', color: '#1f3a4a', border: 'none',
              padding: '10px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <IconBell />
          </button>

          {/* DESPLEGABLE DE ALERTAS (VISTA DE LA PILA REDIS) */}
          {showNotifications && (
            <div style={{
              position: 'absolute', top: '50px', right: '0', width: '300px',
              background: '#1f3a4a', border: '2px border #3a5a6f', borderRadius: '16px',
              padding: '16px', boxShadow: '0px 10px 30px rgba(0,0,0,0.5)', color: '#FAFBFD',
              fontFamily: 'sans-serif', zIndex: 1001
            }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#E182CB', uppercase: 'true', trackingSpacing: '1px' }}>
                🔔 Avisos Recientes
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <p style={{ margin: '0', fontSize: '12px', opacity: 0.6, textStyle: 'italic' }}> No tienes novedades por el momento.</p>
                ) : (
                  notifications.map((notif, idx) => (
                    <div key={idx} style={{ padding: '8px 12px', background: '#27495F', borderRadius: '8px', fontSize: '12px', lineHeight: '1.4' }}>
                      {notif}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* BOTÓN INDEPENDIENTE DE SUSCRIPCIONES */}
        <button 
          type="button" 
          onClick={() => navigate('/subscription/manage')} 
          style={{
            background: '#E182CB', color: '#fff', border: 'none',
            padding: '10px 16px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer',
            height: '40px'
          }}
        >
          💳 Mis Suscripciones
        </button>
      </div>

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