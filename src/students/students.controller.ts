import { Controller, Get, Param } from '@nestjs/common';
import { StudentsService } from './students.service';
import { BookIssueRecord } from 'src/books/book-issue-record.entity';

@Controller('students')
export class StudentsController {
  constructor(private studentService: StudentsService) {}

  @Get('get-student-history/:studentId')
  async getStudentHistory(
    @Param('studentId') studentId: number,
  ): Promise<BookIssueRecord[]> {
    return this.studentService.getStudentHistory(studentId);
  }

  @Get('get-student-book-dashboard')
  async getStudentBookDashboard(): Promise<BookIssueRecord[]> {
    return this.studentService.getStudentBookDashboard();
  }
}
