-- Run this script in your Supabase SQL Editor to fix security vulnerabilities

-- 1. Fix "View defined with SECURITY DEFINER"
-- We recreate the profiles view with `security_invoker = true`.
-- This ensures the view respects the RLS policies of the underlying `users` table for the user executing the query.
DROP VIEW IF EXISTS profiles;
CREATE VIEW profiles WITH (security_invoker = true) AS 
SELECT 
  id, name, email, role, 
  "isActive", "signatureUrl", 
  "assignedClassIds", "assignedSubjectIds" 
FROM users;

-- 2. Fix "Table exposed without RLS and sensitive columns"
-- We implement Column Level Security (CLS) on the `users` table.

-- Enable RLS (Safety check)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Revoke all access to `users` table initially
REVOKE SELECT ON users FROM anon, authenticated;

-- Grant SELECT only on non-sensitive columns (Excluding 'password')
GRANT SELECT (
  id, name, email, role, 
  "isActive", "signatureUrl", 
  "assignedClassIds", "assignedSubjectIds"
) ON users TO anon, authenticated;

-- Grant Write permissions (Application logic handles validation)
GRANT INSERT, UPDATE, DELETE ON users TO anon, authenticated;

-- Create RLS Policies
-- Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "Public profiles" ON users;
DROP POLICY IF EXISTS "Allow public read" ON users;
DROP POLICY IF EXISTS "Allow writes" ON users;
DROP POLICY IF EXISTS "Allow updates" ON users;
DROP POLICY IF EXISTS "Allow deletes" ON users;

-- Policy: Allow reading rows (Columns are restricted by GRANT above)
CREATE POLICY "Allow public read" ON users FOR SELECT USING (true);

-- Policy: Allow writing rows
CREATE POLICY "Allow writes" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow updates" ON users FOR UPDATE USING (true);
CREATE POLICY "Allow deletes" ON users FOR DELETE USING (true);

-- 3. Grant access to the view
GRANT SELECT ON profiles TO anon, authenticated;
