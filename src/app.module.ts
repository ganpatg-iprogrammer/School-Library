import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { BooksModule } from './books/books.module';
import { AuthorsModule } from './authors/authors.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './students/student.entity';
import { BookIssueRecord } from './books/book-issue-record.entity';
import { Author } from './authors/author.entity';
import { Book } from './books/book.entity';

@Module({
  imports: [
    StudentsModule,
    BooksModule,
    AuthorsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Ganpat@122',
      database: 'school_library',
      entities: [Student, Book, BookIssueRecord, Author],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
