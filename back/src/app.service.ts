import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Games } from './entities/Others/games.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectRepository(Games)
    private readonly gamesRepository: Repository<Games>,
  ) {}

  async onModuleInit() {
    const games = ['Counter-Strike 2', 'League of Legends', 'Valorant'];

    for (const game of games) {
      const gameExists = await this.gamesRepository.findOne({
        where: { name: game },
      });
      if (!gameExists) {
        const newGame = this.gamesRepository.create({
          name: game,
        });
        await this.gamesRepository.save(newGame);
      }
    }
  }
}
