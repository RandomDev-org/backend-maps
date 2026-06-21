import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PointOfInterest } from './point-of-interest.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'point_id', type: 'uuid' })
  pointId: string;

  @Column({ name: 'day_of_week', length: 15 })
  dayOfWeek: string;

  @Column({ name: 'opening_time', type: 'time' })
  openingTime: string;

  @Column({ name: 'closing_time', type: 'time' })
  closingTime: string;

  @Column({ name: 'has_live_music', default: false })
  hasLiveMusic: boolean;

  @Column({ name: 'genres', type: 'jsonb', nullable: true })
  genres: string[];

  @ManyToOne(() => PointOfInterest, (point) => point.schedules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'point_id' })
  point: PointOfInterest;
}
