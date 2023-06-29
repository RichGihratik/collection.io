/*
  Warnings:

  - You are about to drop the column `themeId` on the `Collection` table. All the data in the column will be lost.
  - The primary key for the `CollectionTheme` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `CollectionTheme` table. All the data in the column will be lost.
  - The primary key for the `ItemTag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ItemTag` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Collection" DROP CONSTRAINT "Collection_themeId_fkey";

-- DropForeignKey
ALTER TABLE "_ItemToItemTag" DROP CONSTRAINT "_ItemToItemTag_B_fkey";

-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "themeId",
ADD COLUMN     "themeName" TEXT;

-- AlterTable
ALTER TABLE "CollectionTheme" DROP CONSTRAINT "CollectionTheme_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "CollectionTheme_pkey" PRIMARY KEY ("name");

-- AlterTable
ALTER TABLE "ItemTag" DROP CONSTRAINT "ItemTag_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ItemTag_pkey" PRIMARY KEY ("name");

-- AlterTable
ALTER TABLE "_ItemToItemTag" ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_themeName_fkey" FOREIGN KEY ("themeName") REFERENCES "CollectionTheme"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToItemTag" ADD CONSTRAINT "_ItemToItemTag_B_fkey" FOREIGN KEY ("B") REFERENCES "ItemTag"("name") ON DELETE CASCADE ON UPDATE CASCADE;
