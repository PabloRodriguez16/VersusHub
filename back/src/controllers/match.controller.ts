import { Controller, Post } from '@nestjs/common';
import { MatchRepository } from 'src/repositories/match.repository';

@Controller('match')
export class MatchController {
  constructor(private readonly matchRepository: MatchRepository) {}

  @Post('create')
  async createMatch() {}
}
