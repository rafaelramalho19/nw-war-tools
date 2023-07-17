-- CreateTable
CREATE TABLE "VodAnalysis" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "VodAnalysis_url_key" ON "VodAnalysis"("url");
