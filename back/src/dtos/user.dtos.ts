import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { Role } from 'src/enum/role.enum';
import { onTopSolo, onTopWithTeam, UserStatus } from 'src/enum/user.enums';

export class CreateUserDto {
  @IsString()
  @Length(3, 20)
  nickname: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 50)
  password: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  discord?: string;

  @IsOptional()
  @IsString()
  picture?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsEnum(onTopSolo)
  onTopSolo?: onTopSolo;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(3, 20)
  nickname: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @Length(6, 50)
  password: string;

  @IsOptional()
  @IsString()
  @Length(6, 50)
  oldPassword: string;

  @IsOptional()
  picture?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
