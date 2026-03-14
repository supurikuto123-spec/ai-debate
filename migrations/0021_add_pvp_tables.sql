-- マッチングキューテーブル
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
CREATE INDEX IF NOT EXISTS idx_match_queue_status ON match_queue(status);
CREATE INDEX IF NOT EXISTS idx_match_queue_mode ON match_queue(mode);

-- PvP対戦ルームテーブル
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
CREATE INDEX IF NOT EXISTS idx_pvp_rooms_player_a ON pvp_rooms(player_a);
CREATE INDEX IF NOT EXISTS idx_pvp_rooms_player_b ON pvp_rooms(player_b);
CREATE INDEX IF NOT EXISTS idx_pvp_rooms_status ON pvp_rooms(status);
