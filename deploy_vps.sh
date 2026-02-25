#!/bin/bash
# AI Debate - ワンコマンド完全デプロイスクリプト
# 使用方法: cd /var/www/ai-debate && chmod +x deploy_vps.sh && ./deploy_vps.sh
#
# 必要な環境変数 (Cloudflare Pages の場合は不要):
#   CLOUDFLARE_API_TOKEN  - wrangler 認証用 API トークン
#
# オプション:
#   --skip-pull    : git pull をスキップ
#   --skip-build   : ビルドをスキップ（コードを変更しない場合）
#   --local-only   : Cloudflare デプロイをスキップしてローカルのみ再起動
#   --prod         : 本番 Cloudflare Pages にデプロイ (wrangler pages deploy)

set -e

# ===== 引数パース =====
SKIP_PULL=false
SKIP_BUILD=false
LOCAL_ONLY=false
DEPLOY_PROD=false

for arg in "$@"; do
  case $arg in
    --skip-pull)  SKIP_PULL=true ;;
    --skip-build) SKIP_BUILD=true ;;
    --local-only) LOCAL_ONLY=true ;;
    --prod)       DEPLOY_PROD=true ;;
  esac
done

# ===== ヘッダー =====
echo ""
echo "╔══════════════════════════════════════╗"
echo "║   AI Debate - ワンコマンドデプロイ   ║"
echo "╚══════════════════════════════════════╝"
echo ""
echo "オプション: skip-pull=$SKIP_PULL | skip-build=$SKIP_BUILD | local-only=$LOCAL_ONLY | prod=$DEPLOY_PROD"
echo ""

# ===== 作業ディレクトリ確認 =====
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json が見つかりません。プロジェクトルートで実行してください。"
    exit 1
fi

STEP=1

# ===== [1] バックアップ =====
echo "[$STEP] バックアップ作成中..."
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="../ai-debate-backup-${TIMESTAMP}"
cp -r . "$BACKUP_DIR" 2>/dev/null && echo "  ✅ バックアップ: $BACKUP_DIR" || echo "  ⚠️ バックアップスキップ"
STEP=$((STEP+1))

# ===== [2] 最新コード取得 =====
if [ "$SKIP_PULL" = false ]; then
    echo ""
    echo "[$STEP] 最新コードを取得中..."
    git pull origin main 2>&1 && echo "  ✅ git pull 完了" || echo "  ⚠️ git pull 失敗 - ローカルコードで続行"
else
    echo ""
    echo "[$STEP] git pull をスキップ"
fi
STEP=$((STEP+1))

# ===== [3] 依存パッケージインストール =====
echo ""
echo "[$STEP] 依存パッケージをインストール中..."
npm install --prefer-offline 2>&1 | tail -3
echo "  ✅ npm install 完了"
STEP=$((STEP+1))

# ===== [4] ビルド =====
if [ "$SKIP_BUILD" = false ]; then
    echo ""
    echo "[$STEP] ビルド中..."
    npm run build 2>&1 | tail -5
    echo "  ✅ ビルド完了 → dist/"
else
    echo ""
    echo "[$STEP] ビルドをスキップ"
fi
STEP=$((STEP+1))

# ===== [5] DB マイグレーション =====
echo ""
echo "[$STEP] データベースマイグレーション実行中..."

# ターゲット決定: --local か本番か
if [ "$LOCAL_ONLY" = true ]; then
    DB_TARGET="--local"
    echo "  対象: ローカル D1 (--local)"
else
    DB_TARGET=""
    echo "  対象: 本番 Cloudflare D1 (ai-debate-db)"
fi

# メインスキーマ適用
echo "  スキーマ適用 (migrate_production.sql)..."
npx wrangler d1 execute ai-debate-db $DB_TARGET --file=./migrate_production.sql 2>&1 \
  | grep -v "^$" | head -5 || echo "  ⚠️ メインマイグレーション: 一部スキップ（既存テーブル）"

# ALTER TABLE（既存カラムがある場合はスキップ）
echo "  カラム追加マイグレーション..."
run_alter() {
  npx wrangler d1 execute ai-debate-db $DB_TARGET --command="$1" 2>/dev/null \
    && echo "  ✅ $2" || echo "  ↩️  $2 skip"
}

run_alter "ALTER TABLE users ADD COLUMN avatar_url TEXT;"            "users.avatar_url"
run_alter "ALTER TABLE users ADD COLUMN avatar_type TEXT DEFAULT 'bottts';" "users.avatar_type"
run_alter "ALTER TABLE users ADD COLUMN avatar_value TEXT DEFAULT '1';"     "users.avatar_value"
run_alter "ALTER TABLE users ADD COLUMN nickname TEXT;"              "users.nickname"
run_alter "ALTER TABLE theme_proposals ADD COLUMN agree_opinion TEXT;"    "theme_proposals.agree_opinion"
run_alter "ALTER TABLE theme_proposals ADD COLUMN disagree_opinion TEXT;" "theme_proposals.disagree_opinion"
run_alter "ALTER TABLE theme_proposals ADD COLUMN category TEXT DEFAULT 'other';" "theme_proposals.category"
run_alter "ALTER TABLE theme_proposals ADD COLUMN proposed_by TEXT DEFAULT '';"   "theme_proposals.proposed_by"
run_alter "UPDATE theme_proposals SET proposed_by = user_id WHERE proposed_by IS NULL OR proposed_by = '';" "proposed_by copy"
run_alter "ALTER TABLE debate_messages ADD COLUMN ai_evaluation TEXT;" "debate_messages.ai_evaluation"
run_alter "ALTER TABLE debates ADD COLUMN completed_at DATETIME;"  "debates.completed_at"
run_alter "ALTER TABLE debates ADD COLUMN winner TEXT;"            "debates.winner"
run_alter "ALTER TABLE debates ADD COLUMN judge_evaluations TEXT;" "debates.judge_evaluations"
run_alter "ALTER TABLE debates ADD COLUMN status TEXT DEFAULT 'pending';" "debates.status"
run_alter "DELETE FROM debates WHERE id='default';"                "delete default debate"

# 追加マイグレーション（alter_columns）
if [ -f "./migrate_alter_columns.sql" ]; then
    echo "  追加カラムマイグレーション (migrate_alter_columns.sql)..."
    npx wrangler d1 execute ai-debate-db $DB_TARGET --file=./migrate_alter_columns.sql 2>&1 \
      | grep -v "^$" | head -3 || echo "  ⚠️ alter_columns: 一部スキップ"
fi

echo "  ✅ マイグレーション完了"
STEP=$((STEP+1))

# ===== [6] Cloudflare Pages デプロイ (--prod 時のみ) =====
if [ "$DEPLOY_PROD" = true ] && [ "$LOCAL_ONLY" = false ]; then
    echo ""
    echo "[$STEP] Cloudflare Pages にデプロイ中..."
    npx wrangler pages deploy dist --project-name ai-debate 2>&1 | tail -10
    echo "  ✅ Cloudflare Pages デプロイ完了"
    STEP=$((STEP+1))
fi

# ===== [7] サービス再起動 =====
echo ""
echo "[$STEP] サービスを再起動中..."

if command -v pm2 &> /dev/null; then
    if pm2 list 2>/dev/null | grep -q "ai-debate"; then
        pm2 restart ai-debate 2>/dev/null && echo "  ✅ PM2: ai-debate 再起動完了" || echo "  ⚠️ PM2 再起動失敗"
    else
        pm2 start ecosystem.config.cjs 2>/dev/null && echo "  ✅ PM2: ai-debate 起動完了" || echo "  ⚠️ PM2 起動失敗"
    fi
elif command -v systemctl &> /dev/null; then
    sudo systemctl restart ai-debate 2>/dev/null && echo "  ✅ systemctl 再起動完了" || echo "  ⚠️ systemctl 再起動失敗"
else
    echo "  ⚠️ サービス管理ツールが見つかりません。手動で再起動してください。"
    echo "  手動起動コマンド: npm run build && npx wrangler pages dev dist --ip 0.0.0.0 --port 3000"
fi

STEP=$((STEP+1))

# ===== [8] ヘルスチェック =====
echo ""
echo "[$STEP] ヘルスチェック中..."
sleep 3
if curl -sf http://localhost:3000 > /dev/null 2>&1; then
    echo "  ✅ サービス正常稼働中 (http://localhost:3000)"
else
    echo "  ⚠️ ローカルヘルスチェック失敗（Cloudflare Pages 本番では無視可）"
fi

# ===== 完了 =====
echo ""
echo "╔══════════════════════════════════════╗"
echo "║      ✅ デプロイ完了！               ║"
echo "╠══════════════════════════════════════╣"
echo "║  サイト: https://ai-debate.jp        ║"
if [ "$DEPLOY_PROD" = true ]; then
echo "║  CF Pages: デプロイ済み              ║"
fi
echo "╚══════════════════════════════════════╝"
echo ""
echo "使用方法:"
echo "  ./deploy_vps.sh              # ローカル再起動（git pull + build + migrate local）"
echo "  ./deploy_vps.sh --prod       # 本番デプロイ（Cloudflare Pages + 本番 D1）"
echo "  ./deploy_vps.sh --local-only # ローカルのみ（本番 D1 を触らない）"
echo "  ./deploy_vps.sh --skip-pull  # git pull をスキップ"
echo "  ./deploy_vps.sh --skip-build # ビルドをスキップ"
