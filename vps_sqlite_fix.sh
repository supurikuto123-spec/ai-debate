#!/bin/bash
# VPS SQLite 直接修正スクリプト
# 実行方法: bash /var/www/ai-debate/vps_sqlite_fix.sh
# ※ sqlite3 がインストールされている必要があります
#    sudo apt-get install sqlite3

echo "🔍 SQLiteファイルを検索中..."
SQLITE_FILE=$(find /var/www/ai-debate/.wrangler -name "*.sqlite" | grep -i "D1\|d1" | head -1)

if [ -z "$SQLITE_FILE" ]; then
  SQLITE_FILE=$(find /var/www/ai-debate/.wrangler -name "*.sqlite" | head -1)
fi

if [ -z "$SQLITE_FILE" ]; then
  echo "❌ SQLiteファイルが見つかりません"
  echo "手動で確認: find /var/www/ai-debate/.wrangler -name '*.sqlite'"
  exit 1
fi

echo "✅ 発見: $SQLITE_FILE"
echo ""

# カラム存在チェック関数
add_column_if_missing() {
  local TABLE=$1
  local COLUMN=$2
  local DEFINITION=$3
  
  # カラムが存在するか確認
  COLS=$(sqlite3 "$SQLITE_FILE" "PRAGMA table_info($TABLE);" 2>/dev/null | grep "|$COLUMN|")
  if [ -z "$COLS" ]; then
    echo "➕ $TABLE.$COLUMN を追加中..."
    sqlite3 "$SQLITE_FILE" "ALTER TABLE $TABLE ADD COLUMN $COLUMN $DEFINITION;" 2>&1
    echo "   完了"
  else
    echo "⏭  $TABLE.$COLUMN は既に存在します"
  fi
}

echo "=== users テーブルのカラム追加 ==="
add_column_if_missing "users" "last_access_at" "DATETIME"
add_column_if_missing "users" "is_banned" "INTEGER NOT NULL DEFAULT 0"
add_column_if_missing "users" "ban_reason" "TEXT"
add_column_if_missing "users" "post_ban" "INTEGER NOT NULL DEFAULT 0"
add_column_if_missing "users" "debate_ban" "INTEGER NOT NULL DEFAULT 0"
add_column_if_missing "users" "credit_freeze" "INTEGER NOT NULL DEFAULT 0"
add_column_if_missing "users" "restriction_reason" "TEXT"
add_column_if_missing "users" "is_dev" "INTEGER NOT NULL DEFAULT 0"

echo ""
echo "=== debates テーブルのカラム追加 ==="
add_column_if_missing "debates" "status" "TEXT NOT NULL DEFAULT 'upcoming'"
add_column_if_missing "debates" "scheduled_at" "DATETIME"
add_column_if_missing "debates" "winner" "TEXT"

echo ""
echo "=== テーブル作成 ==="

sqlite3 "$SQLITE_FILE" <<'SQLEOF'
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0,
  link TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

CREATE TABLE IF NOT EXISTS archived_debates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  debate_id TEXT,
  title TEXT,
  agree_position TEXT,
  disagree_position TEXT,
  agree_votes INTEGER DEFAULT 0,
  disagree_votes INTEGER DEFAULT 0,
  winner TEXT,
  messages TEXT,
  created_at DATETIME,
  archived_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS archive_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  debate_id TEXT NOT NULL,
  purchased_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS support_tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ticket_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  is_admin INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS theme_proposals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  agree_opinion TEXT,
  disagree_opinion TEXT,
  category TEXT,
  proposed_by TEXT,
  status TEXT DEFAULT 'active',
  vote_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS theme_votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  theme_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dev_invitations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  inviter_user_id TEXT NOT NULL,
  invitee_user_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
SQLEOF

echo ""
echo "✅ 完了！現在のusersテーブル構造:"
sqlite3 "$SQLITE_FILE" "PRAGMA table_info(users);" | awk -F'|' '{print "  " $2 " (" $3 ")"}'

echo ""
echo "🔄 PM2を再起動してください:"
echo "   pm2 restart ai-debate"
