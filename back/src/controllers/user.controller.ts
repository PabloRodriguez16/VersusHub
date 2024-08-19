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
import { UpdateUserDto } from 'src/dtos/user.dtos';
import { User } from 'src/entities/usersEntities/user.entity';
import { UserRepository } from 'src/repositories/user.repository';

@Controller('user')
export class UserController {
  constructor(private readonly userRepository: UserRepository) {}

  @Get()
  async getAllUsers() {
    return await this.userRepository.getAllUsers();
  }

  @Get('getOne/:id')
  async getUserById(@Param('id', ParseUUIDPipe) id: string): Promise<object> {
    return await this.userRepository.getUserById(id);
  }

  @Post('follow/:id')
  async followUser(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() body: any,
  ): Promise<object> {
    return await this.userRepository.followUser(userId, body.nickname);
  }

  // edit user
  @Put(':id')
  async editUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Partial<UpdateUserDto>,
  ): Promise<User> {
    return await this.userRepository.updateUser(id, data);
  }

  @Delete('/:id')
  async unfollowUser(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() body: any,
  ): Promise<object> {
    return await this.userRepository.unfollowUser(userId, body.nickname);
  }

  // notifications

  @Get('notifications/:id') // User id
  async getNotifications(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userRepository.getNotifications(id);
  }
}
