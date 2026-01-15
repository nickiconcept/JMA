import { User, UserRole, Student, Result, Term, Pin, ClassDefinition, Subject, PromotionStatus, Attendance } from "../types";
import { CURRENT_SESSION, CURRENT_TERM } from "../constants";

export const mockClasses: ClassDefinition[] = [
  { id: 'JSS1-A', name: 'JSS 1', arm: 'A', formMasterId: 'form-1' },
  { id: 'JSS1-B', name: 'JSS 1', arm: 'B', formMasterId: 'form-2' },
  { id: 'SSS2-A', name: 'SSS 2', arm: 'A', formMasterId: 'form-3' },
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
    assignedClassIds: ['JSS1-A', 'JSS1-B'], assignedSubjectIds: ['MATH'] 
  },
  { 
    id: 'teach-2', name: 'Mr. Balogun', email: 'balogun@jere.edu.ng', role: UserRole.TEACHER, isActive: true, 
    assignedClassIds: ['JSS1-A', 'SSS2-A'], assignedSubjectIds: ['ENG', 'CIVIC'] 
  },

  // Form Masters (Who are also teachers usually, but for simplicity defined here)
  { 
    id: 'form-1', name: 'Mr. Okonkwo', email: 'okonkwo@jere.edu.ng', role: UserRole.FORM_MASTER, isActive: true, 
    assignedClassIds: ['JSS1-A'], assignedSubjectIds: ['BSC'] 
  },
];

export const mockStudents: Student[] = [
  { id: 'JMA/24/001', name: 'Ibrahim Musa', classId: 'JSS1-A', promotionStatus: PromotionStatus.PENDING },
  { id: 'JMA/24/002', name: 'Chidinma Obi', classId: 'JSS1-A', promotionStatus: PromotionStatus.PENDING },
  { id: 'JMA/24/003', name: 'Yusuf Sani', classId: 'JSS1-B', promotionStatus: PromotionStatus.PENDING },
  { id: 'JMA/24/004', name: 'Emeka Eze', classId: 'SSS2-A', promotionStatus: PromotionStatus.PENDING },
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
  { id: 'att-1', studentId: 'JMA/24/001', classId: 'JSS1-A', date: new Date().toISOString().split('T')[0], status: 'PRESENT', term: CURRENT_TERM, session: CURRENT_SESSION }
];

export const mockPins: Pin[] = [
  { code: '1234-5678-9012', usageCount: 0, maxUsage: 5, generatedBy: 'admin-1', expiryDate: '2025-12-31', isUsed: false }
];
