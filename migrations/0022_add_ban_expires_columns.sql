-- Migration 0022: ban_expires_at等の期限カラムをusersテーブルに追加
-- VPS環境でのD1_ERROR: no such column: ban_expires_at を修正

-- usersテーブルに期限カラムを安全に追加
-- SQLiteはIF NOT EXISTSをALTER COLUMNに対応していないため
-- 既存カラムがある場合はエラーが出るが無視してよい

ALTER TABLE users ADD COLUMN ban_expires_at DATETIME;
ALTER TABLE users ADD COLUMN post_ban_expires_at DATETIME;
ALTER TABLE users ADD COLUMN debate_ban_expires_at DATETIME;
ALTER TABLE users ADD COLUMN credit_freeze_expires_at DATETIME;

-- match_queueテーブル作成（存在しない場合）
CREATE TABLE IF NOT EXISTS match_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL UNIQUE,
  username TEXT,
  mode TEXT DEFAULT 'pvp',
  stance TEXT,
  status TEXT DEFAULT 'waiting',
  debate_id TEXT,
  matched_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- pvp_roomsテーブル作成（存在しない場合）
CREATE TABLE IF NOT EXISTS pvp_rooms (
  room_id TEXT PRIMARY KEY,
  debate_id TEXT,
  player_a TEXT NOT NULL,
  player_b TEXT,
  player_a_stance TEXT DEFAULT 'agree',
  player_b_stance TEXT DEFAULT 'disagree',
  status TEXT DEFAULT 'active',
  messages TEXT DEFAULT '[]',
  winner TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  started_at DATETIME,
  ended_at DATETIME
);

-- debates.duration_seconds カラム追加
ALTER TABLE debates ADD COLUMN duration_seconds INTEGER DEFAULT 300;
