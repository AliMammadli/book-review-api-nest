import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';

interface Book {
    id: number;
    title: string;
    author: string;
    avgRating: number;
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
        { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', avgRating: 4.5, reviews: [] },
        { id: 2, title: '1984', author: 'George Orwell', avgRating: 4.0, reviews: [] },
        { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', avgRating: 4.7, reviews: [] },
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
        book.avgRating = book.reviews.length > 0 ? Math.round((book.reviews.reduce((acc, review) => acc + review.rating, 0) / book.reviews.length) * 10) / 10 : review.rating;
        return review;
    }
}
