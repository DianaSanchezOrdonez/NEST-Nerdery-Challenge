/*
  Warnings:

  - A unique constraint covering the columns `[full_name]` on the table `Author` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Author.full_name_unique" ON "Author"("full_name");

-- CreateIndex
CREATE UNIQUE INDEX "Category.name_unique" ON "Category"("name");
