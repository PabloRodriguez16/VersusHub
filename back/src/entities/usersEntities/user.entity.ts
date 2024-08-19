import { Role } from 'src/enum/role.enum';
import { onTopSolo, onTopWithTeam, UserStatus } from 'src/enum/user.enums';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Followers } from './followers.entity';
import { UserWins } from './userWins.entity';
import { OrganizerReputation } from './organizerReputation.entity';
import { Team } from '../teamEntities/team.entity';
import { Tournament } from '../TournamentEntities/tournament.entity';
import { Exclude } from 'class-transformer';
import { Notification } from './notification.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  nickname: string;

  @Column({
    type: 'varchar',
    nullable: true,
    default: 'https://www.svgrepo.com/show/105517/user-icon.svg',
  })
  picture?: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({
    nullable: true,
    length: 255,
    type: 'varchar',
    default: 'no discord',
  })
  discord?: string;

  @Column({ type: 'varchar', nullable: true, default: 'no bio' })
  bio?: string;

  @Column({ type: 'enum', default: onTopWithTeam.NODATA, enum: onTopWithTeam })
  onTopWithTeam: onTopWithTeam;

  @Column({ type: 'enum', default: onTopSolo.NODATA, enum: onTopSolo })
  onTopSolo: onTopSolo;

  @Column({ type: 'enum', default: Role.USER, enum: Role })
  role: Role;

  @Column({ type: 'enum', default: UserStatus.ACTIVE, enum: UserStatus })
  status: UserStatus;

  //
  @ManyToOne(() => Team, (team) => team.users)
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @OneToMany(() => Notification, (notification) => notification.receiver)
  notifications: Notification[];

  @OneToMany(() => Followers, (followers) => followers.user)
  followers: Followers[];

  @OneToMany(() => Followers, (following) => following.following)
  following: Followers[];

  @OneToMany(() => UserWins, (userWins) => userWins.user)
  userWins: UserWins[];

  @OneToOne(
    () => OrganizerReputation,
    (organizerReputation) => organizerReputation.user,
  )
  organizerReputation: OrganizerReputation;

  @OneToOne(() => Team, (team) => team.captain)
  @JoinColumn({ name: 'captain' })
  isCaptain: Team;

  @OneToMany(() => Tournament, (tournament) => tournament.organizer)
  tournaments: Tournament[];
}
