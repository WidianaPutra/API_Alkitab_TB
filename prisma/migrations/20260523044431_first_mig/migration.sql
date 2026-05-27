-- CreateTable
CREATE TABLE "BibleBook" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bnumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" INTEGER NOT NULL,
    "bibleBookId" INTEGER NOT NULL,
    CONSTRAINT "Chapter_bibleBookId_fkey" FOREIGN KEY ("bibleBookId") REFERENCES "BibleBook" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Verse" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "chapterId" INTEGER NOT NULL,
    CONSTRAINT "Verse_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "BibleBook_bnumber_key" ON "BibleBook"("bnumber");

-- CreateIndex
CREATE INDEX "BibleBook_name_idx" ON "BibleBook"("name");

-- CreateIndex
CREATE INDEX "Chapter_bibleBookId_idx" ON "Chapter"("bibleBookId");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_number_bibleBookId_key" ON "Chapter"("number", "bibleBookId");

-- CreateIndex
CREATE INDEX "Verse_chapterId_idx" ON "Verse"("chapterId");

-- CreateIndex
CREATE UNIQUE INDEX "Verse_number_chapterId_key" ON "Verse"("number", "chapterId");
