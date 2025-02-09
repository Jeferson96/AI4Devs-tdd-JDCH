export const validCandidateData = {
  firstName: "Albert",
  lastName: "Saelices",
  email: "albert.saelices@gmail.com",
  phone: "656874937",
  address: "Calle Sant Dalmir 2, 5ºB. Barcelona",
  educations: [
    {
      institution: "UC3M",
      title: "Computer Science",
      startDate: "2006-12-31",
      endDate: "2010-12-26"
    }
  ],
  workExperiences: [
    {
      company: "Coca Cola",
      position: "SWE",
      description: "",
      startDate: "2011-01-13",
      endDate: "2013-01-17"
    }
  ],
  cv: {
    filePath: "uploads/1715760936750-cv.pdf",
    fileType: "application/pdf"
  }
};

export const invalidCandidateData = {
  firstName: "",  // Campo vacío inválido
  lastName: "Saelices",
  email: "invalid-email",  // Email inválido
  phone: "123",  // Teléfono muy corto
  address: "Calle Sant Dalmir 2, 5ºB. Barcelona"
}; 