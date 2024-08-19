import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/decorators/role.decorator';
import {
  createTournamentsDto,
  tournamentTeamsDto,
  tournamentTeamsNotificationDto,
} from 'src/dtos/tournaments.dto';
import { Role } from 'src/enum/role.enum';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGUard } from 'src/guards/auth.guard';
import { TournamentRepository } from 'src/repositories/tournament.repository';

@Controller('tournament')
export class TournamentController {
  constructor(private readonly tournamentRepository: TournamentRepository) {}

  @Get(':id')
  async getTournamentById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.tournamentRepository.getTournamentById(id);
  }

  @Post('create/:id') // Organizer id
  // @Roles(Role.ORGANIZER)
  // @UseGuards(AuthGUard, AdminGuard)
  async createTournament(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: createTournamentsDto,
  ) {
    return await this.tournamentRepository.createTournament(id, body);
  }

  @Post('addTeamsNotification/:id') // Organizer id
  async addTeamsNotification(
    @Param('id', ParseUUIDPipe) id,
    @Body() body: tournamentTeamsNotificationDto,
  ) {
    return await this.tournamentRepository.addTeamsNotification(id, body);
  }

  @Post('addTeams')
  async addTeams(@Body() body: tournamentTeamsDto) {
    return await this.tournamentRepository.addTeams(body);
  }

  @Put('participantReady/:id') // user id
  async participantReady(@Param('id', ParseUUIDPipe) id: string) {
    return await this.tournamentRepository.participantReady(id);
  }

  ///////
  ///////
  ///////

  @Post('autoCreateTournament')
  async autoCreateTournament() {
    return await this.tournamentRepository.autoCreateTournaments();
  }
}
