-- AlterTable
ALTER TABLE "Pregunta" ADD COLUMN     "imagenAlt" TEXT,
ADD COLUMN     "imagenId" INTEGER;

-- CreateTable
CREATE TABLE "Imagen" (
    "id" SERIAL NOT NULL,
    "datos" BYTEA NOT NULL,
    "tipo" TEXT NOT NULL,
    "ancho" INTEGER NOT NULL,
    "alto" INTEGER NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Imagen_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pregunta" ADD CONSTRAINT "Pregunta_imagenId_fkey" FOREIGN KEY ("imagenId") REFERENCES "Imagen"("id") ON DELETE SET NULL ON UPDATE CASCADE;
