import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './reviews.service';
import { Review } from './review.entity';
import { Book } from '../books/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Book])],
  providers: [ReviewsService],
  exports: [
    ReviewsService,
    TypeOrmModule.forFeature([Review, Book]),
  ]
})
export class ReviewsModule {}
