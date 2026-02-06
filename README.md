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

### 2. AIディベート観戦システム（完全実装✅）

**リアルタイムディベート**
- AI vs AI ディベート生成（OpenAI gpt-4o-mini）
- タイピングアニメーション（30ms/文字）
- 150文字厳守（バックエンドで強制切り詰め + 句読点調整）
- ターン制対話（3秒間隔）
- 60秒制限時間

**投票・ゲージシステム**
- リアルタイム投票（意見A / 意見B）
- 10秒ごとに10票のランダム変更（総数不変）
- AI評価システム（3つのAI審査員）
  - **3ターン目から評価開始**（それまで「AI集計中」表示）
  - 人間投票者数（AI除く）に基づく票数配分
  - 10人投票 = 各AI審査員に3票配分
  - 人間投票者が増えた場合のみAI票追加
- Fog Mode（残り10%で投票数を完全非表示）
- ゲージアニメーション完全削除（transition: none）

**AI評価記号システム**
- !! : 圧倒的な説得力（緑）
- ! : 優れた意見（緑）
- ? : 根拠不足（オレンジ）
- ?? : 意図不明・致命的失言（赤）
- 符号なし : 通常の主張（表示なし）

**自動スクロール機能**
- 真下にいる場合のみスクロール（10px以内判定）
- タイピング中も`requestAnimationFrame`で自動スクロール
- ユーザーが上にスクロール中は自動スクロール停止
- コメント欄も同様の動作

**コメントシステム**
- リアルタイムコメント投稿
- 投票に基づく色分け（緑=意見A、赤=意見B）
- D1データベース永続化
- 2秒ごとの自動同期

**開発者コマンド（devユーザー限定）**
- `!s` : ディベート開始
- `!stop` : ディベート停止
- `!dela` : コメント+ディベート全削除
- `!deld` : ディベート履歴削除

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

**debates テーブル**
```sql
- id (UUID)
- topic (トピック)
- status (waiting/active/finished)
- winner (agree/disagree/draw)
- created_at, updated_at
```

**debate_messages テーブル**
```sql
- id (UUID)
- debate_id
- side (agree/disagree)
- model (gpt-4o-mini等)
- content (メッセージ本文)
- created_at
```

**votes テーブル**
```sql
- debate_id
- user_id
- vote (agree/disagree)
- created_at, updated_at
```

**comments テーブル**
```sql
- id (UUID)
- debate_id
- user_id
- username
- vote (agree/disagree)
- content
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
GET  /                                  - ホームページ
GET  /auth/google                       - Google認証開始（モック）
GET  /register                          - 登録ページ
POST /api/register                      - 登録処理
GET  /demo                              - 事前登録完了ページ
GET  /main                              - メインメニュー
GET  /watch/:debateId                   - ディベート観戦ページ
GET  /logout                            - ログアウト
GET  /api/user                          - ユーザー情報取得
GET  /api/check-userid/:userid          - ユーザーID重複チェック

# ディベートAPI
POST /api/debate/generate               - AI応答生成（OpenAI gpt-4o-mini）
POST /api/debate/message                - ディベートメッセージ保存
GET  /api/debate/:debateId/messages     - ディベートメッセージ取得
DELETE /api/debate/:debateId/messages   - ディベートメッセージ削除

# 投票API
POST /api/vote                          - 投票保存・更新
GET  /api/votes/:debateId               - 投票データ取得

# コメントAPI
POST /api/comment                       - コメント投稿
GET  /api/comments/:debateId            - コメント一覧取得
DELETE /api/comments/:debateId          - コメント全削除
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

**最終更新日**: 2026-02-06  
**現在のステータス**: ✅ AIディベート観戦システム完全実装済み  
**次のマイルストーン**: ユーザー vs AI ディベート実装

## 🔧 最近の修正（2026-02-06）

### AI投票システムの完全修正
- **3ターン目まで待機**: 1-2ターン目は「AI集計中」表示、3ターン目から実際の評価開始
- **人間投票者ベースの配分**: AI除く有効投票者数をベースに、AI 3体に均等配分
  - 例: 10人投票 → 各AI審査員に3票ずつ配分
- **増加分のみ追加**: 人間投票者が増えた場合のみAI票を追加

### ランダム投票変更の修正
- **総数維持**: 10秒ごとに10票を変更するが、総投票数は増やさない
- **既存票の入れ替え**: agree ↔ disagree の変更のみ
- **初期値対応**: 0票の場合は初回のみ新規追加

### スクロール機能の最適化
- **閾値統一**: 真下判定を10px以内に統一（100px→10px）
- **タイピング中の自動スクロール**: `requestAnimationFrame`でフレーム単位の滑らかなスクロール
- **ユーザー操作優先**: 上にスクロール中は自動スクロール停止

### 文字数制限の強化
- **バックエンド強制切り詰め**: 150文字を超えた場合、句読点位置で自然に終了
- **句読点自動追加**: 句読点で終わっていない場合は「。」を自動追加
- **最低文字数保証**: 100文字以上は確保した上で句読点調整

### Fog Mode実装
- **投票情報完全非表示**: 残り時間10%以下で投票数・パーセンテージを「???」表示
- **ゲージブラー効果**: blur(20px) + グラデーション化
- **アニメーション削除**: transition: none で静的表示
