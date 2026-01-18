
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
  id: string; // e.g., "JSS1"
  name: string; // "JSS 1"
  formMasterId?: string;
}

export interface Subject {
  id: string;
  name: string;
  isCore: boolean;
  compatibleLevels?: string[]; // e.g. ["JSS 1", "SSS 2"] - If empty, available to all
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string; // Added for custom login
  passwordHash?: string;
  isActive: boolean;
  signatureUrl?: string; // Added for signatures
  // assignments
  assignedClassIds?: string[]; // IDs of ClassDefinition e.g., ["JSS1"]
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
  classId: string; // e.g., "JSS1"
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

export interface StaffAttendance {
  id: string;
  staffId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
  timestamp: string; // ISO Full
  coordinates: {
      lat: number;
      lng: number;
  };
  distanceFromSchool: number; // In Meters
  status: 'PRESENT' | 'LATE';
}

export interface AuditLog {
  id: string;
  userId: string;
  userName?: string; // Added
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
  assignedStudentId?: string; // Optional: Only this student can use this PIN
}

export interface PsychomotorRecord {
  id: string;
  studentId: string;
  session: string;
  term: Term;
  // Legacy support plus dynamic
  affective: {
    punctuality: number;
    attendance: number;
    reliability: number;
    neatness: number;
    politeness: number;
    [key: string]: number; // Allow dynamic keys
  };
  psychomotor: {
    handwriting: number;
    games: number;
    communication: number;
    creativity: number;
    leadership: number;
    [key: string]: number; // Allow dynamic keys
  };
}

export interface SkillDefinition {
    id: string; // key
    name: string; // label
    category: 'AFFECTIVE' | 'PSYCHOMOTOR';
}

export interface SchoolConfig {
  schoolName: string;
  address: string;
  principalName: string;
  principalSignature?: string; // Base64 string
  logo?: string; // Base64 string
  // Active Context for Data Entry
  activeSession: string; 
  activeTerm: Term;
  nextTermBegins: string;
  nextTermEnds: string;
  // Geolocation for Staff Attendance
  gpsCoordinates?: {
      lat: number;
      lng: number;
  };
  allowedRadiusMeters: number; // e.g., 200 meters
  // Dynamic labels for report card table
  reportCardLayout: {
    headingColor: string;
    subjectLabel: string;
    ca1Label: string;
    ca2Label: string;
    assignLabel: string;
    notesLabel: string;
    examLabel: string;
    totalLabel: string;
    gradeLabel: string;
    remarkLabel: string;
  };
  reportOptions?: {
    showPosition: boolean;
    showTotalStudents: boolean;
    showClassStats: boolean; // Highest/Lowest Avg
    showSubjectAverage: boolean;
    showSubjectMinMax: boolean;
    showSubjectPosition: boolean;
  };
  // Custom Skills Configuration
  customSkills?: SkillDefinition[];
}

// --- Permission System Types ---

export enum RequestType {
    EDIT_RESULT = 'EDIT_RESULT',
    EDIT_ATTENDANCE = 'EDIT_ATTENDANCE',
    VIEW_RESULT_LIMIT = 'VIEW_RESULT_LIMIT'
}

export enum RequestStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    DECLINED = 'DECLINED',
    CONSUMED = 'CONSUMED' // Used when the permission was used once and is now invalid
}

export interface AccessRequest {
    id: string;
    requesterId: string;
    requesterName: string;
    type: RequestType;
    resourceId: string; // ID of the result, or "classId|date" for attendance, or "studentId" for view limit
    details: string;
    status: RequestStatus;
    timestamp: string;
}
