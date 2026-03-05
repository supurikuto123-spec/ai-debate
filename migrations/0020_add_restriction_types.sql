-- Migration: 制限種別カラム追加（投稿禁止・ディベート禁止・クレジット凍結）
-- is_banned = 完全BAN（ログイン制限）
-- post_ban = コミュニティ投稿禁止
-- debate_ban = ディベート参加禁止
-- credit_freeze = クレジット消費凍結（クレジット使用不可）

ALTER TABLE users ADD COLUMN post_ban INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN debate_ban INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN credit_freeze INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN restriction_reason TEXT;
