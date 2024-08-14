import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuid } from 'uuid';
import { Team } from "./team.entity";
import { Games } from "../Others/games.entity";

@Entity({ name: 'team_wins' })
export class TeamWins {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuid();

    @ManyToOne(() => Team, (team) => team.teamWins)
    @JoinColumn({ name: 'team_id' })
    team: Team;

    @ManyToOne(() => Games, (games) => games.teamWins)
    @JoinColumn({ name: 'game_id' })
    game: Games;
    
    @Column()
    wins: number = 0;
}