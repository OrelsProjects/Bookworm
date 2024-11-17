-- DropForeignKey
ALTER TABLE "app_user_meta_data" DROP CONSTRAINT "app_user_meta_data_user_id_fkey";

-- DropForeignKey
ALTER TABLE "book_in_list" DROP CONSTRAINT "book_in_list_book_id_fkey";

-- DropForeignKey
ALTER TABLE "book_in_list" DROP CONSTRAINT "book_in_list_list_id_fkey";

-- DropForeignKey
ALTER TABLE "book_in_list_visits" DROP CONSTRAINT "book_in_list_visits_list_id_book_id_fkey";

-- DropForeignKey
ALTER TABLE "book_in_list_visits" DROP CONSTRAINT "book_in_list_visits_visitor_id_fkey";

-- DropForeignKey
ALTER TABLE "book_visits" DROP CONSTRAINT "book_visits_book_id_fkey";

-- DropForeignKey
ALTER TABLE "book_visits" DROP CONSTRAINT "book_visits_visitor_id_fkey";

-- DropForeignKey
ALTER TABLE "books_import" DROP CONSTRAINT "books_import_user_id_fkey";

-- DropForeignKey
ALTER TABLE "books_list" DROP CONSTRAINT "books_list_user_id_fkey";

-- DropForeignKey
ALTER TABLE "goodreads_data" DROP CONSTRAINT "goodreads_data_bookId_fkey";

-- DropForeignKey
ALTER TABLE "list_visits" DROP CONSTRAINT "list_visits_list_id_fkey";

-- DropForeignKey
ALTER TABLE "list_visits" DROP CONSTRAINT "list_visits_visitor_id_fkey";

-- DropForeignKey
ALTER TABLE "user_book" DROP CONSTRAINT "user_book_book_id_fkey";

-- DropForeignKey
ALTER TABLE "user_book" DROP CONSTRAINT "user_book_reading_status_id_fkey";

-- DropForeignKey
ALTER TABLE "user_book" DROP CONSTRAINT "user_book_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_books_list_match" DROP CONSTRAINT "user_books_list_match_list_id_fkey";

-- DropForeignKey
ALTER TABLE "user_books_list_match" DROP CONSTRAINT "user_books_list_match_user_id_fkey";

-- DropTable
DROP TABLE "app_user";

-- DropTable
DROP TABLE "app_user_meta_data";

-- DropTable
DROP TABLE "book";

-- DropTable
DROP TABLE "book_goodreads_raw_data";

-- DropTable
DROP TABLE "book_import_status";

-- DropTable
DROP TABLE "book_in_list";

-- DropTable
DROP TABLE "book_in_list_visits";

-- DropTable
DROP TABLE "book_visits";

-- DropTable
DROP TABLE "books_import";

-- DropTable
DROP TABLE "books_list";

-- DropTable
DROP TABLE "goodreads_data";

-- DropTable
DROP TABLE "list_visits";

-- DropTable
DROP TABLE "reading_status";

-- DropTable
DROP TABLE "role";

-- DropTable
DROP TABLE "user_book";

-- DropTable
DROP TABLE "user_books_list_match";

