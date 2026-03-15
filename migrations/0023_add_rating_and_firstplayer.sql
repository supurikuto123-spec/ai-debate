-- 0023: user_ratings テーブル作成 + pvp_rooms.first_player カラム追加

-- ユーザーレーティングテーブル
CREATE TABLE IF NOT EXISTS user_ratings (
  user_id TEXT PRIMARY KEY,
  rating INTEGER DEFAULT 1000,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- pvp_rooms に first_player カラム追加（ランダム先攻決定用）
ALTER TABLE pvp_rooms ADD COLUMN first_player TEXT;
