-- AlterTable
ALTER TABLE "FieldConfig" ALTER COLUMN "fieldType" SET NOT NULL,
ALTER COLUMN "fieldType" SET DATA TYPE "FieldType" USING "fieldType"[1];
