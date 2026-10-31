-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "avatarColor" TEXT NOT NULL DEFAULT 'azul',
ADD COLUMN     "avatarIcono" TEXT,
ADD COLUMN     "ocultoEnRanking" BOOLEAN NOT NULL DEFAULT false;
