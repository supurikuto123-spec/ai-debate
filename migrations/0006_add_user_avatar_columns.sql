-- Add avatar-related columns to users table
ALTER TABLE users ADD COLUMN avatar_url TEXT;
ALTER TABLE users ADD COLUMN avatar_type TEXT DEFAULT 'bottts';
ALTER TABLE users ADD COLUMN avatar_value TEXT DEFAULT '1';
ALTER TABLE users ADD COLUMN nickname TEXT;
