import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookIssueRecord } from './book-issue-record.entity';
import { Student } from '../students/student.entity';
import { Book } from './book.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BooksService', () => {
  let service: BooksService;

  // Mock the repositories
  const mockBookIssueRecordRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockStudentRepository = {
    findOne: jest.fn(),
  };

  const mockBookRepository = {
    findOne: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(BookIssueRecord),
          useValue: mockBookIssueRecordRepository,
        },
        {
          provide: getRepositoryToken(Student),
          useValue: mockStudentRepository,
        },
        {
          provide: getRepositoryToken(Book),
          useValue: mockBookRepository,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('issueBook', () => {
    it('should issue a book successfully', async () => {
      const issueBookDto = { studentId: 1, bookId: 1 };
      const student = { id: 1 };
      const book = { id: 1 };
      const newIssue = { student, book, issueDate: new Date() };

      mockStudentRepository.findOne.mockResolvedValue(student);
      mockBookRepository.findOne.mockResolvedValue(book);
      mockBookIssueRecordRepository.findOne.mockResolvedValue(null); // No active issue
      mockBookIssueRecordRepository.create.mockReturnValue(newIssue);
      mockBookIssueRecordRepository.save.mockResolvedValue(newIssue);

      const result = await service.issueBook(issueBookDto);
      expect(result).toEqual(newIssue);
      expect(mockBookIssueRecordRepository.save).toHaveBeenCalledWith(newIssue);
    });

    it('should throw BadRequestException if student or book not found', async () => {
      const issueBookDto = { studentId: 1, bookId: 1 };
      mockStudentRepository.findOne.mockResolvedValue(null); // Student not found

      await expect(service.issueBook(issueBookDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if student already has an active book issue', async () => {
      const issueBookDto = { studentId: 1, bookId: 1 };
      const student = { id: 1 };
      const book = { id: 1 };
      const activeIssue = { student };

      mockStudentRepository.findOne.mockResolvedValue(student);
      mockBookRepository.findOne.mockResolvedValue(book);
      mockBookIssueRecordRepository.findOne.mockResolvedValue(activeIssue); // Active issue found

      await expect(service.issueBook(issueBookDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('returnBook', () => {
    it('should return a book successfully', async () => {
      const bookIssueId = 1;
      const fine = 5;
      const issueRecord = { id: 1, fine: 0, returnDate: null };

      mockBookIssueRecordRepository.findOne.mockResolvedValue(issueRecord);

      const result = await service.returnBook(bookIssueId, fine);
      expect(result.fine).toBe(fine);
      expect(result.returnDate).toBeInstanceOf(Date);
      expect(mockBookIssueRecordRepository.save).toHaveBeenCalledWith(
        issueRecord,
      );
    });

    it('should throw NotFoundException if issue record not found', async () => {
      const bookIssueId = 1;
      mockBookIssueRecordRepository.findOne.mockResolvedValue(null); // No record found

      await expect(service.returnBook(bookIssueId, 0)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findBooksByAuthor', () => {
    it('should return books by author', async () => {
      const authorName = 'John Doe';
      const books = [{ id: 1, title: 'Book 1' }];

      mockBookRepository.createQueryBuilder().getMany.mockResolvedValue(books);

      const result = await service.findBooksByAuthor(authorName);
      expect(result).toEqual(books);
    });
  });

  describe('getBookIssueHistory', () => {
    it('should return book issue history', async () => {
      const bookId = 1;
      const issueHistory = [{ id: 1, bookId: 1, student: { id: 1 } }];

      mockBookIssueRecordRepository.find.mockResolvedValue(issueHistory);

      const result = await service.getBookIssueHistory(bookId);
      expect(result).toEqual(issueHistory);
    });
  });
});
