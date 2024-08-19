import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TournamentController } from 'src/controllers/tournament.controller';
import { Games } from 'src/entities/Others/games.entity';
import { Team } from 'src/entities/teamEntities/team.entity';
import { TeamWins } from 'src/entities/teamEntities/teamWins.entity';
import { Matches } from 'src/entities/TournamentEntities/matches.entity';
import { Tournament } from 'src/entities/TournamentEntities/tournament.entity';
import { TournamentParticipation } from 'src/entities/TournamentEntities/tournamentParticipation.entity';
import { TournamentTeams } from 'src/entities/TournamentEntities/tournamentTeams.entity';
import { Notification } from 'src/entities/usersEntities/notification.entity';
import { OrganizerReputation } from 'src/entities/usersEntities/organizerReputation.entity';
import { User } from 'src/entities/usersEntities/user.entity';
import { UserWins } from 'src/entities/usersEntities/userWins.entity';
import { TournamentRepository } from 'src/repositories/tournament.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tournament,
      User,
      Team,
      UserWins,
      TeamWins,
      Matches,
      TournamentParticipation,
      TournamentTeams,
      OrganizerReputation,
      Notification,
      Games
    ]),
  ],
  controllers: [TournamentController],
  providers: [TournamentRepository],
})
export class TournamentModule {}
