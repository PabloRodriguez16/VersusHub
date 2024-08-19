import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enum/role.enum';
import { TeamRepository } from 'src/repositories/team.repository';

@Controller('team')
export class TeamController {
  constructor(private readonly teamRepository: TeamRepository) {}

  @Get(':id')
  async getTeam(@Param('id', ParseUUIDPipe) id) {
    return await this.teamRepository.getTeam(id);
  }

  @Post('create/:id')
  async createTeam(@Param('id', ParseUUIDPipe) id, @Body() body: any) {
    return await this.teamRepository.createTeam(id, body);
  }

  @Post('addMember/:id') // team id
  async addMember(@Param('id', ParseUUIDPipe) teamId, @Body() body: any) {
    return await this.teamRepository.addMember(body.nickname, teamId);
  }

  @Put('edit/:id')
  async editTeam(@Param('id', ParseUUIDPipe) id, @Body() body: any) {
    return await this.teamRepository.editTeam(id, body);
  }

  @Delete('deleteMember/:id')
  async deleteMember(@Param('id', ParseUUIDPipe) id, @Body() body: any) {
    return await this.teamRepository.deleteMember(body.nickname, id);
  }

  @Delete(':id')
  async deleteTeam(@Param('id', ParseUUIDPipe) id) {
    return await this.teamRepository.deleteTeam(id);
  }
}
