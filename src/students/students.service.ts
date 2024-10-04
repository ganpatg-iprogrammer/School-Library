import { Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookIssueRecord } from 'src/books/book-issue-record.entity';
import { Student } from './student.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(BookIssueRecord)
    private bookIssueRepository: Repository<BookIssueRecord>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  //get book assigned history of student
  async getStudentHistory(@Param('studentId') studentId: number) {
    return await this.bookIssueRepository.find({
      where: { student: { id: studentId } },
      relations: ['book'],
    });
  }
}
