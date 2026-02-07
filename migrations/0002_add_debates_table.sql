-- ディベートテーマテーブル
CREATE TABLE IF NOT EXISTS debates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  agree_position TEXT NOT NULL,
  disagree_position TEXT NOT NULL,
  time_limit INTEGER DEFAULT 600,
  char_limit INTEGER DEFAULT 180,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- デフォルトディベート
INSERT OR IGNORE INTO debates (id, title, topic, agree_position, disagree_position) 
VALUES ('default', 'AIは仕事を創出するか奪うか', 'AIと雇用の関係', 'AIは仕事を創出する', 'AIは仕事を奪う');
