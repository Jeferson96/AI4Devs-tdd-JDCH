import { addCandidate } from '../../../application/services/candidateService';
import { validCandidateData } from '../../utils/fixtures/candidate.fixtures';
import { prismaMock } from '../../utils/mocks/prisma.mock';

describe('Candidate Service Tests', () => {
  describe('addCandidate', () => {
    test('debería crear un candidato exitosamente', async () => {
      // Mock para la creación del candidato
      prismaMock.candidate.create.mockResolvedValue({
        id: 1,
        firstName: validCandidateData.firstName,
        lastName: validCandidateData.lastName,
        email: validCandidateData.email,
        phone: validCandidateData.phone,
        address: validCandidateData.address
      });

      // Mock para la creación de educación
      prismaMock.education.create.mockResolvedValue({
        id: 1,
        institution: validCandidateData.educations[0].institution,
        title: validCandidateData.educations[0].title,
        startDate: new Date(validCandidateData.educations[0].startDate),
        endDate: validCandidateData.educations[0].endDate ? new Date(validCandidateData.educations[0].endDate) : null,
        candidateId: 1
      });

      // Mock para la creación de experiencia laboral
      prismaMock.workExperience.create.mockResolvedValue({
        id: 1,
        company: validCandidateData.workExperiences[0].company,
        position: validCandidateData.workExperiences[0].position,
        description: validCandidateData.workExperiences[0].description,
        startDate: new Date(validCandidateData.workExperiences[0].startDate),
        endDate: validCandidateData.workExperiences[0].endDate ? new Date(validCandidateData.workExperiences[0].endDate) : null,
        candidateId: 1
      });

      // Mock para la creación del CV
      prismaMock.resume.create.mockResolvedValue({
        id: 1,
        ...validCandidateData.cv,
        candidateId: 1,
        uploadDate: new Date()
      });

      const result = await addCandidate(validCandidateData);

      expect(result).toHaveProperty('id', 1);
      expect(result.email).toBe(validCandidateData.email);
      expect(prismaMock.candidate.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.education.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.workExperience.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.resume.create).toHaveBeenCalledTimes(1);
    });

    test('debería manejar error de email duplicado', async () => {
      prismaMock.candidate.create.mockRejectedValue({
        code: 'P2002',
        message: 'Unique constraint failed on the fields: (`email`)'
      });

      await expect(addCandidate(validCandidateData))
        .rejects
        .toThrow('The email already exists in the database');
    });

    test('debería crear candidato sin educación', async () => {
      const candidateDataWithoutEducation = {
        ...validCandidateData,
        educations: undefined
      };

      const mockSavedCandidate = {
        id: 1,
        firstName: candidateDataWithoutEducation.firstName,
        lastName: candidateDataWithoutEducation.lastName,
        email: candidateDataWithoutEducation.email,
        phone: candidateDataWithoutEducation.phone,
        address: candidateDataWithoutEducation.address
      };

      prismaMock.candidate.create.mockResolvedValue(mockSavedCandidate);

      const result = await addCandidate(candidateDataWithoutEducation);

      expect(result).toHaveProperty('id', 1);
      expect(prismaMock.education.create).not.toHaveBeenCalled();
    });

    test('debería crear candidato sin experiencia laboral', async () => {
      const candidateDataWithoutExperience = {
        ...validCandidateData,
        workExperiences: undefined
      };

      const mockSavedCandidate = {
        id: 1,
        firstName: candidateDataWithoutExperience.firstName,
        lastName: candidateDataWithoutExperience.lastName,
        email: candidateDataWithoutExperience.email,
        phone: candidateDataWithoutExperience.phone,
        address: candidateDataWithoutExperience.address
      };

      prismaMock.candidate.create.mockResolvedValue(mockSavedCandidate);

      const result = await addCandidate(candidateDataWithoutExperience);

      expect(result).toHaveProperty('id', 1);
      expect(prismaMock.workExperience.create).not.toHaveBeenCalled();
    });

    test('debería crear candidato sin CV', async () => {
      const candidateDataWithoutCV = {
        ...validCandidateData,
        cv: undefined
      };

      const mockSavedCandidate = {
        id: 1,
        firstName: candidateDataWithoutCV.firstName,
        lastName: candidateDataWithoutCV.lastName,
        email: candidateDataWithoutCV.email,
        phone: candidateDataWithoutCV.phone,
        address: candidateDataWithoutCV.address
      };

      prismaMock.candidate.create.mockResolvedValue(mockSavedCandidate);

      const result = await addCandidate(candidateDataWithoutCV);

      expect(result).toHaveProperty('id', 1);
      expect(prismaMock.resume.create).not.toHaveBeenCalled();
    });

    test('debería manejar error de base de datos', async () => {
      prismaMock.candidate.create.mockRejectedValue(new Error('Database connection error'));

      await expect(addCandidate(validCandidateData))
        .rejects
        .toThrow('Database connection error');
    });
  });
}); 