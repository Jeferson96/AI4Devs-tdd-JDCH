import { validateCandidateData } from '../../../application/validator';
import { validCandidateData } from '../../utils/fixtures/candidate.fixtures';

describe('Validator Tests', () => {
  describe('validateCandidateData', () => {
    // Pruebas para datos válidos
    test('debería aceptar datos válidos del candidato', () => {
      expect(() => validateCandidateData(validCandidateData)).not.toThrow();
    });

    // Pruebas para el nombre
    describe('Validación de nombre', () => {
      test('debería rechazar firstName vacío', () => {
        const invalidData = { ...validCandidateData, firstName: '' };
        expect(() => validateCandidateData(invalidData)).toThrow('Invalid name');
      });

      test('debería rechazar firstName muy corto', () => {
        const invalidData = { ...validCandidateData, firstName: 'A' };
        expect(() => validateCandidateData(invalidData)).toThrow('Invalid name');
      });

      test('debería rechazar firstName con caracteres inválidos', () => {
        const invalidData = { ...validCandidateData, firstName: 'John123' };
        expect(() => validateCandidateData(invalidData)).toThrow('Invalid name');
      });
    });

    // Pruebas para el email
    describe('Validación de email', () => {
      test('debería rechazar email inválido', () => {
        const invalidData = { ...validCandidateData, email: 'invalid-email' };
        expect(() => validateCandidateData(invalidData)).toThrow('Invalid email');
      });

      test('debería rechazar email vacío', () => {
        const invalidData = { ...validCandidateData, email: '' };
        expect(() => validateCandidateData(invalidData)).toThrow('Invalid email');
      });
    });

    // Pruebas para el teléfono
    describe('Validación de teléfono', () => {
      test('debería rechazar teléfono con formato inválido', () => {
        const invalidData = { ...validCandidateData, phone: '123456' };
        expect(() => validateCandidateData(invalidData)).toThrow('Invalid phone');
      });

      test('debería aceptar teléfono con formato válido', () => {
        const validPhone = { ...validCandidateData, phone: '666777888' };
        expect(() => validateCandidateData(validPhone)).not.toThrow();
      });
    });

    // Pruebas para la educación
    describe('Validación de educación', () => {
      test('debería validar educación con datos correctos', () => {
        expect(() => validateCandidateData(validCandidateData)).not.toThrow();
      });

      test('debería rechazar institución vacía', () => {
        const invalidData = {
          ...validCandidateData,
          educations: [{
            ...validCandidateData.educations[0],
            institution: ''
          }]
        };
        expect(() => validateCandidateData(invalidData)).toThrow('Invalid institution');
      });

      test('debería rechazar fecha de inicio inválida', () => {
        const invalidData = {
          ...validCandidateData,
          educations: [{
            ...validCandidateData.educations[0],
            startDate: 'invalid-date'
          }]
        };
        expect(() => validateCandidateData(invalidData)).toThrow('Invalid date');
      });
    });

    // Pruebas para experiencia laboral
    describe('Validación de experiencia laboral', () => {
      test('debería validar experiencia con datos correctos', () => {
        expect(() => validateCandidateData(validCandidateData)).not.toThrow();
      });

      test('debería rechazar compañía vacía', () => {
        const invalidData = {
          ...validCandidateData,
          workExperiences: [{
            ...validCandidateData.workExperiences[0],
            company: ''
          }]
        };
        expect(() => validateCandidateData(invalidData)).toThrow('Invalid company');
      });

      test('debería rechazar descripción muy larga', () => {
        const invalidData = {
          ...validCandidateData,
          workExperiences: [{
            ...validCandidateData.workExperiences[0],
            description: 'a'.repeat(201)
          }]
        };
        expect(() => validateCandidateData(invalidData)).toThrow('Invalid description');
      });
    });

    // Pruebas para CV
    describe('Validación de CV', () => {
      test('debería validar CV con datos correctos', () => {
        expect(() => validateCandidateData(validCandidateData)).not.toThrow();
      });

      test('debería rechazar CV sin ruta de archivo', () => {
        const invalidData = {
          ...validCandidateData,
          cv: {
            fileType: 'application/pdf'
          }
        };
        expect(() => validateCandidateData(invalidData)).toThrow('Invalid CV data');
      });

      test('debería rechazar CV sin tipo de archivo', () => {
        const invalidData = {
          ...validCandidateData,
          cv: {
            filePath: 'path/to/file.pdf'
          }
        };
        expect(() => validateCandidateData(invalidData)).toThrow('Invalid CV data');
      });
    });
  });
}); 