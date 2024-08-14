import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Team } from '../teamEntities/team.entity';
import { Tournament } from './tournament.entity';
import { teamStatusOnTournament } from 'src/enum/team.enum';

@Entity({ name: 'tournament_teams' })
export class TournamentTeams {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'int', nullable: false })
  numberTeam: number;

  @Column({
    type: 'enum',
    default: teamStatusOnTournament.REGISTERED,
    enum: teamStatusOnTournament,
  })
  status: teamStatusOnTournament;

  @ManyToOne(() => Tournament, (tournament) => tournament.tournamentTeams)
  @JoinColumn({ name: 'tournament_id' })
  tournament: Tournament;

  @OneToOne(() => Team)
  team: Team;
}
