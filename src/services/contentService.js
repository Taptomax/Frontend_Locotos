const CATALOG_BASE = (import.meta.env.VITE_CATALOG_API_URL || 'http://localhost:3001').replace(/\/+$/, '');
const LEGACY_API_BASE = (import.meta.env.VITE_CONTENT_API_URL || 'http://localhost:3006/api').replace(/\/+$/, '');

const fallbackContent = [
  {
    id: 1,
    id_contenido: 1,
    titulo: 'La Ruta del Locoto',
    name: 'La Ruta del Locoto',
    tipo: 'pelicula',
    tipo_label: 'Pelicula',
    generos: ['Aventura'],
    genero: 'Aventura',
    genre: 'Aventura',
    anio: 2024,
    year: 2024,
    descripcion: 'Una cocinera recorre Bolivia para recuperar una receta familiar antes de que se pierda para siempre.',
    sinopsis: 'Una cocinera recorre Bolivia para recuperar una receta familiar antes de que se pierda para siempre.',
    trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    poster: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
    imagen_url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
    duracion: '1h 48m',
    duracion_segundos: 6480,
    calificacion: 8.4,
    clasificacion: 'PG-13',
    poster_color: '#27495f',
    poster_inicial: 'LR',
    reproducciones: 124
  },
  {
    id: 2,
    id_contenido: 2,
    titulo: 'Cordillera Roja',
    name: 'Cordillera Roja',
    tipo: 'serie',
    tipo_label: 'Serie',
    generos: ['Aventura'],
    genero: 'Aventura',
    genre: 'Aventura',
    anio: 2023,
    year: 2023,
    descripcion: 'Un equipo de rescate enfrenta tormentas, secretos y decisiones limite en la zona andina.',
    sinopsis: 'Un equipo de rescate enfrenta tormentas, secretos y decisiones limite en la zona andina.',
    trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    poster: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=600&q=80',
    imagen_url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=600&q=80',
    duracion: '8 episodios',
    duracion_segundos: 3000,
    calificacion: 8.1,
    clasificacion: 'TV-14',
    temporadas: 2,
    poster_color: '#27495f',
    poster_inicial: 'CR',
    reproducciones: 98
  }
].map((item) => ({ ...item, source: 'fallback' }));

export const hashTitle = (title) => {
  if (!title) return 0;
  let hash = 0;
  for (let i = 0; i < title.length; i += 1) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

const parseList = (value) => {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  if (typeof value !== 'string') return [];
  return value.split(',').map((item) => item.trim()).filter(Boolean);
};

const toNumberOrNull = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const getTypeKey = (value) => {
  const normalized = String(value || '').trim().toLowerCase();
  return normalized === 'serie' ? 'serie' : 'pelicula';
};

export const getTypeLabel = (value) => (getTypeKey(value) === 'serie' ? 'Serie' : 'Pelicula');

export const normalizeContent = (raw = {}) => {
  const databaseId = raw._id ?? raw.database_id ?? raw.id_contenido ?? raw.id ?? '';
  const title = String(raw.titulo ?? raw.name ?? '').trim();
  const genres = parseList(raw.generos ?? raw.reparto_generos ?? raw.genero ?? raw.genre);
  const firstGenre = genres[0] || String(raw.genero ?? raw.genre ?? 'General').trim() || 'General';
  const typeKey = getTypeKey(raw.tipo);
  const description = raw.descripcion ?? raw.sinopsis ?? '';
  const imageUrl = raw.imagen_url ?? raw.poster ?? '';
  const trailerUrl = raw.trailer_url ?? raw.trailer ?? raw.url ?? '';
  const year = toNumberOrNull(raw.anio ?? raw.year);
  const durationSeconds = toNumberOrNull(raw.duracion_segundos);
  const rating = toNumberOrNull(raw.calificacion);
  const seasons = toNumberOrNull(raw.temporadas ?? raw.seasons);
  const playbackCount = toNumberOrNull(raw.reproducciones);

  return {
    ...raw,
    _id: raw._id,
    id: databaseId,
    id_contenido: databaseId,
    database_id: databaseId ? String(databaseId) : '',
    titulo: title,
    name: title,
    tipo: typeKey,
    tipo_label: getTypeLabel(typeKey),
    generos: genres.length ? genres : [firstGenre],
    genero: firstGenre,
    genre: firstGenre,
    anio: year,
    year,
    clasificacion: raw.clasificacion || (typeKey === 'serie' ? 'TV-14' : 'PG-13'),
    duracion_segundos: durationSeconds,
    duracion: raw.duracion || '',
    poster_color: raw.poster_color || '#1a1a2e',
    poster_inicial: raw.poster_inicial || title.slice(0, 2).toUpperCase(),
    imagen_url: imageUrl,
    poster: imageUrl,
    trailer_url: trailerUrl,
    trailer: trailerUrl,
    calificacion: rating,
    temporadas: typeKey === 'serie' ? seasons : null,
    seasons: typeKey === 'serie' ? seasons : null,
    descripcion: description,
    sinopsis: description,
    reproducciones: playbackCount ?? 0,
    source: raw.source || (raw._id ? 'mongo' : 'legacy')
  };
};

const normalizeList = (data) => {
  const items = Array.isArray(data) ? data : (data?.contenidos || data?.content || data?.items || []);
  return Array.isArray(items) ? items.map(normalizeContent) : [];
};

const requestJson = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || data?.message || data?.mensaje || `Solicitud fallida (${response.status}).`);
  }

  return data;
};

const loadLegacyCatalog = async () => normalizeList(await requestJson(`${LEGACY_API_BASE}/catalog`));

export const getCatalog = async () => {
  try {
    return normalizeList(await requestJson(`${CATALOG_BASE}/api/catalog`));
  } catch (mongoError) {
    try {
      return await loadLegacyCatalog();
    } catch (legacyError) {
      console.warn('Usando catalogo local de respaldo:', mongoError.message, legacyError.message);
      return fallbackContent;
    }
  }
};

export const getAdminCatalog = async () => {
  const data = await requestJson(`${CATALOG_BASE}/admin/content`);
  return normalizeList(data);
};

const findByAnyId = (items, id) => {
  const target = String(id);
  return items.find((item) => {
    const contentId = String(getContentId(item));
    const legacyId = String(getLegacyNumericContentId(item));
    return contentId === target || legacyId === target || String(item.id) === target || String(item._id) === target;
  }) || null;
};

export const getContentId = (content) => {
  const rawId = content?._id ?? content?.database_id ?? content?.id_contenido ?? content?.id;
  if (rawId !== null && rawId !== undefined && String(rawId).trim() !== '') return String(rawId);
  return String(hashTitle(content?.titulo || content?.name));
};

export const getLegacyNumericContentId = (content) => {
  const numericId = Number(content?.legacy_id ?? content?.numeric_id ?? content?.id_numeric ?? content?.id_contenido ?? content?.id);
  return Number.isFinite(numericId) && numericId > 0 ? numericId : hashTitle(content?.titulo || content?.name);
};

export const getContentById = async (id) => {
  try {
    const idText = String(id);
    if (/^[a-f\d]{24}$/i.test(idText)) {
      return normalizeContent(await requestJson(`${CATALOG_BASE}/contenido/${idText}`));
    }
  } catch (error) {
    console.warn('No se pudo cargar el detalle directo desde Mongo:', error.message);
  }

  try {
    return normalizeContent(await requestJson(`${LEGACY_API_BASE}/content/${id}`));
  } catch {
    const catalog = await getCatalog();
    return findByAnyId(catalog, id);
  }
};

export const getRecommendationsByContent = async (id, genre) => {
  const catalog = await getCatalog();
  const current = findByAnyId(catalog, id);
  const currentGenres = new Set(
    (current?.generos?.length ? current.generos : parseList(genre))
      .map((item) => item.toLowerCase())
  );

  return catalog
    .filter((item) => String(getContentId(item)) !== String(id))
    .filter((item) => item.generos.some((itemGenre) => currentGenres.has(String(itemGenre).toLowerCase())))
    .slice(0, 8);
};

export const registerPlayback = async (id) => {
  try {
    return await requestJson(`${LEGACY_API_BASE}/content/${id}/play`, { method: 'POST', body: '{}' });
  } catch {
    return null;
  }
};

export const buildContentPayload = (form) => {
  const typeKey = getTypeKey(form.tipo);
  const title = String(form.titulo || '').trim();
  const genres = parseList(form.generos);
  const seasons = toNumberOrNull(form.temporadas);

  return {
    titulo: title,
    tipo: typeKey,
    anio: toNumberOrNull(form.anio) ?? new Date().getFullYear(),
    generos: genres,
    clasificacion: String(form.clasificacion || '').trim(),
    duracion_segundos: toNumberOrNull(form.duracion_segundos) ?? 3600,
    duracion: String(form.duracion || '').trim(),
    poster_color: String(form.poster_color || '#1a1a2e').trim(),
    poster_inicial: String(form.poster_inicial || title.slice(0, 2)).trim().toUpperCase(),
    imagen_url: String(form.imagen_url || '').trim(),
    trailer_url: String(form.trailer_url || '').trim(),
    calificacion: toNumberOrNull(form.calificacion) ?? 0,
    temporadas: typeKey === 'serie' ? seasons : null,
    descripcion: String(form.descripcion || '').trim()
  };
};

export const createContent = async (payload) => {
  const data = await requestJson(`${CATALOG_BASE}/contenido`, {
    method: 'POST',
    body: JSON.stringify(buildContentPayload(payload))
  });
  return normalizeContent(data?.contenido || data);
};

export const updateContent = async (id, payload) => {
  const data = await requestJson(`${CATALOG_BASE}/contenido/${id}`, {
    method: 'PUT',
    body: JSON.stringify(buildContentPayload(payload))
  });
  return normalizeContent(data?.contenido || data);
};

export const deleteContent = async (id) => requestJson(`${CATALOG_BASE}/contenido/${id}`, { method: 'DELETE' });

const countBy = (items, getKey) => items.reduce((acc, item) => {
  const key = getKey(item);
  if (!key) return acc;
  acc[key] = (acc[key] || 0) + 1;
  return acc;
}, {});

const toSortedEntries = (record) => Object.entries(record)
  .map(([label, value]) => ({ label, value }))
  .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));

const buildRatingBuckets = (items) => {
  const buckets = { '0-4.9': 0, '5-5.9': 0, '6-6.9': 0, '7-7.9': 0, '8-8.9': 0, '9-10': 0 };
  items.forEach((item) => {
    const rating = Number(item.calificacion);
    if (!Number.isFinite(rating)) return;
    if (rating < 5) buckets['0-4.9'] += 1;
    else if (rating < 6) buckets['5-5.9'] += 1;
    else if (rating < 7) buckets['6-6.9'] += 1;
    else if (rating < 8) buckets['7-7.9'] += 1;
    else if (rating < 9) buckets['8-8.9'] += 1;
    else buckets['9-10'] += 1;
  });
  return Object.entries(buckets).map(([label, value]) => ({ label, value }));
};

const buildDurationBuckets = (items) => {
  const buckets = { '< 60m': 0, '60-119m': 0, '120-179m': 0, '180m+': 0, 'Series': 0 };
  items.forEach((item) => {
    if (item.tipo === 'serie') {
      buckets.Series += 1;
      return;
    }
    const seconds = Number(item.duracion_segundos);
    if (!Number.isFinite(seconds)) return;
    const minutes = seconds / 60;
    if (minutes < 60) buckets['< 60m'] += 1;
    else if (minutes < 120) buckets['60-119m'] += 1;
    else if (minutes < 180) buckets['120-179m'] += 1;
    else buckets['180m+'] += 1;
  });
  return Object.entries(buckets).map(([label, value]) => ({ label, value }));
};

export const buildContentAnalytics = (items) => {
  const contents = items.map(normalizeContent);
  const total = contents.length;
  const ratingValues = contents.map((item) => Number(item.calificacion)).filter(Number.isFinite);
  const durationValues = contents.map((item) => Number(item.duracion_segundos)).filter(Number.isFinite);
  const genreCounts = contents.reduce((acc, item) => {
    item.generos.forEach((genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
    });
    return acc;
  }, {});
  const missingImage = contents.filter((item) => !item.imagen_url).length;
  const missingTrailer = contents.filter((item) => !item.trailer_url).length;
  const missingDescription = contents.filter((item) => !item.descripcion || item.descripcion.length < 20).length;
  const completeAssets = contents.filter((item) => item.imagen_url && item.trailer_url).length;

  return {
    total,
    peliculas: contents.filter((item) => item.tipo === 'pelicula').length,
    series: contents.filter((item) => item.tipo === 'serie').length,
    avgRating: ratingValues.length ? ratingValues.reduce((sum, value) => sum + value, 0) / ratingValues.length : 0,
    avgDurationMinutes: durationValues.length ? Math.round(durationValues.reduce((sum, value) => sum + value, 0) / durationValues.length / 60) : 0,
    totalDurationHours: Math.round(durationValues.reduce((sum, value) => sum + value, 0) / 3600),
    genreCounts: toSortedEntries(genreCounts),
    typeCounts: toSortedEntries(countBy(contents, (item) => item.tipo_label)),
    yearCounts: Object.entries(countBy(contents, (item) => item.anio || 'Sin anio'))
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => Number(a.label) - Number(b.label)),
    classificationCounts: toSortedEntries(countBy(contents, (item) => item.clasificacion || 'Sin clasificacion')),
    ratingBuckets: buildRatingBuckets(contents),
    durationBuckets: buildDurationBuckets(contents),
    topRated: [...contents]
      .sort((a, b) => Number(b.calificacion || 0) - Number(a.calificacion || 0))
      .slice(0, 10),
    newest: [...contents]
      .sort((a, b) => Number(b.anio || 0) - Number(a.anio || 0))
      .slice(0, 10),
    qualityIssues: {
      missingImage,
      missingTrailer,
      missingDescription,
      completeAssets: total ? Math.round((completeAssets / total) * 100) : 0
    }
  };
};

export const getStats = async () => {
  const contents = await getAdminCatalog();
  const analytics = buildContentAnalytics(contents);

  return {
    total_contenidos: analytics.total,
    total_reproducciones: contents.reduce((sum, item) => sum + Number(item.reproducciones || 0), 0),
    promedio_reproducciones: analytics.total
      ? Math.round(contents.reduce((sum, item) => sum + Number(item.reproducciones || 0), 0) / analytics.total)
      : 0,
    contenido_mas_visto: [...contents].sort((a, b) => Number(b.reproducciones || 0) - Number(a.reproducciones || 0))[0] || null,
    mas_vistos: [...contents].sort((a, b) => Number(b.reproducciones || 0) - Number(a.reproducciones || 0))
  };
};
