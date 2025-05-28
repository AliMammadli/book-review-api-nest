import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsIn, Min } from 'class-validator';

export class GetBooksQueryDto {
  @ApiProperty({
    description: 'Minimum average rating for filtering books (e.g., 3 to get books with avg rating >= 3)',
    required: false,
    type: Number,
    example: 3,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minRating?: number;

  @ApiProperty({
    description: 'Field to sort by (e.g., "avgRating", "title")',
    required: false,
    example: 'avgRating',
  })
  @IsOptional()
  @IsString()
  @IsIn(['avgRating', 'title', 'author'])
  sortBy?: 'avgRating' | 'title' | 'author';

  @ApiProperty({
    description: 'Order of sorting (ASC or DESC)',
    required: false,
    example: 'DESC',
  })
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';
}