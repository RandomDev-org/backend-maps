# Maps Microservice

## Purpose
Manages points of interest (POIs) with geospatial queries using PostGIS.

## Capabilities

### Points of Interest (POIs)
- Entity: `PointOfInterest` with UUID PK, name, description, address, phone, capacity, type, is_verified
- Spatial: `location` column as PostGIS geography(Point, 4326)
- CRUD via TCP handlers: `map.create`, `map.findAll`, `map.findOne`, `map.update`, `map.remove`
- Spatial queries: `map.findByBounds` (viewport rectangle), `map.findNearby` (radius in meters)

### Scheduled Events
- Entity: `Event` with UUID PK, name, description, date, start_time, end_time, music_genre, artists, is_free, ticket_price, available_capacity, poster, confirmed
- Relation: belongs to `PointOfInterest`

### Opening Hours / Schedules
- Entity: `Schedule` with day_of_week, opening_time, closing_time, has_live_music, genres
- Relation: belongs to `PointOfInterest`

### Reviews
- Entity: `Review` with rating, title, content, helpful_votes, verified_by_attendance
- Relation: belongs to `PointOfInterest`

### Attendance
- Entity: `Attendance` linking user to event with confirmation status

### Verifications
- Entity: `Verification` linking user to POI with proof image and status

## Non-Functional Requirements
- TCP transport on port 3001
- PostgreSQL with PostGIS extension
- Database: `locations`
