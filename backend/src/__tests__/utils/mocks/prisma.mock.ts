import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

// Crear el mock antes de cualquier otra operación
export const prismaMock = mockDeep<PrismaClient>();

// Mock más completo que incluye el singleton
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    ...prismaMock,
    $connect: jest.fn(),
    $disconnect: jest.fn()
  };
  return {
    PrismaClient: jest.fn().mockImplementation(() => mockPrisma)
  };
});

// Limpiar y reiniciar el mock antes de cada prueba
beforeEach(() => {
  jest.clearAllMocks();
  // Reiniciar el estado del mock
  prismaMock.$connect.mockResolvedValue(undefined);
  prismaMock.$disconnect.mockResolvedValue(undefined);
});

export type Context = {
  prisma: PrismaClient;
};

export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>;
};

export const createMockContext = (): MockContext => {
  return {
    prisma: prismaMock
  };
}; 