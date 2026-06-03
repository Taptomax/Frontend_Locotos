import React, { useEffect, useMemo, useState } from 'react';
import {
  buildContentAnalytics,
  getAdminCatalog,
  getTypeLabel
} from '../../services/contentService';
import './AdminDashboardPage.css';

const currentYear = new Date().getFullYear();

const emptyFilters = {
  search: '',
  tipo: 'todos',
  genero: 'todos',
  clasificacion: 'todos',
  minYear: '',
  maxYear: '',
  minRating: '0',
  assetState: 'todos'
};

const numberFormat = new Intl.NumberFormat('es-BO');

const percent = (value, total) => (total > 0 ? Math.round((value / total) * 100) : 0);

const getMaxValue = (rows) => Math.max(1, ...rows.map((row) => Number(row.value || 0)));

const BarList = ({ rows, maxRows = 8 }) => {
  const visibleRows = rows.slice(0, maxRows);
  const maxValue = getMaxValue(visibleRows);

  return (
    <div className="dashboard-bars">
      {visibleRows.map((row) => (
        <div className="dashboard-bar-row" key={row.label}>
          <span>{row.label}</span>
          <div className="dashboard-bar-track">
            <div className="dashboard-bar-fill" style={{ width: `${Math.max(4, (row.value / maxValue) * 100)}%` }} />
          </div>
          <strong>{numberFormat.format(row.value)}</strong>
        </div>
      ))}
    </div>
  );
};

const DonutChart = ({ peliculas, series }) => {
  const total = peliculas + series;
  const moviePercent = percent(peliculas, total);

  return (
    <div className="dashboard-donut-wrap">
      <div
        className="dashboard-donut"
        style={{ background: `conic-gradient(#2f8f83 0 ${moviePercent}%, #d07a43 ${moviePercent}% 100%)` }}
        aria-label={`Peliculas ${moviePercent} por ciento, series ${100 - moviePercent} por ciento`}
      />
      <div className="dashboard-legend">
        <span><i className="legend-dot legend-dot--movie" />Peliculas {peliculas}</span>
        <span><i className="legend-dot legend-dot--series" />Series {series}</span>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, detail }) => (
  <article className="dashboard-stat">
    <span>{label}</span>
    <strong>{value}</strong>
    <small>{detail}</small>
  </article>
);

const AdminDashboardPage = () => {
  const [contents, setContents] = useState([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const filterOptions = useMemo(() => {
    const genres = new Set();
    const classifications = new Set();
    contents.forEach((content) => {
      content.generos.forEach((genre) => genres.add(genre));
      if (content.clasificacion) classifications.add(content.clasificacion);
    });
    return {
      genres: [...genres].sort((a, b) => a.localeCompare(b)),
      classifications: [...classifications].sort((a, b) => a.localeCompare(b))
    };
  }, [contents]);

  const filteredContents = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    const minYear = filters.minYear ? Number(filters.minYear) : null;
    const maxYear = filters.maxYear ? Number(filters.maxYear) : null;
    const minRating = Number(filters.minRating || 0);

    return contents.filter((content) => {
      const haystack = `${content.titulo} ${content.descripcion} ${content.generos.join(' ')}`.toLowerCase();
      const matchesSearch = !search || haystack.includes(search);
      const matchesType = filters.tipo === 'todos' || content.tipo === filters.tipo;
      const matchesGenre = filters.genero === 'todos' || content.generos.includes(filters.genero);
      const matchesClassification = filters.clasificacion === 'todos' || content.clasificacion === filters.clasificacion;
      const matchesMinYear = minYear === null || Number(content.anio || 0) >= minYear;
      const matchesMaxYear = maxYear === null || Number(content.anio || 0) <= maxYear;
      const matchesRating = Number(content.calificacion || 0) >= minRating;
      const hasImage = Boolean(content.imagen_url);
      const hasTrailer = Boolean(content.trailer_url);
      const matchesAssets =
        filters.assetState === 'todos'
        || (filters.assetState === 'completos' && hasImage && hasTrailer)
        || (filters.assetState === 'sinImagen' && !hasImage)
        || (filters.assetState === 'sinTrailer' && !hasTrailer);

      return matchesSearch
        && matchesType
        && matchesGenre
        && matchesClassification
        && matchesMinYear
        && matchesMaxYear
        && matchesRating
        && matchesAssets;
    });
  }, [contents, filters]);

  const analytics = useMemo(() => buildContentAnalytics(filteredContents), [filteredContents]);

  const yearRange = useMemo(() => {
    const years = contents.map((content) => Number(content.anio)).filter(Number.isFinite);
    return {
      min: years.length ? Math.min(...years) : 1895,
      max: years.length ? Math.max(...years) : currentYear
    };
  }, [contents]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      setContents(await getAdminCatalog());
    } catch (loadError) {
      setError(`No se pudo cargar el dashboard desde Mongo. Detalle: ${loadError.message}`);
      setContents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const resetFilters = () => {
    setFilters(emptyFilters);
  };

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-kicker">Dashboard de contenido</p>
          <h1>Estadisticas del catalogo Mongo</h1>
        </div>
        <nav className="dashboard-nav" aria-label="Administracion">
          <a href="/admin/content">CRUD</a>
          <a href="/catalog">Catalogo</a>
        </nav>
      </header>

      {error && <p className="dashboard-alert">{error}</p>}

      <section className="dashboard-filters" aria-label="Filtros del dashboard">
        <label>
          Busqueda
          <input name="search" value={filters.search} onChange={handleChange} placeholder="Titulo, descripcion o genero" />
        </label>
        <label>
          Tipo
          <select name="tipo" value={filters.tipo} onChange={handleChange}>
            <option value="todos">Todos</option>
            <option value="pelicula">Peliculas</option>
            <option value="serie">Series</option>
          </select>
        </label>
        <label>
          Genero
          <select name="genero" value={filters.genero} onChange={handleChange}>
            <option value="todos">Todos</option>
            {filterOptions.genres.map((genre) => <option key={genre} value={genre}>{genre}</option>)}
          </select>
        </label>
        <label>
          Clasificacion
          <select name="clasificacion" value={filters.clasificacion} onChange={handleChange}>
            <option value="todos">Todas</option>
            {filterOptions.classifications.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label>
          Anio desde
          <input name="minYear" type="number" min={yearRange.min} max={yearRange.max} value={filters.minYear} onChange={handleChange} placeholder={String(yearRange.min)} />
        </label>
        <label>
          Anio hasta
          <input name="maxYear" type="number" min={yearRange.min} max={currentYear + 5} value={filters.maxYear} onChange={handleChange} placeholder={String(yearRange.max)} />
        </label>
        <label>
          Rating minimo
          <input name="minRating" type="range" min="0" max="10" step="0.5" value={filters.minRating} onChange={handleChange} />
          <span className="dashboard-range-value">{filters.minRating}</span>
        </label>
        <label>
          Assets
          <select name="assetState" value={filters.assetState} onChange={handleChange}>
            <option value="todos">Todos</option>
            <option value="completos">Imagen y trailer</option>
            <option value="sinImagen">Sin imagen</option>
            <option value="sinTrailer">Sin trailer</option>
          </select>
        </label>
        <button type="button" onClick={resetFilters}>Limpiar filtros</button>
      </section>

      <section className="dashboard-stats" aria-label="Indicadores principales">
        <StatCard label="Contenido filtrado" value={numberFormat.format(analytics.total)} detail={`de ${numberFormat.format(contents.length)} documentos`} />
        <StatCard label="Rating promedio" value={analytics.avgRating.toFixed(1)} detail="sobre 10" />
        <StatCard label="Duracion promedio" value={`${analytics.avgDurationMinutes}m`} detail="por titulo con duracion" />
        <StatCard label="Assets completos" value={`${analytics.qualityIssues.completeAssets}%`} detail="imagen y trailer registrados" />
        <StatCard label="Sin trailer" value={analytics.qualityIssues.missingTrailer} detail="requieren revision" />
        <StatCard label="Horas totales" value={numberFormat.format(analytics.totalDurationHours)} detail="catalogo filtrado" />
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-panel dashboard-panel--compact">
          <div className="dashboard-panel-title">
            <h2>Tipo de contenido</h2>
            <span>{analytics.total} titulos</span>
          </div>
          <DonutChart peliculas={analytics.peliculas} series={analytics.series} />
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel-title">
            <h2>Generos principales</h2>
            <span>Top 10</span>
          </div>
          <BarList rows={analytics.genreCounts} maxRows={10} />
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel-title">
            <h2>Distribucion por anio</h2>
            <span>{yearRange.min}-{yearRange.max}</span>
          </div>
          <BarList rows={analytics.yearCounts} maxRows={12} />
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel-title">
            <h2>Ratings</h2>
            <span>rangos</span>
          </div>
          <BarList rows={analytics.ratingBuckets} maxRows={6} />
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel-title">
            <h2>Clasificaciones</h2>
            <span>audiencia</span>
          </div>
          <BarList rows={analytics.classificationCounts} maxRows={10} />
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel-title">
            <h2>Duracion</h2>
            <span>peliculas y series</span>
          </div>
          <BarList rows={analytics.durationBuckets} maxRows={5} />
        </article>
      </section>

      <section className="dashboard-tables">
        <article className="dashboard-panel">
          <div className="dashboard-panel-title">
            <h2>Mejor calificados</h2>
            <span>top 10</span>
          </div>
          <div className="dashboard-table-scroll">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Titulo</th>
                  <th>Tipo</th>
                  <th>Generos</th>
                  <th>Anio</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {analytics.topRated.map((content) => (
                  <tr key={`${content.database_id}-rated`}>
                    <td>{content.titulo}</td>
                    <td>{getTypeLabel(content.tipo)}</td>
                    <td>{content.generos.join(', ')}</td>
                    <td>{content.anio || 'N/D'}</td>
                    <td>{content.calificacion ?? 'N/D'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel-title">
            <h2>Revision de calidad</h2>
            <span>assets y descripcion</span>
          </div>
          <div className="dashboard-quality">
            <div>
              <strong>{analytics.qualityIssues.missingImage}</strong>
              <span>sin imagen</span>
            </div>
            <div>
              <strong>{analytics.qualityIssues.missingTrailer}</strong>
              <span>sin trailer</span>
            </div>
            <div>
              <strong>{analytics.qualityIssues.missingDescription}</strong>
              <span>descripcion corta</span>
            </div>
          </div>
          <div className="dashboard-table-scroll">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Titulo</th>
                  <th>Imagen</th>
                  <th>Trailer</th>
                  <th>Descripcion</th>
                </tr>
              </thead>
              <tbody>
                {filteredContents
                  .filter((content) => !content.imagen_url || !content.trailer_url || !content.descripcion || content.descripcion.length < 20)
                  .slice(0, 12)
                  .map((content) => (
                    <tr key={`${content.database_id}-quality`}>
                      <td>{content.titulo}</td>
                      <td>{content.imagen_url ? 'OK' : 'Falta'}</td>
                      <td>{content.trailer_url ? 'OK' : 'Falta'}</td>
                      <td>{content.descripcion && content.descripcion.length >= 20 ? 'OK' : 'Revisar'}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      {loading && <p className="dashboard-loading">Cargando datos de Mongo...</p>}
    </main>
  );
};

export default AdminDashboardPage;
