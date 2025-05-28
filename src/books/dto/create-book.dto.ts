import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ description: 'The title of the book' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'The author of the book' })
  @IsString()
  @IsNotEmpty()
  author: string;
}
