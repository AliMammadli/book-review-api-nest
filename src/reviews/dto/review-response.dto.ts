import { ApiProperty } from '@nestjs/swagger';

export class ReviewResponseDto {
  @ApiProperty({ description: 'Unique identifier of the review', example: 101 })
  id: number;

  @ApiProperty({ description: 'The rating given (1-5)', example: 4 })
  rating: number;

  @ApiProperty({ description: 'The comment provided with the review', example: 'Really enjoyed this book!' })
  comment: string;

  @ApiProperty({ description: 'The ID of the book this review belongs to', example: 1 })
  bookId: number;
}
