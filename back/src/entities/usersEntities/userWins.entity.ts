import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { User } from './user.entity';
import { Games } from '../Others/games.entity';

@Entity({ name: 'user_wins' })
export class UserWins {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @ManyToOne(() => User, (user) => user.userWins)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Games, (games) => games.userWins)
  @JoinColumn({ name: 'game_id' })
  game: Games;
}
