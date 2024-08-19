import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamController } from 'src/controllers/team.controller';
import { Team } from 'src/entities/teamEntities/team.entity';
import { TournamentTeams } from 'src/entities/TournamentEntities/tournamentTeams.entity';
import { User } from 'src/entities/usersEntities/user.entity';
import { TeamRepository } from 'src/repositories/team.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Team, User, TournamentTeams])],
  controllers: [TeamController],
  providers: [TeamRepository],
})
export class TeamModule {}
