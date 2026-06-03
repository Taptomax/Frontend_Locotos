import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './WatchPage.css';

const WatchPage = () => {
  const { contentId } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [player, setPlayer] = useState(null);
  const [progress, setProgress] = useState(0);

  // USUARIO CORRECTO
  const user = JSON.parse(localStorage.getItem("user"));
  const id_usuario = user?.id_usuario;

  // =========================
  // CARGAR CONTENIDO + PROGRESO
  // =========================
  useEffect(() => {

    const fetchData = async () => {
      try {
        const catalogRes = await axios.get('http://localhost:3006/api/catalog');

        const found = catalogRes.data.find(c => {
          let hash = 0;
          const title = c.titulo || c.name || '';
          for (let i = 0; i < title.length; i++) {
            hash = title.charCodeAt(i) + ((hash << 5) - hash);
          }
          return Math.abs(hash) === parseInt(contentId);
        });

        if (!found) {
          setContent(null);
          setLoading(false);
          return;
        }

        setContent(found);

        const id_contenido = parseInt(contentId);

        // CONSULTAR PROGRESO (PUERTO 3003)
        try {
          const res = await axios.get(
            `http://localhost:3003/reproduction/progress/user/${id_usuario}/content/${id_contenido}`
          );

          if (res.data?.has_progress) {
            setProgress(res.data.segundo_actual);
          }

        } catch (err) {
          console.log("Sin progreso previo");
        }

      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [contentId]);

  // =========================
  // EXTRAER ID YOUTUBE
  // =========================
  const extractVideoId = (url) => {
    if (!url) return "dQw4w9WgXcQ";
    if (url.length === 11) return url;

    const regExp = /^.*(youtu.be\/|v\/|watch\?v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11 ? match[2] : "dQw4w9WgXcQ";
  };

  // =========================
  // CARGAR YOUTUBE (SIN BUCLE)
  // =========================
  useEffect(() => {
    if (!content) return;

    const createPlayer = () => {
      const videoId = extractVideoId(content.trailer_url);

      const newPlayer = new window.YT.Player("youtube-player", {
        height: "100%",
        width: "100%",
        videoId,
        playerVars: {
          autoplay: 1,
          start: Math.floor(progress)
        },
        events: {
          onReady: (e) => e.target.playVideo(),
          onStateChange: handleStateChange
        }
      });

      setPlayer(newPlayer);
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = createPlayer;
    } else {
      createPlayer();
    }

  }, [content]); 
  // =========================
  // ⏱GUARDAR CADA 10s (PUERTO 3003)
  // =========================
  useEffect(() => {
    if (!player || !content) return;

    const id_contenido = parseInt(contentId);

    const interval = setInterval(() => {
      try {
        const currentTime = Math.floor(player.getCurrentTime());

        axios.post('http://localhost:3003/reproduction/progress', {
          id_usuario,
          id_contenido,
          segundo_actual: currentTime,
          visto_completado: false
        });

      } catch (err) {
        console.warn("Player no listo");
      }
    }, 10000);

    return () => clearInterval(interval);

  }, [player]);

  // =========================
  // FIN DEL VIDEO 
  // =========================
  const handleStateChange = (event) => {
    const id_contenido = parseInt(contentId);

    if (event.data === window.YT.PlayerState.ENDED) {
      axios.post('http://localhost:3003/reproduction/progress', {
        id_usuario,
        id_contenido,
        segundo_actual: 0,
        visto_completado: true
      });
    }
  };

  // =========================
  // RENDER
  // =========================
  if (loading) {
    return <div className="watch-loading">Cargando...</div>;
  }

  if (!content) {
    return (
      <div>
        <h2>No encontrado</h2>
        <button onClick={() => navigate('/catalog')}>
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="watch-container">

      <div className="watch-header">
        <button onClick={() => navigate('/catalog')}>
          ← Volver
        </button>
      </div>

      <div className="watch-content">

        {/* PLAYER */}
        <div className="video-player">
          <div
            id="youtube-player"
            style={{ width: "100%", height: "500px", borderRadius: "12px" }}
          ></div>
        </div>

        {/* INFO */}
        <div className="video-info">
          <h1>{content.titulo || content.name}</h1>

          {(content.descripcion || content.sinopsis) && (
            <p>{content.descripcion || content.sinopsis}</p>
          )}

          {content.calificacion && <p>⭐ {content.calificacion}</p>}
          {content.duracion && <p>⏱️ {content.duracion}</p>}
          {content.anio && <p>📅 {content.anio}</p>}
          {content.director && <p>🎬 {content.director}</p>}
          {content.actores && <p>👥 {content.actores}</p>}
        </div>

      </div>
    </div>
  );
};

export default WatchPage;