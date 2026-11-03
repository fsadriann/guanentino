-- AlterTable
ALTER TABLE "RespuestaPractica" ADD COLUMN     "sesion" TEXT;

-- CreateIndex
CREATE INDEX "RespuestaPractica_usuarioId_sesion_idx" ON "RespuestaPractica"("usuarioId", "sesion");
