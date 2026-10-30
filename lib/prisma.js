import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adaptador = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const global_ = globalThis;
export const prisma = global_.prisma ?? new PrismaClient({ adapter: adaptador });

if (process.env.NODE_ENV !== "production") global_.prisma = prisma;