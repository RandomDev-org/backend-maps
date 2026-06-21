# backend-maps

Microservicio de mapa y locales para la plataforma **MusicSpot**. Gestiona puntos de interés musical con queries espaciales via **PostgreSQL + PostGIS**, y se comunica con el API Gateway NestJS mediante **transporte TCP**.

## Arquitectura

```
React App → (HTTPS/JSON) → API Gateway NestJS → (TCP) → backend-maps
```

## Stack

| Tecnología | Versión |
|---|---|
| NestJS | 11 |
| TypeORM | 1.0 |
| PostgreSQL + PostGIS | — |
| Transporte | TCP |

## Configuración

Crear un archivo `.env` en la raíz basado en `.env.example`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=locations

TCP_HOST=0.0.0.0
TCP_PORT=3001

NODE_ENV=development
```

## Instalación

```bash
pnpm install
```

## Ejecución

```bash
# desarrollo con watch
pnpm run start:dev

# producción
pnpm run start:prod
```

## Endpoints TCP

El microservicio expone los siguientes patrones de mensaje para el API Gateway:

| Pattern | Descripción | Payload |
|---|---|---|
| `map.create` | Crear punto de interés | `CreatePointDto` |
| `map.findAll` | Listar todos los puntos | — |
| `map.findOne` | Obtener punto con relaciones | `{ id }` |
| `map.update` | Actualizar punto | `{ id, dto }` |
| `map.remove` | Eliminar punto | `{ id }` |
| `map.findNearby` | Puntos en un radio (metros) | `{ lat, lng, radius }` |
| `map.findByBounds` | Puntos dentro de un viewport | `{ neLat, neLng, swLat, swLng }` |

## Modelo de datos

### points_of_interest

Entidad principal con geometría PostGIS (`GEOGRAPHY(Point, 4326)`) e índice GIST.

| Columna | Tipo | Descripción |
|---|---|---|
| id | UUID | PK |
| name | VARCHAR(255) | Nombre del local |
| description | TEXT | Descripción |
| location | GEOGRAPHY(Point, 4326) | Coordenadas geográficas |
| address | VARCHAR(500) | Dirección |
| phone | VARCHAR(50) | Teléfono |
| capacity | INT | Capacidad máxima |
| type | VARCHAR(50) | Bar, Sala de Conciertos, Plaza, etc. |
| is_verified | BOOLEAN | Verificado por el equipo |
| created_by | UUID | ID del usuario creador |
| created_at | TIMESTAMPTZ | Fecha de creación |
| updated_at | TIMESTAMPTZ | Última actualización |

### Entidades relacionadas

- **schedules** — Horarios por día de la semana
- **events** — Eventos musicales en un punto
- **reviews** — Reseñas de usuarios (rating 1–5)
- **verifications** — Solicitudes de verificación de locales
- **attendances** — Confirmaciones de asistencia a eventos
- **categories** — Clasificación de tipos de espacio

## Queries espaciales

- `ST_DWithin` — Búsqueda por radio en metros con orden por distancia
- `&&` + `ST_MakeEnvelope` — Búsqueda por viewport (cámara del mapa)

## Validación

Los DTOs usan `class-validator` con:

- Coordenadas: `@IsLatitude()` / `@IsLongitude()`
- Capacidad: `@Min(1)`
- Tipo: `@IsIn([...tipos válidos])`
- Pipe global con `whitelist` y `forbidNonWhitelisted`

## Tests

```bash
# tests unitarios
pnpm run test

# tests e2e
pnpm run test:e2e

# cobertura
pnpm run test:cov
```

## Proyecto base

Plataforma colaborativa que conecta a músicos, productores, público y dueños de locales a través de un mapa interactivo de espacios musicales.

