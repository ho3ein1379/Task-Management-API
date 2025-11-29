import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment } from './attachment.entity';
import { TasksService } from '../tasks/tasks.service';
import * as fs from 'node:fs';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Attachment)
    private attachmentRepository: Repository<Attachment>,
    private tasksService: TasksService,
  ) {}

  async uploadFile(file: Express.Multer.File, taskId: string, userId: string) {
    await this.tasksService.findOne(taskId, userId);

    const attachment = this.attachmentRepository.create({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      taskId,
    });

    return this.attachmentRepository.save(attachment);
  }

  async getTaskAttachments(taskId: string, userId: string) {
    await this.tasksService.findOne(taskId, userId);
    return this.attachmentRepository.find({
      where: { taskId },
      order: { uploadedAt: 'DESC' },
    });
  }

  async deleteAttachment(
    id: string,
    userId: string,
  ): Promise<{ message: string }> {
    const attachment = await this.attachmentRepository.findOne({
      where: { id },
      relations: ['task'],
    });

    if (!attachment) {
      throw new NotFoundException('Attachment not found');
    }

    await this.tasksService.findOne(attachment.taskId, userId);

    if (fs.existsSync(attachment.path)) {
      fs.unlinkSync(attachment.path);
    }

    await this.attachmentRepository.remove(attachment);

    return { message: `Attachment deleted successfully` };
  }

  async getAttachment(id: string, userId: string): Promise<Attachment> {
    const attachment = await this.attachmentRepository.findOne({
      where: { id },
      relations: ['task'],
    });

    if (!attachment) {
      throw new NotFoundException('Attachment not found');
    }

    await this.tasksService.findOne(attachment.taskId, userId);
    return attachment;
  }
}
