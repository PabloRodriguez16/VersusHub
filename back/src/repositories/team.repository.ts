import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from 'src/entities/teamEntities/team.entity';
import { TournamentTeams } from 'src/entities/TournamentEntities/tournamentTeams.entity';
import { User } from 'src/entities/usersEntities/user.entity';
import { Repository } from 'typeorm';
import { teamArray } from 'src/utils/teams.array';

@Injectable()
export class TeamRepository implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
    @InjectRepository(TournamentTeams)
    private readonly tournamentTeamsRepository: Repository<TournamentTeams>,
  ) {}

  async onModuleInit() {
    for (const team of teamArray) {
      // verifying if user exists

      const user = await this.userRepository.findOne({
        where: { nickname: team.users[0].nickname },
      });

      if (user) {
        return;
      }

      for (const user of team.users) {
        const newUser = this.userRepository.create({
          ...user,
        });
        await this.userRepository.save(newUser);
      }

      const captain = await this.userRepository.findOne({
        where: { nickname: team.users[0].nickname },
      });

      const newTeam = await this.teamRepository.create({
        name: team.name,
        captain: captain,
      });

      await this.teamRepository.save(newTeam);

      for (const user of team.users) {
        const player = await this.userRepository.findOne({
          where: { nickname: user.nickname },
        });

        // asign player to team
        player.team = await this.teamRepository.findOne({
          where: { name: team.name },
        });

        await this.userRepository.save(player);
      }
    }
  }

  async createTeam(id: string, body: any) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['team', 'isCaptain'],
    });

    const isAlreadyCaptain = await this.teamRepository.findOne({
      where: { captain: user },
    });

    const isAlreadyMember = await this.teamRepository.findOne({
      where: { users: user },
    });

    if (isAlreadyCaptain || isAlreadyMember) {
      throw new BadRequestException(
        'User already has a team or is a member of one',
      );
    }

    const newTeam = this.teamRepository.create({
      ...body,
      captain: user,
    });

    return await this.teamRepository.save(newTeam);
  }

  async editTeam(id: any, body: any) {
    const team = await this.teamRepository.findOne({
      where: { id },
    });

    const updatedTeam = this.teamRepository.merge(team, body);

    return await this.teamRepository.save(updatedTeam);
  }

  async getTeam(id: any) {
    const team = await this.teamRepository.findOne({
      where: { id },
      relations: ['captain', 'users'],
    });

    if (!team) {
      console.log('team not found, looking for tournament team');

      const tournamentTeam = await this.tournamentTeamsRepository.findOne({
        where: { id },
        relations: ['team'],
      });

      if (!tournamentTeam) {
        throw new BadRequestException('Team not found');
      }

      const foundTeam = await this.teamRepository.findOne({
        where: { id: tournamentTeam.team.id },
        relations: ['captain', 'users'],
      });

      return foundTeam;
    }

    return team;
  }

  async addMember(userNickname: any, teamId: string) {
    const maxMembers = 10;

    console.log(teamId);

    const user = await this.userRepository.findOne({
      where: { nickname: userNickname },
      relations: ['team', 'isCaptain'],
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const userAlreadyInTeam = await this.teamRepository.findOne({
      where: { users: user },
    });

    const userAlreadyHasTeam = await this.teamRepository.findOne({
      where: { captain: user },
    });

    if (userAlreadyInTeam || userAlreadyHasTeam) {
      throw new BadRequestException(
        'User already in team or is a captain of one',
      );
    }

    const team = await this.teamRepository.findOne({
      where: { id: teamId },
      relations: ['users'],
    });

    if (!team) {
      throw new BadRequestException('Team not found');
    }

    if (team.users.length >= maxMembers) {
      throw new BadRequestException('Team is full');
    }

    user.team = team;
    await this.userRepository.save(user);

    return await this.getTeam(teamId);
  }

  async deleteMember(userNickname: string, teamId: string) {
    const user = await this.userRepository.findOne({
      where: { nickname: userNickname },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.team = null;
    await this.userRepository.save(user);
    return await this.getTeam(teamId);
  }

  async deleteTeam(id: any) {
    await this.userRepository.update({ team: id }, { team: null });
    await this.teamRepository.delete({ id });

    return 'team deleted successfully';
  }
}
