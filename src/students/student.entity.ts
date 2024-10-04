import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BookIssueRecord } from '../books/book-issue-record.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  grade: number;

  @OneToMany(() => BookIssueRecord, (record) => record.student)
  bookIssueRecords: BookIssueRecord[];
}
