/*
  Warnings:

  - You are about to drop the `CollectionFieldConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CollectionItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CollectionItemValue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CommentRating` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CollectionFieldConfig" DROP CONSTRAINT "CollectionFieldConfig_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "CollectionItem" DROP CONSTRAINT "CollectionItem_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "CollectionItemValue" DROP CONSTRAINT "CollectionItemValue_configId_fkey";

-- DropForeignKey
ALTER TABLE "CollectionItemValue" DROP CONSTRAINT "CollectionItemValue_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_itemId_fkey";

-- DropForeignKey
ALTER TABLE "CommentRating" DROP CONSTRAINT "CommentRating_commentId_fkey";

-- DropForeignKey
ALTER TABLE "CommentRating" DROP CONSTRAINT "CommentRating_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "ItemRating" DROP CONSTRAINT "ItemRating_itemId_fkey";

-- DropTable
DROP TABLE "CollectionFieldConfig";

-- DropTable
DROP TABLE "CollectionItem";

-- DropTable
DROP TABLE "CollectionItemValue";

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "CommentRating";

-- CreateTable
CREATE TABLE "FieldConfig" (
    "id" SERIAL NOT NULL,
    "collectionId" INTEGER NOT NULL,
    "fieldType" "FieldType"[],

    CONSTRAINT "FieldConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "collectionId" INTEGER NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemTag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ItemTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemValue" (
    "value" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,
    "configId" INTEGER NOT NULL,

    CONSTRAINT "ItemValue_pkey" PRIMARY KEY ("itemId","configId")
);

-- CreateTable
CREATE TABLE "ItemCommentRating" (
    "ownerId" INTEGER NOT NULL,
    "like" BOOLEAN NOT NULL,
    "commentId" INTEGER NOT NULL,

    CONSTRAINT "ItemCommentRating_pkey" PRIMARY KEY ("commentId","ownerId")
);

-- CreateTable
CREATE TABLE "ItemComment" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "ItemComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ItemToItemTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ItemToItemTag_AB_unique" ON "_ItemToItemTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ItemToItemTag_B_index" ON "_ItemToItemTag"("B");

-- AddForeignKey
ALTER TABLE "FieldConfig" ADD CONSTRAINT "FieldConfig_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemValue" ADD CONSTRAINT "ItemValue_configId_fkey" FOREIGN KEY ("configId") REFERENCES "FieldConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemValue" ADD CONSTRAINT "ItemValue_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemCommentRating" ADD CONSTRAINT "ItemCommentRating_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemCommentRating" ADD CONSTRAINT "ItemCommentRating_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "ItemComment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemRating" ADD CONSTRAINT "ItemRating_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemComment" ADD CONSTRAINT "ItemComment_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemComment" ADD CONSTRAINT "ItemComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToItemTag" ADD CONSTRAINT "_ItemToItemTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToItemTag" ADD CONSTRAINT "_ItemToItemTag_B_fkey" FOREIGN KEY ("B") REFERENCES "ItemTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
