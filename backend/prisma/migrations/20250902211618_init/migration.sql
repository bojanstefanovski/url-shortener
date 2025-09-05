-- CreateTable
CREATE TABLE "public"."Url" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "longUrl" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Url_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Url_slug_key" ON "public"."Url"("slug");
