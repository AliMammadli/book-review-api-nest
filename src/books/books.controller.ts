import { Body, Controller, Get, Param, Post } from '@nestjs/common';

interface Book {
    id: number;
    title: string;
    author: string;
    reviews: Review[];
}

interface Review {
    id: number;
    bookId: number;
    rating: number;
    comment: string;
}

@Controller('books')
export class BooksController {
    private books = [
        { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', reviews: [] },
        { id: 2, title: '1984', author: 'George Orwell', reviews: [] },
        { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', reviews: [] },
    ];

    @Get()
    getBooks() {
        return this.books;
    }

    @Get(':id')
    getBook(@Param('id') id: string) {
        return this.books.find((book) => book.id === parseInt(id));
    }

    @Post()
    createBook(@Body() book: Book) {
        this.books.push(book);
        return book;
    }

    @Post(':id/reviews')
    createReview(@Param('id') id: string, @Body() review: Review) {
        const book = this.books.find((book) => book.id === parseInt(id));
        book.reviews.push(review);
        return review;
    }
}
