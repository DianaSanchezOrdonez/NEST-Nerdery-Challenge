/*
  Warnings:

  - You are about to drop the `BlackListTokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "image_id" INTEGER;

-- DropTable
DROP TABLE "BlackListTokens";

-- CreateTable
CREATE TABLE "Attachment" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "ext" TEXT NOT NULL,
    "content_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Attachment.uuid_unique" ON "Attachment"("uuid");

-- AddForeignKey
ALTER TABLE "Book" ADD FOREIGN KEY ("image_id") REFERENCES "Attachment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
