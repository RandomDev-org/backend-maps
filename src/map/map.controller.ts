import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MapService } from './map.service';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { QueryNearbyDto } from './dto/query-nearby.dto';
import { QueryBoundsDto } from './dto/query-bounds.dto';

@Controller()
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @MessagePattern({ cmd: 'map.create' })
  create(@Payload() dto: CreatePointDto) {
    return this.mapService.create(dto);
  }

  @MessagePattern({ cmd: 'map.findAll' })
  findAll() {
    return this.mapService.findAll();
  }

  @MessagePattern({ cmd: 'map.findOne' })
  findOne(@Payload() { id }: { id: string }) {
    return this.mapService.findOne(id);
  }

  @MessagePattern({ cmd: 'map.update' })
  update(@Payload() payload: { id: string; dto: UpdatePointDto }) {
    return this.mapService.update(payload.id, payload.dto);
  }

  @MessagePattern({ cmd: 'map.remove' })
  remove(@Payload() { id }: { id: string }) {
    return this.mapService.remove(id);
  }

  @MessagePattern({ cmd: 'map.findNearby' })
  findNearby(@Payload() query: QueryNearbyDto) {
    return this.mapService.findNearby(query);
  }

  @MessagePattern({ cmd: 'map.findByBounds' })
  findByBounds(@Payload() query: QueryBoundsDto) {
    return this.mapService.findByBounds(query);
  }

  @MessagePattern({ cmd: 'event.create' })
  createEvent(@Payload() dto: CreateEventDto) {
    return this.mapService.createEvent(dto);
  }

  @MessagePattern({ cmd: 'event.findAll' })
  findAllEvents() {
    return this.mapService.findAllEvents();
  }

  @MessagePattern({ cmd: 'event.findByPoint' })
  findEventsByPoint(@Payload() { pointId }: { pointId: string }) {
    return this.mapService.findEventsByPoint(pointId);
  }

  @MessagePattern({ cmd: 'event.remove' })
  removeEvent(@Payload() { id }: { id: string }) {
    return this.mapService.removeEvent(id);
  }
}
