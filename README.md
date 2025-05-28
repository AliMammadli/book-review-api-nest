# Book Review API (NestJS)

## Description

A RESTful API for managing books and their reviews, built with NestJS.

## Features

* Create, retrieve, and list books.
* Add reviews to books.
* View books with their average ratings and review counts.
* Filter and sort books based on various criteria (e.g., minimum rating, title, author, average rating).
* API documentation with Swagger.
* Database integration with TypeORM (PostgreSQL and SQLite).
* End-to-end tests with Jest and Supertest.

## Technologies Used

* NestJS
* TypeORM
* PostgreSQL
* SQLite
* Docker
* Swagger
* Jest
* Supertest
* TypeScript

## Prerequisites

Before you begin, ensure you have met the following requirements:

* Node.js (LTS version recommended)
* npm or yarn
* Docker

## Getting Started

Follow these steps to get your development environment running.

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/AliMammadli/book-review-api-nest
    cd book-review-api-nest
    ```

2.  **Install dependencies:**

    ```bash
    npm install # or yarn install
    ```

3.  **Environment Variables:**

    Create `.env.development.local` and `.env.production.local` files in the project root based on the `.env.example` file. Configure your database credentials and other settings.

4.  **Database Setup with Docker (PostgreSQL):**

    Ensure Docker is running. Start the PostgreSQL container using Docker Compose:

    ```bash
    docker-compose up -d postgres
    ```

5.  **Run Migrations:**

    Apply the database schema migrations for your chosen environment.

    For development (SQLite):
    ```bash
    npm run migration:run:dev
    ```

    For production (PostgreSQL):
    ```bash
    npm run migration:run:prod
    ```

6.  **Start the application:**

    Start the application for your chosen environment.

    For development (with watch mode):
    ```bash
    npm run start:dev
    ```

    For production:
    ```bash
    npm run start:prod
    ```

The application should now be running, typically on port 50000 (or the port specified in your environment file).

## Environment Variables

Configure the following variables in your `.env.development.local` and `.env.production.local` files:

*   `DB_TYPE`: `sqlite` or `postgres`
*   `DB_HOST`: Database host (e.g., `localhost` for Docker)
*   `DB_PORT`: Database port (e.g., `5432` for PostgreSQL)
*   `DB_USERNAME`: Database username
*   `DB_PASSWORD`: Database password
*   `DB_DATABASE`: Database name
*   `DB_SSL`: Set to `true` or `false` for PostgreSQL SSL connection
*   `PORT`: Application port (e.g., `50000`)

## API Documentation (Swagger)

Once the application is running, you can access the interactive API documentation (Swagger UI) at:

```
http://localhost:<PORT>/api
```

(Replace `<PORT>` with your application's port, e.g., `50000`)

## Running Tests

*   **Run end-to-end tests:**
    ```bash
    npm run test:e2e
    ```

## Folder Structure

```
book-review-api-nest/
├── src/
│   ├── books/         # Book module (controller, service, entities, DTOs)
│   ├── reviews/       # Review module (controller, service, entities, DTOs)
│   ├── config/        # Configuration files (e.g., database config)
│   ├── database/      # TypeORM migrations
│   ├── main.ts        # Application entry point
│   └── ...
├── test/          # End-to-end tests
├── docker-compose.yml # Docker setup for services like PostgreSQL
├── .env.example     # Example environment file
├── .env.development.local # Development environment file
├── .env.production.local  # Production environment file
├── package.json   # Project dependencies and scripts
└── README.md      # Project README
```

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

Get in touch 📬:

✉️ Email: ali1mammadli@gmail.com

🔗 LinkedIn: https://linkedin.com/in/ali1mammadli
