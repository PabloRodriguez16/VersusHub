import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { UserWins } from '../usersEntities/userWins.entity';
import { TeamWins } from '../teamEntities/teamWins.entity';
import { Tournament } from '../TournamentEntities/tournament.entity';

@Entity({ name: 'games' })
export class Games {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'varchar', unique: true, nullable: false })
  name: string;

  @ManyToMany(() => UserWins, (userWins) => userWins.game)
  userWins: UserWins[];

  @OneToMany(() => TeamWins, (teamWins) => teamWins.game)
  teamWins: TeamWins[];

  @OneToMany(() => Tournament, (tournament) => tournament.game)
  tournaments: Tournament[];
}
