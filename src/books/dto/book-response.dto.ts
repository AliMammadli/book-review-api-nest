import { ApiProperty } from '@nestjs/swagger';
import { ReviewResponseDto } from '../../reviews/dto/review-response.dto';

export class BookResponseDto {
  @ApiProperty({ description: 'Unique identifier of the book', example: 1 })
  id: number;

  @ApiProperty({ description: 'The title of the book', example: 'The Great Gatsby' })
  title: string;

  @ApiProperty({ description: 'The author of the book', example: 'F. Scott Fitzgerald' })
  author: string;

  @ApiProperty({ description: 'The average rating of the book based on reviews', example: 4.5 })
  avgRating: number;

  @ApiProperty({ description: 'A list of reviews for this book', type: [ReviewResponseDto] })
  reviews: ReviewResponseDto[];
}
