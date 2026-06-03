import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DownloadsPage.css';

const IconPlay = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" style={{ width: '24px', height: '24px' }}><path d="M8 5v14l11-7z" /></svg>;

const DownloadsPage = () => {
  const [downloads, setDownloads] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem('locotos_downloads') || '[]');
    setDownloads(localData);
  }, []);

  const handleDeleteDownload = (idContenido) => {
    const updated = downloads.filter(item => item.id_contenido !== idContenido);
    setDownloads(updated);
    localStorage.setItem('locotos_downloads', JSON.stringify(updated));
    if (activeVideo === idContenido) setActiveVideo(null);
    alert("Descarga eliminada de la caché local.");
  };

  return (
    <div className="downloads-container">
      {/* Encabezado */}
      <header className="downloads-header">
        <button type="button" onClick={() => navigate('/catalog')} className="back-btn">
          ⬅️ Volver al Catálogo
        </button>
        <h1>Mis Descargas Offline</h1>
        <p>Contenido guardado localmente y listo para reproducir sin conexión.</p>
      </header>

      {/* Grid Principal dividido: Lista e Inyección de Reproductor */}
      <div className="downloads-layout">
        
        {/* REPRODUCTOR FLOTANTE INTEGRADO SI SE SELECCIONA UN VIDEO */}
        {activeVideo && (
          <div className="offline-player-wrapper">
            <h3>⚡ Modo Offline: Reproduciendo desde la memoria del navegador</h3>
            <video key={activeVideo} src={activeVideo} controls autoPlay className="native-video-player" />
          </div>
        )}

        {/* LISTADO DE PELÍCULAS DESCARGADAS */}
        <div className="downloads-list">
          {downloads.length === 0 ? (
            <div className="downloads-empty">
              <p>No tienes películas ni series descargadas.</p>
              <small>Ve al catálogo y haz clic en el ícono (📥) para guardar archivos en este dispositivo.</small>
            </div>
          ) : (
            downloads.map((item) => (
              <div key={item.id_contenido} className="download-card">
                <img src={item.poster} alt={item.titulo} className="download-poster" />
                <div className="download-info">
                  <h3>{item.titulo}</h3>
                  <span className="download-tag">Mauri Backend v5 Binario</span>
                  <p className="download-date">Guardado el: {new Date(item.fecha).toLocaleDateString()}</p>
                </div>
                <div className="download-actions">
                  <button 
                    type="button" 
                    onClick={() => setActiveVideo(item.localUrl)} 
                    className="play-offline-btn"
                  >
                    <IconPlay /> Ver Offline
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleDeleteDownload(item.id_contenido)} 
                    className="delete-offline-btn"
                    title="Eliminar del almacenamiento"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DownloadsPage;