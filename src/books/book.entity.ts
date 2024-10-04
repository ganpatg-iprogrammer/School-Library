import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Author } from '../authors/author.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'date' })
  publishedAt: Date;

  @ManyToMany(() => Author, (author) => author.books)
  @JoinTable({ name: 'book_authors' })
  authors: Author[];
}
