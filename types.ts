export enum UserRole {
  ADMIN = 'ADMIN',
  PRINCIPAL = 'PRINCIPAL',
  TEACHER = 'TEACHER', // Subject Teacher
  FORM_MASTER = 'FORM_MASTER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT'
}

export enum Term {
  FIRST = '1st Term',
  SECOND = '2nd Term',
  THIRD = '3rd Term'
}

export interface ClassDefinition {
  id: string; // e.g., "JSS1-A"
  name: string; // "JSS 1"
  arm: string; // "A"
  formMasterId?: string;
}

export interface Subject {
  id: string;
  name: string;
  isCore: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  passwordHash?: string;
  isActive: boolean;
  // assignments
  assignedClassIds?: string[]; // IDs of ClassDefinition e.g., ["JSS1-A"]
  assignedSubjectIds?: string[]; // IDs of Subject e.g., ["MATH", "ENG"]
}

export enum PromotionStatus {
  PENDING = 'PENDING',
  PROMOTED = 'PROMOTED',
  REPEATING = 'REPEATING',
  GRADUATED = 'GRADUATED'
}

export interface Student {
  id: string; // Admission Number
  name: string;
  classId: string; // e.g., "JSS1-A"
  parentId?: string;
  passportUrl?: string;
  promotionStatus: PromotionStatus;
}

export interface Assessment {
  ca1: number; // Max 10
  ca2: number; // Max 10
  assignment: number; // Max 10
  notes: number; // Max 10
  exam: number; // Max 60
}

export interface Result {
  id: string;
  studentId: string;
  subjectId: string; // Linked to Subject ID
  session: string; // e.g., "2024/2025"
  term: Term;
  assessment: Assessment;
  total: number;
  grade: string;
  teacherRemark?: string;
  formMasterRemark?: string; // Added
  principalRemark?: string;
  isApproved: boolean;
  isLocked: boolean;
  auditHistory: string[]; 
}

export interface Attendance {
  id: string;
  studentId: string;
  classId: string;
  date: string; // ISO Date string YYYY-MM-DD
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  term: Term;
  session: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userRole: UserRole;
  action: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export interface Pin {
  code: string;
  usageCount: number;
  maxUsage: number;
  generatedBy: string;
  expiryDate: string;
  isUsed: boolean;
}
