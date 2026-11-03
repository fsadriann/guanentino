-- CreateTable
CREATE TABLE "Simulacro" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "areaId" INTEGER NOT NULL,
    "inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fin" TIMESTAMP(3) NOT NULL,
    "terminado" TIMESTAMP(3),

    CONSTRAINT "Simulacro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SimulacroPregunta" (
    "id" SERIAL NOT NULL,
    "simulacroId" INTEGER NOT NULL,
    "preguntaId" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL,
    "opcionId" INTEGER,

    CONSTRAINT "SimulacroPregunta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Simulacro_usuarioId_inicio_idx" ON "Simulacro"("usuarioId", "inicio");

-- CreateIndex
CREATE INDEX "SimulacroPregunta_simulacroId_orden_idx" ON "SimulacroPregunta"("simulacroId", "orden");

-- CreateIndex
CREATE UNIQUE INDEX "SimulacroPregunta_simulacroId_preguntaId_key" ON "SimulacroPregunta"("simulacroId", "preguntaId");

-- AddForeignKey
ALTER TABLE "Simulacro" ADD CONSTRAINT "Simulacro_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Simulacro" ADD CONSTRAINT "Simulacro_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulacroPregunta" ADD CONSTRAINT "SimulacroPregunta_simulacroId_fkey" FOREIGN KEY ("simulacroId") REFERENCES "Simulacro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulacroPregunta" ADD CONSTRAINT "SimulacroPregunta_preguntaId_fkey" FOREIGN KEY ("preguntaId") REFERENCES "Pregunta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
