import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { BooksService } from './books.service';
import { IssueBookDto } from './dto/issue-book.dto';
import { BookIssueRecord } from './book-issue-record.entity';
import { Book } from './book.entity';

@Controller('books')
export class BooksController {
  constructor(private bookService: BooksService) {}

  @Post('issue-a-book')
  issueBook(@Body() issueBookDto: IssueBookDto): Promise<BookIssueRecord> {
    return this.bookService.issueBook(issueBookDto);
  }
  @Patch('return-a-book/:bookIssueId')
  returnBook(
    @Param('bookIssueId') bookIssueId: number,
    @Body('fine') fine: number,
  ): Promise<BookIssueRecord> {
    return this.bookService.returnBook(bookIssueId, fine);
  }

  @Get('search-book-by-author/:authorName')
  async findBooksByAuthor(
    @Param('authorName') authorName: string,
  ): Promise<Book[]> {
    return this.bookService.findBooksByAuthor(authorName);
  }

  @Get('get-book-issue-history/:bookId')
  async getBookIssueHistory(
    @Param('bookId') bookId: number,
  ): Promise<BookIssueRecord[]> {
    return this.bookService.getBookIssueHistory(bookId);
  }
}
