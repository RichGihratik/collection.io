/*
  Warnings:

  - You are about to drop the column `theme` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the `ItemCommentRating` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItemRating` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Collection" DROP CONSTRAINT "Collection_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "CollectionRating" DROP CONSTRAINT "CollectionRating_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "CollectionRating" DROP CONSTRAINT "CollectionRating_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "FieldConfig" DROP CONSTRAINT "FieldConfig_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "ItemComment" DROP CONSTRAINT "ItemComment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "ItemComment" DROP CONSTRAINT "ItemComment_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ItemCommentRating" DROP CONSTRAINT "ItemCommentRating_commentId_fkey";

-- DropForeignKey
ALTER TABLE "ItemCommentRating" DROP CONSTRAINT "ItemCommentRating_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "ItemRating" DROP CONSTRAINT "ItemRating_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ItemRating" DROP CONSTRAINT "ItemRating_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "ItemValue" DROP CONSTRAINT "ItemValue_configId_fkey";

-- DropForeignKey
ALTER TABLE "ItemValue" DROP CONSTRAINT "ItemValue_itemId_fkey";

-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "theme",
ADD COLUMN     "themeId" INTEGER;

-- DropTable
DROP TABLE "ItemCommentRating";

-- DropTable
DROP TABLE "ItemRating";

-- CreateTable
CREATE TABLE "CollectionTheme" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CollectionTheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemCommentLike" (
    "ownerId" INTEGER NOT NULL,
    "like" BOOLEAN NOT NULL,
    "commentId" INTEGER NOT NULL,

    CONSTRAINT "ItemCommentLike_pkey" PRIMARY KEY ("commentId","ownerId")
);

-- CreateTable
CREATE TABLE "ItemLike" (
    "ownerId" INTEGER NOT NULL,
    "like" BOOLEAN NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "ItemLike_pkey" PRIMARY KEY ("itemId","ownerId")
);

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "CollectionTheme"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldConfig" ADD CONSTRAINT "FieldConfig_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemValue" ADD CONSTRAINT "ItemValue_configId_fkey" FOREIGN KEY ("configId") REFERENCES "FieldConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemValue" ADD CONSTRAINT "ItemValue_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemCommentLike" ADD CONSTRAINT "ItemCommentLike_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemCommentLike" ADD CONSTRAINT "ItemCommentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "ItemComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionRating" ADD CONSTRAINT "CollectionRating_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionRating" ADD CONSTRAINT "CollectionRating_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemLike" ADD CONSTRAINT "ItemLike_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemLike" ADD CONSTRAINT "ItemLike_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemComment" ADD CONSTRAINT "ItemComment_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemComment" ADD CONSTRAINT "ItemComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
