-- Add last_access_at and is_banned columns to users
ALTER TABLE users ADD COLUMN last_access_at DATETIME;
ALTER TABLE users ADD COLUMN is_banned INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN ban_reason TEXT;

-- Update last_access_at from visits table for existing users
UPDATE users SET last_access_at = (
  SELECT MAX(v.created_at) FROM visits v WHERE v.session_id LIKE users.user_id || '%'
) WHERE last_access_at IS NULL;

-- notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0,
  link TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
