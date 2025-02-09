import { prismaMock } from './src/__tests__/utils/mocks/prisma.mock';

// Mock del módulo lib/prisma.ts
jest.mock('./src/lib/prisma', () => ({
    __esModule: true,
    default: prismaMock,
})); 