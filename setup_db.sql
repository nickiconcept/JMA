
-- MASTER SETUP SCRIPT v2
-- Run this in Supabase SQL Editor to fix permissions and seed data.

-- 1. CLEANUP: Drop existing policies to prevent "policy already exists" errors
DROP POLICY IF EXISTS "Allow public read" ON users;
DROP POLICY IF EXISTS "Allow writes" ON users;
DROP POLICY IF EXISTS "Allow updates" ON users;
DROP POLICY IF EXISTS "Allow deletes" ON users;
DROP POLICY IF EXISTS "Public profiles" ON users; -- Legacy policy name

-- Drop policies on other tables
DROP POLICY IF EXISTS "Public Access" ON students;
DROP POLICY IF EXISTS "Public Access" ON classes;
DROP POLICY IF EXISTS "Public Access" ON subjects;
DROP POLICY IF EXISTS "Public Access" ON results;
DROP POLICY IF EXISTS "Public Access" ON attendance;
DROP POLICY IF EXISTS "Public Access" ON staff_attendance;
DROP POLICY IF EXISTS "Public Access" ON pins;
DROP POLICY IF EXISTS "Public Access" ON psychomotor;
DROP POLICY IF EXISTS "Public Access" ON audit_logs;
DROP POLICY IF EXISTS "Public Access" ON access_requests;
DROP POLICY IF EXISTS "Public Access" ON school_config;

-- 2. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE pins ENABLE ROW LEVEL SECURITY;
ALTER TABLE psychomotor ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_config ENABLE ROW LEVEL SECURITY;

-- 3. CREATE FUNCTIONS & VIEWS
-- Secure RPC Login Function
CREATE OR REPLACE FUNCTION auth_staff(email_input text, password_input text)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  found_user users;
BEGIN
  SELECT * INTO found_user FROM users WHERE email = email_input;
  
  IF found_user.id IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Simple plaintext check for this template. Use hashing in production.
  IF found_user.password = password_input THEN
    RETURN json_build_object(
      'id', found_user.id,
      'name', found_user.name,
      'email', found_user.email,
      'role', found_user.role,
      'isActive', found_user."isActive",
      'signatureUrl', found_user."signatureUrl",
      'assignedClassIds', found_user."assignedClassIds",
      'assignedSubjectIds', found_user."assignedSubjectIds"
    );
  ELSE
    RETURN NULL;
  END IF;
END;
$$;

-- Secure Public Profile View
DROP VIEW IF EXISTS profiles;
CREATE VIEW profiles WITH (security_invoker = true) AS 
SELECT 
  id, name, email, role, 
  "isActive", "signatureUrl", 
  "assignedClassIds", "assignedSubjectIds" 
FROM users;

-- 4. CONFIGURE PERMISSIONS & POLICIES

-- Revoke insecure access to the raw users table
REVOKE SELECT ON users FROM anon, authenticated;

-- Grant specific access to the secure view and other tables
GRANT SELECT ON profiles TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON students TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON classes TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON subjects TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON results TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON attendance TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON staff_attendance TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON pins TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON psychomotor TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON audit_logs TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON access_requests TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON school_config TO anon, authenticated;

-- Allow reading the raw users table via RLS (Columns hidden by REVOKE above, restricts to permitted cols only)
CREATE POLICY "Allow public read" ON users FOR SELECT USING (true);
CREATE POLICY "Allow writes" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow updates" ON users FOR UPDATE USING (true);
CREATE POLICY "Allow deletes" ON users FOR DELETE USING (true);

-- Allow public access to other tables (controlled by app logic)
CREATE POLICY "Public Access" ON students FOR ALL USING (true);
CREATE POLICY "Public Access" ON classes FOR ALL USING (true);
CREATE POLICY "Public Access" ON subjects FOR ALL USING (true);
CREATE POLICY "Public Access" ON results FOR ALL USING (true);
CREATE POLICY "Public Access" ON attendance FOR ALL USING (true);
CREATE POLICY "Public Access" ON staff_attendance FOR ALL USING (true);
CREATE POLICY "Public Access" ON pins FOR ALL USING (true);
CREATE POLICY "Public Access" ON psychomotor FOR ALL USING (true);
CREATE POLICY "Public Access" ON audit_logs FOR ALL USING (true);
CREATE POLICY "Public Access" ON access_requests FOR ALL USING (true);
CREATE POLICY "Public Access" ON school_config FOR ALL USING (true);

-- 5. SEED INITIAL DATA (Admin User)
INSERT INTO users (id, name, email, password, role, "isActive", "assignedClassIds", "assignedSubjectIds")
VALUES 
  ('admin-1', 'Admin User', 'admin@jere.edu.ng', 'password', 'ADMIN', true, '{}', '{}')
ON CONFLICT (id) DO NOTHING;

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
