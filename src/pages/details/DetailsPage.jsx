import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getContentById,
  getContentId,
  getRecommendationsByContent,
  getTypeLabel
} from '../../services/contentService';
import { getPosterSrc, handlePosterError } from '../../utils/poster';
import './DetailsPage.css';

const DetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      const detail = await getContentById(id);
      setContent(detail);

      if (detail) {
        const currentGenres = (detail.generos?.length ? detail.generos : [detail.genero || detail.genre])
          .map((genre) => String(genre).toLowerCase());
        const sameGenre = await getRecommendationsByContent(getContentId(detail), detail.generos?.[0] || detail.genero || detail.genre);
        setRecommendations(
          sameGenre.filter((item) => item.generos?.some((genre) => currentGenres.includes(String(genre).toLowerCase())))
        );
      } else {
        setRecommendations([]);
      }

      setLoading(false);
    };

    loadDetails();
  }, [id]);

  if (loading) {
    return (
      <main className="details-shell">
        <p className="details-loading">Cargando detalles...</p>
      </main>
    );
  }

  if (!content) {
    return (
      <main className="details-shell">
        <section className="details-empty">
          <h1>Contenido no encontrado</h1>
          <button type="button" onClick={() => navigate('/catalog')}>Volver al catalogo</button>
        </section>
      </main>
    );
  }

  const title = content.titulo || content.name;
  const genres = content.generos?.length ? content.generos : [content.genero || content.genre].filter(Boolean);
  const cast = Array.isArray(content.reparto || content.cast)
    ? (content.reparto || content.cast)
    : String(content.actores || '').split(',').map((item) => item.trim()).filter(Boolean);

  return (
    <main className="details-shell">
      <button type="button" className="details-back" onClick={() => navigate('/catalog')}>
        Volver
      </button>

      <section className="details-hero">
        <div className="details-poster-wrap">
          <img
            src={getPosterSrc(content)}
            alt={title}
            className="details-poster"
            onError={handlePosterError}
          />
        </div>

        <div className="details-main">
          <span className="details-type">{getTypeLabel(content.tipo)} · {genres.join(', ')}</span>
          <h1>{title}</h1>
          <p className="details-synopsis">{content.sinopsis || content.descripcion}</p>

          <dl className="details-meta">
            <div>
              <dt>Anio</dt>
              <dd>{content.anio || content.year || 'No registrado'}</dd>
            </div>
            <div>
              <dt>Director</dt>
              <dd>{content.director || 'No registrado'}</dd>
            </div>
            <div>
              <dt>Autor</dt>
              <dd>{content.autor || content.author || 'No registrado'}</dd>
            </div>
            <div>
              <dt>Temporadas</dt>
              <dd>{content.temporadas || content.seasons || 'No aplica'}</dd>
            </div>
            <div>
              <dt>Reparto</dt>
              <dd>{cast.length ? cast.join(', ') : 'No registrado'}</dd>
            </div>
          </dl>

          <div className="details-actions">
            <button type="button" className="details-primary" onClick={() => navigate(`/watch/${getContentId(content)}`)}>
              Ver ahora
            </button>
            <button type="button" onClick={() => navigate('/catalog')}>Catalogo</button>
          </div>
        </div>
      </section>

      <section className="details-trailer">
        <h2>Trailer</h2>
        <div className="details-video">
          <iframe
            src={content.trailer_url || content.trailer}
            title={`Trailer de ${title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      <section className="details-recommendations">
        <h2>Recomendaciones del mismo genero</h2>
        {recommendations.length === 0 ? (
          <p>No hay recomendaciones disponibles para este genero.</p>
        ) : (
          <div className="details-recommendation-grid">
            {recommendations.map((item) => (
              <button
                type="button"
                key={getContentId(item)}
                className="details-recommendation"
                onClick={() => navigate(`/details/${getContentId(item)}`)}
              >
                <img
                  src={getPosterSrc(item)}
                  alt={item.titulo || item.name}
                  onError={handlePosterError}
                />
                <span>{item.titulo || item.name}</span>
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default DetailsPage;
