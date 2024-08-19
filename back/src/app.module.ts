import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeormConfig from './config/typeorm';
import { UserModule } from './modules/user.module';
import { AuthModule } from './modules/auth.module';
import { Games } from './entities/Others/games.entity';
import { TeamModule } from './modules/team.module';
import { CloudinaryModule } from './modules/cloudinary.module';
import { TournamentModule } from './modules/tournament.module';
import { MatchModule } from './modules/match.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [typeormConfig] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('typeorm'),
      }),
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    UserModule,
    AuthModule,
    TeamModule,
    CloudinaryModule,
    TournamentModule,
    MatchModule,
    TypeOrmModule.forFeature([Games]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
