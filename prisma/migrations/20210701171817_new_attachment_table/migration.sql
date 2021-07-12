/*
  Warnings:

  - You are about to drop the column `url` on the `Attachment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `Attachment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `content_type` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ext` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - The required column `uuid` was added to the `Attachment` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Attachment" DROP COLUMN "url",
ADD COLUMN     "content_type" TEXT NOT NULL,
ADD COLUMN     "ext" TEXT NOT NULL,
ADD COLUMN     "path" TEXT NOT NULL,
ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Attachment.uuid_unique" ON "Attachment"("uuid");
