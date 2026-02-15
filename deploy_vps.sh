#!/bin/bash
# AI Debate VPS デプロイスクリプト
# 使用方法: cd /var/www/ai-debate && chmod +x deploy_vps.sh && ./deploy_vps.sh

set -e

echo "=============================="
echo " AI Debate - VPS デプロイ"
echo "=============================="

# Check if in project directory
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Run from project root."
    exit 1
fi

# Backup
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
echo ""
echo "[1/6] バックアップ作成中..."
if [ -d "../ai-debate-backup-${TIMESTAMP}" ]; then
    echo "  バックアップディレクトリが既に存在します。スキップ。"
else
    cp -r . "../ai-debate-backup-${TIMESTAMP}" 2>/dev/null || echo "  バックアップをスキップ"
fi

# Pull latest code
echo ""
echo "[2/6] 最新コードを取得中..."
git pull origin main || echo "  git pull failed - continuing with local code"

# Install dependencies
echo ""
echo "[3/6] 依存パッケージをインストール中..."
npm install

# Build
echo ""
echo "[4/6] ビルド中..."
npm run build

# Run migrations
echo ""
echo "[5/6] データベースマイグレーション実行中..."
echo "  メインマイグレーション..."
npx wrangler d1 execute ai-debate-db --local --file=./migrate_production.sql 2>&1 || echo "  メインマイグレーション: 一部スキップ（既存テーブル）"

echo ""
echo "  カラム追加マイグレーション..."
npx wrangler d1 execute ai-debate-db --local --command="ALTER TABLE users ADD COLUMN avatar_url TEXT;" 2>/dev/null || echo "  avatar_url: skip"
npx wrangler d1 execute ai-debate-db --local --command="ALTER TABLE users ADD COLUMN avatar_type TEXT DEFAULT 'bottts';" 2>/dev/null || echo "  avatar_type: skip"
npx wrangler d1 execute ai-debate-db --local --command="ALTER TABLE users ADD COLUMN avatar_value TEXT DEFAULT '1';" 2>/dev/null || echo "  avatar_value: skip"
npx wrangler d1 execute ai-debate-db --local --command="ALTER TABLE users ADD COLUMN nickname TEXT;" 2>/dev/null || echo "  nickname: skip"
npx wrangler d1 execute ai-debate-db --local --command="ALTER TABLE theme_proposals ADD COLUMN agree_opinion TEXT;" 2>/dev/null || echo "  agree_opinion: skip"
npx wrangler d1 execute ai-debate-db --local --command="ALTER TABLE theme_proposals ADD COLUMN disagree_opinion TEXT;" 2>/dev/null || echo "  disagree_opinion: skip"
npx wrangler d1 execute ai-debate-db --local --command="ALTER TABLE theme_proposals ADD COLUMN category TEXT DEFAULT 'other';" 2>/dev/null || echo "  category: skip"
npx wrangler d1 execute ai-debate-db --local --command="ALTER TABLE theme_proposals ADD COLUMN proposed_by TEXT DEFAULT '';" 2>/dev/null || echo "  proposed_by: skip"
npx wrangler d1 execute ai-debate-db --local --command="UPDATE theme_proposals SET proposed_by = user_id WHERE proposed_by IS NULL OR proposed_by = '';" 2>/dev/null || echo "  proposed_by copy: skip"
npx wrangler d1 execute ai-debate-db --local --command="ALTER TABLE debate_messages ADD COLUMN ai_evaluation TEXT;" 2>/dev/null || echo "  ai_evaluation: skip"
npx wrangler d1 execute ai-debate-db --local --command="ALTER TABLE debates ADD COLUMN completed_at DATETIME;" 2>/dev/null || echo "  completed_at: skip"
npx wrangler d1 execute ai-debate-db --local --command="ALTER TABLE debates ADD COLUMN winner TEXT;" 2>/dev/null || echo "  winner: skip"
npx wrangler d1 execute ai-debate-db --local --command="ALTER TABLE debates ADD COLUMN judge_evaluations TEXT;" 2>/dev/null || echo "  judge_evaluations: skip"
npx wrangler d1 execute ai-debate-db --local --command="ALTER TABLE debates ADD COLUMN status TEXT DEFAULT 'pending';" 2>/dev/null || echo "  status: skip"
npx wrangler d1 execute ai-debate-db --local --command="UPDATE debates SET status='live' WHERE id='default';" 2>/dev/null || echo "  default status: skip"

# Restart service
echo ""
echo "[6/6] サービスを再起動中..."
if command -v pm2 &> /dev/null; then
    pm2 restart ai-debate 2>/dev/null || pm2 start ecosystem.config.cjs 2>/dev/null || echo "  PM2再起動失敗"
elif command -v systemctl &> /dev/null; then
    sudo systemctl restart ai-debate 2>/dev/null || echo "  systemctl再起動失敗"
else
    echo "  サービス管理ツールが見つかりません。手動で再起動してください。"
fi

echo ""
echo "=============================="
echo " デプロイ完了！"
echo " サイト: https://ai-debate.jp"
echo "=============================="
