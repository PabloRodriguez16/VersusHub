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

@Entity({ name: 'tournament_participation' })
export class TournamentParticipation {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'enum', enum: RoleOnTournament })
  role: RoleOnTournament;

  @ManyToOne(() => Tournament, (tournament) => tournament.participations)
  @JoinColumn({ name: 'tournament_id' })
  tournament: Tournament;

  @OneToOne(() => User)
  user: User;
}
