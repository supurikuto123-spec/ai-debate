-- Remove priority column from support_tickets table
-- SQLite doesn't support DROP COLUMN, so we need to recreate the table

-- Create new table without priority
CREATE TABLE IF NOT EXISTS support_tickets_new (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK(status IN ('open', 'in_progress', 'resolved', 'closed')),
  assigned_to TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  resolved_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Copy data from old table (excluding priority)
INSERT INTO support_tickets_new (id, user_id, subject, message, status, assigned_to, created_at, updated_at, resolved_at)
SELECT id, user_id, subject, message, status, assigned_to, created_at, updated_at, resolved_at
FROM support_tickets;

-- Drop old table
DROP TABLE support_tickets;

-- Rename new table
ALTER TABLE support_tickets_new RENAME TO support_tickets;

-- Recreate indexes
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned_to ON support_tickets(assigned_to);
