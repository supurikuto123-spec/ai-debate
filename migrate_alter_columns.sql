-- ============================================
-- AI Debate カラム追加マイグレーション
-- ALTER TABLEは1つずつ実行する必要あり（既存カラムでエラー）
-- deploy_vps.sh で自動的に1行ずつ実行されます
-- ============================================

-- users テーブルのカラム追加
ALTER TABLE users ADD COLUMN avatar_url TEXT;
ALTER TABLE users ADD COLUMN avatar_type TEXT DEFAULT 'bottts';
ALTER TABLE users ADD COLUMN avatar_value TEXT DEFAULT '1';
ALTER TABLE users ADD COLUMN nickname TEXT;

-- theme_proposals テーブルのカラム追加
ALTER TABLE theme_proposals ADD COLUMN agree_opinion TEXT;
ALTER TABLE theme_proposals ADD COLUMN disagree_opinion TEXT;
ALTER TABLE theme_proposals ADD COLUMN category TEXT DEFAULT 'other';
ALTER TABLE theme_proposals ADD COLUMN proposed_by TEXT;

-- debate_messages テーブルのカラム追加
ALTER TABLE debate_messages ADD COLUMN ai_evaluation TEXT;

-- debates テーブルのカラム追加
ALTER TABLE debates ADD COLUMN completed_at DATETIME;
ALTER TABLE debates ADD COLUMN winner TEXT;
ALTER TABLE debates ADD COLUMN judge_evaluations TEXT;
ALTER TABLE debates ADD COLUMN status TEXT DEFAULT 'pending';

-- インデックス追加
CREATE INDEX IF NOT EXISTS idx_theme_proposals_category ON theme_proposals(category);
CREATE INDEX IF NOT EXISTS idx_theme_proposals_proposed_by ON theme_proposals(proposed_by);

-- デフォルトディベートのstatus設定
UPDATE debates SET status = 'pending' WHERE status IS NULL;
UPDATE debates SET status = 'live' WHERE id = 'default';
