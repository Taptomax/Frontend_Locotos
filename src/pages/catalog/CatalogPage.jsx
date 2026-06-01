import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CatalogPage.css'; 

// ICONOS UNIFICADOS (Sin declaraciones duplicadas)
const IconSun  = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>;
const IconMoon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const IconBell = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>;
const IconShare = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186l5.566-3.13m-5.566 3.13l5.566 3.13m0 0a2.25 2.25 0 103.933 2.185 2.25 2.25 0 00-3.933-2.185zm-.002-10.423a2.25 2.25 0 113.933 2.185 2.25 2.25 0 01-3.933-2.185z" /></svg>;
const IconUser = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;
const IconHeartEmpty = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>;
const IconHeartFull  = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" style={{ color: '#E182CB' }}><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3c1.749 0 3.3 1.01 4.142 2.525C12.675 4.01 14.225 3 15.97 3 18.944 3 21.41 5.322 21.41 8.25c0 3.924-2.438 7.11-4.73 9.28a25.117 25.117 0 01-4.245 3.17 15.181 15.181 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>;
const IconStarList   = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.154 1.907 1.101 1.907 2.214v12.586c0 1.108-.806 2.057-1.907 2.21a48.554 48.554 0 01-11.186 0c-1.1-.154-1.907-1.101-1.907-2.214V5.536c0-1.108.806-2.057 1.907-2.21a48.554 48.554 0 0111.186 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 9.75h6M9 13.5h6" /></svg>;
const IconPlay       = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>;
const IconClock      = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2" /></svg>;

const getMovieId = (title) => {
  if (!title) return 0;
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash); 
};

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [favContentIds, setFavContentIds] = useState([]); 
  const [activeShareId, setActiveShareId] = useState(null);
  const [watchLaterIds, setWatchLaterIds] = useState([]);
  const [showFavDropdown, setShowFavDropdown] = useState(false);
  const [showWatchLaterDropdown, setShowWatchLaterDropdown] = useState(false);

  const navigate = useNavigate();
  const dm = darkMode;
  const storedUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const savedTheme = localStorage.getItem('catalog-theme');
    if (savedTheme) setDarkMode(savedTheme === 'dark');

    const fetchInitialData = async () => {
      try {
        const catalogRes = await axios.get('http://localhost:3006/api/catalog');
        setProducts(catalogRes.data);

        if (storedUser?.id_usuario) {
          const userIdNum = Number(storedUser.id_usuario);
          
          // Fetch favoritos
          const favsRes = await axios.get(`http://localhost:3010/favorites/user/${userIdNum}`);
          const favIds = (favsRes.data.favoritos || []).map(f => Number(f.id_contenido));
          setFavContentIds(favIds);
          
          // Fetch watch later
          const watchLaterRes = await axios.get(`http://localhost:3011/watch-later/${userIdNum}`);
          const watchIds = (watchLaterRes.data.items || []).map(item => Number(item.id_contenido));
          setWatchLaterIds(watchIds);
        }
      } catch (error) {
        console.error("Error cargando componentes del ecosistema:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData(); 
  }, []);


  const handleToggleFavorite = async (idContenido) => {
    if (!storedUser?.id_usuario) return alert("Inicia sesión para usar favoritos.");
    
    const userIdNum = Number(storedUser.id_usuario);
    const idNum = Number(idContenido);
    const yaEsFavorito = favContentIds.includes(idNum);

    try {
      if (yaEsFavorito) {
        await axios.delete(`http://localhost:3010/favorites/user/${userIdNum}/content/${idNum}`);
        setFavContentIds(prev => prev.filter(id => id !== idNum));
      } else {
        await axios.post('http://localhost:3010/favorites', {
          id_usuario: userIdNum,       
          id_contenido: idNum,         
          tipo_lista: "favorito"
        });
        setFavContentIds(prev => [...prev, idNum]);
      }
    } catch (error) {
      console.error("Error operando sobre la lista en MongoDB:", error);
    }
  };

  const handleToggleWatchLater = async (idContenido) => {
    if (!storedUser?.id_usuario) return alert("Inicia sesión para usar Ver Más Tarde.");
    
    const userIdNum = Number(storedUser.id_usuario);
    const idNum = Number(idContenido);
    const yaEstaEnWatchLater = watchLaterIds.includes(idNum);

    try {
      if (yaEstaEnWatchLater) {
        await axios.delete(`http://localhost:3011/watch-later/user/${userIdNum}/content/${idNum}`);
        setWatchLaterIds(prev => prev.filter(id => id !== idNum));
      } else {
        await axios.post('http://localhost:3011/watch-later', {
          id_usuario: userIdNum,
          id_contenido: idNum
        });
        setWatchLaterIds(prev => [...prev, idNum]);
      }
    } catch (error) {
      console.error("Error operando sobre Ver Más Tarde:", error);
    }
  };

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

  const handleCopyLink = (shareUrl) => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => alert("Enlace copiado al portapapeles con éxito "))
      .catch(() => alert("Error al copiar el enlace."));
    setActiveShareId(null); 
  };

  const dropdownItemStyle = {
    background: 'transparent', color: '#FAFBFD', border: 'none',
    padding: '12px 16px', width: '100%', textAlign: 'left',
    cursor: 'pointer', fontSize: '14px', fontWeight: 'bold',
    display: 'flex', alignItems: 'center', gap: '10px',
    borderBottom: '1px solid #3a5a6f', position: 'relative'
  };

  if (loading) return (
    <div className={`catalog-loading ${dm ? 'dark-mode' : ''}`}>
      <div className="loader-text">CARGANDO LOCOTOS...</div>
    </div>
  );

  return (
    <div className={`catalog-theme-wrapper ${dm ? 'dark-mode' : ''}`}>
      <button type="button" onClick={toggleTheme} className="theme-toggle-fixed">
        {dm ? <IconSun /> : <IconMoon />}
      </button>

      {/* HEADER DE NAVEGACIÓN */}
      <div style={{ position: 'fixed', top: '20px', right: '100px', zIndex: 1000 }}>
        <div style={{ position: 'relative' }}>
          
          <button 
            type="button" 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            <div style={{
              width: '40px', height: '40px', borderRadius: '4px',
              background: '#E182CB', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#fff',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
            }}>
              <IconUser />
            </div>
            <span style={{ color: '#FAFBFD', fontSize: '10px' }}>▼</span>
          </button>

          {showProfileMenu && (
            <div style={{
              position: 'absolute', top: '55px', right: '0', width: '220px',
              background: '#1f3a4a', border: '1px solid #3a5a6f', borderRadius: '8px',
              boxShadow: '0px 10px 30px rgba(0,0,0,0.5)', color: '#FAFBFD',
              fontFamily: 'sans-serif', zIndex: 1001, overflow: 'hidden'
            }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#8AD5DF', uppercase: 'true' }}>
                ⭐ Mi Lista de Favoritos
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto' }}>
                {favContentIds.length === 0 ? (
                  <p style={{ margin: '0', fontSize: '12px', opacity: 0.6, italic: 'true' }}>No tienes películas guardadas aún.</p>
                ) : (
                  favContentIds.map((idFavorito) => {
                    const movieData = products.find(p => getMovieId(p.titulo || p.name) === idFavorito);
                    if (!movieData) return null; 

                    return (
                      <div key={idFavorito} style={{ display: 'flex', gap: '10px', alignItems: 'center', background: '#27495F', padding: '8px', borderRadius: '8px' }}>
                        <img src={movieData.poster || movieData.imagen_url} alt="" style={{ width: '40px', height: '55px', borderRadius: '4px', objectFit: 'cover' }} />
                        <div style={{ flex: 1 }}>
                          <h5 style={{ margin: '0', fontSize: '12px', color: '#FAFBFD' }}>{movieData.titulo || movieData.name}</h5>
                          <span style={{ fontSize: '10px', color: '#E182CB' }}>{movieData.tipo || 'Película'}</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleToggleFavorite(idFavorito)} 
                          style={{ background: 'transparent', border: 'none', color: 'rose', cursor: 'pointer', fontSize: '14px' }}
                          title="Remover de favoritos"
                        >
                          ❌
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
              
              <button 
                type="button" 
                onClick={() => navigate('/settings')} 
                style={{ ...dropdownItemStyle, borderBottom: 'none' }}
              >
                ⚙️ Configuración
              </button>
            </div>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <button 
            type="button" 
            onClick={() => { setShowWatchLaterDropdown(!showWatchLaterDropdown); setShowNotifications(false); }} 
            style={{
              background: '#8AD5DF', color: '#1f3a4a', border: 'none',
              padding: '10px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            title="Ver mi Lista de Ver Más Tarde"
          >
            <IconClock />
            {watchLaterIds.length > 0 && (
              <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#8AD5DF', color: '#1f3a4a', fontSize: '10px', borderRadius: '50%', padding: '2px 6px', fontWeight: 'black' }}>
                {watchLaterIds.length}
              </span>
            )}
          </button>

          {showWatchLaterDropdown && (
            <div style={{
              position: 'absolute', top: '50px', right: '0', width: '320px',
              background: '#1f3a4a', border: '2px solid #3a5a6f', borderRadius: '16px',
              padding: '16px', boxShadow: '0px 10px 30px rgba(0,0,0,0.5)', color: '#FAFBFD',
              fontFamily: 'sans-serif', zIndex: 1001
            }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#8AD5DF', uppercase: 'true' }}>
                ⏱️ Ver Más Tarde
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto' }}>
                {watchLaterIds.length === 0 ? (
                  <p style={{ margin: '0', fontSize: '12px', opacity: 0.6, italic: 'true' }}>No tienes películas en tu lista de ver más tarde.</p>
                ) : (
                  watchLaterIds.map((idWatchLater) => {
                    const movieData = products.find(p => getMovieId(p.titulo || p.name) === idWatchLater);
                    if (!movieData) return null; 

                    return (
                      <div key={idWatchLater} style={{ display: 'flex', gap: '10px', alignItems: 'center', background: '#27495F', padding: '8px', borderRadius: '8px' }}>
                        <img src={movieData.poster || movieData.imagen_url} alt="" style={{ width: '40px', height: '55px', borderRadius: '4px', objectFit: 'cover' }} />
                        <div style={{ flex: 1 }}>
                          <h5 style={{ margin: '0', fontSize: '12px', color: '#FAFBFD' }}>{movieData.titulo || movieData.name}</h5>
                          <span style={{ fontSize: '10px', color: '#8AD5DF' }}>{movieData.tipo || 'Película'}</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleToggleWatchLater(idWatchLater)} 
                          style={{ background: 'transparent', border: 'none', color: 'rose', cursor: 'pointer', fontSize: '14px' }}
                          title="Remover de Ver Más Tarde"
                        >
                          ❌
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        <button 
          type="button" 
          onClick={() => navigate('/mylist')} 
          style={{
            background: '#8AD5DF', color: '#1f3a4a', border: 'none',
            padding: '10px 16px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer',
            height: '40px', display: 'flex', alignItems: 'center', gap: '6px'
          }}
        >
          🍿 Mi Lista
        </button>

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

          {showNotifications && (
            <div style={{
              position: 'absolute', top: '55px', right: '230px', width: '300px',
              background: '#1f3a4a', border: '2px solid #3a5a6f', borderRadius: '16px',
              padding: '16px', boxShadow: '0px 10px 30px rgba(0,0,0,0.5)', color: '#FAFBFD',
              fontFamily: 'sans-serif', zIndex: 1002
            }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#E182CB', textTransform: 'uppercase' }}>
                🔔 Avisos Recientes
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <p style={{ margin: '0', fontSize: '12px', opacity: 0.6 }}>No tienes novedades por el momento.</p>
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
      </div>

      <header className="catalog-header">
        <div className="brand">
          <h1 className="logo-text">LOCO<span>TOS</span></h1>
          <p className="subtitle">Catálogo de Contenido</p>
        </div>
      </header>

            <main className="catalog-grid">
        {products.map((c, index) => {
          const contentId = getMovieId(c.titulo || c.name);
          const isFav = favContentIds.includes(Number(contentId));
          const isWatchLater = watchLaterIds.includes(Number(contentId));
          const shareUrl = `${window.location.origin}/catalog?watch=${contentId}`;
          const shareText = `¡Te recomiendo ver "${c.titulo || c.name}" en LOCOTOS Streaming! Míralo aquí: ${shareUrl}`;

          return (
            <div key={`locotos-media-${contentId}-${index}`} className="content-card" style={{ position: 'relative' }}>
              
              {/* BOTÓN 1: FAVORITOS */}
              <button
                type="button"
                onClick={() => handleToggleFavorite(contentId)}
                style={{
                  position: 'absolute', top: '12px', left: '12px', zIndex: 10,
                  background: 'rgba(31, 58, 74, 0.75)', border: 'none', borderRadius: '50%',
                  width: '36px', height: '36px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                }}
                title={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
              >
                {isFav ? <IconHeartFull /> : <IconHeartEmpty />}
              </button>

              {/* BOTÓN 2: COMPARTIR CONTENIDO */}
              <button
                type="button"
                onClick={() => setActiveShareId(activeShareId === contentId ? null : contentId)}
                style={{
                  position: 'absolute', top: '42px', right: '12px', zIndex: 10,
                  background: 'rgba(31, 58, 74, 0.75)', border: 'none', borderRadius: '50%',
                  width: '36px', height: '36px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)', color: '#8AD5DF'
                }}
                title="Compartir este contenido"
              >
                <IconShare />
              </button>

              {/* DESPLEGABLE DE COMPARTIR */}
              {activeShareId === contentId && (
                <div style={{
                  position: 'absolute', top: '82px', right: '12px', width: '160px',
                  background: '#1f3a4a', border: '2px solid #3a5a6f', borderRadius: '12px',
                  padding: '8px', boxShadow: '0px 8px 24px rgba(0,0,0,0.5)', zIndex: 20,
                  display: 'flex', flexDirection: 'column', gap: '6px'
                }}>
                  <button 
                    type="button"
                    onClick={() => handleCopyLink(shareUrl)}
                    style={{ background: '#27495F', border: 'none', color: '#FAFBFD', padding: '6px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}
                  >
                    🔗 Copiar Enlace
                  </button>
                  <a 
                    href={`https://whatsapp.com{encodeURIComponent(shareText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setActiveShareId(null)}
                    style={{ background: '#25D366', color: '#fff', padding: '6px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center' }}
                  >
                    WhatsApp
                  </a>
                  <a 
                    href={`https://twitter.com{encodeURIComponent(shareText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setActiveShareId(null)}
                    style={{ background: '#1DA1F2', color: '#fff', padding: '6px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center' }}
                  >
                    Twitter / X
                  </a>
                </div>
              )}

              {/* BOTÓN 3: VER MÁS TARDE */}
              <button
                type="button"
                onClick={() => handleToggleWatchLater(contentId)}
                style={{
                  position: 'absolute', bottom: '12px', left: '12px', zIndex: 10,
                  background: isWatchLater ? 'rgba(138, 213, 223, 0.9)' : 'rgba(31, 58, 74, 0.75)', 
                  border: 'none', borderRadius: '50%',
                  width: '36px', height: '36px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                }}
                title={isWatchLater ? "Remover de Ver Más Tarde" : "Agregar a Ver Más Tarde"}
              >
                <IconClock style={{ color: isWatchLater ? '#1f3a4a' : '#8AD5DF' }} />
              </button>

              {/* CONTENEDOR DE LA IMAGEN DE PORTADA */}
              <div className="poster-container">
                <img 
                  src={c.imagen_url || c.poster || 'https://placeholder.com'} 
                  alt={c.titulo} 
                  className="poster-img"
                />
                <div className="card-overlay">
                  <span className="calificacion-badge">⭐ {c.calificacion || '8.0'}</span>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/watch/${contentId}`)}
                  style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    background: 'rgba(225, 130, 203, 0.9)', border: 'none', borderRadius: '50%',
                    width: '56px', height: '56px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s',
                    boxShadow: '0 8px 20px rgba(225, 130, 203, 0.4)', zIndex: 15,
                    opacity: 0, visibility: 'hidden'
                  }}
                  className="play-button"
                  title="Reproducir"
                >
                  <IconPlay style={{ color: '#fff' }} />
                </button>
              </div>

              {/* INFORMACIÓN DE LA TARJETA */}
              <div className="card-info">
                <span className="content-type">{c.tipo || 'Película'}</span>
                <h3 className="content-title">{c.titulo || c.name}</h3>
              </div>

            </div> // Cierra el div content-card
          );
        })}
      </main>

      <footer className="catalog-footer">
        <p>© 2026 StreamFlix Catalog — Tu central de entretenimiento distribuida</p>
      </footer>
    </div> // Cierra el div contenedor padre del componente entero
  );
};

export default CatalogPage;
