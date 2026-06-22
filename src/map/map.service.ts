import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PointOfInterest } from './entities/point-of-interest.entity';
import { Event } from './entities/event.entity';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { QueryNearbyDto } from './dto/query-nearby.dto';
import { QueryBoundsDto } from './dto/query-bounds.dto';
import { PointResponseDto } from './dto/point-response.dto';
import { SpatialPoint } from './interfaces/spatial-result.interface';

interface SpatialRow {
  id: string;
  name: string;
  description: string | null;
  lng: string;
  lat: string;
  address: string | null;
  phone: string | null;
  capacity: number | null;
  type: string;
  is_verified: boolean;
  poster: string | null;
  distance: string | null;
  music_genres: unknown;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class MapService {
  constructor(
    @InjectRepository(PointOfInterest)
    private readonly pointRepo: Repository<PointOfInterest>,
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreatePointDto): Promise<PointResponseDto> {
    const point = this.pointRepo.create({
      name: dto.name,
      description: dto.description,
      location: {
        type: 'Point',
        coordinates: [dto.lng, dto.lat],
      },
      address: dto.address,
      phone: dto.phone,
      capacity: dto.capacity,
      type: dto.type,
      isVerified: dto.isVerified ?? false,
    });

    const saved = await this.pointRepo.save(point);
    return this.toResponseDto(saved);
  }

  async findAll(): Promise<PointResponseDto[]> {
    const points = await this.pointRepo.find({ order: { createdAt: 'DESC' } });
    return points.map((p) => this.toResponseDto(p));
  }

  async findOne(id: string): Promise<PointResponseDto> {
    const point = await this.pointRepo.findOne({
      where: { id },
      relations: { schedules: true, events: true, reviews: true },
    });
    if (!point) throw new NotFoundException(`Point ${id} not found`);
    return this.toResponseDto(point);
  }

  async update(id: string, dto: UpdatePointDto): Promise<PointResponseDto> {
    const point = await this.pointRepo.findOneBy({ id });
    if (!point) throw new NotFoundException(`Point ${id} not found`);

    if (dto.name !== undefined) point.name = dto.name;
    if (dto.description !== undefined) point.description = dto.description;
    if (dto.lat !== undefined && dto.lng !== undefined) {
      point.location = {
        type: 'Point',
        coordinates: [dto.lng, dto.lat],
      };
    }
    if (dto.address !== undefined) point.address = dto.address;
    if (dto.phone !== undefined) point.phone = dto.phone;
    if (dto.capacity !== undefined) point.capacity = dto.capacity;
    if (dto.type !== undefined) point.type = dto.type;
    if (dto.isVerified !== undefined) point.isVerified = dto.isVerified;

    const saved = await this.pointRepo.save(point);
    return this.toResponseDto(saved);
  }

  async remove(id: string): Promise<void> {
    const result = await this.pointRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Point ${id} not found`);
  }

  async findNearby(query: QueryNearbyDto): Promise<SpatialPoint[]> {
    const { lat, lng, radius } = query;

    const rows: SpatialRow[] = await this.dataSource.query(
      `
        SELECT
          poi.id, poi.name, poi.description,
          ST_X(poi.location::geometry) AS lng,
          ST_Y(poi.location::geometry) AS lat,
          poi.address, poi.phone, poi.capacity, poi.type, poi.is_verified, poi.poster,
          ST_Distance(poi.location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) AS distance,
          poi.created_at, poi.updated_at,
          COALESCE(ARRAY_AGG(DISTINCT e.music_genre) FILTER (WHERE e.music_genre IS NOT NULL), '{}') AS music_genres
        FROM points_of_interest poi
        LEFT JOIN events e ON e.point_id = poi.id
        WHERE ST_DWithin(poi.location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3)
        GROUP BY poi.id
        ORDER BY distance ASC
      `,
      [lng, lat, radius],
    );

    return rows.map((row) => this.toSpatialDto(row));
  }

  async findByBounds(query: QueryBoundsDto): Promise<SpatialPoint[]> {
    const { neLat, neLng, swLat, swLng } = query;

    const rows: SpatialRow[] = await this.dataSource.query(
      `
        SELECT
          poi.id, poi.name, poi.description,
          ST_X(poi.location::geometry) AS lng,
          ST_Y(poi.location::geometry) AS lat,
          poi.address, poi.phone, poi.capacity, poi.type, poi.is_verified, poi.poster,
          poi.created_at, poi.updated_at,
          COALESCE(ARRAY_AGG(DISTINCT e.music_genre) FILTER (WHERE e.music_genre IS NOT NULL), '{}') AS music_genres
        FROM points_of_interest poi
        LEFT JOIN events e ON e.point_id = poi.id
        WHERE poi.location && ST_SetSRID(ST_MakeEnvelope($1, $2, $3, $4), 4326)
        GROUP BY poi.id
      `,
      [swLng, swLat, neLng, neLat],
    );

    return rows.map((row) => this.toSpatialDto(row));
  }

  async createEvent(dto: CreateEventDto) {
    const point = await this.pointRepo.findOneBy({ id: dto.pointId });
    if (!point) throw new NotFoundException(`Point ${dto.pointId} not found`);
    const event = this.eventRepo.create(dto);
    return this.eventRepo.save(event);
  }

  async findAllEvents() {
    return this.eventRepo.find({
      order: { date: 'DESC' },
      relations: { point: true },
    });
  }

  async findEventsByPoint(pointId: string) {
    return this.eventRepo.find({
      where: { pointId },
      order: { date: 'DESC' },
    });
  }

  async removeEvent(id: string) {
    const result = await this.eventRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Event ${id} not found`);
  }

  private toResponseDto(point: PointOfInterest): PointResponseDto {
    const coords = point.location?.coordinates ?? [0, 0];
    return {
      id: point.id,
      name: point.name,
      description: point.description,
      lat: coords[1],
      lng: coords[0],
      address: point.address,
      phone: point.phone,
      capacity: point.capacity,
      type: point.type,
      isVerified: point.isVerified,
      poster: point.poster ?? null,
      createdAt: point.createdAt,
      updatedAt: point.updatedAt,
    };
  }

  private toSpatialDto(row: SpatialRow): SpatialPoint {
    const raw = row.music_genres;
    const musicGenres: string[] =
      Array.isArray(raw) ? raw :
      typeof raw === 'string' && raw !== '{}'
        ? raw.slice(1, -1).split(',').filter(Boolean)
        : [];
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      lat: parseFloat(row.lat),
      lng: parseFloat(row.lng),
      address: row.address,
      phone: row.phone,
      capacity: row.capacity,
      type: row.type,
      isVerified: row.is_verified,
      poster: row.poster ?? null,
      musicGenres,
      distance: row.distance ? parseFloat(row.distance) : undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
