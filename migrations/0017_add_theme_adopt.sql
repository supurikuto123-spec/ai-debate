-- Add adopted field to theme_proposals table
ALTER TABLE theme_proposals ADD COLUMN adopted INTEGER DEFAULT 0;

-- Create index for adopted field
CREATE INDEX IF NOT EXISTS idx_theme_proposals_adopted ON theme_proposals(adopted);
