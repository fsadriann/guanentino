-- CreateTable
CREATE TABLE "IntentoLogin" (
    "id" SERIAL NOT NULL,
    "usuario" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntentoLogin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IntentoLogin_usuario_fecha_idx" ON "IntentoLogin"("usuario", "fecha");

-- CreateIndex
CREATE INDEX "IntentoLogin_ip_fecha_idx" ON "IntentoLogin"("ip", "fecha");
