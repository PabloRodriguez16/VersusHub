import { onTopTeam } from 'src/enum/team.enum';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { User } from '../usersEntities/user.entity';
import { TeamWins } from './teamWins.entity';

@Entity({ name: 'team' })
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'varchar', unique: true, nullable: false })
  name: string;

  @Column({
    type: 'varchar',
    default:
      'http://res.cloudinary.com/dacebahmf/image/upload/v1723706326/xw8ifmowdwkxfcwic7lk.png',
  })
  picture?: string;

  @Column({ type: 'enum', default: onTopTeam.NODATA, enum: onTopTeam })
  onTopTeam: onTopTeam;

  @OneToMany(() => TeamWins, (teamWins) => teamWins.team)
  teamWins: TeamWins[];

  @OneToMany(() => User, (user) => user.team)
  users: User[];

  @OneToOne(() => User, (user) => user.isCaptain)
  @JoinColumn({ name: 'captain' })
  captain: User;
}
