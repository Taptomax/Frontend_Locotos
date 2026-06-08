import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getContentById,
  getContentId,
  getProgressContentId,
  registerPlayback
} from '../../services/contentService';
import { isDriveUrl } from '../../utils/driveVideo';
import axios from 'axios';
import './WatchPage.css';

const PROGRESS_API = 'http://localhost:3003/reproduction/progress';
const MEDIA_API = 'http://localhost:3010/media';

const formatTime = (seconds) => {
  const total = Math.max(0, Math.floor(seconds || 0));
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const WatchPage = () => {
  const { contentId } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [player, setPlayer] = useState(null);
  const [initialProgress, setInitialProgress] = useState(0);
  const [progressReady, setProgressReady] = useState(false);
  const [resumeDismissed, setResumeDismissed] = useState(false);
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const seekAppliedRef = useRef(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const id_usuario = user?.id_usuario ? Number(user.id_usuario) : null;

  const isYoutubeUrl = (url = "") =>
    url.includes("youtube.com") || url.includes("youtu.be");

  const extractVideoId = (url) => {
    if (!url) return null;
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;

    const patterns = [
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const getVideoSrc = useCallback(() => {
    if (!content) return '';
    if (isDriveUrl(content.trailer_url) || isDriveUrl(content.trailer)) {
      return `${MEDIA_API}/stream/${contentId}`;
    }
    return content.trailer_url || content.trailer;
  }, [content, contentId]);

  const saveProgress = useCallback((segundoActual, vistoCompletado = false) => {
    if (!id_usuario || !content) return;

    const payload = {
      id_usuario,
      id_contenido: getProgressContentId(content),
      segundo_actual: Math.floor(segundoActual),
      visto_completado: vistoCompletado
    };

    axios.post(PROGRESS_API, payload).catch(() => {
      fetch(PROGRESS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(() => {});
    });
  }, [id_usuario, content]);

  const applyResumePosition = useCallback(() => {
    const videoEl = videoRef.current;
    if (!videoEl || seekAppliedRef.current || initialProgress < 1) return;

    if (videoEl.readyState >= 1) {
      videoEl.currentTime = initialProgress;
      seekAppliedRef.current = true;
    }
  }, [initialProgress]);

  const handleResume = () => {
    applyResumePosition();
    setResumeDismissed(true);
    videoRef.current?.play().catch(() => {});
  };

  const handleStartOver = () => {
    seekAppliedRef.current = true;
    setInitialProgress(0);
    setResumeDismissed(true);
    if (videoRef.current) videoRef.current.currentTime = 0;
    saveProgress(0, false);
    videoRef.current?.play().catch(() => {});
  };

  useEffect(() => {
    seekAppliedRef.current = false;
    setResumeDismissed(false);

    const fetchData = async () => {
      setProgressReady(false);
      try {
        const found = await getContentById(contentId);
        setContent(found || null);

        if (found) {
          registerPlayback(getContentId(found));

          if (id_usuario) {
            const progressId = getProgressContentId(found);
            try {
              const res = await axios.get(
                `${PROGRESS_API}/user/${id_usuario}/content/${progressId}`
              );
              if (res.data?.has_progress && res.data.segundo_actual > 0) {
                setInitialProgress(res.data.segundo_actual);
              }
            } catch {
              console.log("Sin progreso previo registrado");
            }
          }
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setProgressReady(true);
        setLoading(false);
      }
    };

    fetchData();
  }, [contentId, id_usuario]);

  useEffect(() => {
    if (!content || !progressReady || !isYoutubeUrl(content.trailer_url)) return;

    const videoId = extractVideoId(content.trailer_url);
    if (!videoId) return;

    const createPlayer = () => {
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch (_) {}
        playerRef.current = null;
      }

      const newPlayer = new window.YT.Player("youtube-player", {
        height: "100%",
        width: "100%",
        videoId,
        playerVars: {
          autoplay: 1,
          start: Math.floor(initialProgress)
        },
        events: {
          onReady: (e) => e.target.playVideo(),
          onStateChange: handleStateChange
        }
      });

      playerRef.current = newPlayer;
      setPlayer(newPlayer);
    };

    if (!window.YT || !window.YT.Player) {
      const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }
      window.onYouTubeIframeAPIReady = createPlayer;
    } else {
      createPlayer();
    }

    return () => {
      if (playerRef.current) {
        try {
          const currentTime = playerRef.current.getCurrentTime?.() ?? 0;
          saveProgress(currentTime);
          playerRef.current.destroy();
        } catch (_) {}
        playerRef.current = null;
      }
    };
  }, [content, progressReady, initialProgress, saveProgress]);

  useEffect(() => {
    if (!player || !content) return;

    const interval = setInterval(() => {
      try {
        saveProgress(player.getCurrentTime());
      } catch (_) {
        console.warn("Player no listo");
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [player, content, saveProgress]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || !content || !progressReady || isYoutubeUrl(content.trailer_url)) return;

    const onLoadedMetadata = () => applyResumePosition();
    const onCanPlay = () => applyResumePosition();
    const onEnded = () => saveProgress(0, true);
    const onPause = () => {
      if (videoEl.currentTime > 0) saveProgress(videoEl.currentTime);
    };

    videoEl.addEventListener('loadedmetadata', onLoadedMetadata);
    videoEl.addEventListener('canplay', onCanPlay);
    videoEl.addEventListener('ended', onEnded);
    videoEl.addEventListener('pause', onPause);

    const interval = setInterval(() => {
      if (!videoEl.paused && videoEl.currentTime > 0) {
        saveProgress(videoEl.currentTime);
      }
    }, 10000);

    return () => {
      if (videoEl.currentTime > 0) saveProgress(videoEl.currentTime);
      clearInterval(interval);
      videoEl.removeEventListener('loadedmetadata', onLoadedMetadata);
      videoEl.removeEventListener('canplay', onCanPlay);
      videoEl.removeEventListener('ended', onEnded);
      videoEl.removeEventListener('pause', onPause);
    };
  }, [content, progressReady, applyResumePosition, saveProgress]);

  const handleStateChange = (event) => {
    if (event.data === window.YT.PlayerState.ENDED) {
      saveProgress(0, true);
    }
  };

  if (loading) {
    return <div className="watch-loading">Cargando...</div>;
  }

  if (!content) {
    return (
      <div>
        <h2>No encontrado</h2>
        <button onClick={() => navigate('/catalog')}>Volver</button>
      </div>
    );
  }

  const showResumeBanner = initialProgress > 5 && !resumeDismissed && !isYoutubeUrl(content.trailer_url);

  return (
    <div className="watch-container">
      <div className="watch-header">
        <button onClick={() => navigate('/catalog')}>← Volver</button>
      </div>

      <div className="watch-content">
        <div className="video-player">
          {isYoutubeUrl(content.trailer_url) ? (
            <div
              id="youtube-player"
              style={{ width: "100%", height: "500px", borderRadius: "12px" }}
            />
          ) : (
            <>
              {showResumeBanner && (
                <div className="watch-resume-banner">
                  <p>Continuar desde {formatTime(initialProgress)}</p>
                  <div className="watch-resume-actions">
                    <button type="button" onClick={handleResume}>Reanudar</button>
                    <button type="button" className="secondary" onClick={handleStartOver}>Desde el inicio</button>
                  </div>
                </div>
              )}
              <video
                ref={videoRef}
                src={progressReady ? getVideoSrc() : undefined}
                controls
                preload="auto"
                width="100%"
                height="500"
                style={{ width: "100%", borderRadius: "12px" }}
              />
            </>
          )}
        </div>

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
