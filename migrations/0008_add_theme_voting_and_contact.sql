-- Update theme_proposals table to add missing columns
-- Note: SQLite doesn't support multiple ALTER TABLE ADD COLUMN in one statement
ALTER TABLE theme_proposals ADD COLUMN agree_opinion TEXT;
ALTER TABLE theme_proposals ADD COLUMN disagree_opinion TEXT;
ALTER TABLE theme_proposals ADD COLUMN category TEXT DEFAULT 'other';
ALTER TABLE theme_proposals ADD COLUMN proposed_by TEXT;

-- Update theme_proposals: rename user_id to proposed_by if it exists (SQLite limitation)
-- We'll handle this by accepting both columns in the app logic

-- Create additional indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_theme_proposals_category ON theme_proposals(category);
CREATE INDEX IF NOT EXISTS idx_theme_proposals_proposed_by ON theme_proposals(proposed_by);
