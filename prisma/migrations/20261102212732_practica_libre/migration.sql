-- CreateTable
CREATE TABLE "RespuestaPractica" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "preguntaId" INTEGER NOT NULL,
    "opcionId" INTEGER NOT NULL,
    "acierto" BOOLEAN NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RespuestaPractica_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RespuestaPractica_usuarioId_fecha_idx" ON "RespuestaPractica"("usuarioId", "fecha");

-- CreateIndex
CREATE INDEX "RespuestaPractica_usuarioId_preguntaId_idx" ON "RespuestaPractica"("usuarioId", "preguntaId");

-- AddForeignKey
ALTER TABLE "RespuestaPractica" ADD CONSTRAINT "RespuestaPractica_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RespuestaPractica" ADD CONSTRAINT "RespuestaPractica_preguntaId_fkey" FOREIGN KEY ("preguntaId") REFERENCES "Pregunta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
