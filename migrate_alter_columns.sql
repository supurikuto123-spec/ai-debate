-- ============================================
-- ALTER TABLE カラム追加（個別実行用）
-- 既にカラムが存在する場合はエラーになるが無視してOK
-- VPSで実行: 1行ずつ --command で実行するか、エラーを無視して実行
-- ============================================

-- === 0006: users テーブルにアバター関連カラム追加 ===
ALTER TABLE users ADD COLUMN avatar_url TEXT;
ALTER TABLE users ADD COLUMN avatar_type TEXT DEFAULT 'bottts';
ALTER TABLE users ADD COLUMN avatar_value TEXT DEFAULT '1';
ALTER TABLE users ADD COLUMN nickname TEXT;

-- === 0008: theme_proposals テーブルにカラム追加 ===
ALTER TABLE theme_proposals ADD COLUMN agree_opinion TEXT;
ALTER TABLE theme_proposals ADD COLUMN disagree_opinion TEXT;
ALTER TABLE theme_proposals ADD COLUMN category TEXT DEFAULT 'other';
ALTER TABLE theme_proposals ADD COLUMN proposed_by TEXT;

CREATE INDEX IF NOT EXISTS idx_theme_proposals_category ON theme_proposals(category);
CREATE INDEX IF NOT EXISTS idx_theme_proposals_proposed_by ON theme_proposals(proposed_by);

-- === 0009: debates/debate_messages テーブルにカラム追加 ===
ALTER TABLE debate_messages ADD COLUMN ai_evaluation TEXT;
ALTER TABLE debates ADD COLUMN completed_at DATETIME;
ALTER TABLE debates ADD COLUMN winner TEXT;
ALTER TABLE debates ADD COLUMN judge_evaluations TEXT;

-- === 0013: debates テーブルに status カラム追加 ===
ALTER TABLE debates ADD COLUMN status TEXT DEFAULT 'pending';
UPDATE debates SET status = 'pending' WHERE status IS NULL;
UPDATE debates SET status = 'live' WHERE id = 'default';
