import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { User } from './user.entity';

@Entity({ name: 'organizer_reputation' })
export class OrganizerReputation {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'int', default: 0 })
  likes: number = 0;

  @Column({ type: 'int', default: 0 })
  dislikes: number = 0;

  @OneToOne(() => User, (user) => user.organizerReputation)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
