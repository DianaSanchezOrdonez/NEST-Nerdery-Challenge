/*
  Warnings:

  - You are about to drop the column `uuid` on the `Attachment` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Attachment.uuid_unique";

-- AlterTable
ALTER TABLE "Attachment" DROP COLUMN "uuid";
