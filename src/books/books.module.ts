import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookIssueRecord } from './book-issue-record.entity';
import { Student } from 'src/students/student.entity';
import { Book } from './book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookIssueRecord, Student, Book])],
  providers: [BooksService],
  controllers: [BooksController],
})
export class BooksModule {}
