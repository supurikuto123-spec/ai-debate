#!/bin/bash
# VPS D1マイグレーション — 安全版
# 使い方: cd /var/www/ai-debate && bash vps_migrate.sh
# 各SQLを1文ずつ実行し、「already exists / duplicate column」はスキップ

set -e
DB="ai-debate-db"

exec_sql() {
  local sql="$1"
  local label="$2"
  printf "  %-40s" "$label"
  # wrangler d1 execute の出力をキャプチャ
  out=$(npx wrangler d1 execute "$DB" --local --command="$sql" 2>&1)
  if echo "$out" | grep -qiE "duplicate column name|already exists"; then
    echo "SKIP"
  elif echo "$out" | grep -qiE "error|failed|exception"; then
    echo "WARN => $out"
  else
    echo "OK"
  fi
}

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   VPS D1 Migration (safe / idempotent)  ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# ── users テーブル カラム追加 ──────────────────────────────────────────
echo "── users columns ──"
exec_sql "ALTER TABLE users ADD COLUMN last_access_at DATETIME"         "last_access_at"
exec_sql "ALTER TABLE users ADD COLUMN is_banned INTEGER NOT NULL DEFAULT 0" "is_banned"
exec_sql "ALTER TABLE users ADD COLUMN ban_reason TEXT"                 "ban_reason"
exec_sql "ALTER TABLE users ADD COLUMN post_ban INTEGER NOT NULL DEFAULT 0"  "post_ban"
exec_sql "ALTER TABLE users ADD COLUMN debate_ban INTEGER NOT NULL DEFAULT 0" "debate_ban"
exec_sql "ALTER TABLE users ADD COLUMN credit_freeze INTEGER NOT NULL DEFAULT 0" "credit_freeze"
exec_sql "ALTER TABLE users ADD COLUMN restriction_reason TEXT"         "restriction_reason"
exec_sql "ALTER TABLE users ADD COLUMN is_dev INTEGER NOT NULL DEFAULT 0" "is_dev"

# ── debates テーブル カラム追加 ──────────────────────────────────────
echo ""
echo "── debates columns ──"
exec_sql "ALTER TABLE debates ADD COLUMN status TEXT NOT NULL DEFAULT 'upcoming'" "debates.status"
exec_sql "ALTER TABLE debates ADD COLUMN scheduled_at DATETIME"         "debates.scheduled_at"
exec_sql "ALTER TABLE debates ADD COLUMN winner TEXT"                   "debates.winner"

# ── 新規テーブル作成（IF NOT EXISTS で安全） ─────────────────────────
echo ""
echo "── new tables ──"

exec_sql "CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0,
  link TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)" "notifications"

exec_sql "CREATE TABLE IF NOT EXISTS archived_debates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  debate_id TEXT,
  title TEXT,
  topic TEXT,
  agree_position TEXT,
  disagree_position TEXT,
  agree_votes INTEGER DEFAULT 0,
  disagree_votes INTEGER DEFAULT 0,
  winner TEXT,
  messages TEXT,
  created_at DATETIME,
  archived_at DATETIME DEFAULT CURRENT_TIMESTAMP
)" "archived_debates"

exec_sql "CREATE TABLE IF NOT EXISTS archive_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  debate_id TEXT NOT NULL,
  purchased_at DATETIME DEFAULT CURRENT_TIMESTAMP
)" "archive_views"

exec_sql "CREATE TABLE IF NOT EXISTS support_tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)" "support_tickets"

exec_sql "CREATE TABLE IF NOT EXISTS ticket_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  is_admin INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)" "ticket_messages"

exec_sql "CREATE TABLE IF NOT EXISTS theme_proposals (
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
)" "theme_proposals"

exec_sql "CREATE TABLE IF NOT EXISTS theme_votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  theme_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)" "theme_votes"

exec_sql "CREATE TABLE IF NOT EXISTS dev_invitations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  inviter_user_id TEXT NOT NULL,
  invitee_user_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)" "dev_invitations"

# ── インデックス ─────────────────────────────────────────────────────
echo ""
echo "── indexes ──"
exec_sql "CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id)" "idx_notifications_user_id"
exec_sql "CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at)" "idx_notifications_created_at"
exec_sql "CREATE INDEX IF NOT EXISTS idx_archived_debates_archived_at ON archived_debates(archived_at)" "idx_archived_debates_at"
exec_sql "CREATE INDEX IF NOT EXISTS idx_archived_debates_debate_id ON archived_debates(debate_id)" "idx_archived_debates_id"

# ── 確認 ─────────────────────────────────────────────────────────────
echo ""
echo "── users table structure ──"
npx wrangler d1 execute "$DB" --local --command="PRAGMA table_info(users)" 2>&1 | grep -E "credit_freeze|is_banned|post_ban|debate_ban|is_dev|restriction_reason" || echo "  (no matching columns found — check manually)"

echo ""
echo "═══════════════════════════════════════════"
echo "  Migration complete!"
echo "  Next: pm2 restart ai-debate"
echo "═══════════════════════════════════════════"
