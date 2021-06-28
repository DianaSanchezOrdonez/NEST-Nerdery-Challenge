-- CreateTable
CREATE TABLE "BlackListTokens" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);
