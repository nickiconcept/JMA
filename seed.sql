-- SEED DATA SCRIPT
-- Run this in Supabase SQL Editor to populate the database with initial data.

-- 1. Create Default Admin User
-- Note: 'password' is stored as plain text for this demo. Production should use hashing.
INSERT INTO users (id, name, email, password, role, "isActive", "assignedClassIds", "assignedSubjectIds")
VALUES 
  ('admin-1', 'Admin User', 'admin@jere.edu.ng', 'password', 'ADMIN', true, '{}', '{}')
ON CONFLICT (id) DO NOTHING;

-- 2. Create Sample Teachers
INSERT INTO users (id, name, email, password, role, "isActive", "assignedClassIds", "assignedSubjectIds")
VALUES 
  ('teach-1', 'Mrs. Adewale', 'adewale@jere.edu.ng', 'password', 'TEACHER', true, '{"JSS1"}', '{"MATH"}'),
  ('teach-2', 'Mr. Balogun', 'balogun@jere.edu.ng', 'password', 'TEACHER', true, '{"JSS1", "SSS2"}', '{"ENG", "CIVIC"}')
ON CONFLICT (id) DO NOTHING;

-- 3. Create Classes
INSERT INTO classes (id, name, "formMasterId")
VALUES 
  ('JSS1', 'JSS 1', 'teach-1'),
  ('JSS2', 'JSS 2', NULL),
  ('SSS1', 'SSS 1', NULL),
  ('SSS2', 'SSS 2', 'teach-2')
ON CONFLICT (id) DO NOTHING;

-- 4. Create Subjects
INSERT INTO subjects (id, name, "isCore")
VALUES 
  ('MATH', 'Mathematics', true),
  ('ENG', 'English Language', true),
  ('BSC', 'Basic Science', false),
  ('CIVIC', 'Civic Education', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Create Students
INSERT INTO students (id, name, "classId", "promotionStatus")
VALUES 
  ('JMA/24/001', 'Ibrahim Musa', 'JSS1', 'PENDING'),
  ('JMA/24/002', 'Chidinma Obi', 'JSS1', 'PENDING'),
  ('JMA/24/003', 'Yusuf Sani', 'JSS1', 'PENDING')
ON CONFLICT (id) DO NOTHING;

-- 6. Create School Config
INSERT INTO school_config (id, data)
VALUES (1, '{
  "schoolName": "Jere Model Academy",
  "address": "Behind Zara Kabir Filling Station, Ungwan Shakwera, Kagarko LGA, Kaduna State",
  "principalName": "Mr. J. Okonkwo",
  "activeSession": "2024/2025",
  "activeTerm": "1st Term",
  "allowedRadiusMeters": 500
}')
ON CONFLICT (id) DO NOTHING;

-- 7. Create Sample PIN
INSERT INTO pins (code, "usageCount", "maxUsage", "generatedBy", "expiryDate", "isUsed")
VALUES ('1234-5678-9012', 0, 5, 'admin-1', '2025-12-31', false)
ON CONFLICT (code) DO NOTHING;
