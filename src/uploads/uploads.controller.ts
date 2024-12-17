import { Controller, Delete, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file : Express.Multer.File) : Promise<object> {    
    return await this.uploadsService.upload(file.originalname, file.buffer)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.uploadsService.remove(id);
  }

}
