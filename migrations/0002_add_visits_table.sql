-- Add visits tracking table for real visitor count
CREATE TABLE IF NOT EXISTS visits (
  id TEXT PRIMARY KEY,
  session_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  page_path TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_visits_created_at ON visits(created_at);
CREATE INDEX IF NOT EXISTS idx_visits_session_id ON visits(session_id);
