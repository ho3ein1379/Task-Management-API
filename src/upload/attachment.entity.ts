import {
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from '../tasks/task.entity';

export class Attachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  filename: string;
  @Column()
  originalName: string;
  @Column()
  mimetype: string;
  @Column()
  size: number;
  @Column()
  path: string;

  @ManyToOne(() => Task, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @Column()
  taskId: string;

  @CreateDateColumn()
  uploadedAt: Date;
}
