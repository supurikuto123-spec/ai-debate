#!/bin/bash
# AI Debate - ワンコマンド完全デプロイスクリプト
# ======================================================
# VPS (pm2 + wrangler pages dev) での使用:
#   cd /var/www/ai-debate && ./deploy_vps.sh
#
# Cloudflare Pages 本番デプロイ:
#   ./deploy_vps.sh --prod
#
# オプション:
#   --skip-pull    : git pull をスキップ
#   --skip-build   : ビルドをスキップ
#   --local-only   : CF Pages デプロイをスキップ
#   --prod         : 本番 CF Pages + 本番 D1 にデプロイ
#   --skip-migrate : DB マイグレーションをスキップ

set -e

# ===== 引数パース =====
SKIP_PULL=false
SKIP_BUILD=false
LOCAL_ONLY=false
DEPLOY_PROD=false
SKIP_MIGRATE=false

for arg in "$@"; do
  case $arg in
    --skip-pull)    SKIP_PULL=true ;;
    --skip-build)   SKIP_BUILD=true ;;
    --local-only)   LOCAL_ONLY=true ;;
    --prod)         DEPLOY_PROD=true ;;
    --skip-migrate) SKIP_MIGRATE=true ;;
  esac
done

# ===== ヘッダー =====
echo ""
echo "╔══════════════════════════════════════════╗"
echo "║    AI Debate - ワンコマンドデプロイ      ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "設定: skip-pull=$SKIP_PULL | skip-build=$SKIP_BUILD | prod=$DEPLOY_PROD"
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
cp -r . "$BACKUP_DIR" 2>/dev/null && echo "  ✅ バックアップ: $BACKUP_DIR" || echo "  ⚠️ バックアップスキップ（容量不足の可能性）"
STEP=$((STEP+1))

# ===== [2] 最新コード取得 =====
echo ""
if [ "$SKIP_PULL" = false ]; then
    echo "[$STEP] 最新コードを取得中 (git pull origin main)..."
    git pull origin main 2>&1 && echo "  ✅ git pull 完了" || echo "  ⚠️ git pull 失敗 - ローカルコードで続行"
else
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
echo ""
if [ "$SKIP_BUILD" = false ]; then
    echo "[$STEP] ビルド中..."
    npm run build 2>&1 | tail -5
    echo "  ✅ ビルド完了 → dist/"
else
    echo "[$STEP] ビルドをスキップ"
fi
STEP=$((STEP+1))

# ===== [5] DB マイグレーション =====
echo ""
if [ "$SKIP_MIGRATE" = false ]; then
    echo "[$STEP] データベースマイグレーション実行中..."

    # ターゲット決定
    if [ "$DEPLOY_PROD" = true ] && [ "$LOCAL_ONLY" = false ]; then
        DB_TARGET=""
        echo "  対象: 本番 Cloudflare D1 (ai-debate-db)"
    else
        DB_TARGET="--local"
        echo "  対象: ローカル D1 (--local)"
    fi

    # migrations/ ディレクトリのマイグレーションを適用
    echo "  マイグレーション適用中..."
    npx wrangler d1 migrations apply ai-debate-db $DB_TARGET 2>&1 \
      | grep -E "✅|❌|Error|skip|apply" | head -20 \
      || echo "  ⚠️ マイグレーション: 一部スキップ（既適用）"

    # 追加 ALTER TABLE（冪等）
    echo "  追加カラム適用中..."
    run_alter() {
      npx wrangler d1 execute ai-debate-db $DB_TARGET --command="$1" 2>/dev/null \
        && echo "  ✅ $2" || echo "  ↩️  $2 (already exists)"
    }
    run_alter "ALTER TABLE users ADD COLUMN avatar_url TEXT;"                          "users.avatar_url"
    run_alter "ALTER TABLE users ADD COLUMN avatar_type TEXT DEFAULT 'bottts';"        "users.avatar_type"
    run_alter "ALTER TABLE users ADD COLUMN avatar_value TEXT DEFAULT '1';"            "users.avatar_value"
    run_alter "ALTER TABLE users ADD COLUMN nickname TEXT;"                            "users.nickname"
    run_alter "ALTER TABLE theme_proposals ADD COLUMN agree_opinion TEXT;"             "theme_proposals.agree_opinion"
    run_alter "ALTER TABLE theme_proposals ADD COLUMN disagree_opinion TEXT;"          "theme_proposals.disagree_opinion"
    run_alter "ALTER TABLE theme_proposals ADD COLUMN category TEXT DEFAULT 'other';"  "theme_proposals.category"
    run_alter "ALTER TABLE theme_proposals ADD COLUMN proposed_by TEXT DEFAULT '';"    "theme_proposals.proposed_by"
    run_alter "ALTER TABLE debate_messages ADD COLUMN ai_evaluation TEXT;"             "debate_messages.ai_evaluation"
    run_alter "ALTER TABLE debates ADD COLUMN completed_at DATETIME;"                  "debates.completed_at"
    run_alter "ALTER TABLE debates ADD COLUMN winner TEXT;"                            "debates.winner"
    run_alter "ALTER TABLE debates ADD COLUMN judge_evaluations TEXT;"                 "debates.judge_evaluations"
    run_alter "ALTER TABLE debates ADD COLUMN status TEXT DEFAULT 'live';"             "debates.status"

    # visits テーブル（IF NOT EXISTS で安全）
    npx wrangler d1 execute ai-debate-db $DB_TARGET --command="
      CREATE TABLE IF NOT EXISTS visits (
        id TEXT PRIMARY KEY,
        session_id TEXT,
        ip_address TEXT,
        user_agent TEXT,
        page_path TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    " 2>/dev/null && echo "  ✅ visits table ensured" || echo "  ↩️  visits table already exists"

    echo "  ✅ マイグレーション完了"
else
    echo "[$STEP] DB マイグレーションをスキップ"
fi
STEP=$((STEP+1))

# ===== [6] Cloudflare Pages デプロイ (--prod 時のみ) =====
echo ""
if [ "$DEPLOY_PROD" = true ] && [ "$LOCAL_ONLY" = false ]; then
    echo "[$STEP] Cloudflare Pages に本番デプロイ中..."
    npx wrangler pages deploy dist --project-name ai-debate 2>&1 | tail -10
    echo "  ✅ Cloudflare Pages デプロイ完了"
    STEP=$((STEP+1))
fi

# ===== [7] サービス再起動 =====
echo ""
echo "[$STEP] サービスを再起動中..."

if command -v pm2 &> /dev/null; then
    if pm2 list 2>/dev/null | grep -q "ai-debate"; then
        pm2 restart ai-debate 2>/dev/null && echo "  ✅ PM2: ai-debate 再起動完了" || {
            echo "  再起動失敗 → 新規起動を試みます..."
            pm2 start ecosystem.config.cjs && echo "  ✅ PM2: ai-debate 起動完了"
        }
    else
        pm2 start ecosystem.config.cjs 2>/dev/null && echo "  ✅ PM2: ai-debate 起動完了" || echo "  ⚠️ PM2 起動失敗"
    fi
elif command -v systemctl &> /dev/null; then
    sudo systemctl restart ai-debate 2>/dev/null && echo "  ✅ systemctl 再起動完了" || echo "  ⚠️ systemctl 再起動失敗"
else
    echo "  ⚠️ サービス管理ツールが見つかりません"
    echo "  手動起動: pm2 start ecosystem.config.cjs"
fi
STEP=$((STEP+1))

# ===== [8] ヘルスチェック =====
echo ""
echo "[$STEP] ヘルスチェック中..."
sleep 4
if curl -sf http://localhost:3000 > /dev/null 2>&1; then
    echo "  ✅ サービス正常稼働中 → http://localhost:3000"
    echo "  ✅ 本番サイト: https://ai-debate.jp"
else
    echo "  ⚠️ ローカルヘルスチェック失敗"
    echo "  ログ確認: pm2 logs ai-debate --nostream --lines 20"
fi

# ===== 完了 =====
echo ""
echo "╔══════════════════════════════════════════╗"
echo "║         ✅ デプロイ完了！                ║"
echo "╠══════════════════════════════════════════╣"
echo "║  サイト: https://ai-debate.jp            ║"
if [ "$DEPLOY_PROD" = true ]; then
echo "║  CF Pages: デプロイ済み ✅               ║"
fi
echo "╚══════════════════════════════════════════╝"
echo ""
echo "━━━━ コマンド一覧 ━━━━"
echo "  ./deploy_vps.sh                   # VPS更新（git pull + build + migrate local）"
echo "  ./deploy_vps.sh --prod            # 本番デプロイ（CF Pages + 本番D1）"
echo "  ./deploy_vps.sh --skip-pull       # git pull をスキップ"
echo "  ./deploy_vps.sh --skip-build      # ビルドをスキップ"
echo "  ./deploy_vps.sh --skip-migrate    # マイグレーションをスキップ"
echo "  ./deploy_vps.sh --local-only      # CF Pages を触らない"
echo ""
