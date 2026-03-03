-- Add is_dev column to users table for dev role management
ALTER TABLE users ADD COLUMN is_dev INTEGER NOT NULL DEFAULT 0;

-- Update existing dev user (user_id = 'dev') to have is_dev = 1
UPDATE users SET is_dev = 1 WHERE user_id = 'dev';

-- Create dev_invitations table to track who granted dev access to whom
CREATE TABLE IF NOT EXISTS dev_invitations (
  id TEXT PRIMARY KEY,
  inviter_user_id TEXT NOT NULL,
  invitee_user_id TEXT NOT NULL,
  granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (inviter_user_id) REFERENCES users(user_id),
  FOREIGN KEY (invitee_user_id) REFERENCES users(user_id)
);

CREATE INDEX IF NOT EXISTS idx_dev_invitations_invitee ON dev_invitations(invitee_user_id);
