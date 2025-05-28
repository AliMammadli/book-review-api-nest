import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from '../src/books/books.module';
import { ReviewsModule } from '../src/reviews/reviews.module';
import { Book } from '../src/books/book.entity';
import { Review } from '../src/reviews/review.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('BooksController (e2e)', () => {
  let app: INestApplication;
  let book1Id: number;
  let book2Id: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Book, Review],
          synchronize: true,
        }),
        BooksModule,
        ReviewsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    // Clear the database
    const bookRepository = app.get(getRepositoryToken(Book));
    const reviewRepository = app.get(getRepositoryToken(Review));
    await reviewRepository.clear();
    await bookRepository.clear();

    // Create test books
    const book1Response = await request(app.getHttpServer())
      .post('/books')
      .send({
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger'
      });

    const book2Response = await request(app.getHttpServer())
      .post('/books')
      .send({
        title: '1984',
        author: 'George Orwell'
      });

    book1Id = book1Response.body.id;
    book2Id = book2Response.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /books', () => {
    it('should create a new book', async () => {
      const response = await request(app.getHttpServer())
        .post('/books')
        .send({
          title: 'New Book',
          author: 'New Author'
        })
        .expect(201);

      expect(response.body).toEqual({
        title: 'New Book',
        author: 'New Author',
        id: expect.any(Number)
      });
    });
  });

  describe('POST /books/:id/reviews', () => {
    it('should create a review for a book', async () => {
      const response = await request(app.getHttpServer())
        .post(`/books/${book2Id}/reviews`)
        .send({
          rating: 2,
          comment: 'Bad book'
        })
        .expect(201);

      expect(response.body).toEqual({
        id: expect.any(Number),
        rating: 2,
        comment: 'Bad book',
        bookId: book2Id
      });
    });

    it('should return 404 when book does not exist', async () => {
      await request(app.getHttpServer())
        .post('/books/999/reviews')
        .send({
          rating: 2,
          comment: 'Bad book'
        })
        .expect(404);
    });
  });

  describe('GET /books', () => {
    it('should return all books with their reviews and average ratings', async () => {
      // Add a review to book2
      await request(app.getHttpServer())
        .post(`/books/${book2Id}/reviews`)
        .send({
          rating: 2,
          comment: 'Bad book'
        });

      const response = await request(app.getHttpServer())
        .get('/books')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: book1Id,
            title: 'The Catcher in the Rye',
            author: 'J.D. Salinger',
            avgRating: 0,
            reviews: []
          }),
          expect.objectContaining({
            id: book2Id,
            title: '1984',
            author: 'George Orwell',
            avgRating: 2,
            reviews: [
              expect.objectContaining({
                rating: 2,
                comment: 'Bad book',
                bookId: book2Id
              })
            ]
          })
        ])
      );
    });
  });

  describe('GET /books/:id', () => {
    it('should return a specific book with its reviews and average rating', async () => {
      const response = await request(app.getHttpServer())
        .get(`/books/${book1Id}`)
        .expect(200);

      expect(response.body).toEqual({
        id: book1Id,
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        avgRating: 0,
        reviews: []
      });
    });

    it('should return 404 when book does not exist', async () => {
      await request(app.getHttpServer())
        .get('/books/999')
        .expect(404);
    });
  });
}); 