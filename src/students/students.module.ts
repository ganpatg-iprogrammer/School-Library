import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { BookIssueRecord } from 'src/books/book-issue-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student, BookIssueRecord])],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
