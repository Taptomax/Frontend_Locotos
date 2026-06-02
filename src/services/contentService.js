const API_BASE = import.meta.env.VITE_CONTENT_API_URL || 'http://localhost:3006/api';

const fallbackContent = [
  {
    id: 1,
    id_contenido: 1,
    titulo: 'La Ruta del Locoto',
    name: 'La Ruta del Locoto',
    tipo: 'Pelicula',
    genero: 'Aventura',
    genre: 'Aventura',
    anio: 2024,
    year: 2024,
    director: 'Valeria Quiroga',
    autor: 'Mario Salazar',
    author: 'Mario Salazar',
    temporadas: null,
    seasons: null,
    reparto: ['Ana Rojas', 'Luis Peredo', 'Camila Arce'],
    cast: ['Ana Rojas', 'Luis Peredo', 'Camila Arce'],
    actores: 'Ana Rojas, Luis Peredo, Camila Arce',
    sinopsis: 'Una cocinera recorre Bolivia para recuperar una receta familiar antes de que se pierda para siempre.',
    descripcion: 'Una cocinera recorre Bolivia para recuperar una receta familiar antes de que se pierda para siempre.',
    trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    poster: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
    imagen_url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
    duracion: '1h 48m',
    calificacion: '8.4',
    reproducciones: 124
  },
  {
    id: 2,
    id_contenido: 2,
    titulo: 'Cordillera Roja',
    name: 'Cordillera Roja',
    tipo: 'Serie',
    genero: 'Aventura',
    genre: 'Aventura',
    anio: 2023,
    year: 2023,
    director: 'Andres Baldiviezo',
    autor: 'Elena Vargas',
    author: 'Elena Vargas',
    temporadas: 2,
    seasons: 2,
    reparto: ['Diego Molina', 'Noelia Paz', 'Ruben Choque'],
    cast: ['Diego Molina', 'Noelia Paz', 'Ruben Choque'],
    actores: 'Diego Molina, Noelia Paz, Ruben Choque',
    sinopsis: 'Un equipo de rescate enfrenta tormentas, secretos y decisiones limite en la zona andina.',
    descripcion: 'Un equipo de rescate enfrenta tormentas, secretos y decisiones limite en la zona andina.',
    trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    poster: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=600&q=80',
    imagen_url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=600&q=80',
    duracion: '8 episodios',
    calificacion: '8.1',
    reproducciones: 98
  },
  {
    id: 3,
    id_contenido: 3,
    titulo: 'Codigo Salar',
    name: 'Codigo Salar',
    tipo: 'Pelicula',
    genero: 'Suspenso',
    genre: 'Suspenso',
    anio: 2025,
    year: 2025,
    director: 'Nicolas Pinto',
    autor: 'Sofia Mercado',
    author: 'Sofia Mercado',
    temporadas: null,
    seasons: null,
    reparto: ['Marcos Linares', 'Paola Guzman', 'Hugo Rios'],
    cast: ['Marcos Linares', 'Paola Guzman', 'Hugo Rios'],
    actores: 'Marcos Linares, Paola Guzman, Hugo Rios',
    sinopsis: 'Una analista descubre una red de datos ocultos bajo una operacion minera aparentemente normal.',
    descripcion: 'Una analista descubre una red de datos ocultos bajo una operacion minera aparentemente normal.',
    trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    poster: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80',
    imagen_url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80',
    duracion: '2h 03m',
    calificacion: '8.7',
    reproducciones: 183
  },
  {
    id: 4,
    id_contenido: 4,
    titulo: 'Archivo 16',
    name: 'Archivo 16',
    tipo: 'Serie',
    genero: 'Suspenso',
    genre: 'Suspenso',
    anio: 2022,
    year: 2022,
    director: 'Renata Suarez',
    autor: 'Tomas Villca',
    author: 'Tomas Villca',
    temporadas: 1,
    seasons: 1,
    reparto: ['Lucia Flores', 'Esteban Calle', 'Mara Ibarra'],
    cast: ['Lucia Flores', 'Esteban Calle', 'Mara Ibarra'],
    actores: 'Lucia Flores, Esteban Calle, Mara Ibarra',
    sinopsis: 'Una periodista reabre un caso archivado y encuentra pruebas que cambian toda la historia.',
    descripcion: 'Una periodista reabre un caso archivado y encuentra pruebas que cambian toda la historia.',
    trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    poster: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=600&q=80',
    imagen_url: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=600&q=80',
    duracion: '6 episodios',
    calificacion: '7.9',
    reproducciones: 77
  }
];

const hashTitle = (title) => {
  if (!title) return 0;
  let hash = 0;
  for (let i = 0; i < title.length; i += 1) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

export const getContentId = (content) => {
  const numericId = Number(content?.id_contenido ?? content?.id);
  return Number.isFinite(numericId) && numericId > 0 ? numericId : hashTitle(content?.titulo || content?.name);
};

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || 'No se pudo completar la solicitud de contenido.');
  }

  return data;
};

export const getCatalog = async () => {
  try {
    const data = await request('/catalog');
    return Array.isArray(data) ? data : fallbackContent;
  } catch (error) {
    console.warn('Usando catalogo local de respaldo:', error.message);
    return fallbackContent;
  }
};

export const getContentById = async (id) => {
  try {
    return await request(`/content/${id}`);
  } catch (error) {
    console.warn('Usando detalle local de respaldo:', error.message);
    return fallbackContent.find((item) => getContentId(item) === Number(id)) || null;
  }
};

export const getRecommendationsByContent = async (id, genre) => {
  try {
    const data = await request(`/content/${id}/recommendations`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn('Usando recomendaciones locales de respaldo:', error.message);
    return fallbackContent.filter((item) => getContentId(item) !== Number(id) && item.genero === genre);
  }
};

export const registerPlayback = async (id) => {
  try {
    return await request(`/content/${id}/play`, { method: 'POST', body: '{}' });
  } catch (error) {
    console.warn('No se pudo registrar la reproduccion:', error.message);
    return null;
  }
};

export const getStats = async () => {
  try {
    return await request('/admin/stats');
  } catch (error) {
    console.warn('Usando estadisticas locales de respaldo:', error.message);
    const total = fallbackContent.reduce((sum, item) => sum + Number(item.reproducciones || 0), 0);
    const masVistos = [...fallbackContent]
      .sort((a, b) => Number(b.reproducciones || 0) - Number(a.reproducciones || 0))
      .map((item) => ({
        id: getContentId(item),
        titulo: item.titulo,
        tipo: item.tipo,
        genero: item.genero,
        reproducciones: Number(item.reproducciones || 0)
      }));

    return {
      total_contenidos: fallbackContent.length,
      total_reproducciones: total,
      promedio_reproducciones: Math.round(total / fallbackContent.length),
      contenido_mas_visto: masVistos[0],
      mas_vistos: masVistos
    };
  }
};

export const createContent = (payload) => request('/content', { method: 'POST', body: JSON.stringify(payload) });

export const updateContent = (id, payload) => request(`/content/${id}`, { method: 'PUT', body: JSON.stringify(payload) });

export const deleteContent = (id) => request(`/content/${id}`, { method: 'DELETE' });
