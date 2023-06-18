-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('int', 'text', 'richtext', 'bool', 'date');

-- CreateTable
CREATE TABLE "Collection" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionFieldConfig" (
    "id" SERIAL NOT NULL,
    "collectionId" INTEGER NOT NULL,
    "fieldType" "FieldType"[],

    CONSTRAINT "CollectionFieldConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "collectionId" INTEGER NOT NULL,

    CONSTRAINT "CollectionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionItemValue" (
    "value" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,
    "configId" INTEGER NOT NULL,

    CONSTRAINT "CollectionItemValue_pkey" PRIMARY KEY ("itemId","configId")
);

-- CreateTable
CREATE TABLE "CollectionRating" (
    "rating" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "collectionId" INTEGER NOT NULL,

    CONSTRAINT "CollectionRating_pkey" PRIMARY KEY ("ownerId","collectionId")
);

-- CreateTable
CREATE TABLE "ItemRating" (
    "ownerId" INTEGER NOT NULL,
    "like" BOOLEAN NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "ItemRating_pkey" PRIMARY KEY ("itemId","ownerId")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentRating" (
    "ownerId" INTEGER NOT NULL,
    "like" BOOLEAN NOT NULL,
    "commentId" INTEGER NOT NULL,

    CONSTRAINT "CommentRating_pkey" PRIMARY KEY ("commentId","ownerId")
);

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionFieldConfig" ADD CONSTRAINT "CollectionFieldConfig_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionItem" ADD CONSTRAINT "CollectionItem_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionItemValue" ADD CONSTRAINT "CollectionItemValue_configId_fkey" FOREIGN KEY ("configId") REFERENCES "CollectionFieldConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionItemValue" ADD CONSTRAINT "CollectionItemValue_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "CollectionItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionRating" ADD CONSTRAINT "CollectionRating_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionRating" ADD CONSTRAINT "CollectionRating_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemRating" ADD CONSTRAINT "ItemRating_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemRating" ADD CONSTRAINT "ItemRating_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "CollectionItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "CollectionItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentRating" ADD CONSTRAINT "CommentRating_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentRating" ADD CONSTRAINT "CommentRating_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
