# Guia HU-9 y HU-19 - Mauri

Este cambio cubre solo:

- HU-9: vista de detalles de contenido y recomendaciones del mismo genero.
- HU-19: estadisticas de reproduccion para administracion.
- CRUD de administracion de contenido.
- Cambio del servicio de contenido de `localhost:3001` a `localhost:3006`.

## Que se agrego

Backend independiente:

- `locotos-content-admin-service`
- Corre en `http://localhost:3006`
- No depende de auth, favoritos, notificaciones ni suscripciones.
- Por defecto usa `data/content.json`.
- Si se quiere MySQL, incluye `database/01_content_admin.sql`.

Frontend:

- `/details/:id`: detalle del contenido con sinopsis, reparto, anio, director/autor, temporadas y trailer.
- `/watch/:contentId`: reproductor y registro de reproduccion.
- `/admin/content`: CRUD de contenido y dashboard de estadisticas.

`/details/:id`, `/watch/:contentId` y `/admin/content` se pueden abrir directo para pruebas del modulo aunque auth u otros servicios no esten levantados.

## Arranque rapido sin base de datos

Terminal 1:

```bash
cd locotos-content-admin-service
npm install
npm start
```

Debe quedar en:

```txt
http://localhost:3006
```

Terminal 2:

```bash
npm install
npm run dev
```

Rutas para probar:

- `http://localhost:5173/catalog`
- `http://localhost:5173/details/1`
- `http://localhost:5173/watch/1`
- `http://localhost:5173/admin/content`

Nota: si el frontend se levanta en otro puerto, usar ese puerto en lugar de `5173`.

## Arranque con MySQL opcional

1. Crear la BD ejecutando:

```txt
locotos-content-admin-service/database/01_content_admin.sql
```

2. Levantar el backend con variables:

```bash
cd locotos-content-admin-service
set CONTENT_STORAGE=mysql
set DB_HOST=localhost
set DB_PORT=3307
set DB_USER=root
set DB_PASSWORD=tu_password
set DB_NAME=StreamingDB_Content
npm start
```

Si MySQL falla o no esta disponible, se puede volver al modo JSON quitando `CONTENT_STORAGE=mysql`.

## Endpoints del modulo

- `GET http://localhost:3006/api/catalog`
- `GET http://localhost:3006/api/content/:id`
- `GET http://localhost:3006/api/content/:id/recommendations`
- `POST http://localhost:3006/api/content/:id/play`
- `GET http://localhost:3006/api/admin/stats`
- `POST http://localhost:3006/api/content`
- `PUT http://localhost:3006/api/content/:id`
- `DELETE http://localhost:3006/api/content/:id`

## Archivos tocados

Frontend:

- `src/App.jsx`
- `src/services/contentService.js`
- `src/pages/catalog/CatalogPage.jsx`
- `src/pages/catalog/CatalogPage.css`
- `src/pages/details/DetailsPage.jsx`
- `src/pages/details/DetailsPage.css`
- `src/pages/watch/WatchPage.jsx`
- `src/pages/mylist/MyListPage.jsx`
- `src/pages/admin/AdminContentPage.jsx`
- `src/pages/admin/AdminContentPage.css`

Backend nuevo:

- `locotos-content-admin-service/package.json`
- `locotos-content-admin-service/server.js`
- `locotos-content-admin-service/data/content.json`
- `locotos-content-admin-service/database/01_content_admin.sql`
- `locotos-content-admin-service/README.md`

Documentacion:

- `README-HU9-HU19.md`

## Para pasar en ZIP/RAR

Incluir la raiz completa del proyecto para que viajen juntos:

- El frontend actual.
- `locotos-content-admin-service`.
- Este archivo `README-HU9-HU19.md`.

La carpeta `scripts-StreamingBD` no estaba presente en este workspace. Por eso el script SQL de estas historias queda dentro del modulo nuevo, en `database/01_content_admin.sql`.
