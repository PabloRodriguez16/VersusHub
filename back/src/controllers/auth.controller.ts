import { Body, Controller, Post } from '@nestjs/common';
import { Roles } from 'src/decorators/role.decorator';
import { CreateUserDto } from 'src/dtos/user.dtos';
import { User } from 'src/entities/usersEntities/user.entity';
import { Role } from 'src/enum/role.enum';
import { AuthRepository } from 'src/repositories/auth.repository';

@Controller('auth')
export class AuthController {
  constructor(private readonly authRepository: AuthRepository) {}

  @Post('register')
  async register(@Body() body: CreateUserDto): Promise<User> {
    return await this.authRepository.register(body);
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
  ): Promise<{ message: string; token: string }> {
    return await this.authRepository.login(body.email, body.password);
  }
}
