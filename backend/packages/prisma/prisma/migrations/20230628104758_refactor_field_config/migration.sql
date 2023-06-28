/*
  Warnings:

  - The primary key for the `FieldConfig` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `FieldConfig` table. All the data in the column will be lost.
  - The primary key for the `ItemValue` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `configId` on the `ItemValue` table. All the data in the column will be lost.
  - Added the required column `collectionId` to the `ItemValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fieldName` to the `ItemValue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ItemValue" DROP CONSTRAINT "ItemValue_configId_fkey";

-- AlterTable
ALTER TABLE "FieldConfig" DROP CONSTRAINT "FieldConfig_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "FieldConfig_pkey" PRIMARY KEY ("name", "collectionId");

-- AlterTable
ALTER TABLE "ItemValue" DROP CONSTRAINT "ItemValue_pkey",
DROP COLUMN "configId",
ADD COLUMN     "collectionId" INTEGER NOT NULL,
ADD COLUMN     "fieldName" TEXT NOT NULL,
ADD CONSTRAINT "ItemValue_pkey" PRIMARY KEY ("itemId", "fieldName", "collectionId");

-- AddForeignKey
ALTER TABLE "ItemValue" ADD CONSTRAINT "ItemValue_fieldName_collectionId_fkey" FOREIGN KEY ("fieldName", "collectionId") REFERENCES "FieldConfig"("name", "collectionId") ON DELETE CASCADE ON UPDATE CASCADE;
