import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getContentById, getContentId, registerPlayback } from '../../services/contentService';
import './WatchPage.css';

const IconArrowLeft = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>;
const IconHome = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l4-4" /></svg>;

const WatchPage = () => {
  const { contentId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('catalog-theme');
    if (savedTheme) setDarkMode(savedTheme === 'dark');

    const fetchContent = async () => {
      try {
        const found = await getContentById(contentId);
        setContent(found || null);
        if (found) registerPlayback(getContentId(found));
      } catch (error) {
        console.error("Error cargando contenido:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [contentId]);

  // 🛠️ Función para convertir URLs estándar de YT en URLs embebibles válidas
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "https://www.youtube.com/embed/dQw4w9WgXcQ"; // fallback (Rickroll) si está vacío
    
    // Si ya guardaste solo el ID de 11 caracteres (ej: "dQw4w9WgXcQ")
    if (url.length === 11) return `https://www.youtube.com/embed/${url}`;

    // Si guardaste la URL completa, extraemos el ID usando expresiones regulares
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    
    return (match && (match[2].length === 12 || match[2].length === 11))
      ? `https://www.youtube.com/embed/${match[2]}`
      : url;
  };

  if (loading) {
    return (
      <div className={`watch-loading ${darkMode ? 'dark-mode' : ''}`}>
        <div className="loader-text">CARGANDO REPRODUCTOR...</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className={`watch-container ${darkMode ? 'dark-mode' : ''}`}>
        <div className="watch-error">
          <h2>Contenido no encontrado</h2>
          <button onClick={() => navigate('/catalog')} className="btn-back">
            <IconArrowLeft /> Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`watch-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="watch-header">
        <button type="button" onClick={() => navigate('/catalog')} className="btn-back" title="Volver al catálogo">
          <IconArrowLeft />
        </button>
        <button type="button" onClick={() => navigate('/catalog')} className="btn-home" title="Ir a catálogo">
          <IconHome />
        </button>
      </div>

      <div className="watch-content">
        <div className="video-player">
          <div className="video-placeholder">
            {/* 🚀 URL AHORA ES DINÁMICA BASADA EN TU BACKEND */}
            <iframe
              width="100%"
              height="100%"
              src={getYouTubeEmbedUrl(content.trailer_url)}
              title={content.titulo || content.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ borderRadius: '12px' }}
            ></iframe>
          </div>
        </div>

        {/* Content Info */}
        <div className="video-info">
          <div className="info-header">
            <h1 className="content-title">{content.titulo || content.name}</h1>
            <span className="content-badge">{content.tipo || 'Película'}</span>
          </div>

          <div className="info-details">
            {(content.descripcion || content.sinopsis) && (
              <p className="description">{content.descripcion || content.sinopsis}</p>
            )}
            {content.calificacion && (
              <div className="rating">
                <span className="star">⭐</span>
                <span className="rating-value">{content.calificacion}</span>
              </div>
            )}
            {content.duracion && (
              <p className="duration">
                ⏱️ Duración: {content.duracion}
              </p>
            )}
            {content.anio && (
              <p className="year">
                📅 Año: {content.anio}
              </p>
            )}
            {content.director && (
              <p className="director">
                🎬 Director: {content.director}
              </p>
            )}
            {content.actores && (
              <p className="actors">
                👥 Actores: {content.actores}
              </p>
            )}
          </div>

          <div className="action-buttons">
            <button 
              type="button"
              onClick={() => navigate('/catalog')}
              className="btn-back-full"
            >
              ← Volver al catálogo
            </button>
            <button 
              type="button"
              onClick={() => navigate('/mylist')}
              className="btn-mylist"
            >
              🍿 Mi Lista
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
