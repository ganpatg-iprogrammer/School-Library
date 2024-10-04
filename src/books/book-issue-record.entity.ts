import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { Student } from '../students/student.entity';
import { Book } from './book.entity';

@Entity()
export class BookIssueRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, (student) => student.bookIssueRecords)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Book)
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @Column({ type: 'date' })
  issueDate: Date;

  @Column({ type: 'date', nullable: true })
  returnDate: Date;

  @Column({ type: 'decimal', nullable: true })
  fine: number;
}
