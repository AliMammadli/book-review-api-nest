import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ description: 'The title of the book' })
  title: string;

  @ApiProperty({ description: 'The author of the book' })
  author: string;
}
