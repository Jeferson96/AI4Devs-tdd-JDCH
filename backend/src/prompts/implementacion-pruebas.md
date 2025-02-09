# Plan de Implementación de Pruebas Unitarias para Backend

## 1. Análisis Inicial del Proyecto

### 1.1 Configuración Actual
El proyecto ya cuenta con:
- Jest configurado en `jest.config.js`
- TypeScript configurado
- Prisma como ORM
- Express como framework web

### 1.2 Dependencias Necesarias Adicionales
```bash
npm install --save-dev @types/jest jest ts-jest @types/supertest supertest jest-mock-extended
```

## 2. Fases de Implementación

### Fase 1: Configuración del Entorno de Pruebas

#### Objetivo
Preparar el ambiente para ejecutar pruebas unitarias aisladas.

#### Acciones
1. Crear directorio de pruebas:
```bash
mkdir -p src/__tests__/unit
```

2. Configurar Mock de Prisma - Crear archivo `src/__tests__/utils/prisma.mock.ts`:
```typescript
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

export type Context = {
  prisma: PrismaClient;
};

export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>;
};

export const createMockContext = (): MockContext => {
  return {
    prisma: mockDeep<PrismaClient>(),
  };
};
```

### Fase 2: Pruebas de Validación de Datos

#### Objetivo
Verificar que las validaciones del formulario funcionan correctamente.

#### Acciones
1. Crear archivo `src/__tests__/unit/validator.test.ts`:
```typescript
import { validateCandidateData } from '../../application/validator';

describe('Validator Tests', () => {
  describe('validateCandidateData', () => {
    test('debería validar datos correctos del candidato', () => {
      const validData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '666777888',
        address: 'Calle Principal 123'
      };
      
      expect(() => validateCandidateData(validData)).not.toThrow();
    });

    test('debería rechazar email inválido', () => {
      const invalidData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'correo-invalido',
        phone: '666777888',
        address: 'Calle Principal 123'
      };
      
      expect(() => validateCandidateData(invalidData)).toThrow('Invalid email');
    });
  });
});
```

### Fase 3: Pruebas del Servicio de Candidatos

#### Objetivo
Verificar la lógica de negocio para el manejo de candidatos.

#### Acciones
1. Crear archivo `src/__tests__/unit/candidateService.test.ts`:
```typescript
import { addCandidate } from '../../application/services/candidateService';
import { createMockContext, MockContext } from '../utils/prisma.mock';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client');

let mockContext: MockContext;
let prisma: PrismaClient;

beforeEach(() => {
  mockContext = createMockContext();
  prisma = mockContext.prisma;
});

describe('Candidate Service Tests', () => {
  test('debería crear un candidato exitosamente', async () => {
    const candidateData = {
      firstName: 'María',
      lastName: 'García',
      email: 'maria@example.com',
      phone: '666777888',
      address: 'Avenida Principal 456'
    };

    mockContext.prisma.candidate.create.mockResolvedValue({
      id: 1,
      ...candidateData
    });

    const result = await addCandidate(candidateData);
    
    expect(result).toHaveProperty('id', 1);
    expect(result.email).toBe(candidateData.email);
  });

  test('debería manejar error de email duplicado', async () => {
    const candidateData = {
      firstName: 'Ana',
      lastName: 'López',
      email: 'ana@example.com',
      phone: '666999888'
    };

    mockContext.prisma.candidate.create.mockRejectedValue({
      code: 'P2002',
      message: 'Unique constraint failed on the fields: (`email`)'
    });

    await expect(addCandidate(candidateData))
      .rejects
      .toThrow('The email already exists in the database');
  });
});
```

### Fase 4: Pruebas de Integración de Endpoints

#### Objetivo
Verificar la correcta integración entre controladores y servicios.

#### Acciones
1. Crear archivo `src/__tests__/integration/candidates.test.ts`:
```typescript
import request from 'supertest';
import { app } from '../../index';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';

jest.mock('@prisma/client');

const prisma = mockDeep<PrismaClient>();

describe('Candidate Endpoints', () => {
  test('POST /candidates debería crear un nuevo candidato', async () => {
    const candidateData = {
      firstName: 'Pedro',
      lastName: 'Sánchez',
      email: 'pedro@example.com',
      phone: '666555444',
      address: 'Plaza Mayor 789'
    };

    const response = await request(app)
      .post('/candidates')
      .send(candidateData)
      .expect(201);

    expect(response.body).toHaveProperty('message', 'Candidate added successfully');
    expect(response.body.data).toHaveProperty('email', candidateData.email);
  });
});
```

## 3. Buenas Prácticas

### 3.1 Organización de Pruebas
- Mantener una estructura clara de directorios (`unit`, `integration`)
- Usar nombres descriptivos para los archivos de prueba
- Agrupar pruebas relacionadas en bloques `describe`

### 3.2 Mocking
- Usar mocks para aislar las pruebas de la base de datos
- Implementar mocks específicos para cada caso de prueba
- Limpiar los mocks después de cada prueba

### 3.3 Aserciones
- Usar aserciones específicas y descriptivas
- Verificar tanto casos exitosos como casos de error
- Incluir mensajes descriptivos en las aserciones

## 4. Ejecución de Pruebas

Para ejecutar las pruebas:
```bash
npm test                 # Ejecutar todas las pruebas
npm test -- --watch     # Modo watch
npm test -- --coverage  # Generar reporte de cobertura
```

---
