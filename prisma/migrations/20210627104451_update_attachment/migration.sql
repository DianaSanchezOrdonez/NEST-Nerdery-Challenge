/*
  Warnings:

  - You are about to drop the column `content_type` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `ext` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `path` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `Attachment` table. All the data in the column will be lost.
  - Added the required column `url` to the `Attachment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Attachment.uuid_unique";

-- AlterTable
ALTER TABLE "Attachment" DROP COLUMN "content_type",
DROP COLUMN "ext",
DROP COLUMN "path",
DROP COLUMN "uuid",
ADD COLUMN     "url" TEXT NOT NULL;
