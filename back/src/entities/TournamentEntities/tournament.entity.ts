import { tournamentStatus, tournamentType } from 'src/enum/tournament.enum';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { User } from '../usersEntities/user.entity';
import { TournamentTeams } from './tournamentTeams.entity';
import { TournamentParticipation } from './tournamentParticipation.entity';
import { Matches } from './matches.entity';

@Entity({ name: 'tournaments' })
export class Tournament {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'varchar', length: 55 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({
    type: 'enum',
    default: tournamentStatus.PENDING,
    enum: tournamentStatus,
  })
  status: tournamentStatus;

  @Column({
    type: 'enum',
    enum: tournamentType,
    default: tournamentType.MEDIUM,
  })
  type: tournamentType;

  @ManyToOne(() => User, (user) => user.tournaments)
  organizer: User;

  @OneToMany(
    () => TournamentTeams,
    (tournamentTeams) => tournamentTeams.tournament,
  )
  tournamentTeams: TournamentTeams[];

  @OneToMany(
    () => TournamentParticipation,
    (participation) => participation.tournament,
  )
  participations: TournamentParticipation[];

  @OneToMany(() => Matches, (matches) => matches.tournament)
  matches: Matches[];
}
