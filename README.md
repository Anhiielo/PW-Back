# PeKeys Store — Backend API

API REST para la tienda de videojuegos PeKeys, construida con **Node.js + Express**. Repositorio independiente que se conecta al frontend vía HTTP con CORS configurado.

## Tecnologías

- **Runtime:** Node.js (ESModules)
- **Framework:** Express 4
- **Datos:** Mock data en memoria (arrays/objetos — sin base de datos)
- **CORS:** Habilitado explícitamente para el frontend en `http://localhost:5173`

## Estructura del proyecto

```
PW-Back/
├── src/
│   ├── index.js                  # Servidor Express, CORS y registro de rutas
│   ├── controllers/
│   │   └── gamesController.js    # Lógica de todos los endpoints
│   ├── routes/
│   │   ├── games.js              # GET/POST/PUT/DELETE /api/games
│   │   ├── auth.js               # POST /api/auth/login
│   │   └── checkout.js           # POST /api/checkout
│   └── data/
│       └── mockData.js           # 12 juegos + 2 usuarios en memoria
├── .env.example
├── .gitignore
└── package.json
```

## Instalación y uso

```bash
# 1. Instalar dependencias
npm install

# 2. Crear archivo de entorno
cp .env.example .env

# 3. Iniciar el servidor en modo desarrollo (con hot-reload)
npm run dev

# El servidor queda disponible en:
# http://localhost:3000
```

## Variables de entorno

Copia `.env.example` a `.env` y ajusta si es necesario:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
```

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/health` | Health check del servidor |
| `GET` | `/api/games` | Lista juegos. Query params: `platform`, `category`, `search`, `minPrice`, `maxPrice` |
| `GET` | `/api/games/:id` | Detalle de un juego por ID |
| `POST` | `/api/games` | Crear nuevo juego |
| `PUT` | `/api/games/:id` | Editar un juego |
| `DELETE` | `/api/games/:id` | Eliminar un juego |
| `POST` | `/api/auth/login` | Login → `{ email, password }` |
| `POST` | `/api/checkout` | Procesar compra y generar product keys |

## Usuarios de prueba (mock)

| Email | Contraseña | Rol |
|-------|-----------|-----|
| admin@pekeys.com | admin123 | admin |
| usuario1@pekeys.com | pass123 | user |

## Notas

- Los datos persisten **en memoria** mientras el servidor esté corriendo. Al reiniciar, vuelven al estado inicial definido en `src/data/mockData.js`.
- Este repositorio es completamente independiente del frontend. No comparte carpetas ni dependencias.
- Para conectar con el frontend, asegúrate de que `FRONTEND_URL` en `.env` coincida con la URL donde corre el frontend de Vite.