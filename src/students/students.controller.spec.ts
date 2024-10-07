import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { BookIssueRecord } from '../books/book-issue-record.entity';

describe('StudentsController', () => {
  let controller: StudentsController;
  let mockStudentsService: Partial<StudentsService>;

  beforeEach(async () => {
    // Create a mock for StudentsService
    mockStudentsService = {
      getStudentHistory: jest.fn(),
      getStudentBookDashboard: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [
        {
          provide: StudentsService,
          useValue: mockStudentsService, // Inject the mock service
        },
      ],
    }).compile();

    controller = module.get<StudentsController>(StudentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Test for getStudentHistory method
  it('should call getStudentHistory with the correct parameters', async () => {
    const studentId = 1;
    const history: BookIssueRecord[] = [
      new BookIssueRecord(),
      new BookIssueRecord(),
    ]; // Mock response
    (mockStudentsService.getStudentHistory as jest.Mock).mockResolvedValue(
      history,
    );

    const result = await controller.getStudentHistory(studentId);
    expect(mockStudentsService.getStudentHistory).toHaveBeenCalledWith(
      studentId,
    );
    expect(result).toBe(history);
  });

  // Test for getStudentBookDashboard method
  it('should call getStudentBookDashboard and return the result', async () => {
    const dashboard: BookIssueRecord[] = [
      new BookIssueRecord(),
      new BookIssueRecord(),
    ]; // Mock response
    (
      mockStudentsService.getStudentBookDashboard as jest.Mock
    ).mockResolvedValue(dashboard);

    const result = await controller.getStudentBookDashboard();
    expect(mockStudentsService.getStudentBookDashboard).toHaveBeenCalled();
    expect(result).toBe(dashboard);
  });
});
