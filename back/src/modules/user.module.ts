import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/controllers/user.controller';
import { Followers } from 'src/entities/usersEntities/followers.entity';
import { Notification } from 'src/entities/usersEntities/notification.entity';
import { User } from 'src/entities/usersEntities/user.entity';
import { UserRepository } from 'src/repositories/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Followers, Notification])],
  controllers: [UserController],
  providers: [UserRepository],
})
export class UserModule {}
