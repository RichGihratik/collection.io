/*
  Warnings:

  - Added the required column `name` to the `FieldConfig` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FieldConfig" ADD COLUMN     "name" TEXT NOT NULL;
