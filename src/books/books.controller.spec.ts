import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { IssueBookDto } from './dto/issue-book.dto';
import { BookIssueRecord } from './book-issue-record.entity';
import { Book } from './book.entity';

describe('BooksController', () => {
  let controller: BooksController;
  let mockBooksService: Partial<BooksService>;

  beforeEach(async () => {
    // Create a mock for BooksService
    mockBooksService = {
      issueBook: jest.fn(),
      returnBook: jest.fn(),
      findBooksByAuthor: jest.fn(),
      getBookIssueHistory: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService, // Inject the mock service
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Test for issueBook method
  it('should call issueBook with the correct parameters', async () => {
    const issueBookDto: IssueBookDto = { studentId: 1, bookId: 2 }; // Mock DTO
    const bookIssueRecord: BookIssueRecord = new BookIssueRecord(); // Mock response
    (mockBooksService.issueBook as jest.Mock).mockResolvedValue(
      bookIssueRecord,
    );

    const result = await controller.issueBook(issueBookDto);
    expect(mockBooksService.issueBook).toHaveBeenCalledWith(issueBookDto);
    expect(result).toBe(bookIssueRecord);
  });

  // Test for returnBook method
  it('should call returnBook with the correct parameters', async () => {
    const bookIssueRecord: BookIssueRecord = new BookIssueRecord(); // Mock response
    (mockBooksService.returnBook as jest.Mock).mockResolvedValue(
      bookIssueRecord,
    );

    const result = await controller.returnBook(1, 10);
    expect(mockBooksService.returnBook).toHaveBeenCalledWith(1, 10);
    expect(result).toBe(bookIssueRecord);
  });

  // Test for findBooksByAuthor method
  it('should call findBooksByAuthor with the correct parameters', async () => {
    const books: Book[] = [new Book(), new Book()]; // Mock response
    (mockBooksService.findBooksByAuthor as jest.Mock).mockResolvedValue(books);

    const result = await controller.findBooksByAuthor('John Doe');
    expect(mockBooksService.findBooksByAuthor).toHaveBeenCalledWith('John Doe');
    expect(result).toBe(books);
  });

  // Test for getBookIssueHistory method
  it('should call getBookIssueHistory with the correct parameters', async () => {
    const history: BookIssueRecord[] = [
      new BookIssueRecord(),
      new BookIssueRecord(),
    ]; // Mock response
    (mockBooksService.getBookIssueHistory as jest.Mock).mockResolvedValue(
      history,
    );

    const result = await controller.getBookIssueHistory(1);
    expect(mockBooksService.getBookIssueHistory).toHaveBeenCalledWith(1);
    expect(result).toBe(history);
  });
});
