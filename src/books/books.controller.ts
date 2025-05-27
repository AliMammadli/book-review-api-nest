import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Book } from './book.entity';
import { BooksService } from './books.service';
import { BookStatsService } from './book-stats.service';
import { ReviewsService } from 'src/reviews/reviews.service';

interface Review {
  rating: number;
  comment: string;
}

@Controller('books')
export class BooksController {
  // private books = [
  //     { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', avgRating: 4.5, reviews: [] },
  //     { id: 2, title: '1984', author: 'George Orwell', avgRating: 4.0, reviews: [] },
  //     { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', avgRating: 4.7, reviews: [] },
  // ];

  constructor(
    private readonly booksService: BooksService,
    private readonly bookStatsService: BookStatsService,
    private readonly reviewsService: ReviewsService
  ) { }

  @Get()
  async getBooks(): Promise<Book[]> {
    const books = await this.booksService.findAll();
    return books.map(book => ({
      ...book,
      avgRating: this.bookStatsService.calculateAvgRating(book.reviews)
    }));
  }

  @Get(':id')
  async getBook(@Param('id') id: string) {
    const book = await this.booksService.findOne(parseInt(id));

    return {
      ...book,
      avgRating: this.bookStatsService.calculateAvgRating(book.reviews)
    };
  }

  @Post()
  async createBook(@Body() bookData: Partial<Book>): Promise<Book> {
    return this.booksService.create(bookData);
  }

  @Post(':id/reviews')
  async createReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() reviewData: { rating: number; comment: string },
  ): Promise<Review> {
    return this.reviewsService.createReview(id, reviewData);
  }
}
