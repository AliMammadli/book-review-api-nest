import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { GetBooksQueryDto } from '../books/dto/get-books-query.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) { }

  async findAll(queryDto?: GetBooksQueryDto): Promise<Book[]> {
    const queryBuilder = this.booksRepository.createQueryBuilder('book')
      .leftJoinAndSelect('book.reviews', 'review')
      .leftJoin('book_ratings', 'ratings', 'book.id = ratings.book_id')
      .addSelect('ratings.avg_rating', 'book_average_rating')
      .addSelect('ratings.review_count', 'book_review_count');

    if (queryDto?.minRating !== undefined) {
      queryBuilder.andWhere('ratings.avg_rating >= :minRating', { minRating: queryDto.minRating });
    }

    if (queryDto?.sortBy) {
      let orderBy: string;
      if (queryDto.sortBy === 'avgRating') {
        orderBy = 'ratings.avg_rating';
      } else {
        orderBy = `book.${queryDto.sortBy}`;
      }
      queryBuilder.orderBy(orderBy, queryDto.order || 'ASC');
    } else {
      queryBuilder.orderBy('book.id', 'ASC');
    }

    const books = await queryBuilder.getMany();
    return books;
  }

  async findOne(id: number): Promise<Book> {
    return this.booksRepository.findOne({
      where: { id },
      relations: ['reviews'],
    });
  }

  async create(bookData: Partial<Book>): Promise<Book> {
    const book = this.booksRepository.create(bookData);
    return this.booksRepository.save(book);
  }
}