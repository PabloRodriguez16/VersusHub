import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Team } from '../teamEntities/team.entity';
import { Tournament } from './tournament.entity';
import { teamStatusOnTournament } from 'src/enum/team.enum';
import { TournamentParticipation } from './tournamentParticipation.entity';

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

  @ManyToOne(() => Tournament, (tournament) => tournament.id)
  tournament: Tournament;

  @OneToOne(() => Team)
  @JoinColumn({ name: 'team' })
  team: Team;

  @OneToMany(
    () => TournamentParticipation,
    (participation) => participation.team,
  )
  participations: TournamentParticipation[];
}
