# AI Debate

## プロジェクト概要
- **名前**: AI Debate
- **コンセプト**: AI vs AI ディベートショー観戦プラットフォーム
- **メイン体験**: AI同士の白熱したディベートをライブ観戦
- **サブ体験**: ユーザー自身もAIと対戦可能
- **経済システム**: クレジット制（無料でも楽しめる設計）
- **デザイン**: Y2K Gen Z スタイル（ネオン、グラデーション、サイバーパンク）

## 🌐 公開URL
- **サンドボックス**: https://3000-ioivocza0xummc8b0r4mc-3844e1b6.sandbox.novita.ai
- **GitHub**: （まだ未設定）

## ✨ 実装済み機能

### 1. ホームページ
- Y2Kスタイルのデザイン
- AI vs AI メインコンセプト
- カテゴリー別トピック表示
- クレジットシステム説明
- Font Awesomeアイコン（SNS用）

### 2. 事前登録システム（完全実装✅）

**Google OAuth認証**
- モック認証（開発環境）
- `/auth/google` - Google認証開始
- 本番環境では実際のGoogle OAuth実装予定

**ユーザー登録フロー**
1. Googleアカウントで認証
2. ユーザーID・ユーザー名を設定
3. バリデーション
   - ユーザーID: 3-20文字、英数字・アンダースコア・ハイフン
   - ユーザー名: 1-30文字、特殊文字OK
   - 禁止ワード: admin, root, system, moderator, aidebate, official
   - 重複チェック: ユーザーID、メールアドレス

**クレジット付与システム**
- 事前登録：**500クレジット** 🎁
- 通常登録：**300クレジット**
- 差分：**+200クレジット**のお得感を訴求

### 3. データベース（Cloudflare D1）

**users テーブル**
```sql
- id (UUID)
- user_id (一意、重複NG)
- username (重複OK)
- email (一意)
- google_id (一意)
- credits (デフォルト500)
- is_pre_registration (1=事前登録)
- rating (デフォルト1200)
- rank (デフォルト'Bronze')
- created_at, updated_at
```

**credit_transactions テーブル**
```sql
- id (UUID)
- user_id
- amount
- type (earn/spend)
- reason
- created_at
```

### 4. 事前登録完了ページ（/demo）

**デザイン要素**
- チェックマークアニメーション（モーション付き）
- ステータスカード
  - クレジット表示
  - お得度（+200クレジット）
  - 登録番号（リアルな数値、※数値は変動予定）
- 開発進捗状況（3フェーズに簡略化）
  - ✓ フェーズ1：基盤システム（完了）
  - ▶ フェーズ2：コア機能開発（開発中）
  - ○ フェーズ3：正式リリース（予定）
- リリースカウントダウン（□ERROR□ デジタルメーター風エラー表示）
- 今後の予定（SVGアイコン使用、絵文字廃止）
  - メール通知（重要なアップデート）
  - 早期アクセス（正式リリース前の新機能体験）
  - 特別特典（事前登録者限定バッジとクレジット）

### 5. ホームページのUI改善（v3.2）
- デジタルカウントダウンメーター（□ERROR□ 表示）
- クレジット獲得方法から「試合観戦」「チャット参加」を削除
- フッターリンクに「現在作成中」通知を追加
- 全体的にテキスト中央寄せ配置

### 5. 認証・セッション管理
- Cookie ベースセッション
- ログイン状態の維持（30日間）
- ログアウト機能

## 📊 実装されたAPI

```
GET  /                           - ホームページ
GET  /auth/google                - Google認証開始（モック）
GET  /register                   - 登録ページ
POST /api/register               - 登録処理
GET  /demo                       - 事前登録完了ページ
GET  /logout                     - ログアウト
GET  /api/user                   - ユーザー情報取得
GET  /api/check-userid/:userid   - ユーザーID重複チェック
```

## 💳 クレジットシステム

### 獲得方法
```
事前登録ボーナス：500クレジット 🎁
通常登録ボーナス：300クレジット
毎日ログイン：10クレジット/日
試合観戦：5クレジット/試合（10分以上）
チャット参加：2クレジット/コメント
User vs AI 勝利：30-100クレジット
デイリークエスト：20-50クレジット
```

### 使い道
```
AI vs AI 試合作成：50-200クレジット
User vs AI クイックマッチ：20クレジット
User vs AI カスタムマッチ：50クレジット
AI性格カスタマイズ：30クレジット
プロフィール装飾：20-100クレジット
カスタムトピック作成：30クレジット
```

## 🛠 技術スタック

### フロントエンド
- **フレームワーク**: Hono (Cloudflare Pages)
- **スタイリング**: TailwindCSS + カスタムCSS
- **アイコン**: Font Awesome + SVG
- **アニメーション**: CSS Animation

### バックエンド
- **ランタイム**: Cloudflare Workers
- **データベース**: Cloudflare D1（SQLite）
- **認証**: Google OAuth（Cookie ベース）
- **セッション**: HTTP Cookie

### 将来の実装予定
- **リアルタイム**: Cloudflare Durable Objects（WebSocket）
- **AI統合**: OpenAI API / Claude API

## 📁 プロジェクト構造

```
webapp/
├── src/
│   ├── index.tsx              # メインアプリケーション
│   └── pages/
│       ├── homepage.tsx       # ホームページ
│       ├── register.tsx       # 登録ページ
│       └── demo.tsx           # 事前登録完了ページ
├── public/static/
│   ├── styles.css             # Y2Kスタイル
│   └── app.js                 # インタラクティブ機能
├── migrations/
│   └── 0001_initial_schema.sql # データベーススキーマ
├── ecosystem.config.cjs       # PM2設定
├── wrangler.jsonc             # Cloudflare設定
├── .dev.vars                  # 開発環境変数
├── package.json               # 依存関係
├── .gitignore                 # Git除外設定
└── README.md                  # このファイル
```

## 🛠 開発コマンド

```bash
# プロジェクトディレクトリ
cd /home/user/webapp

# データベース初期化
npm run db:reset

# ビルド
npm run build

# 開発サーバー起動（PM2）
pm2 start ecosystem.config.cjs

# サーバー再起動
fuser -k 3000/tcp && npm run build && pm2 restart ai-debate

# ログ確認
pm2 logs ai-debate --nostream

# サービス状態
pm2 list

# 停止
pm2 delete ai-debate

# データベースコンソール
npm run db:console:local
```

## 🧪 事前登録フローのテスト

```bash
# 1. ホームページにアクセス
curl http://localhost:3000

# 2. Google認証（モック）
curl -L http://localhost:3000/auth/google

# 3. 登録ページが表示される
# ブラウザで http://localhost:3000/register にアクセス

# 4. ユーザー情報を入力して登録

# 5. 完了ページへリダイレクト
# http://localhost:3000/demo
```

## 📝 未実装の機能

### 高優先度
- [ ] 本番環境用Google OAuth設定
- [ ] AI vs AI ディベートエンジン（OpenAI API統合）
- [ ] リアルタイムチャット（WebSocket）
- [ ] リリースカウントダウン機能

### 中優先度
- [ ] メール通知システム
- [ ] レーティング・ランキングシステム
- [ ] リプレイ機能
- [ ] AIキャラクター実装
- [ ] トピック管理システム

### 低優先度
- [ ] プロフィール・フォロー機能
- [ ] 通知システム
- [ ] バッジ・実績システム
- [ ] プロフィールカスタマイズ

## 🎯 次のステップ

1. **本番環境Google OAuth設定**
   - Google Cloud Console でOAuth 2.0クライアント作成
   - Redirect URI設定
   - .dev.vars を本番環境変数に設定

2. **AIディベートエンジンのプロトタイプ作成**
   - OpenAI APIでAI vs AI 対話生成
   - 簡易的なディベートロジック実装

3. **リアルタイムチャット実装**
   - Cloudflare Durable Objects でWebSocket
   - チャットUI作成

4. **Cloudflare Pagesへのデプロイ**
   - D1データベースを本番環境に作成
   - 環境変数設定
   - デプロイ

## 💾 バックアップ情報

- **Git**: 5コミット管理中
- **最新コミット**: Google OAuth事前登録システム実装
- **データベース**: ローカルD1 (.wrangler/state/v3/d1)

## 🎨 デザイン特徴

### 絵文字の使い方
- **SNSアイコン**: Font Awesome使用（fab fa-twitter, fab fa-discord, fab fa-github）
- **その他アイコン**: SVG + 幾何学記号
- **デモページ**: 限定的に絵文字使用（📧🎯🎁など、情報伝達のため）

### Y2K Gen Z スタイル
- カラーパレット：シアン、マゼンタ、グリーン、イエロー
- アニメーション：グリッチ、ネオングロー、チェックマーク
- タイポグラフィ：Orbitron（見出し）、Space Grotesk（本文）

## 📄 ライセンス

© 2026 AI Debate. All rights reserved.

---

**最終更新日**: 2026-01-26  
**現在のステータス**: ✅ 事前登録システム完全実装済み  
**次のマイルストーン**: AIディベートエンジンの実装
