import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { PointOfInterest } from './point-of-interest.entity';
import { Attendance } from './attendance.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'point_id', type: 'uuid' })
  pointId: string;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @Column({ name: 'end_time', type: 'time', nullable: true })
  endTime: string;

  @Column({ name: 'music_genre', length: 100, nullable: true })
  musicGenre: string;

  @Column({ name: 'artists', type: 'jsonb', nullable: true })
  artists: string[];

  @Column({ name: 'is_free', default: false })
  isFree: boolean;

  @Column({
    name: 'ticket_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  ticketPrice: number;

  @Column({ name: 'available_capacity', type: 'int', nullable: true })
  availableCapacity: number;

  @Column({ type: 'text', nullable: true })
  poster: string;

  @Column({ default: false })
  confirmed: boolean;

  @ManyToOne(() => PointOfInterest, (point) => point.events, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'point_id' })
  point: PointOfInterest;

  @OneToMany(() => Attendance, (attendance) => attendance.event)
  attendances: Attendance[];
}
