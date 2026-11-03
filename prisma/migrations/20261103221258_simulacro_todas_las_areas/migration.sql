/*
  Warnings:

  - You are about to drop the column `areaId` on the `Simulacro` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Simulacro" DROP CONSTRAINT "Simulacro_areaId_fkey";

-- AlterTable
ALTER TABLE "Simulacro" DROP COLUMN "areaId";
