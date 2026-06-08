import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DownloadsPage.css';

const IconPlay = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" style={{ width: '24px', height: '24px' }}><path d="M8 5v14l11-7z" /></svg>;

const DownloadsPage = () => {
  const [downloads, setDownloads] = useState([]);
  const [videoSrcReal, setVideoSrcReal] = useState(null);
  const [activeMovie, setActiveMovie] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem('locotos_downloads') || '[]');
    setDownloads(localData);
  }, []);


  const handlePlayOffline = async (item) => {
    try {
      const cacheContenidos = await caches.open('locotos_media_cache');
      const respuestaCacheada = await cacheContenidos.match(item.localUrl);

      if (!respuestaCacheada) {
        return alert("El archivo de video no se encuentra en el almacenamiento local.");
      }

      const blobVideo = await respuestaCacheada.blob();
      const localBlobUrl = URL.createObjectURL(blobVideo);

      setVideoSrcReal(localBlobUrl);
      setActiveMovie(item);
    } catch (err) {
      console.error(err);
      alert("Error al cargar el reproductor offline.");
    }
  };

  const handleDeleteDownload = async (idContenido, localUrl) => {

    const cacheContenidos = await caches.open('locotos_media_cache');
    await cacheContenidos.delete(localUrl);


    const updated = downloads.filter(item => item.id_contenido !== idContenido);
    setDownloads(updated);
    localStorage.setItem('locotos_downloads', JSON.stringify(updated));

    if (activeMovie && activeMovie.id_contenido === idContenido) {
      setActiveMovie(null);
      setVideoSrcReal(null);
    }
    alert("Descarga eliminada de la caché local.");
  };

  return (
    <div className="downloads-container">
      <header className="downloads-header">
        <button type="button" onClick={() => navigate('/catalog')} className="back-btn">
          ⬅️ Volver al Catálogo
        </button>
        <h1>Mis Descargas Offline</h1>
        <p>Contenido guardado localmente y listo para reproducir sin conexión.</p>
      </header>

      <div className="downloads-layout">

        {/* REPRODUCTOR FLUIDO DE ALTO TRÁFICO */}
        {activeMovie && videoSrcReal && (
          <div className="offline-player-wrapper" style={{ margin: '20px 0', padding: '15px', backgroundColor: '#141414', borderRadius: '8px' }}>
            <h3 style={{ color: '#fff' }}>⚡ Modo Offline: {activeMovie.titulo}</h3>
            <video
              key={activeMovie.id_contenido}
              src={videoSrcReal}
              controls
              autoPlay
              className="native-video-player"
              style={{ width: '100%', maxHeight: '400px', borderRadius: '4px', marginTop: '10px' }}
            />
          </div>
        )}

        {/* LISTADO DE PELÍCULAS MULTIPLES */}
        <div className="downloads-list">
          {downloads.length === 0 ? (
            <div className="downloads-empty">
              <p>No tienes películas ni series descargadas.</p>
            </div>
          ) : (
            downloads.map((item) => (
              <div key={item.id_contenido} className="download-card" style={{ display: 'flex', alignItems: 'center', margin: '10px 0', padding: '10px', backgroundColor: '#222', borderRadius: '6px' }}>
                <img src={item.poster} alt={item.titulo} className="download-poster" style={{ width: '80px', height: '110px', borderRadius: '4px', objectFit: 'cover' }} />
                <div className="download-info" style={{ flex: 1, paddingLeft: '15px', color: '#fff' }}>
                  <h3>{item.titulo}</h3>
                  <p style={{ fontSize: '12px', color: '#aaa' }}>Guardado: {new Date(item.fecha).toLocaleDateString()}</p>
                </div>
                <div className="download-actions">
                  <button
                    type="button"
                    onClick={() => handlePlayOffline(item)}
                    className="play-offline-btn"
                  >
                    <IconPlay /> Ver Offline
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteDownload(item.id_contenido, item.localUrl)}
                    className="delete-offline-btn"
                    style={{ marginLeft: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}
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