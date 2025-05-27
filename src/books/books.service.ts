import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  findAll(): Promise<Book[]> {
    return this.booksRepository.find({ relations: ['reviews'] });
  }

  findOne(id: number): Promise<Book> {
    return this.booksRepository.findOne({
      where: { id },
      relations: ['reviews'],
    });
  }

  create(bookData: Partial<Book>): Promise<Book> {
    const book = this.booksRepository.create(bookData);
    return this.booksRepository.save(book);
  }
}
