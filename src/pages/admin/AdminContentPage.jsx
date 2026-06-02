import React, { useEffect, useMemo, useState } from 'react';
import {
  createContent,
  deleteContent,
  getCatalog,
  getContentId,
  getStats,
  updateContent
} from '../../services/contentService';
import './AdminContentPage.css';

const emptyForm = {
  titulo: '',
  tipo: 'Pelicula',
  genero: '',
  anio: '',
  director: '',
  autor: '',
  temporadas: '',
  reparto: '',
  sinopsis: '',
  trailer_url: '',
  poster: '',
  duracion: '',
  calificacion: ''
};

const toForm = (content) => ({
  titulo: content.titulo || content.name || '',
  tipo: content.tipo || 'Pelicula',
  genero: content.genero || content.genre || '',
  anio: content.anio || content.year || '',
  director: content.director || '',
  autor: content.autor || content.author || '',
  temporadas: content.temporadas || content.seasons || '',
  reparto: Array.isArray(content.reparto || content.cast)
    ? (content.reparto || content.cast).join(', ')
    : content.actores || '',
  sinopsis: content.sinopsis || content.descripcion || '',
  trailer_url: content.trailer_url || content.trailer || '',
  poster: content.poster || content.imagen_url || '',
  duracion: content.duracion || '',
  calificacion: content.calificacion || ''
});

const toPayload = (form) => ({
  ...form,
  anio: form.anio ? Number(form.anio) : null,
  temporadas: form.tipo === 'Serie' && form.temporadas ? Number(form.temporadas) : null,
  reparto: form.reparto.split(',').map((item) => item.trim()).filter(Boolean)
});

const AdminContentPage = () => {
  const [contents, setContents] = useState([]);
  const [stats, setStats] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const sortedContents = useMemo(
    () => [...contents].sort((a, b) => Number(b.reproducciones || 0) - Number(a.reproducciones || 0)),
    [contents]
  );

  const loadData = async () => {
    setLoading(true);
    const [catalogData, statsData] = await Promise.all([getCatalog(), getStats()]);
    setContents(catalogData);
    setStats(statsData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleEdit = (content) => {
    setEditingId(getContentId(content));
    setForm(toForm(content));
    setMessage(`Editando "${content.titulo || content.name}".`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      if (editingId) {
        await updateContent(editingId, toPayload(form));
        setMessage('Contenido actualizado correctamente.');
      } else {
        await createContent(toPayload(form));
        setMessage('Contenido creado correctamente.');
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadData();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (content) => {
    const id = getContentId(content);
    const title = content.titulo || content.name;
    if (!window.confirm(`Eliminar "${title}" del catalogo?`)) return;

    try {
      await deleteContent(id);
      setMessage('Contenido eliminado correctamente.');
      if (editingId === id) handleReset();
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const topContent = stats?.contenido_mas_visto;

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="admin-kicker">Administracion de contenido</p>
          <h1>Contenido y estadisticas</h1>
        </div>
        <a href="/catalog" className="admin-link">Ir al catalogo</a>
      </header>

      {message && <p className="admin-message">{message}</p>}

      <section className="admin-stats" aria-label="Estadisticas de reproduccion">
        <article className="admin-stat">
          <span>Contenido mas visto</span>
          <strong>{topContent?.titulo || 'Sin datos'}</strong>
          <small>{topContent?.reproducciones || 0} reproducciones</small>
        </article>
        <article className="admin-stat">
          <span>Total reproducciones</span>
          <strong>{stats?.total_reproducciones || 0}</strong>
          <small>acumuladas</small>
        </article>
        <article className="admin-stat">
          <span>Contenidos</span>
          <strong>{stats?.total_contenidos || contents.length}</strong>
          <small>registrados</small>
        </article>
        <article className="admin-stat">
          <span>Promedio</span>
          <strong>{stats?.promedio_reproducciones || 0}</strong>
          <small>por contenido</small>
        </article>
      </section>

      <section className="admin-layout">
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-section-title">
            <h2>{editingId ? 'Editar contenido' : 'Nuevo contenido'}</h2>
            {editingId && (
              <button type="button" onClick={handleReset}>
                Cancelar
              </button>
            )}
          </div>

          <label>
            Titulo
            <input name="titulo" value={form.titulo} onChange={handleChange} required />
          </label>

          <div className="admin-two-cols">
            <label>
              Tipo
              <select name="tipo" value={form.tipo} onChange={handleChange}>
                <option value="Pelicula">Pelicula</option>
                <option value="Serie">Serie</option>
              </select>
            </label>
            <label>
              Genero
              <input name="genero" value={form.genero} onChange={handleChange} required />
            </label>
          </div>

          <div className="admin-two-cols">
            <label>
              Anio
              <input name="anio" type="number" min="1900" max="2100" value={form.anio} onChange={handleChange} />
            </label>
            <label>
              Temporadas
              <input name="temporadas" type="number" min="0" value={form.temporadas} onChange={handleChange} />
            </label>
          </div>

          <div className="admin-two-cols">
            <label>
              Director
              <input name="director" value={form.director} onChange={handleChange} />
            </label>
            <label>
              Autor
              <input name="autor" value={form.autor} onChange={handleChange} />
            </label>
          </div>

          <label>
            Reparto
            <input name="reparto" value={form.reparto} onChange={handleChange} placeholder="Nombre 1, Nombre 2" />
          </label>

          <label>
            Sinopsis
            <textarea name="sinopsis" value={form.sinopsis} onChange={handleChange} rows="4" />
          </label>

          <label>
            Trailer embed URL
            <input name="trailer_url" value={form.trailer_url} onChange={handleChange} placeholder="https://www.youtube.com/embed/..." />
          </label>

          <label>
            Poster URL
            <input name="poster" value={form.poster} onChange={handleChange} />
          </label>

          <div className="admin-two-cols">
            <label>
              Duracion
              <input name="duracion" value={form.duracion} onChange={handleChange} />
            </label>
            <label>
              Calificacion
              <input name="calificacion" value={form.calificacion} onChange={handleChange} />
            </label>
          </div>

          <button type="submit" className="admin-submit" disabled={saving}>
            {saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear contenido'}
          </button>
        </form>

        <section className="admin-table-wrap">
          <div className="admin-section-title">
            <h2>Catalogo administrable</h2>
            <button type="button" onClick={loadData} disabled={loading}>
              Actualizar
            </button>
          </div>

          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Titulo</th>
                  <th>Genero</th>
                  <th>Tipo</th>
                  <th>Reproducciones</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {sortedContents.map((content) => (
                  <tr key={getContentId(content)}>
                    <td>{content.titulo || content.name}</td>
                    <td>{content.genero || content.genre}</td>
                    <td>{content.tipo || 'Pelicula'}</td>
                    <td>{content.reproducciones || 0}</td>
                    <td>
                      <div className="admin-row-actions">
                        <button type="button" onClick={() => handleEdit(content)}>Editar</button>
                        <button type="button" className="admin-danger" onClick={() => handleDelete(content)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && sortedContents.length === 0 && (
                  <tr>
                    <td colSpan="5">No hay contenido registrado.</td>
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
