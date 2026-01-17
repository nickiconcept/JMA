
import { User, UserRole, Student, Result, Term, Pin, ClassDefinition, Subject, PromotionStatus, Attendance, SchoolConfig, PsychomotorRecord } from "../types";
import { CURRENT_SESSION, CURRENT_TERM, SCHOOL_NAME } from "../constants";

export const mockClasses: ClassDefinition[] = [
  { id: 'JSS1', name: 'JSS 1', formMasterId: 'form-1' },
  { id: 'JSS2', name: 'JSS 2', formMasterId: 'form-2' },
  { id: 'SSS2', name: 'SSS 2', formMasterId: 'form-3' },
];

export const mockSubjects: Subject[] = [
  { id: 'MATH', name: 'Mathematics', isCore: true },
  { id: 'ENG', name: 'English Language', isCore: true },
  { id: 'BSC', name: 'Basic Science', isCore: false },
  { id: 'CIVIC', name: 'Civic Education', isCore: true },
];

export const mockUsers: User[] = [
  { id: 'admin-1', name: 'Admin User', email: 'admin@jere.edu.ng', role: UserRole.ADMIN, isActive: true },
  { id: 'princ-1', name: 'Mr. Principal', email: 'principal@jere.edu.ng', role: UserRole.PRINCIPAL, isActive: true },
  
  // Teachers
  { 
    id: 'teach-1', name: 'Mrs. Adewale', email: 'adewale@jere.edu.ng', role: UserRole.TEACHER, isActive: true, 
    assignedClassIds: ['JSS1'], assignedSubjectIds: ['MATH'] 
  },
  { 
    id: 'teach-2', name: 'Mr. Balogun', email: 'balogun@jere.edu.ng', role: UserRole.TEACHER, isActive: true, 
    assignedClassIds: ['JSS1', 'SSS2'], assignedSubjectIds: ['ENG', 'CIVIC'] 
  },

  // Form Masters (Who are also teachers usually, but for simplicity defined here)
  { 
    id: 'form-1', name: 'Mr. Okonkwo', email: 'okonkwo@jere.edu.ng', role: UserRole.FORM_MASTER, isActive: true, 
    assignedClassIds: ['JSS1'], assignedSubjectIds: ['BSC'] 
  },
];

export const mockStudents: Student[] = [
  { id: 'JMA/24/001', name: 'Ibrahim Musa', classId: 'JSS1', promotionStatus: PromotionStatus.PENDING },
  { id: 'JMA/24/002', name: 'Chidinma Obi', classId: 'JSS1', promotionStatus: PromotionStatus.PENDING },
  { id: 'JMA/24/003', name: 'Yusuf Sani', classId: 'JSS1', promotionStatus: PromotionStatus.PENDING },
  { id: 'JMA/24/004', name: 'Emeka Eze', classId: 'SSS2', promotionStatus: PromotionStatus.PENDING },
];

export const mockResults: Result[] = [
  {
    id: 'res-1',
    studentId: 'JMA/24/001',
    subjectId: 'MATH',
    session: CURRENT_SESSION,
    term: CURRENT_TERM,
    assessment: { ca1: 8, ca2: 7, assignment: 9, notes: 10, exam: 45 },
    total: 79,
    grade: 'A',
    teacherRemark: 'Excellent work',
    isApproved: true,
    isLocked: true,
    auditHistory: []
  },
  {
    id: 'res-2',
    studentId: 'JMA/24/001',
    subjectId: 'ENG',
    session: CURRENT_SESSION,
    term: CURRENT_TERM,
    assessment: { ca1: 5, ca2: 6, assignment: 5, notes: 5, exam: 30 },
    total: 51,
    grade: 'C',
    isApproved: false,
    isLocked: false,
    auditHistory: []
  }
];

export const mockAttendance: Attendance[] = [
  { id: 'att-1', studentId: 'JMA/24/001', classId: 'JSS1', date: new Date().toISOString().split('T')[0], status: 'PRESENT', term: CURRENT_TERM, session: CURRENT_SESSION }
];

export const mockPins: Pin[] = [
  { code: '1234-5678-9012', usageCount: 0, maxUsage: 5, generatedBy: 'admin-1', expiryDate: '2025-12-31', isUsed: false }
];

export const mockSchoolConfig: SchoolConfig = {
  schoolName: SCHOOL_NAME,
  address: "Behind Zara Kabir Filling Station, Ungwan Shakwera, Kagarko LGA, Kaduna State",
  principalName: "Mr. J. Okonkwo",
  activeSession: CURRENT_SESSION,
  activeTerm: CURRENT_TERM,
  nextTermBegins: "2025-01-08",
  nextTermEnds: "2025-04-12",
  reportCardLayout: {
    headingColor: 'blue',
    subjectLabel: 'Subject',
    ca1Label: 'CA 1',
    ca2Label: 'CA 2',
    assignLabel: 'Assign',
    notesLabel: 'Notes',
    examLabel: 'Exam',
    totalLabel: 'Total',
    gradeLabel: 'Grade',
    remarkLabel: 'Remark'
  }
};

export const mockPsychomotor: PsychomotorRecord[] = [
  {
    id: 'psy-1',
    studentId: 'JMA/24/001',
    session: CURRENT_SESSION,
    term: CURRENT_TERM,
    affective: { punctuality: 4, attendance: 5, reliability: 4, neatness: 3, politeness: 5 },
    psychomotor: { handwriting: 4, games: 3, communication: 5, creativity: 4, leadership: 4 }
  }
];
