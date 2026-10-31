/*
  Warnings:

  - The primary key for the `PreguntaDelDia` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `areaId` to the `PreguntaDelDia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PreguntaDelDia" DROP CONSTRAINT "PreguntaDelDia_pkey",
ADD COLUMN     "areaId" INTEGER NOT NULL,
ADD CONSTRAINT "PreguntaDelDia_pkey" PRIMARY KEY ("fecha", "areaId");

-- AddForeignKey
ALTER TABLE "PreguntaDelDia" ADD CONSTRAINT "PreguntaDelDia_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
