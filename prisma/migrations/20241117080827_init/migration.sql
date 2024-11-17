/*
  Warnings:

  - You are about to drop the column `roleId` on the `app_user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "app_user" DROP COLUMN "roleId",
ADD COLUMN     "email_verified" TIMESTAMP(3),
ADD COLUMN     "role_id" INTEGER,
ALTER COLUMN "goodreads_id" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- RenameForeignKey
ALTER TABLE "book_in_list_visits" RENAME CONSTRAINT "book_in_list_visits_list_id_book_id_fkey" TO "book_in_list_visits_book_id_fkey";

-- RenameForeignKey
ALTER TABLE "goodreads_data" RENAME CONSTRAINT "goodreads_data_bookId_fkey" TO "goodreads_data_book_id_fkey";

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
