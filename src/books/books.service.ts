import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IssueBookDto } from './dto/issue-book.dto';
import { BookIssueRecord } from './book-issue-record.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from 'src/students/student.entity';
import { Book } from './book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(BookIssueRecord)
    private bookIssueRepository: Repository<BookIssueRecord>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async issueBook(
    @Body() issueBookDto: IssueBookDto,
  ): Promise<BookIssueRecord> {
    const { studentId, bookId } = issueBookDto;

    // Fetch the student and book entities
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });
    const book = await this.bookRepository.findOne({ where: { id: bookId } });

    if (!student || !book) {
      throw new BadRequestException('Student or Book not found');
    }

    // Ensure student doesn't have another active book issue
    const activeIssue = await this.bookIssueRepository.findOne({
      where: { student: { id: studentId }, returnDate: null },
    });

    if (activeIssue) {
      throw new BadRequestException('Student has already issued a book');
    }

    // Create and save the new book issue record
    const newIssue = this.bookIssueRepository.create({
      student: student,
      book: book,
      issueDate: new Date(),
    });

    return this.bookIssueRepository.save(newIssue);
  }

  async returnBook(
    bookIssueId: number,
    fine: number,
  ): Promise<BookIssueRecord> {
    const issueRecord = await this.bookIssueRepository.findOne({
      where: { id: bookIssueId },
    });
    if (!issueRecord) {
      throw new NotFoundException(`Something went wrong.`);
    }
    issueRecord.fine = fine || 0;
    issueRecord.returnDate = new Date();

    await this.bookIssueRepository.save(issueRecord);
    return issueRecord;
  }

  async findBooksByAuthor(authorName: string): Promise<Book[]> {
    return await this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.authors', 'author')
      .where('LOWER(author.name) LIKE LOWER(:authorName)', {
        authorName: `%${authorName}%`,
      })
      .getMany();
  }

  async getBookIssueHistory(bookId: number): Promise<BookIssueRecord[]> {
    return await this.bookIssueRepository.find({
      where: { book: { id: bookId } },
      relations: ['student'],
    });
  }
}
