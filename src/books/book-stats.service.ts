import { Injectable } from '@nestjs/common';
import { Review } from '../reviews/review.entity';

@Injectable()
export class BookStatsService {

  calculateAvgRating(reviews: Review[]): number {
    if (!reviews || reviews.length === 0) {
      return 0;
    }
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const avgRating = totalRating / reviews.length;
    return Math.round(avgRating * 10) / 10;
  }
}
