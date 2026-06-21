import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Event } from './event.entity';

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'event_id', type: 'uuid' })
  eventId: string;

  @Column({ name: 'confirmed_at', type: 'timestamptz', default: () => 'NOW()' })
  confirmedAt: Date;

  @Column({ name: 'actually_attended', default: false })
  actuallyAttended: boolean;

  @Column({ type: 'int', nullable: true })
  rating: number;

  @ManyToOne(() => Event, (event) => event.attendances, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' })
  event: Event;
}
