-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_VodAnalysis" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING'
);
INSERT INTO "new_VodAnalysis" ("id", "url") SELECT "id", "url" FROM "VodAnalysis";
DROP TABLE "VodAnalysis";
ALTER TABLE "new_VodAnalysis" RENAME TO "VodAnalysis";
CREATE UNIQUE INDEX "VodAnalysis_url_key" ON "VodAnalysis"("url");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
