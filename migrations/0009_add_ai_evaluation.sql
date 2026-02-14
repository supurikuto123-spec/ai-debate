-- Add AI evaluation column to debate_messages table
ALTER TABLE debate_messages ADD COLUMN ai_evaluation TEXT;

-- Add completed_at timestamp to debates table
ALTER TABLE debates ADD COLUMN completed_at DATETIME;

-- Add winner column to debates table (can be 'agree' or 'disagree' or null)
ALTER TABLE debates ADD COLUMN winner TEXT;

-- Add judge_evaluations TEXT (JSON) column to debates table
ALTER TABLE debates ADD COLUMN judge_evaluations TEXT;
