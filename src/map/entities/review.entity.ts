import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { PointOfInterest } from './point-of-interest.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'point_id', type: 'uuid' })
  pointId: string;

  @Column({ type: 'int' })
  rating: number;

  @Column({ length: 255, nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'helpful_votes', type: 'int', default: 0 })
  helpfulVotes: number;

  @Column({ name: 'verified_by_attendance', default: false })
  verifiedByAttendance: boolean;

  @ManyToOne(() => PointOfInterest, (point) => point.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'point_id' })
  point: PointOfInterest;
}
