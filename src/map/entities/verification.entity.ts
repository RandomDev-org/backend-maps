import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PointOfInterest } from './point-of-interest.entity';

export type VerificationStatus = 'Pending' | 'Verified' | 'Rejected';

@Entity('verifications')
export class Verification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'point_id', type: 'uuid' })
  pointId: string;

  @Column({ name: 'owner_id', type: 'uuid', nullable: true })
  ownerId: string;

  @Column({ length: 20, default: 'Pending' })
  status: VerificationStatus;

  @Column({ name: 'attached_docs', type: 'jsonb', nullable: true })
  attachedDocs: string[];

  @Column({ name: 'requested_at', type: 'timestamptz', default: () => 'NOW()' })
  requestedAt: Date;

  @Column({ name: 'resolved_at', type: 'timestamptz', nullable: true })
  resolvedAt: Date;

  @Column({ name: 'admin_comment', type: 'text', nullable: true })
  adminComment: string;

  @ManyToOne(() => PointOfInterest, (point) => point.verifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'point_id' })
  point: PointOfInterest;
}
