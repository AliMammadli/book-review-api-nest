import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { Book } from '../books/book.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) { }

  async createReview(bookId: number, reviewData: CreateReviewDto): Promise<Review> {
    const book = await this.booksRepository.findOne({ where: { id: bookId } });

    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not found`);
    }

    const newReview = this.reviewsRepository.create({
      ...reviewData,
      book: book,
      bookId: bookId
    });

    return this.reviewsRepository.save(newReview);
  }
}
