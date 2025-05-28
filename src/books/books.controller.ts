import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiOkResponse, ApiCreatedResponse, ApiExtraModels, getSchemaPath, ApiQuery } from '@nestjs/swagger';
import { Book } from './book.entity';
import { BooksService } from './books.service';
import { BookStatsService } from './book-stats.service';
import { ReviewsService } from 'src/reviews/reviews.service';
import { CreateBookDto } from './dto/create-book.dto';
import { CreateReviewDto } from '../reviews/dto/create-review.dto';
import { BookResponseDto } from './dto/book-response.dto';
import { ReviewResponseDto } from '../reviews/dto/review-response.dto';
import { Review } from 'src/reviews/review.entity';
import { GetBooksQueryDto } from './dto/get-books-query.dto';


@ApiTags('books')
@ApiExtraModels(Book, Review, BookResponseDto, ReviewResponseDto, GetBooksQueryDto)
@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly bookStatsService: BookStatsService,
    private readonly reviewsService: ReviewsService
  ) { }

  @Get()
  @ApiOperation({ summary: 'Get all books' })
  @ApiQuery({ type: GetBooksQueryDto })
  @ApiOkResponse({
    description: 'Returns an array of books with average ratings.',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(BookResponseDto) },
    },
  })
  async getBooks(@Query() queryDto: GetBooksQueryDto): Promise<BookResponseDto[]> {
    const books = await this.booksService.findAll(queryDto);
    return books.map(book => {
      const avgRating = this.bookStatsService.calculateAvgRating(book.reviews);
      const bookResponse = new BookResponseDto();
      bookResponse.id = book.id;
      bookResponse.title = book.title;
      bookResponse.author = book.author;
      bookResponse.avgRating = avgRating;
      bookResponse.reviews = book.reviews ? book.reviews.map(review => {
        const reviewResponse = new ReviewResponseDto();
        reviewResponse.id = review.id;
        reviewResponse.rating = review.rating;
        reviewResponse.comment = review.comment;
        reviewResponse.bookId = review.bookId;
        return reviewResponse;
      }) : [];

      return bookResponse;
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a book by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the book', example: 1, type: Number })
  @ApiOkResponse({ description: 'Returns the book with the specified ID and its reviews.', type: BookResponseDto })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  async getBook(@Param('id', ParseIntPipe) id: number): Promise<BookResponseDto> {
    const book = await this.booksService.findOne(id);

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    const avgRating = this.bookStatsService.calculateAvgRating(book.reviews);

    const bookResponse = new BookResponseDto();
    bookResponse.id = book.id;
    bookResponse.title = book.title;
    bookResponse.author = book.author;
    bookResponse.avgRating = avgRating;
    bookResponse.reviews = book.reviews ? book.reviews.map(review => {
      const reviewResponse = new ReviewResponseDto();
      reviewResponse.id = review.id;
      reviewResponse.rating = review.rating;
      reviewResponse.comment = review.comment;
      reviewResponse.bookId = review.bookId;
      return reviewResponse;
    }) : [];

    return bookResponse;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiBody({ type: CreateBookDto, description: 'The data for the new book' })
  @ApiCreatedResponse({ description: 'The book has been successfully created.', type: Book })
  async createBook(@Body() bookData: CreateBookDto): Promise<Book> {
    return this.booksService.create(bookData);
  }

  @Post(':id/reviews')
  @ApiOperation({ summary: 'Create a review for a book' })
  @ApiParam({ name: 'id', description: 'The ID of the book to review', example: 1, type: Number })
  @ApiBody({ type: CreateReviewDto, description: 'The data for the new review' })
  @ApiCreatedResponse({ description: 'The review has been successfully created.', type: ReviewResponseDto })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  async createReview(
    @Param('id', ParseIntPipe) bookId: number,
    @Body() reviewData: CreateReviewDto,
  ): Promise<ReviewResponseDto> {
    const createdReview = await this.reviewsService.createReview(bookId, reviewData);
    const reviewResponse = new ReviewResponseDto();
    reviewResponse.id = createdReview.id;
    reviewResponse.rating = createdReview.rating;
    reviewResponse.comment = createdReview.comment;
    reviewResponse.bookId = createdReview.bookId;

    return reviewResponse;
  }
}