import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/usersEntities/user.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/enum/role.enum';
import { UpdateUserDto } from 'src/dtos/user.dtos';
import * as bcrypt from 'bcrypt';
import { Followers } from 'src/entities/usersEntities/followers.entity';
import { Notification } from 'src/entities/usersEntities/notification.entity';

@Injectable()
export class UserRepository implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Followers)
    private readonly followersRepository: Repository<Followers>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async onModuleInit() {
    const exists = await this.userRepository.findOne({
      where: { email: 'pablo@example.com' },
    });
    if (exists) return;

    const hashedPassword = await bcrypt.hash('123456', 10);

    const user = this.userRepository.create({
      nickname: 'Pablo',
      email: 'pablo@example.com',
      password: hashedPassword,
      role: Role.ADMIN,
    });

    await this.userRepository.save(user);
  }

  async getAllUsers() {
    return await this.userRepository.find({
      relations: ['followers', 'team', 'isCaptain', 'tournaments'],
    });
  }

  async updateUser(id: string, data: Partial<UpdateUserDto>): Promise<User> {
    const user: User = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (
      (data.password && !data.oldPassword) ||
      (!data.password && data.oldPassword)
    ) {
      throw new BadRequestException('Old & new passwords are required');
    }

    if (data.password && data.oldPassword) {
      const isOldPasswordValid: boolean = await bcrypt.compare(
        data.oldPassword,
        user.password,
      );
      if (!isOldPasswordValid) {
        throw new BadRequestException('Old password is not valid');
      }
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
    }

    const updatedUser = this.userRepository.merge(user, data);
    await this.userRepository.save(updatedUser);

    // Refetch the user to include the cart relation
    const completeUser = await this.userRepository.findOne({
      where: { id },
    });
    return completeUser;
  }

  async getUserById(id: string) {
    console.log(id);

    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['team', 'isCaptain', 'tournaments'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userFollowers = await this.followersRepository.find({
      where: { following: user },
    });

    const userWithNumberOfFollowers = {
      ...user,
      userFollowers: userFollowers.length,
    };

    return userWithNumberOfFollowers;
  }

  async followUser(userId: string, toFollow: string) {
    const userToFollow = await this.userRepository.findOne({
      where: { nickname: toFollow },
    });
    if (!userToFollow) {
      throw new NotFoundException('User not found');
    }

    const userFollower: User = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!userFollower) {
      throw new NotFoundException('Follower not found');
    }

    const exists = await this.followersRepository.findOne({
      where: { user: userFollower, following: userToFollow },
    });
    if (exists) {
      throw new BadRequestException('Already following');
    }

    const newFollower = this.followersRepository.create({
      user: userFollower,
      following: userToFollow,
    });

    if (userFollower.nickname === userToFollow.nickname) {
      throw new BadRequestException('Cannot follow yourself');
    }

    await this.followersRepository.save(newFollower);

    const followData = {
      newFollower: {
        nickname: newFollower.user.nickname,
        picture: newFollower.user.picture,
      },
      following: {
        nickname: newFollower.following.nickname,
        picture: newFollower.following.picture,
      },
    };

    return followData;
  }

  async unfollowUser(userId: string, toUnfollow: string) {
    const userToUnfollow = await this.userRepository.findOne({
      where: { nickname: toUnfollow },
    });
    if (!userToUnfollow) {
      throw new NotFoundException('User not found');
    }

    const userFollower: User = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!userFollower) {
      throw new NotFoundException('Follower not found');
    }

    const exists = await this.followersRepository.findOne({
      where: { user: userFollower, following: userToUnfollow },
    });
    if (!exists) {
      throw new BadRequestException('Not following');
    }

    await this.followersRepository.delete({
      user: userFollower,
      following: userToUnfollow,
    });
    return {
      message: 'User unfollowed successfully',
    };
  }

  // notifications

  async getNotifications(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    const notifications = await this.notificationRepository.find({
      where: { receiver: user },
      relations: ['sender'],
    });

    if (!notifications) {
      throw new NotFoundException('Notifications not found');
    }

    return notifications;
  }
}
