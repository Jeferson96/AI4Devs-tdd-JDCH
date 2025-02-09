import { PrismaClient } from '@prisma/client';
import { MockContext, createMockContext } from '../mocks/prisma.mock';

export let mockContext: MockContext;
export let prisma: PrismaClient;

export const setupTestDB = () => {
  beforeEach(() => {
    mockContext = createMockContext();
    prisma = mockContext.prisma;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
}; 