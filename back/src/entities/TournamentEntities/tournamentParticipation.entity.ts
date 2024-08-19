import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Tournament } from './tournament.entity';
import { User } from '../usersEntities/user.entity';
import { RoleOnTournament } from 'src/enum/user.enums';
import { TournamentTeams } from './tournamentTeams.entity';

@Entity({ name: 'tournament_participation' })
export class TournamentParticipation {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'enum', enum: RoleOnTournament })
  role: RoleOnTournament;

  @Column({ type: 'boolean', default: false })
  isReady: boolean;

  @ManyToOne(() => Tournament, (tournament) => tournament.participations)
  @JoinColumn({ name: 'tournament_id' })
  tournament: Tournament;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => TournamentTeams, (team) => team.participations)
  @JoinColumn({ name: 'team_id' })
  team: TournamentTeams;
}
