import { createServer } from 'node:http'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const PORT = Number(process.env.PORT ?? 3006)
const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_FILE = `${__dirname}/data/content.json`

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, jsonHeaders)
  res.end(JSON.stringify(payload))
}

const readBody = async (req) => {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  if (chunks.length === 0) return {}

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    const error = new Error('El cuerpo de la solicitud debe ser JSON valido.')
    error.statusCode = 400
    throw error
  }
}

const parseList = (value) => {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean)
  if (typeof value !== 'string') return []
  return value.split(',').map((item) => item.trim()).filter(Boolean)
}

const toNullableNumber = (value) => {
  if (value === null || value === undefined || value === '') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

const normalizeContent = (raw) => {
  const id = Number(raw.id_contenido ?? raw.id)
  let reparto = raw.reparto ?? raw.cast ?? raw.actores ?? []

  if (typeof reparto === 'string') {
    try {
      const parsed = JSON.parse(reparto)
      reparto = Array.isArray(parsed) ? parsed : parseList(reparto)
    } catch {
      reparto = parseList(reparto)
    }
  }

  const titulo = raw.titulo ?? raw.name ?? ''
  const sinopsis = raw.sinopsis ?? raw.descripcion ?? ''
  const trailer = raw.trailer_url ?? raw.trailer ?? ''
  const anio = raw.anio ?? raw.year ?? null
  const autor = raw.autor ?? raw.author ?? ''
  const temporadas = raw.temporadas ?? raw.seasons ?? null

  return {
    id,
    id_contenido: id,
    titulo,
    name: titulo,
    tipo: raw.tipo ?? 'Pelicula',
    genero: raw.genero ?? raw.genre ?? 'General',
    genre: raw.genero ?? raw.genre ?? 'General',
    anio,
    year: anio,
    director: raw.director ?? '',
    autor,
    author: autor,
    temporadas,
    seasons: temporadas,
    reparto,
    cast: reparto,
    actores: reparto.join(', '),
    sinopsis,
    descripcion: sinopsis,
    trailer_url: trailer,
    trailer,
    poster: raw.poster ?? raw.imagen_url ?? '',
    imagen_url: raw.poster ?? raw.imagen_url ?? '',
    duracion: raw.duracion ?? '',
    calificacion: raw.calificacion ?? '',
    reproducciones: Number(raw.reproducciones ?? 0)
  }
}

const toStoredContent = (raw) => {
  const item = normalizeContent(raw)
  return {
    id: item.id,
    titulo: item.titulo,
    tipo: item.tipo,
    genero: item.genero,
    anio: item.anio,
    director: item.director,
    autor: item.autor,
    temporadas: item.temporadas,
    reparto: item.reparto,
    sinopsis: item.sinopsis,
    trailer_url: item.trailer_url,
    poster: item.poster,
    duracion: item.duracion,
    calificacion: item.calificacion,
    reproducciones: item.reproducciones
  }
}

const cleanPayload = (payload) => {
  const titulo = String(payload.titulo ?? payload.name ?? '').trim()
  const genero = String(payload.genero ?? payload.genre ?? '').trim()

  if (!titulo) {
    const error = new Error('El titulo es obligatorio.')
    error.statusCode = 400
    throw error
  }

  if (!genero) {
    const error = new Error('El genero es obligatorio para recomendaciones por genero.')
    error.statusCode = 400
    throw error
  }

  return {
    titulo,
    tipo: String(payload.tipo ?? 'Pelicula').trim() === 'Serie' ? 'Serie' : 'Pelicula',
    genero,
    anio: toNullableNumber(payload.anio ?? payload.year),
    director: String(payload.director ?? '').trim(),
    autor: String(payload.autor ?? payload.author ?? '').trim(),
    temporadas: toNullableNumber(payload.temporadas ?? payload.seasons),
    reparto: parseList(payload.reparto ?? payload.cast ?? payload.actores),
    sinopsis: String(payload.sinopsis ?? payload.descripcion ?? '').trim(),
    trailer_url: String(payload.trailer_url ?? payload.trailer ?? '').trim(),
    poster: String(payload.poster ?? payload.imagen_url ?? '').trim(),
    duracion: String(payload.duracion ?? '').trim(),
    calificacion: String(payload.calificacion ?? '').trim()
  }
}

const createJsonStorage = () => {
  const readAll = async () => {
    await mkdir(dirname(DATA_FILE), { recursive: true })
    const raw = await readFile(DATA_FILE, 'utf8')
    return JSON.parse(raw).map(normalizeContent)
  }

  const writeAll = async (items) => {
    const normalized = items.map(normalizeContent)
    await writeFile(DATA_FILE, JSON.stringify(normalized.map(toStoredContent), null, 2), 'utf8')
    return normalized
  }

  return {
    driver: 'json',
    async getAll() {
      return readAll()
    },
    async getById(id) {
      const items = await readAll()
      return items.find((item) => item.id === id) ?? null
    },
    async getRecommendations(id) {
      const items = await readAll()
      const current = items.find((item) => item.id === id)
      if (!current) return []
      return items
        .filter((item) => item.id !== id && item.genero.toLowerCase() === current.genero.toLowerCase())
        .slice(0, 6)
    },
    async create(payload) {
      const items = await readAll()
      const nextId = items.reduce((max, item) => Math.max(max, item.id), 0) + 1
      const created = normalizeContent({ id: nextId, ...cleanPayload(payload), reproducciones: 0 })
      await writeAll([...items, created])
      return created
    },
    async update(id, payload) {
      const items = await readAll()
      const index = items.findIndex((item) => item.id === id)
      if (index === -1) return null

      const updated = normalizeContent({
        ...items[index],
        ...cleanPayload({ ...items[index], ...payload }),
        reproducciones: Number(payload.reproducciones ?? items[index].reproducciones)
      })
      items[index] = updated
      await writeAll(items)
      return updated
    },
    async remove(id) {
      const items = await readAll()
      const filtered = items.filter((item) => item.id !== id)
      if (filtered.length === items.length) return false
      await writeAll(filtered)
      return true
    },
    async recordPlayback(id) {
      const items = await readAll()
      const index = items.findIndex((item) => item.id === id)
      if (index === -1) return null
      items[index] = normalizeContent({
        ...items[index],
        reproducciones: items[index].reproducciones + 1
      })
      await writeAll(items)
      return items[index]
    },
    async stats() {
      const items = await readAll()
      const totalReproducciones = items.reduce((total, item) => total + item.reproducciones, 0)
      const masVistos = [...items]
        .sort((a, b) => b.reproducciones - a.reproducciones)
        .map(({ id, titulo, tipo, genero, reproducciones }) => ({ id, titulo, tipo, genero, reproducciones }))

      return {
        total_contenidos: items.length,
        total_reproducciones: totalReproducciones,
        promedio_reproducciones: items.length ? Math.round(totalReproducciones / items.length) : 0,
        contenido_mas_visto: masVistos[0] ?? null,
        mas_vistos: masVistos
      }
    }
  }
}

const createMysqlStorage = async () => {
  if (process.env.CONTENT_STORAGE !== 'mysql') return null

  try {
    const mysql = await import('mysql2/promise')
    const pool = mysql.createPool({
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 3307),
      user: process.env.DB_USER ?? 'root',
      password: process.env.DB_PASSWORD ?? '',
      database: process.env.DB_NAME ?? 'StreamingDB_Content',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    })

    await pool.query('SELECT 1')

    const fields = 'id_contenido, titulo, tipo, genero, anio, director, autor, temporadas, reparto, sinopsis, trailer_url, poster, duracion, calificacion, reproducciones'

    return {
      driver: 'mysql',
      async getAll() {
        const [rows] = await pool.query(`SELECT ${fields} FROM Contenido ORDER BY fecha_creacion DESC, id_contenido DESC`)
        return rows.map(normalizeContent)
      },
      async getById(id) {
        const [rows] = await pool.query(`SELECT ${fields} FROM Contenido WHERE id_contenido = ?`, [id])
        return rows[0] ? normalizeContent(rows[0]) : null
      },
      async getRecommendations(id) {
        const current = await this.getById(id)
        if (!current) return []
        const [rows] = await pool.query(
          `SELECT ${fields} FROM Contenido WHERE id_contenido <> ? AND LOWER(genero) = LOWER(?) ORDER BY reproducciones DESC LIMIT 6`,
          [id, current.genero]
        )
        return rows.map(normalizeContent)
      },
      async create(payload) {
        const data = cleanPayload(payload)
        const [result] = await pool.execute(
          `INSERT INTO Contenido
            (titulo, tipo, genero, anio, director, autor, temporadas, reparto, sinopsis, trailer_url, poster, duracion, calificacion)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            data.titulo,
            data.tipo,
            data.genero,
            data.anio,
            data.director,
            data.autor,
            data.temporadas,
            JSON.stringify(data.reparto),
            data.sinopsis,
            data.trailer_url,
            data.poster,
            data.duracion,
            data.calificacion
          ]
        )
        return this.getById(result.insertId)
      },
      async update(id, payload) {
        const current = await this.getById(id)
        if (!current) return null
        const data = cleanPayload({ ...current, ...payload })
        await pool.execute(
          `UPDATE Contenido
           SET titulo = ?, tipo = ?, genero = ?, anio = ?, director = ?, autor = ?, temporadas = ?,
               reparto = ?, sinopsis = ?, trailer_url = ?, poster = ?, duracion = ?, calificacion = ?
           WHERE id_contenido = ?`,
          [
            data.titulo,
            data.tipo,
            data.genero,
            data.anio,
            data.director,
            data.autor,
            data.temporadas,
            JSON.stringify(data.reparto),
            data.sinopsis,
            data.trailer_url,
            data.poster,
            data.duracion,
            data.calificacion,
            id
          ]
        )
        return this.getById(id)
      },
      async remove(id) {
        const [result] = await pool.execute('DELETE FROM Contenido WHERE id_contenido = ?', [id])
        return result.affectedRows > 0
      },
      async recordPlayback(id) {
        await pool.execute('UPDATE Contenido SET reproducciones = reproducciones + 1 WHERE id_contenido = ?', [id])
        await pool.execute('INSERT INTO Reproduccion (id_contenido) VALUES (?)', [id])
        return this.getById(id)
      },
      async stats() {
        const [rows] = await pool.query(`SELECT ${fields} FROM Contenido ORDER BY reproducciones DESC`)
        const items = rows.map(normalizeContent)
        const totalReproducciones = items.reduce((total, item) => total + item.reproducciones, 0)
        const masVistos = items.map(({ id, titulo, tipo, genero, reproducciones }) => ({ id, titulo, tipo, genero, reproducciones }))

        return {
          total_contenidos: items.length,
          total_reproducciones: totalReproducciones,
          promedio_reproducciones: items.length ? Math.round(totalReproducciones / items.length) : 0,
          contenido_mas_visto: masVistos[0] ?? null,
          mas_vistos: masVistos
        }
      }
    }
  } catch (error) {
    console.warn(`[content-service] No se pudo iniciar MySQL, usando JSON local: ${error.message}`)
    return null
  }
}

const routeRequest = async (req, res, storage) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, jsonHeaders)
    res.end()
    return
  }

  const url = new URL(req.url, `http://${req.headers.host}`)
  const path = url.pathname.replace(/\/+$/, '') || '/'
  const segments = path.split('/').filter(Boolean)

  if (req.method === 'GET' && (path === '/health' || path === '/api/health')) {
    sendJson(res, 200, { ok: true, service: 'locotos-content-admin-service', port: PORT, storage: storage.driver })
    return
  }

  if (req.method === 'GET' && (path === '/api/catalog' || path === '/api/content')) {
    sendJson(res, 200, await storage.getAll())
    return
  }

  if (req.method === 'POST' && path === '/api/content') {
    sendJson(res, 201, await storage.create(await readBody(req)))
    return
  }

  if (req.method === 'GET' && (path === '/api/admin/stats' || path === '/api/stats')) {
    sendJson(res, 200, await storage.stats())
    return
  }

  if (segments[0] === 'api' && segments[1] === 'content' && segments[2]) {
    const id = Number(segments[2])
    if (!Number.isInteger(id) || id <= 0) {
      sendJson(res, 400, { error: 'ID de contenido invalido.' })
      return
    }

    if (req.method === 'GET' && segments.length === 3) {
      const content = await storage.getById(id)
      sendJson(res, content ? 200 : 404, content ?? { error: 'Contenido no encontrado.' })
      return
    }

    if (req.method === 'GET' && segments[3] === 'recommendations') {
      sendJson(res, 200, await storage.getRecommendations(id))
      return
    }

    if (req.method === 'POST' && segments[3] === 'play') {
      const content = await storage.recordPlayback(id)
      sendJson(res, content ? 200 : 404, content ?? { error: 'Contenido no encontrado.' })
      return
    }

    if ((req.method === 'PUT' || req.method === 'PATCH') && segments.length === 3) {
      const content = await storage.update(id, await readBody(req))
      sendJson(res, content ? 200 : 404, content ?? { error: 'Contenido no encontrado.' })
      return
    }

    if (req.method === 'DELETE' && segments.length === 3) {
      const removed = await storage.remove(id)
      sendJson(res, removed ? 200 : 404, removed ? { ok: true } : { error: 'Contenido no encontrado.' })
      return
    }
  }

  sendJson(res, 404, { error: 'Ruta no encontrada.' })
}

const storage = (await createMysqlStorage()) ?? createJsonStorage()

const server = createServer(async (req, res) => {
  try {
    await routeRequest(req, res, storage)
  } catch (error) {
    console.error('[content-service]', error)
    sendJson(res, error.statusCode ?? 500, { error: error.message ?? 'Error interno del modulo de contenido.' })
  }
})

server.listen(PORT, () => {
  console.log(`LOCOTOS Content/Admin listo en http://localhost:${PORT} usando ${storage.driver}`)
})
