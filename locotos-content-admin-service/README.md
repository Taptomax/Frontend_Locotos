# LOCOTOS Content/Admin Service

Modulo independiente para:

- HU-9: detalles de contenido y recomendaciones del mismo genero.
- HU-19: estadisticas de reproduccion para administracion.
- CRUD de administracion de contenido.

Por defecto corre en `http://localhost:3006` y usa `data/content.json`, asi no depende de auth, favoritos, notificaciones, suscripciones ni MySQL.

## Arranque rapido

```bash
cd locotos-content-admin-service
npm install
npm start
```

Endpoints principales:

- `GET /api/catalog`
- `GET /api/content/:id`
- `GET /api/content/:id/recommendations`
- `POST /api/content/:id/play`
- `GET /api/admin/stats`
- `POST /api/content`
- `PUT /api/content/:id`
- `DELETE /api/content/:id`

## Opcion con MySQL

1. Ejecutar `database/01_content_admin.sql` en MySQL.
2. Configurar variables:

```bash
set CONTENT_STORAGE=mysql
set DB_HOST=localhost
set DB_PORT=3307
set DB_USER=root
set DB_PASSWORD=tu_password
set DB_NAME=StreamingDB_Content
npm start
```

Si MySQL no esta disponible, el servicio vuelve a JSON local para que el modulo siga levantando.
