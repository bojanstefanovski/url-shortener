/*
  Warnings:

  - A unique constraint covering the columns `[longUrl]` on the table `Url` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Url_longUrl_key" ON "Url"("longUrl");
