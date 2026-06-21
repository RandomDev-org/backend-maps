import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapController } from './map.controller';
import { MapService } from './map.service';
import { PointOfInterest } from './entities/point-of-interest.entity';
import { Schedule } from './entities/schedule.entity';
import { Event } from './entities/event.entity';
import { Review } from './entities/review.entity';
import { Verification } from './entities/verification.entity';
import { Attendance } from './entities/attendance.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PointOfInterest,
      Schedule,
      Event,
      Review,
      Verification,
      Attendance,
    ]),
  ],
  controllers: [MapController],
  providers: [MapService],
})
export class MapModule {}
