import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Schedule } from './schedule.entity';
import { Event } from './event.entity';
import { Review } from './review.entity';
import { Verification } from './verification.entity';

@Entity('points_of_interest')
export class PointOfInterest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: false,
  })
  location: { type: 'Point'; coordinates: [number, number] };

  @Column({ length: 500, nullable: true })
  address: string;

  @Column({ length: 50, nullable: true })
  phone: string;

  @Column({ type: 'int', nullable: true })
  capacity: number;

  @Column({ length: 50 })
  type: string;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy: string;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ type: 'text', nullable: true })
  poster: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Schedule, (schedule) => schedule.point)
  schedules: Schedule[];

  @OneToMany(() => Event, (event) => event.point)
  events: Event[];

  @OneToMany(() => Review, (review) => review.point)
  reviews: Review[];

  @OneToMany(() => Verification, (verification) => verification.point)
  verifications: Verification[];
}
