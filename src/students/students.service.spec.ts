import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { Repository } from 'typeorm';
import { BookIssueRecord } from '../books/book-issue-record.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('StudentsService', () => {
  let service: StudentsService;
  let bookIssueRecordRepository: Repository<BookIssueRecord>;

  beforeEach(async () => {
    const mockBookIssueRecordRepository = {
      find: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn(), // Do not resolve yet, will resolve later in the tests
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: getRepositoryToken(BookIssueRecord),
          useValue: mockBookIssueRecordRepository,
        },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
    bookIssueRecordRepository = module.get<Repository<BookIssueRecord>>(
      getRepositoryToken(BookIssueRecord),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call getStudentHistory and return the result', async () => {
    const studentId = 1;
    const history: BookIssueRecord[] = [
      new BookIssueRecord(),
      new BookIssueRecord(),
    ];
    jest.spyOn(bookIssueRecordRepository, 'find').mockResolvedValue(history);

    const result = await service.getStudentHistory(studentId);
    expect(bookIssueRecordRepository.find).toHaveBeenCalledWith({
      where: { student: { id: studentId } },
      relations: ['book'],
    });
    expect(result).toBe(history);
  });

  it('should call getStudentBookDashboard and return the result', async () => {
    const dashboard = [{ studentId: 1, bookCount: 3, totalFine: 50 }];

    // Use the same mock instance for getRawMany
    const queryBuilder = bookIssueRecordRepository.createQueryBuilder();
    jest.spyOn(queryBuilder, 'getRawMany').mockResolvedValue(dashboard);

    const result = await service.getStudentBookDashboard();
    expect(result).toBe(dashboard);
  });
});
