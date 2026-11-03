-- CreateIndex
CREATE INDEX "Pregunta_areaId_idx" ON "Pregunta"("areaId");

-- CreateIndex
CREATE INDEX "PreguntaDelDia_preguntaId_fecha_idx" ON "PreguntaDelDia"("preguntaId", "fecha");
