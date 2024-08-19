import { NotificationType } from 'src/enum/user.enums';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'notifications' })
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Change to string for uuid

  @Column({ type: 'enum', enum: NotificationType, nullable: false })
  notificationType: NotificationType;

  @Column({ nullable: false })
  content: string;

  @Column({ nullable: true })
  tournamentId?: string;

  @Column({ nullable: true })
  teamId?: string;

  @Column({ nullable: false })
  description: string;

  @ManyToOne(() => User, { nullable: false })
  sender: User; // Rename to match what you’re passing in create()

  @ManyToOne(() => User, { nullable: false })
  receiver: User; // Rename to match what you’re passing in create()
}
