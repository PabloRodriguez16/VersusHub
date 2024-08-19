import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  createTournamentsDto,
  tournamentTeamsDto,
  tournamentTeamsNotificationDto,
} from 'src/dtos/tournaments.dto';
import { Team } from 'src/entities/teamEntities/team.entity';
import { Tournament } from 'src/entities/TournamentEntities/tournament.entity';
import { TournamentParticipation } from 'src/entities/TournamentEntities/tournamentParticipation.entity';
import { TournamentTeams } from 'src/entities/TournamentEntities/tournamentTeams.entity';
import { Notification } from 'src/entities/usersEntities/notification.entity';
import { User } from 'src/entities/usersEntities/user.entity';
import { tournamentStatus } from 'src/enum/tournament.enum';
import { NotificationType, RoleOnTournament } from 'src/enum/user.enums';
import { Repository } from 'typeorm';
import { teamArray } from 'src/utils/teams.array';
import { Games } from 'src/entities/Others/games.entity';
import { teamStatusOnTournament } from 'src/enum/team.enum';

@Injectable()
export class TournamentRepository {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(TournamentTeams)
    private readonly tournamentTeamsRepository: Repository<TournamentTeams>,
    @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
    @InjectRepository(TournamentParticipation)
    private readonly participationRepository: Repository<TournamentParticipation>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(Games)
    private readonly gamesRepository: Repository<Games>,
  ) {}

  async getTournamentById(id: string) {
    return await this.tournamentRepository.findOne({
      where: { id },
      relations: ['organizer', 'tournamentTeams'],
    });
  }

  async createTournament(id: string, body: createTournamentsDto) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const hasPendingTournament = await this.tournamentRepository.findOne({
      where: {
        organizer: user,
        status: tournamentStatus.PENDING || tournamentStatus.ACTIVE,
      },
    });

    if (hasPendingTournament) {
      throw new BadRequestException('User already has a pending tournament');
    }

    const newTournament = this.tournamentRepository.create({
      ...body,
      organizer: user,
    });

    return await this.tournamentRepository.save(newTournament);
  }

  async addTeamsNotification(
    organizerId: string,
    body: tournamentTeamsNotificationDto,
  ) {
    const tournament = await this.tournamentRepository.findOne({
      where: { id: body.tournamentId },
      relations: ['tournamentTeams'],
    });

    if (!tournament) {
      throw new BadRequestException('Tournament not found');
    }

    if (tournament.tournamentTeams.length >= 10) {
      throw new BadRequestException('Tournament already has 10 teams');
    }

    const team = await this.teamRepository.findOne({
      where: { id: body.teamId },
      relations: ['captain'],
    });

    if (!team) {
      throw new BadRequestException('Team not found');
    }

    const organizer = await this.userRepository.findOne({
      where: { id: organizerId },
    });

    if (!organizer) {
      throw new BadRequestException('Organizer not found');
    }

    if (organizerId === team.captain.id) {
      throw new BadRequestException(
        'You can not invite yourself or your own team',
      );
    }

    const newTournamentInvitation = this.notificationRepository.create({
      notificationType: NotificationType.TOURNAMENT_INVITATION,
      content: `${team.captain.nickname}, ${organizer.nickname} has invited you to join ${tournament.name}`,
      tournamentId: body.tournamentId,
      teamId: body.teamId,
      description: `Tournament description: ${tournament.description}`,
      sender: organizer, // Matches `sender: User`
      receiver: team.captain, // Matches `receiver: User`
    });

    return await this.notificationRepository.save(newTournamentInvitation);
  }

  async addTeams(body: tournamentTeamsDto) {
    const users: string[] = [
      body.player1Id,
      body.player2Id,
      body.player3Id,
      body.player4Id,
    ];

    // Verifica que todos los usuarios estén presentes
    users.forEach((user) => {
      if (!user) {
        throw new BadRequestException('You must invite four players');
      }
    });

    // Busca el torneo y verifica que exista
    const tournament = await this.tournamentRepository.findOne({
      where: { id: body.tournamentId },
      relations: ['tournamentTeams', 'organizer'],
    });

    if (!tournament) {
      throw new BadRequestException('Tournament not found');
    }

    // Verifica que no haya más de 10 equipos en el torneo
    if (tournament.tournamentTeams.length >= 8) {
      throw new BadRequestException('Tournament already has 8 teams');
    }

    // Busca el equipo y verifica que exista y que tenga al menos 5 miembros
    const team = await this.teamRepository.findOne({
      where: { id: body.teamId },
      relations: ['users', 'captain'],
    });

    if (!team) {
      throw new BadRequestException('Team not found');
    } else if (team.users.length < 4) {
      throw new BadRequestException(
        'Team must have at least 5 members, including the captain',
      );
    }

    // Genera un número aleatorio de equipo que no esté asignado
    const availableTeamNumbers = [1, 2, 3, 4, 5, 6, 7, 8].filter(
      (numberTeam) =>
        !tournament.tournamentTeams.some(
          (team) => team.numberTeam === numberTeam,
        ),
    );

    const randomNumber =
      availableTeamNumbers[
        Math.floor(Math.random() * availableTeamNumbers.length)
      ];

    // Crea el nuevo equipo en el torneo
    const newTeamOnTournament = this.tournamentTeamsRepository.create({
      numberTeam: randomNumber,
      team: team,
      tournament,
    });

    await this.tournamentTeamsRepository.insert(newTeamOnTournament);

    // Inserta cada usuario como participante en el torneo
    for (const userId of users) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new BadRequestException(`User with ID ${userId} not found`);
      }

      const newTournamentParticipant = this.participationRepository.create({
        role: RoleOnTournament.PLAYER,
        user,
        team: newTeamOnTournament,
        tournament,
      });

      console.log('Inserting participant:', newTournamentParticipant);
      await this.participationRepository.insert(newTournamentParticipant);
    }

    // Inserta el capitán como líder de equipo en el torneo
    const captain = await this.userRepository.findOne({
      where: { id: team.captain.id },
    });

    const newTournamentParticipation = this.participationRepository.create({
      role: RoleOnTournament.TEAMLEADER,
      user: captain,
      team: newTeamOnTournament,
      tournament,
    });

    console.log('Inserting team leader:', newTournamentParticipation);
    await this.participationRepository.insert(newTournamentParticipation);

    // Crea una nueva notificación para el organizador del torneo
    const newNotification = this.notificationRepository.create({
      notificationType: NotificationType.TOURNAMENT_INVITATION_ACCEPT,
      content: `${team.captain.nickname} has joined ${tournament.name}`,
      description: `Team ${team.name} has joined the tournament ${tournament.name}`,
      sender: captain,
      receiver: tournament.organizer,
    });

    console.log('Inserting notification:', newNotification);
    await this.notificationRepository.insert(newNotification);

    return tournament;
  }

  async participantReady(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException(`User with ID ${id} not found`);
    }

    const participant = await this.participationRepository.findOne({
      where: { user },
      relations: ['team'],
    });

    if (!participant) {
      throw new BadRequestException(`Participant not found`);
    }

    if (participant.isReady) {
      throw new BadRequestException(`Participant is already ready`);
    }

    const notReadyYet: string[] = [];

    const allParticipantsOfTeam = await this.participationRepository.find({
      where: { team: participant.team },
    });

    for (const participant of allParticipantsOfTeam) {
      if (!participant.isReady) {
        notReadyYet.push(participant.user.nickname);
      }
    }

    if (notReadyYet.length === 1) {
      const team = await this.teamRepository.findOne({
        where: { id: participant.team.id },
      });

      const tournamentTeam = await this.tournamentTeamsRepository.findOne({
        where: { team: team },
      });
      participant.isReady = true;
      await this.participationRepository.save(participant);

      tournamentTeam.status = teamStatusOnTournament.READY;

      await this.tournamentTeamsRepository.save(tournamentTeam);

      return tournamentTeam;
    } else {
      participant.isReady = true;
      await this.participationRepository.save(participant);
      return participant;
    }
  }

  /////////
  /////////
  /////////

  // auto-create tournaments

  async autoCreateTournaments() {
    const organizer = await this.userRepository.findOne({
      where: { nickname: 'Pablo' },
    });

    if (!organizer) {
      throw new BadRequestException('Organizer not found');
    }

    const newTournament = this.tournamentRepository.create({
      name: 'Torneo 1',
      description: 'Torneo 1',
      startDate: new Date(),
      endDate: '2024-08-30T18:00:00',
      game: await this.gamesRepository.findOne({
        where: { name: 'Counter-Strike 2' },
      }),
      organizer,
    });

    await this.tournamentRepository.save(newTournament);

    const existingTournamentTeams = await this.tournamentTeamsRepository.find({
      where: { tournament: newTournament },
    });

    const assignedNumbers = new Set(
      existingTournamentTeams.map((team) => team.numberTeam),
    );
    const availableTeamNumbers = [1, 2, 3, 4, 5, 6, 7, 8].filter(
      (number) => !assignedNumbers.has(number),
    );

    if (availableTeamNumbers.length === 0) {
      throw new BadRequestException('No available team numbers');
    }

    for (const team of teamArray) {
      const foundTeam = await this.teamRepository.findOne({
        where: { name: team.name },
      });

      if (!foundTeam) {
        throw new BadRequestException(`Team with name ${team.name} not found`);
      }

      const randomNumber =
        availableTeamNumbers[
          Math.floor(Math.random() * availableTeamNumbers.length)
        ];

      const numberIndex = availableTeamNumbers.indexOf(randomNumber);
      if (numberIndex > -1) {
        availableTeamNumbers.splice(numberIndex, 1);
      }

      const newTeamOnTournament = this.tournamentTeamsRepository.create({
        numberTeam: randomNumber,
        team: foundTeam,
        tournament: newTournament,
      });

      await this.tournamentTeamsRepository.save(newTeamOnTournament);

      for (const user of team.users) {
        const userEntity = await this.userRepository.findOne({
          where: { nickname: user.nickname },
        });

        if (!userEntity) {
          throw new BadRequestException(
            `User with nickname ${user.nickname} not found`,
          );
        }

        const role =
          user.nickname === team.users[0].nickname
            ? RoleOnTournament.TEAMLEADER
            : RoleOnTournament.PLAYER;

        const newTournamentParticipation = this.participationRepository.create({
          role,
          user: userEntity,
          team: newTeamOnTournament,
          tournament: newTournament,
        });

        console.log('Inserting participant:', newTournamentParticipation);
        await this.participationRepository.save(newTournamentParticipation);
      }
    }

    return 'Tournaments created successfully';
  }
}
