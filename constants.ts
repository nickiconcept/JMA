import { Term } from "./types";

export const SCHOOL_NAME = "Jere Model Academy";
export const CURRENT_SESSION = "2024/2025";
export const CURRENT_TERM = Term.FIRST;

export const GRADING_SCALE = [
  { min: 70, max: 100, grade: 'A', remark: 'Excellent' },
  { min: 60, max: 69, grade: 'B', remark: 'Very Good' },
  { min: 50, max: 59, grade: 'C', remark: 'Good' },
  { min: 40, max: 49, grade: 'D', remark: 'Pass' },
  { min: 0, max: 39, grade: 'F', remark: 'Fail' },
];

export const MAX_SCORES = {
  CA1: 10,
  CA2: 10,
  ASSIGNMENT: 10,
  NOTES: 10,
  EXAM: 60
};

export const MOCK_LOGS_INITIAL = [
  {
    id: 'log-1',
    userId: 'admin-1',
    userRole: 'ADMIN',
    action: 'SYSTEM_INIT',
    details: 'System initialized for 2024/2025 session',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    ipAddress: '192.168.1.1'
  },
  {
    id: 'log-2',
    userId: 'teach-1',
    userRole: 'TEACHER',
    action: 'LOGIN',
    details: 'Teacher login successful',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    ipAddress: '10.0.0.5'
  }
];
