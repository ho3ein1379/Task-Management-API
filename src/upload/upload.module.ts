import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachment } from './attachment.entity';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from './multer.config';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attachment]),
    MulterModule.register(multerConfig),
    TasksModule,
  ],
  providers: [UploadService],
  controllers: [UploadController],
})
export class UploadModule {}
