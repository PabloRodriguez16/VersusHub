import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { TournamentTeams } from './tournamentTeams.entity';
import { Tournament } from './tournament.entity';
import { MatchStatus } from 'src/enum/tournament.enum';

@Entity({ name: 'matches' })
export class Matches {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'int' })
  numberOfMatch: number;

  @Column({ type: 'enum', default: MatchStatus.SCHEDULED, enum: MatchStatus })
  status: MatchStatus;

  @OneToOne(() => TournamentTeams)
  teamA: TournamentTeams;

  @OneToOne(() => TournamentTeams)
  teamB: TournamentTeams;

  @OneToOne(() => TournamentTeams)
  winner: TournamentTeams;

  @ManyToOne(() => Tournament, (tournament) => tournament.matches)
  tournament: Tournament;
}
