import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchController } from 'src/controllers/match.controller';
import { Matches } from 'src/entities/TournamentEntities/matches.entity';
import { Tournament } from 'src/entities/TournamentEntities/tournament.entity';
import { TournamentParticipation } from 'src/entities/TournamentEntities/tournamentParticipation.entity';
import { TournamentTeams } from 'src/entities/TournamentEntities/tournamentTeams.entity';
import { User } from 'src/entities/usersEntities/user.entity';
import { MatchRepository } from 'src/repositories/match.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Matches,
      Tournament,
      TournamentParticipation,
      TournamentTeams,
      User,
    ]),
  ],
  controllers: [MatchController],
  providers: [MatchRepository],
})
export class MatchModule {}
