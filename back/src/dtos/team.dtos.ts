import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { onTopTeam } from 'src/enum/team.enum';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  picture: string;

  @IsOptional()
  @IsEnum(onTopTeam)
  onTopTeam?: onTopTeam;

  @IsUUID()
  @IsNotEmpty()
  captain: string; // captain id
}
