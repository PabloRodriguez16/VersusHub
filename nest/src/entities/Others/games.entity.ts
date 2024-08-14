import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { UserWins } from '../usersEntities/userWins.entity';
import { TeamWins } from '../teamEntities/teamWins.entity';

@Entity({ name: 'games' })
export class Games {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'varchar', unique: true, nullable: false })
  name: string;

  @OneToMany(() => UserWins, (userWins) => userWins.game)
  userWins: UserWins[];

  @OneToMany(() => TeamWins, (teamWins) => teamWins.game)
  teamWins: TeamWins[];
}
