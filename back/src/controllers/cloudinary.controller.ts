import {
  Controller,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseInterceptors,
  ParseUUIDPipe, // Importa BadRequestException si quieres manejar errores de manera específica
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Team } from 'src/entities/teamEntities/team.entity';
import { User } from 'src/entities/usersEntities/user.entity';
import { CloudinaryRepository } from 'src/repositories/cloudinary.repository';
import { TeamRepository } from 'src/repositories/team.repository';
import { UserRepository } from 'src/repositories/user.repository';

@Controller('files')
export class CloudinaryController {
  constructor(
    private readonly cloudinaryRepository: CloudinaryRepository,
    private readonly userRepository: UserRepository,
    private readonly teamRepository: TeamRepository,
  ) {}

  @Post('uploadUserImage/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadUserImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile(
      new ParseFilePipe({
        // Validación del tipo de archivo
        validators: [
          new MaxFileSizeValidator({
            maxSize: 2000000000, // 2 MB

            message: 'the file is larger than 2 MB',
          }),
          new FileTypeValidator({ fileType: /.(jpg|jpeg|png|gif|webp|avif)$/ }), // Validación del tipo de archivo
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<User> {
    await this.userRepository.getUserById(id);
    const image = await this.cloudinaryRepository.uploadImage(file);
    return await this.userRepository.updateUser(id, { picture: image.url });
  }

  @Post('uploadTeamImage/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTeamImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 2000000000, // 2 MB

            message: 'the file is larger than 2 MB',
          }),
          new FileTypeValidator({ fileType: /.(jpg|jpeg|png|gif|webp|avif)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<Team> {
    await this.teamRepository.getTeam(id);
    const image = await this.cloudinaryRepository.uploadImage(file);
    return await this.teamRepository.editTeam(id, { picture: image.url });
  }
}
