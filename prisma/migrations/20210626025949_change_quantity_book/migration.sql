/*
  Warnings:

  - You are about to drop the column `count` on the `Book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "count",
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0;
