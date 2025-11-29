import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import express from 'express';
import { UploadService } from './upload.service';
import { Attachment } from './attachment.entity';
import { User } from '../users/user.entity';
import { CurrentUser } from '../common/decorators/current.user.decorator';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('task/:taskId')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('taskId') taskId: string,
    @CurrentUser() user: User,
  ): Promise<Attachment> {
    return this.uploadService.uploadFile(file, taskId, user.id);
  }

  @Get('task/:taskId')
  getTasksAttachment(
    @Param('taskId') taskId: string,
    @CurrentUser() user: User,
  ) {
    return this.uploadService.getTaskAttachments(taskId, user.id);
  }

  @Get('download/:id')
  async downloadFile(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Res() response: express.Response,
  ) {
    const attachment = await this.uploadService.getAttachment(id, user.id);

    response.download(attachment.path, attachment.originalName);
  }

  @Get(':id')
  async deleteAttachment(@Param('id') id: string, @CurrentUser() user: User) {
    return this.uploadService.deleteAttachment(id, user.id);
  }
}
