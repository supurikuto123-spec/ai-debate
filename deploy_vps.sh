#!/bin/bash
# ============================================
# AI Debate VPS 本番デプロイスクリプト
# VPSのプロジェクトディレクトリで実行してください
# ============================================
set -e

echo "=========================================="
echo "  AI Debate 本番デプロイ開始"
echo "=========================================="

# 現在のディレクトリ確認
if [ ! -f "package.json" ]; then
  echo "ERROR: package.json が見つかりません。プロジェクトディレクトリで実行してください。"
  exit 1
fi

# Step 1: バックアップ
echo ""
echo "[1/6] バックアップ作成中..."
BACKUP_DIR="../ai-debate-backup-$(date +%Y%m%d_%H%M%S)"
cp -r . "$BACKUP_DIR"
echo "  -> バックアップ先: $BACKUP_DIR"

# Step 2: Git pull
echo ""
echo "[2/6] 最新コードを取得中..."
git fetch origin
git pull origin main
echo "  -> コード更新完了"

# Step 3: 依存関係インストール
echo ""
echo "[3/6] 依存関係をインストール中..."
npm install
echo "  -> npm install 完了"

# Step 4: ビルド
echo ""
echo "[4/6] ビルド中..."
npm run build
echo "  -> ビルド完了"

# Step 5: D1マイグレーション
echo ""
echo "[5/6] D1マイグレーション適用中..."
echo "  -> テーブル作成（CREATE TABLE IF NOT EXISTS）..."
npx wrangler d1 execute ai-debate-db --file=./migrate_production.sql --remote
echo ""
echo "  -> カラム追加（ALTER TABLE）... ※既存カラムのエラーは無視してOK"
# ALTER TABLEは1行ずつ実行（既にカラムがあるとエラーになるが問題なし）
npx wrangler d1 execute ai-debate-db --remote --command="ALTER TABLE users ADD COLUMN avatar_url TEXT;" 2>/dev/null || echo "    (avatar_url: 既に存在 - スキップ)"
npx wrangler d1 execute ai-debate-db --remote --command="ALTER TABLE users ADD COLUMN avatar_type TEXT DEFAULT 'bottts';" 2>/dev/null || echo "    (avatar_type: 既に存在 - スキップ)"
npx wrangler d1 execute ai-debate-db --remote --command="ALTER TABLE users ADD COLUMN avatar_value TEXT DEFAULT '1';" 2>/dev/null || echo "    (avatar_value: 既に存在 - スキップ)"
npx wrangler d1 execute ai-debate-db --remote --command="ALTER TABLE users ADD COLUMN nickname TEXT;" 2>/dev/null || echo "    (nickname: 既に存在 - スキップ)"
npx wrangler d1 execute ai-debate-db --remote --command="ALTER TABLE theme_proposals ADD COLUMN agree_opinion TEXT;" 2>/dev/null || echo "    (agree_opinion: 既に存在 - スキップ)"
npx wrangler d1 execute ai-debate-db --remote --command="ALTER TABLE theme_proposals ADD COLUMN disagree_opinion TEXT;" 2>/dev/null || echo "    (disagree_opinion: 既に存在 - スキップ)"
npx wrangler d1 execute ai-debate-db --remote --command="ALTER TABLE theme_proposals ADD COLUMN category TEXT DEFAULT 'other';" 2>/dev/null || echo "    (category: 既に存在 - スキップ)"
npx wrangler d1 execute ai-debate-db --remote --command="ALTER TABLE theme_proposals ADD COLUMN proposed_by TEXT;" 2>/dev/null || echo "    (proposed_by: 既に存在 - スキップ)"
npx wrangler d1 execute ai-debate-db --remote --command="ALTER TABLE debate_messages ADD COLUMN ai_evaluation TEXT;" 2>/dev/null || echo "    (ai_evaluation: 既に存在 - スキップ)"
npx wrangler d1 execute ai-debate-db --remote --command="ALTER TABLE debates ADD COLUMN completed_at DATETIME;" 2>/dev/null || echo "    (completed_at: 既に存在 - スキップ)"
npx wrangler d1 execute ai-debate-db --remote --command="ALTER TABLE debates ADD COLUMN winner TEXT;" 2>/dev/null || echo "    (winner: 既に存在 - スキップ)"
npx wrangler d1 execute ai-debate-db --remote --command="ALTER TABLE debates ADD COLUMN judge_evaluations TEXT;" 2>/dev/null || echo "    (judge_evaluations: 既に存在 - スキップ)"
npx wrangler d1 execute ai-debate-db --remote --command="ALTER TABLE debates ADD COLUMN status TEXT DEFAULT 'pending';" 2>/dev/null || echo "    (status: 既に存在 - スキップ)"
npx wrangler d1 execute ai-debate-db --remote --command="CREATE INDEX IF NOT EXISTS idx_theme_proposals_category ON theme_proposals(category);" 2>/dev/null || true
npx wrangler d1 execute ai-debate-db --remote --command="CREATE INDEX IF NOT EXISTS idx_theme_proposals_proposed_by ON theme_proposals(proposed_by);" 2>/dev/null || true
npx wrangler d1 execute ai-debate-db --remote --command="UPDATE debates SET status = 'pending' WHERE status IS NULL;" 2>/dev/null || true
npx wrangler d1 execute ai-debate-db --remote --command="UPDATE debates SET status = 'live' WHERE id = 'default';" 2>/dev/null || true
echo "  -> マイグレーション完了"

# Step 6: サービス再起動
echo ""
echo "[6/6] サービス再起動中..."
if command -v pm2 &> /dev/null; then
  pm2 restart ai-debate 2>/dev/null || pm2 restart all
  echo "  -> PM2 再起動完了"
elif command -v systemctl &> /dev/null; then
  sudo systemctl restart ai-debate 2>/dev/null || echo "  -> systemctl restart 失敗。手動で再起動してください。"
else
  echo "  -> プロセスマネージャが見つかりません。手動で再起動してください。"
fi

echo ""
echo "=========================================="
echo "  デプロイ完了!"
echo "  https://ai-debate.jp で確認してください"
echo "=========================================="
