import { MigrationInterface, QueryRunner } from "typeorm";

export class RecreateBooksAndReviewsWithRatingsSqlite1748426452958 implements MigrationInterface {
  name = 'RecreateBooksAndReviewsWithRatingsSqlite1748426452958';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop existing tables and views in correct order for SQLite
    await queryRunner.query(`DROP VIEW IF EXISTS book_ratings`);
    await queryRunner.query(`DROP TABLE IF EXISTS "review"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "book"`);

    // Create book table with average_rating column
    await queryRunner.query(`
      CREATE TABLE "book" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        "title" varchar NOT NULL,
        "author" varchar NOT NULL,
        "average_rating" decimal(3,2) DEFAULT 0
      )
    `);

    // Create review table
    await queryRunner.query(`
      CREATE TABLE "review" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        "rating" integer NOT NULL,
        "comment" varchar NOT NULL,
        "bookId" integer NOT NULL,
        CONSTRAINT "FK_review_book" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE CASCADE
      )
    `);

    // Create indexes
    await queryRunner.query(`
      CREATE INDEX "IDX_review_bookId" ON "review" ("bookId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_book_average_rating" ON "book" ("average_rating")
    `);

    // Create book ratings view
    await queryRunner.query(`
      CREATE VIEW book_ratings AS
      SELECT
        b.id as book_id,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(r.id) as review_count
      FROM book b
      LEFT JOIN review r ON b.id = r."bookId"
      GROUP BY b.id
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW IF EXISTS book_ratings`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_book_average_rating"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_review_bookId"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "review"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "book"`);
  }
}