-- CreateEnum
CREATE TYPE "MotivoReporte" AS ENUM ('RESPUESTA_INCORRECTA', 'ENUNCIADO_CONFUSO', 'ERROR_DE_TEXTO', 'OTRO');

-- CreateEnum
CREATE TYPE "EstadoReporte" AS ENUM ('PENDIENTE', 'RESUELTO', 'DESCARTADO');

-- CreateTable
CREATE TABLE "ReportePregunta" (
    "id" SERIAL NOT NULL,
    "preguntaId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "motivo" "MotivoReporte" NOT NULL,
    "comentario" TEXT,
    "estado" "EstadoReporte" NOT NULL DEFAULT 'PENDIENTE',
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportePregunta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReportePregunta_estado_fecha_idx" ON "ReportePregunta"("estado", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "ReportePregunta_usuarioId_preguntaId_key" ON "ReportePregunta"("usuarioId", "preguntaId");

-- AddForeignKey
ALTER TABLE "ReportePregunta" ADD CONSTRAINT "ReportePregunta_preguntaId_fkey" FOREIGN KEY ("preguntaId") REFERENCES "Pregunta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportePregunta" ADD CONSTRAINT "ReportePregunta_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
