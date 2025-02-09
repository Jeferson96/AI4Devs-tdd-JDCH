import { PrismaClient } from '@prisma/client';

// Exportar una única instancia de PrismaClient
const prisma = new PrismaClient();

export default prisma; 