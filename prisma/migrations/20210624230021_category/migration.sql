/*
  Warnings:

  - Added the required column `category_id` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "category_id" INTEGER NOT NULL,
ALTER COLUMN "quantity" SET DEFAULT 0,
ALTER COLUMN "active" SET DEFAULT false;

-- AddForeignKey
ALTER TABLE "Book" ADD FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
