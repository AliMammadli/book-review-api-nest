import { MigrationInterface, QueryRunner } from "typeorm";

export class RecreateBooksAndReviewsWithRatingsPostgres1748426452958 implements MigrationInterface {
  name = 'RecreateBooksAndReviewsWithRatingsPostgres1748426452958';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop existing tables and views
    await queryRunner.query(`DROP VIEW IF EXISTS book_ratings`);
    await queryRunner.query(`DROP TABLE IF EXISTS "review" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "book" CASCADE`);

    // Create book table with average_rating column
    await queryRunner.query(`
      CREATE TABLE "book" (
        "id" SERIAL NOT NULL,
        "title" character varying NOT NULL,
        "author" character varying NOT NULL,
        "average_rating" DECIMAL(3,2) DEFAULT 0,
        CONSTRAINT "PK_book" PRIMARY KEY ("id")
      )
    `);

    // Create review table
    await queryRunner.query(`
      CREATE TABLE "review" (
        "id" SERIAL NOT NULL,
        "rating" integer NOT NULL,
        "comment" character varying NOT NULL,
        "bookId" integer NOT NULL,
        CONSTRAINT "PK_review" PRIMARY KEY ("id"),
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
      CREATE OR REPLACE VIEW book_ratings AS
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
    await queryRunner.query(`DROP INDEX "IDX_book_average_rating"`);
    await queryRunner.query(`DROP INDEX "IDX_review_bookId"`);
    await queryRunner.query(`DROP TABLE "review"`);
    await queryRunner.query(`DROP TABLE "book"`);
  }
}