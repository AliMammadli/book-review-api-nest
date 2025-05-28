import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { Book } from './book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksService } from './books.service';
import { BookStatsService } from './book-stats.service';
import { ReviewsModule } from '../reviews/reviews.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    ReviewsModule,
  ],
  controllers: [BooksController],
  providers: [BooksService, BookStatsService],
})
export class BooksModule {}
