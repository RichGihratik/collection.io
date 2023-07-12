/*
  Warnings:

  - Made the column `ts_eng` on table `Collection` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ts_rus` on table `Collection` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ts_eng` on table `Item` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ts_rus` on table `Item` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ts_eng` on table `ItemComment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ts_rus` on table `ItemComment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ts_eng` on table `ItemValue` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ts_rus` on table `ItemValue` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "imageUrl" TEXT,
ALTER COLUMN "ts_eng" SET NOT NULL,
ALTER COLUMN "ts_rus" SET NOT NULL;

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "ts_eng" SET NOT NULL,
ALTER COLUMN "ts_rus" SET NOT NULL;

-- AlterTable
ALTER TABLE "ItemComment" ALTER COLUMN "ts_eng" SET NOT NULL,
ALTER COLUMN "ts_rus" SET NOT NULL;

-- AlterTable
ALTER TABLE "ItemValue" ALTER COLUMN "ts_eng" SET NOT NULL,
ALTER COLUMN "ts_rus" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT;
