import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryController } from 'src/controllers/cloudinary.controller';
import { Games } from 'src/entities/Others/games.entity';
import { Team } from 'src/entities/teamEntities/team.entity';
import { TeamWins } from 'src/entities/teamEntities/teamWins.entity';
import { Tournament } from 'src/entities/TournamentEntities/tournament.entity';
import { TournamentParticipation } from 'src/entities/TournamentEntities/tournamentParticipation.entity';
import { TournamentTeams } from 'src/entities/TournamentEntities/tournamentTeams.entity';
import { Followers } from 'src/entities/usersEntities/followers.entity';
import { Notification } from 'src/entities/usersEntities/notification.entity';
import { User } from 'src/entities/usersEntities/user.entity';
import { UserWins } from 'src/entities/usersEntities/userWins.entity';
import { CloudinaryRepository } from 'src/repositories/cloudinary.repository';
import { TeamRepository } from 'src/repositories/team.repository';
import { UserRepository } from 'src/repositories/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Team,
      Followers,
      Tournament,
      TeamWins,
      UserWins,
      TournamentTeams,
      TournamentParticipation,
      Notification,
      Games,
    ]),
  ],
  controllers: [CloudinaryController],
  providers: [CloudinaryRepository, UserRepository, TeamRepository],
})
export class CloudinaryModule {}
