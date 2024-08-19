import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { v4 as uuid } from 'uuid';

@Entity({ name: 'followers' })
export class Followers {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @ManyToOne(() => User, (user) => user.followers)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, (user) => user.following)
  @JoinColumn({ name: 'following_id' })
  following: User;
}
