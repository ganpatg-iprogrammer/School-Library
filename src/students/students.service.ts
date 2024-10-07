import { Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookIssueRecord } from '../books/book-issue-record.entity';
// import { Student } from './student.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(BookIssueRecord)
    private bookIssueRepository: Repository<BookIssueRecord>,
    // @InjectRepository(Student)
    // private studentRepository: Repository<Student>,
  ) {}

  //get book assigned history of student
  async getStudentHistory(
    @Param('studentId') studentId: number,
  ): Promise<BookIssueRecord[]> {
    return await this.bookIssueRepository.find({
      where: { student: { id: studentId } },
      relations: ['book'],
    });
  }

  async getStudentBookDashboard(): Promise<BookIssueRecord[]> {
    return await this.bookIssueRepository
      .createQueryBuilder('issue')
      .select('student.id', 'studentId')
      .addSelect('COUNT(issue.id)', 'bookCount')
      .addSelect('SUM(issue.fine)', 'totalFine')
      .leftJoin('issue.student', 'student')
      .groupBy('student.id')
      .getRawMany();
  }
}
