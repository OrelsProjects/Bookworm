
-- Create pg_trgm extension
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- CreateTable
CREATE TABLE "app_user" (
    "user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "display_name" TEXT,
    "profile_picture_url" TEXT,
    "bio" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "gender" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "goodreads_id" VARCHAR,
    "roleId" INTEGER,

    CONSTRAINT "app_user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "app_user_meta_data" (
    "user_id" TEXT NOT NULL,
    "referer" TEXT,
    "from_list" TEXT,

    CONSTRAINT "app_user_meta_data_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "book" (
    "book_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "language" TEXT,
    "number_of_pages" INTEGER,
    "isbn" TEXT,
    "thumbnail_url" TEXT,
    "medium_image_url" TEXT,
    "genres" TEXT[],
    "isbn10" TEXT,
    "date_published" DATE,
    "original_date_published" DATE,
    "authors" TEXT[],
    "description" TEXT,
    "publisher" TEXT,
    "is_deleted" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "thumbnail_color" TEXT,

    CONSTRAINT "book_pkey" PRIMARY KEY ("book_id")
);

-- CreateTable
CREATE TABLE "book_goodreads_raw_data" (
    "book_id" INTEGER NOT NULL,
    "raw_data" TEXT,

    CONSTRAINT "book_goodreads_raw_data_pkey" PRIMARY KEY ("book_id")
);

-- CreateTable
CREATE TABLE "book_import_status" (
    "id" SERIAL NOT NULL,
    "import_id" INTEGER,
    "book_id" INTEGER,
    "import_status" VARCHAR,
    "book_title" VARCHAR,
    "book_author" VARCHAR,
    "error_details" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "is_deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "book_import_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book_in_list" (
    "list_id" TEXT NOT NULL,
    "book_id" INTEGER NOT NULL,
    "comments" TEXT,
    "updated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "book_in_list_pkey" PRIMARY KEY ("list_id","book_id")
);

-- CreateTable
CREATE TABLE "book_in_list_visits" (
    "visit_id" SERIAL NOT NULL,
    "visitor_id" TEXT,
    "list_id" TEXT NOT NULL,
    "book_id" INTEGER NOT NULL,
    "visited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "book_in_list_visits_pkey" PRIMARY KEY ("visit_id")
);

-- CreateTable
CREATE TABLE "book_visits" (
    "visit_id" SERIAL NOT NULL,
    "visitor_id" TEXT,
    "book_id" INTEGER NOT NULL,
    "visited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "book_visits_pkey" PRIMARY KEY ("visit_id")
);

-- CreateTable
CREATE TABLE "books_import" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR,
    "start_time" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "end_time" TIMESTAMPTZ(6),
    "status" VARCHAR,
    "is_deleted" BOOLEAN DEFAULT false,
    "message" VARCHAR,

    CONSTRAINT "books_import_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "books_list" (
    "list_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "description" TEXT,
    "public_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "list_name" TEXT NOT NULL,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "published_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "genres" TEXT[],
    "is_genres_editable" BOOLEAN NOT NULL DEFAULT true,
    "visits_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "books_list_pkey" PRIMARY KEY ("list_id")
);

-- CreateTable
CREATE TABLE "goodreads_data" (
    "goodreads_rating" DOUBLE PRECISION,
    "goodreads_url" TEXT,
    "goodreads_ratings_count" INTEGER,
    "updated_at" TIMESTAMP(3),
    "status" TEXT,
    "book_id" INTEGER NOT NULL,

    CONSTRAINT "goodreads_data_pkey" PRIMARY KEY ("book_id")
);

-- CreateTable
CREATE TABLE "list_visits" (
    "visit_id" SERIAL NOT NULL,
    "visitor_id" TEXT,
    "list_id" TEXT NOT NULL,
    "visited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "list_visits_pkey" PRIMARY KEY ("visit_id")
);

-- CreateTable
CREATE TABLE "reading_status" (
    "reading_status_id" SERIAL NOT NULL,
    "status_name" TEXT NOT NULL,

    CONSTRAINT "reading_status_pkey" PRIMARY KEY ("reading_status_id")
);

-- CreateTable
CREATE TABLE "role" (
    "role_id" SERIAL NOT NULL,
    "role_name" TEXT NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "user_book" (
    "user_book_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "book_id" INTEGER NOT NULL,
    "reading_status_id" INTEGER NOT NULL DEFAULT 2,
    "suggestion_source" TEXT,
    "user_comments" TEXT,
    "date_added" TIMESTAMP(3) NOT NULL,
    "user_rating" DOUBLE PRECISION,
    "reading_start_date" TIMESTAMP(3),
    "reading_finish_date" TIMESTAMP(3),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_book_pkey" PRIMARY KEY ("user_book_id")
);

-- CreateTable
CREATE TABLE "user_books_list_match" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "list_id" TEXT NOT NULL,
    "match_rate" DOUBLE PRECISION,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_books_list_match_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "app_user_user_id_key" ON "app_user"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "app_user_email_key" ON "app_user"("email");

-- CreateIndex
CREATE INDEX "idx_app_user_display_name_trgm" ON "app_user" USING GIN ("display_name" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "idx_book_genres" ON "book"("genres");

-- CreateIndex
CREATE INDEX "idx_book_title_trgm" ON "book" USING GIN ("title" gin_trgm_ops);

-- CreateIndex
CREATE UNIQUE INDEX "books_list_list_id_key" ON "books_list"("list_id");

-- CreateIndex
CREATE UNIQUE INDEX "books_list_public_url_key" ON "books_list"("public_url");

-- CreateIndex
CREATE INDEX "idx_books_list_name_trgm" ON "books_list" USING GIN ("list_name" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "list_genres_index" ON "books_list"("genres");

-- CreateIndex
CREATE INDEX "list_name_index" ON "books_list"("list_name");

-- CreateIndex
CREATE UNIQUE INDEX "list_userId_listName_key" ON "books_list"("user_id", "list_name");

-- CreateIndex
CREATE UNIQUE INDEX "user_book_bookId_userId_key" ON "user_book"("book_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_books_list_match_user_id_list_id_key" ON "user_books_list_match"("user_id", "list_id");

-- AddForeignKey
ALTER TABLE "app_user_meta_data" ADD CONSTRAINT "app_user_meta_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_in_list" ADD CONSTRAINT "book_in_list_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("book_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "book_in_list" ADD CONSTRAINT "book_in_list_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "books_list"("list_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "book_in_list_visits" ADD CONSTRAINT "book_in_list_visits_list_id_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("book_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "book_in_list_visits" ADD CONSTRAINT "book_in_list_visits_visitor_id_fkey" FOREIGN KEY ("visitor_id") REFERENCES "app_user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_visits" ADD CONSTRAINT "book_visits_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("book_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "book_visits" ADD CONSTRAINT "book_visits_visitor_id_fkey" FOREIGN KEY ("visitor_id") REFERENCES "app_user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "books_import" ADD CONSTRAINT "books_import_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("user_id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "books_list" ADD CONSTRAINT "books_list_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goodreads_data" ADD CONSTRAINT "goodreads_data_bookId_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("book_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "list_visits" ADD CONSTRAINT "list_visits_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "books_list"("list_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_visits" ADD CONSTRAINT "list_visits_visitor_id_fkey" FOREIGN KEY ("visitor_id") REFERENCES "app_user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_book" ADD CONSTRAINT "user_book_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("book_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_book" ADD CONSTRAINT "user_book_reading_status_id_fkey" FOREIGN KEY ("reading_status_id") REFERENCES "reading_status"("reading_status_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_book" ADD CONSTRAINT "user_book_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_books_list_match" ADD CONSTRAINT "user_books_list_match_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "books_list"("list_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_books_list_match" ADD CONSTRAINT "user_books_list_match_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

