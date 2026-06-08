import React, { useEffect, useMemo, useState } from 'react';
import {
  createContent,
  deleteContent,
  getAdminCatalog,
  getContentId,
  getTypeLabel,
  updateContent
} from '../../services/contentService';
import { useLocotosTheme } from '../../hooks/useLocotosTheme';
import '../catalog/CatalogPage.css';
import './AdminContentPage.css';

const currentYear = new Date().getFullYear();

const emptyForm = {
  titulo: '',
  tipo: 'pelicula',
  anio: String(currentYear),
  generos: '',
  clasificacion: 'PG-13',
  duracion_segundos: '',
  duracion: '',
  poster_color: '#1a1a2e',
  poster_inicial: '',
  imagen_url: '',
  trailer_url: '',
  calificacion: '7',
  temporadas: '',
  descripcion: ''
};

const classificationOptions = ['G', 'PG', 'PG-13', 'R', 'NC-17', 'TV-Y', 'TV-G', 'TV-PG', 'TV-14', 'TV-MA'];

const splitGenres = (value) => String(value || '')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

const isValidUrl = (value) => {
  if (!value) return true;
  try {
    const parsed = new URL(value);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

const isHexColor = (value) => /^#[0-9A-Fa-f]{6}$/.test(String(value || '').trim());

const makeInitials = (title) => String(title || '')
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((word) => word[0])
  .join('')
  .toUpperCase();

const toForm = (content) => ({
  titulo: content.titulo || '',
  tipo: content.tipo || 'pelicula',
  anio: content.anio ? String(content.anio) : '',
  generos: Array.isArray(content.generos) ? content.generos.join(', ') : content.genero || '',
  clasificacion: content.clasificacion || 'PG-13',
  duracion_segundos: content.duracion_segundos ? String(content.duracion_segundos) : '',
  duracion: content.duracion || '',
  poster_color: content.poster_color || '#1a1a2e',
  poster_inicial: content.poster_inicial || makeInitials(content.titulo),
  imagen_url: content.imagen_url || '',
  trailer_url: content.trailer_url || '',
  calificacion: content.calificacion !== null && content.calificacion !== undefined ? String(content.calificacion) : '',
  temporadas: content.temporadas ? String(content.temporadas) : '',
  descripcion: content.descripcion || ''
});

const validateForm = (form) => {
  const errors = {};
  const title = form.titulo.trim();
  const year = Number(form.anio);
  const durationSeconds = Number(form.duracion_segundos);
  const rating = Number(form.calificacion);
  const seasons = Number(form.temporadas);
  const genres = splitGenres(form.generos);

  if (title.length < 2) errors.titulo = 'Ingresa al menos 2 caracteres.';
  if (title.length > 120) errors.titulo = 'Maximo 120 caracteres.';
  if (!['pelicula', 'serie'].includes(form.tipo)) errors.tipo = 'Selecciona un tipo valido.';
  if (!Number.isInteger(year) || year < 1895 || year > currentYear + 5) errors.anio = `Usa un año entre 1895 y ${currentYear + 5}.`;
  if (genres.length === 0) errors.generos = 'Ingresa al menos un genero.';
  if (genres.length > 6) errors.generos = 'Usa maximo 6 generos.';
  if (!classificationOptions.includes(form.clasificacion)) errors.clasificacion = 'Selecciona una clasificacion valida.';
  if (!Number.isFinite(durationSeconds) || durationSeconds < 60 || durationSeconds > 24000) {
    errors.duracion_segundos = 'La duracion debe estar entre 60 y 24000 segundos.';
  }
  if (form.duracion.trim().length < 3) errors.duracion = 'Ejemplo: 2h 10m o 4 temporadas.';
  if (!isHexColor(form.poster_color)) errors.poster_color = 'Usa un color hexadecimal como #1a1a2e.';
  if (form.poster_inicial.trim().length < 1 || form.poster_inicial.trim().length > 3) {
    errors.poster_inicial = 'Usa de 1 a 3 caracteres.';
  }
  if (form.imagen_url && !isValidUrl(form.imagen_url)) errors.imagen_url = 'La URL de imagen debe iniciar con http o https.';
  if (form.trailer_url && !isValidUrl(form.trailer_url)) errors.trailer_url = 'La URL de trailer debe iniciar con http o https.';
  if (!Number.isFinite(rating) || rating < 0 || rating > 10) errors.calificacion = 'La calificacion debe estar entre 0 y 10.';
  if (form.tipo === 'serie' && (!Number.isInteger(seasons) || seasons < 1 || seasons > 80)) {
    errors.temporadas = 'Las series necesitan entre 1 y 80 temporadas.';
  }
  if (form.tipo === 'pelicula' && form.temporadas) errors.temporadas = 'Las peliculas no deben tener temporadas.';
  if (form.descripcion.trim().length < 10) errors.descripcion = 'Agrega una descripcion de al menos 10 caracteres.';
  if (form.descripcion.trim().length > 900) errors.descripcion = 'Maximo 900 caracteres.';

  return errors;
};

const FieldError = ({ message }) => (message ? <span className="admin-field-error">{message}</span> : null);

const AdminContentPage = () => {
  const { darkMode, toggleTheme, wrapperClass } = useLocotosTheme(true);
  const [contents, setContents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({});
  const [filters, setFilters] = useState({ search: '', tipo: 'todos', genero: 'todos' });

  const formErrors = useMemo(() => validateForm(form), [form]);
  const hasErrors = Object.keys(formErrors).length > 0;

  const genreOptions = useMemo(() => {
    const genres = new Set();
    contents.forEach((content) => content.generos.forEach((genre) => genres.add(genre)));
    return [...genres].sort((a, b) => a.localeCompare(b));
  }, [contents]);

  const filteredContents = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return contents
      .filter((content) => {
        const matchesSearch = !search
          || content.titulo.toLowerCase().includes(search)
          || content.descripcion.toLowerCase().includes(search)
          || content.generos.join(' ').toLowerCase().includes(search);
        const matchesType = filters.tipo === 'todos' || content.tipo === filters.tipo;
        const matchesGenre = filters.genero === 'todos' || content.generos.includes(filters.genero);
        return matchesSearch && matchesType && matchesGenre;
      })
      .sort((a, b) => a.titulo.localeCompare(b.titulo));
  }, [contents, filters]);

  const summary = useMemo(() => ({
    total: contents.length,
    peliculas: contents.filter((content) => content.tipo === 'pelicula').length,
    series: contents.filter((content) => content.tipo === 'serie').length,
    visible: filteredContents.length
  }), [contents, filteredContents]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      setContents(await getAdminCatalog());
    } catch (loadError) {
      setError(`No se pudo conectar al catalog-service de Mongo en localhost:3001. Detalle: ${loadError.message}`);
      setContents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showErrorFor = (name) => touched[name] || saving;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => {
      const next = { ...current, [name]: value };

      if (name === 'titulo' && !editingId && !current.poster_inicial.trim()) {
        next.poster_inicial = makeInitials(value);
      }

      if (name === 'tipo' && value === 'pelicula') {
        next.temporadas = '';
      }

      return next;
    });
  };

  const handleBlur = (event) => {
    setTouched((current) => ({ ...current, [event.target.name]: true }));
  };

  const handleEdit = (content) => {
    setEditingId(getContentId(content));
    setForm(toForm(content));
    setTouched({});
    setError('');
    setMessage(`Editando "${content.titulo}".`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setEditingId(null);
    setForm(emptyForm);
    setTouched({});
    setMessage('');
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    if (hasErrors) {
      setTouched(Object.keys(formErrors).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      setError('Revisa los campos marcados antes de guardar.');
      setSaving(false);
      return;
    }

    try {
      if (editingId) {
        await updateContent(editingId, form);
        setMessage('Contenido actualizado correctamente en MongoDB.');
      } else {
        await createContent(form);
        setMessage('Contenido creado correctamente en MongoDB.');
      }

      setForm(emptyForm);
      setEditingId(null);
      setTouched({});
      await loadData();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (content) => {
    const id = getContentId(content);
    if (!window.confirm(`Eliminar "${content.titulo}" de MongoDB?`)) return;

    setError('');
    setMessage('');
    try {
      await deleteContent(id);
      setMessage('Contenido eliminado correctamente de MongoDB.');
      if (editingId === id) handleReset();
      await loadData();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  return (
    <main className={`${wrapperClass} admin-shell`}>
      <header className="admin-header">
        <div>
          <p className="admin-kicker">MongoDB Content Admin</p>
          <h1>CRUD de peliculas y series</h1>
        </div>
        <nav className="admin-nav" aria-label="Administracion">
          <button type="button" className="theme-toggle-btn" onClick={toggleTheme}>
            {darkMode ? '☀️ Claro' : '🌙 Oscuro'}
          </button>
          <a href="/admin/dashboard" className="admin-link">Dashboard</a>
          <a href="/catalog" className="admin-link">Catalogo</a>
        </nav>
      </header>

      {message && <p className="admin-message">{message}</p>}
      {error && <p className="admin-message admin-message--error">{error}</p>}

      <section className="admin-stats" aria-label="Resumen del catalogo">
        <article className="admin-stat">
          <span>Total en Mongo</span>
          <strong>{summary.total}</strong>
          <small>documentos</small>
        </article>
        <article className="admin-stat">
          <span>Peliculas</span>
          <strong>{summary.peliculas}</strong>
          <small>tipo pelicula</small>
        </article>
        <article className="admin-stat">
          <span>Series</span>
          <strong>{summary.series}</strong>
          <small>tipo serie</small>
        </article>
        <article className="admin-stat">
          <span>Filtrados</span>
          <strong>{summary.visible}</strong>
          <small>visibles ahora</small>
        </article>
      </section>

      <section className="admin-layout">
        <form className="admin-form" onSubmit={handleSubmit} noValidate>
          <div className="admin-section-title">
            <h2>{editingId ? 'Editar película' : 'Nueva película'}</h2>
            {editingId && (
              <button type="button" onClick={handleReset}>
                Cancelar
              </button>
            )}
          </div>

          <label>
            Titulo
            <input name="titulo" value={form.titulo} onChange={handleChange} onBlur={handleBlur} required maxLength="120" />
            {showErrorFor('titulo') && <FieldError message={formErrors.titulo} />}
          </label>

          <div className="admin-two-cols">
            <label>
              Tipo
              <select name="tipo" value={form.tipo} onChange={handleChange} onBlur={handleBlur}>
                <option value="pelicula">Pelicula</option>
                <option value="serie">Serie</option>
              </select>
              {showErrorFor('tipo') && <FieldError message={formErrors.tipo} />}
            </label>
            <label>
              Clasificacion
              <select name="clasificacion" value={form.clasificacion} onChange={handleChange} onBlur={handleBlur}>
                {classificationOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
              {showErrorFor('clasificacion') && <FieldError message={formErrors.clasificacion} />}
            </label>
          </div>

          <label>
            Generos
            <input name="generos" value={form.generos} onChange={handleChange} onBlur={handleBlur} placeholder="Accion, Drama, Ciencia Ficcion" />
            {showErrorFor('generos') && <FieldError message={formErrors.generos} />}
          </label>

          <div className="admin-two-cols">
            <label>
              Año
              <input name="anio" type="number" min="1895" max={currentYear + 5} value={form.anio} onChange={handleChange} onBlur={handleBlur} />
              {showErrorFor('anio') && <FieldError message={formErrors.anio} />}
            </label>
            <label>
              Calificacion
              <input name="calificacion" type="number" min="0" max="10" step="0.1" value={form.calificacion} onChange={handleChange} onBlur={handleBlur} />
              {showErrorFor('calificacion') && <FieldError message={formErrors.calificacion} />}
            </label>
          </div>

          <div className="admin-two-cols">
            <label>
              Duracion segundos
              <input name="duracion_segundos" type="number" min="60" max="24000" value={form.duracion_segundos} onChange={handleChange} onBlur={handleBlur} />
              {showErrorFor('duracion_segundos') && <FieldError message={formErrors.duracion_segundos} />}
            </label>
            <label>
              Duracion texto
              <input name="duracion" value={form.duracion} onChange={handleChange} onBlur={handleBlur} placeholder="2h 10m" />
              {showErrorFor('duracion') && <FieldError message={formErrors.duracion} />}
            </label>
          </div>

          <div className="admin-two-cols">
            <label>
              Temporadas
              <input name="temporadas" type="number" min="1" max="80" value={form.temporadas} onChange={handleChange} onBlur={handleBlur} disabled={form.tipo === 'pelicula'} />
              {showErrorFor('temporadas') && <FieldError message={formErrors.temporadas} />}
            </label>
            <label>
              Color poster
              <input name="poster_color" value={form.poster_color} onChange={handleChange} onBlur={handleBlur} placeholder="#1a1a2e" />
              {showErrorFor('poster_color') && <FieldError message={formErrors.poster_color} />}
            </label>
          </div>

          <label>
            Inicial poster
            <input name="poster_inicial" value={form.poster_inicial} onChange={handleChange} onBlur={handleBlur} maxLength="3" />
            {showErrorFor('poster_inicial') && <FieldError message={formErrors.poster_inicial} />}
          </label>

          <label>
            Imagen URL
            <input name="imagen_url" value={form.imagen_url} onChange={handleChange} onBlur={handleBlur} placeholder="https://..." />
            {showErrorFor('imagen_url') && <FieldError message={formErrors.imagen_url} />}
          </label>

          <label>
            Trailer URL
            <input name="trailer_url" value={form.trailer_url} onChange={handleChange} onBlur={handleBlur} placeholder="https://www.youtube.com/embed/..." />
            {showErrorFor('trailer_url') && <FieldError message={formErrors.trailer_url} />}
          </label>

          <label>
            Descripcion
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} onBlur={handleBlur} rows="4" maxLength="900" />
            {showErrorFor('descripcion') && <FieldError message={formErrors.descripcion} />}
          </label>

          <button type="submit" className="admin-submit" disabled={saving}>
            {saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear contenido'}
          </button>
        </form>

        <section className="admin-table-wrap">
          <div className="admin-section-title">
            <h2>Catalogo Mongo administrable</h2>
            <button type="button" onClick={loadData} disabled={loading}>
              {loading ? 'Cargando...' : 'Actualizar'}
            </button>
          </div>

          <div className="admin-filters" aria-label="Filtros de catalogo administrable">
            <input name="search" value={filters.search} onChange={handleFilterChange} placeholder="Buscar por titulo, descripcion o genero" />
            <select name="tipo" value={filters.tipo} onChange={handleFilterChange}>
              <option value="todos">Todos los tipos</option>
              <option value="pelicula">Peliculas</option>
              <option value="serie">Series</option>
            </select>
            <select name="genero" value={filters.genero} onChange={handleFilterChange}>
              <option value="todos">Todos los generos</option>
              {genreOptions.map((genre) => <option key={genre} value={genre}>{genre}</option>)}
            </select>
          </div>

          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Titulo</th>
                  <th>Tipo</th>
                  <th>Generos</th>
                  <th>Año</th>
                  <th>Rating</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredContents.map((content) => (
                  <tr key={getContentId(content)}>
                    <td>
                      <strong>{content.titulo}</strong>
                      <small className="admin-row-id">{getContentId(content)}</small>
                    </td>
                    <td>{getTypeLabel(content.tipo)}</td>
                    <td>{content.generos.join(', ')}</td>
                    <td>{content.anio || 'Sin anio'}</td>
                    <td>{content.calificacion ?? 'Sin rating'}</td>
                    <td>
                      <div className="admin-row-actions">
                        <button type="button" onClick={() => handleEdit(content)}>Editar</button>
                        <button type="button" className="admin-danger" onClick={() => handleDelete(content)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && filteredContents.length === 0 && (
                  <tr>
                    <td colSpan="6">No hay contenido que coincida con los filtros.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
};

export default AdminContentPage;
