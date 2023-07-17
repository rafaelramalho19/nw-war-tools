/*
  Warnings:

  - Added the required column `endTime` to the `VodAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `VodAnalysis` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Twitch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "accessToken" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_VodAnalysis" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL
);
INSERT INTO "new_VodAnalysis" ("id", "status", "url") SELECT "id", "status", "url" FROM "VodAnalysis";
DROP TABLE "VodAnalysis";
ALTER TABLE "new_VodAnalysis" RENAME TO "VodAnalysis";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
