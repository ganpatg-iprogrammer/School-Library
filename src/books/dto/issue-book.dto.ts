import { IsNotEmpty } from 'class-validator';

export class IssueBookDto {
  @IsNotEmpty()
  studentId: number;

  @IsNotEmpty()
  bookId: number;
}
