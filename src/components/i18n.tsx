// Comprehensive i18n translations for all pages
// Usage: include i18nScript() in every page's <head> or before </body>

export const i18nScript = () => `
<script>
(function(){
  const T = {
    en: {
      // === Navigation ===
      'ホーム': 'Home', '仕組み': 'How It Works', 'カテゴリー': 'Categories', '機能': 'Features',
      'ログアウト': 'Logout', '始める': 'Start', 'ログイン': 'Login',
      'お知らせ': 'Announcements', '観戦': 'Watch', '対戦': 'Battle', 'アーカイブ': 'Archive',
      'テーマ投票': 'Theme Vote', 'コミュニティ': 'Community', 'マイページ': 'My Page',
      'サポートチャット': 'Support Chat', '管理者チャット': 'Admin Chat',
      'サポートチャット管理': 'Support Chat Admin',
      '利用規約': 'Terms', 'プライバシー': 'Privacy', 'プライバシーポリシー': 'Privacy Policy',
      '特商法': 'Legal', '特定商取引法': 'Commercial Law',
      'コマンド': 'Commands',
      // === Homepage ===
      'AI vs AI ディベートショーを観戦しよう': 'Watch AI vs AI Debate Shows',
      '最先端のAI同士が繰り広げる白熱したディベートを楽しむ': 'Enjoy heated debates between cutting-edge AIs',
      '観戦でクレジット獲得、自分でもAIと対決可能': 'Earn credits by watching, challenge AI yourself',
      '事前登録ボーナス': 'Pre-registration Bonus',
      '無料プレゼント': 'Free Gift',
      'メインページへ': 'Go to Main Page',
      '事前登録して始める': 'Pre-register & Start',
      'リアルタイム接続数': 'Live Connections',
      '累計訪問者数': 'Total Visitors',
      '総登録ユーザー数': 'Registered Users',
      'サービスリリースまで': 'Until Service Launch',
      'リリース日確定次第、お知らせします': 'We will notify you once the release date is set',
      'AI vs AI 試合を観戦': 'Watch AI vs AI Matches',
      'ライブ配信されるAI同士のディベートを観戦。リアルタイムチャットで他の観客と交流しながら楽しもう': 'Watch live AI debates. Chat with other viewers in real-time!',
      '試合を作成する': 'Create a Match',
      'トピックとAIキャラクターを選んで試合をリクエスト。人気試合なら観客数に応じてクレジット還元': 'Select topics and AI characters to request a match. Popular matches earn credits based on viewership.',
      '自分も参戦': 'Join the Battle',
      'クレジットを使ってAIと対戦。ディベート力を鍛えてレーティングを上げよう': 'Use credits to battle AI. Sharpen your debate skills and climb the rankings.',
      'クレジットシステム': 'Credit System',
      '獲得方法': 'How to Earn',
      '使い道': 'How to Spend',
      '新規登録ボーナス': 'Sign-up Bonus',
      '毎日ログイン': 'Daily Login',
      '将来実装': 'Coming Soon',
      '主な機能': 'Key Features',
      '定期開催の試合': 'Regular Matches',
      '定期開催のAI vs AIのディベート試合を観戦。AI vs 人間、人間 vs 人間の対戦も実施。チャットで他の観客と盛り上がろう': 'Watch regular AI vs AI debate matches. Also featuring AI vs Human and Human vs Human battles. Chat with other viewers!',
      'レーティングシステム': 'Rating System',
      '自分でAIと対戦してスキルアップ。論理性・説得力・創造性を評価してランキング上位を目指そう': 'Battle AI to improve your skills. Get rated on logic, persuasion, and creativity to climb the rankings.',
      'AIステータス': 'AI Status',
      '各AIの戦績、勝率、得意ジャンルなどのステータスを確認可能。データに基づいて戦略を立てよう': "Check each AI's record, win rate, and specialties. Plan your strategy with data.",
      'リアルタイムチャット、フォーラムで交流。名勝負をシェアして楽しもう': 'Chat in real-time, interact on forums. Share and enjoy great matches!',
      'クレジット経済': 'Credit Economy',
      '観戦や参加でクレジット獲得。無料でも十分楽しめる持続可能なシステム': "Earn credits by watching or participating. A sustainable system that's fun even for free.",
      'サブスク無制限': 'Unlimited Subscription',
      'サブスクリプションで過去の名勝負を無制限に閲覧可能。いつでもどこでも学習できる': 'Access unlimited past matches with a subscription. Learn anytime, anywhere.',
      '無料で始める': 'Start Free',
      '今すぐ参加して、AI同士の知的バトルを観戦しよう': 'Join now and watch intellectual AI battles!',
      '登録で500クレジット無料プレゼント': 'Get 500 credits free on registration!',
      'プラットフォーム': 'Platform',
      // === Battle ===
      '対戦モード': 'Battle Mode',
      'AIとディベートで対決しよう': 'Challenge AI in a debate!',
      '対戦機能は現在開発中です': 'Battle feature is under development',
      'AIとのリアルタイムディベート対決機能を準備中です。': 'Real-time AI debate battle feature is in preparation.',
      'リリースまでお待ちください。': 'Please wait for the release.',
      '開発中 - リリース日未定': 'In Development - Release TBD',
      '実装予定の機能': 'Planned Features',
      'AI対戦': 'AI Battle',
      'AIとリアルタイムでディベート。難易度を選択して腕を磨こう。': 'Debate AI in real-time. Choose difficulty to improve your skills.',
      'ユーザー対戦': 'User Battle',
      '他のプレイヤーとリアルタイムでディベート対決。レーティング制対戦。': 'Real-time debate battles with other players. Rated matches.',
      '将来実装予定': 'Coming Soon',
      'テーマ選択': 'Theme Selection',
      '投票で選ばれた人気テーマやビルトインテーマから選択。ランダム選択も可能。': 'Choose from popular voted themes or built-in themes. Random selection available.',
      '難易度システム': 'Difficulty System',
      'かんたん・ふつう・むずかしいの3段階。AIの反論レベルが変化。': 'Three levels: Easy, Normal, Hard. AI rebuttal level changes accordingly.',
      '対戦クレジット（予定）': 'Battle Credits (Planned)',
      'かんたん': 'Easy', 'ふつう': 'Normal', 'むずかしい': 'Hard',
      'クレジット': 'Credits',
      'テーマ投票へ': 'Go to Theme Vote', '観戦へ': 'Go to Watch', 'コミュニティへ': 'Go to Community',
      // === Theme Vote ===
      'テーマ投票・提案': 'Theme Vote & Proposal',
      'ディベートテーマを提案して投票しよう': 'Propose and vote on debate themes!',
      'テーマ提案': 'Propose Theme',
      'テーマタイトル': 'Theme Title',
      '賛成側の意見': 'Pro Opinion',
      '反対側の意見': 'Con Opinion',
      'カテゴリを選択': 'Select Category',
      '提案する（20クレジット）': 'Propose (20 Credits)',
      'フィルター': 'Filter',
      'すべて': 'All',
      '投票順': 'By Votes', '新着順': 'By New', '採用済み': 'Adopted',
      '投票する': 'Vote', '投票済み': 'Voted', '取り消す': 'Cancel Vote', '採用': 'Adopt',
      '投票': 'votes',
      '次回のディベートテーマを決めよう！気になるテーマに投票したり、新しいテーマを提案できます。': "Let's decide the next debate theme! Vote for themes you like or propose new ones.",
      'テーマ提案: 20クレジット消費': 'Theme Proposal: 20 credits',
      '投票: 無料': 'Voting: Free',
      '新しいテーマを提案': 'Propose New Theme',
      '投票可能なテーマ': 'Available Themes',
      '件のテーマ': ' themes',
      'テーマを提案する（20クレジット消費。）': 'Propose Theme (20 Credits)',
      'このテーマに投票（無料）': 'Vote for this theme (Free)',
      '投票を取り消す': 'Cancel Vote',
      '採用済': 'Adopted',
      'いいね順': 'By Likes',
      // === Community ===
      'コミュニティチャット': 'Community Chat',
      'メッセージを入力...': 'Type a message...',
      '送信': 'Send',
      // === Announcements ===
      '運営からのお知らせ': 'Announcements',
      'お知らせを投稿': 'Post Announcement',
      '投稿する': 'Post',
      // === Archive ===
      'ディベートアーカイブ': 'Debate Archive',
      '過去のディベートを閲覧': 'Browse Past Debates',
      '詳細を見る': 'View Details',
      '購入済み': 'Purchased',
      // === MyPage ===
      'プロフィール設定': 'Profile Settings',
      'ニックネーム': 'Nickname',
      'ユーザーID': 'User ID',
      'アバター設定': 'Avatar Settings',
      'アバタータイプ': 'Avatar Type',
      '保存する': 'Save',
      '画像をアップロード': 'Upload Image',
      // === Legal ===
      '特定商取引法に基づく表記': 'Commercial Transaction Act Disclosure',
      '最終更新日': 'Last Updated',
      'サービス名称': 'Service Name',
      '運営者': 'Operator',
      '所在地': 'Address',
      '請求があった場合、遅滞なく開示いたします。': 'Will be disclosed without delay upon request.',
      'お問い合わせ': 'Contact',
      'サービス内容': 'Service Description',
      '利用料金': 'Pricing',
      'お支払い方法': 'Payment Method',
      'サービス提供時期': 'Service Availability',
      '返品・キャンセルについて': 'Returns & Cancellations',
      '動作環境': 'System Requirements',
      '免責事項': 'Disclaimer',
      '知的財産権': 'Intellectual Property',
      '準拠法及び管轄裁判所': 'Governing Law & Jurisdiction',
      '戻る': 'Back',
      'メインに戻る': 'Back to Main',
      // === Terms ===
      'AI Debate Arena 利用規約': 'AI Debate Arena Terms of Service',
      // === Register ===
      'アカウント登録': 'Account Registration',
      '登録する': 'Register',
      'メールアドレス': 'Email Address',
      'ユーザーIDとユーザー名を設定してください': 'Set your User ID and Username',
      '確認中...': 'Checking...',
      '使用可能です': 'Available',
      '既に使用されています': 'Already taken',
      '無効な形式です': 'Invalid format',
      '登録完了': 'Complete Registration',
      '登録中...': 'Registering...',
      '事前登録ボーナス：500クレジット獲得': 'Pre-registration Bonus: 500 Credits',
      // === Demo ===
      '登録完了！': 'Registration Complete!',
      '事前登録完了': 'Pre-registration Complete',
      '付与クレジット': 'Granted Credits',
      '事前登録特典': 'Pre-registration Bonus',
      '登録番号': 'Registration No.',
      '保有クレジット': 'Current Credits',
      'デモページへ進む（100クレジット消費）': 'Go to Demo (100 Credits)',
      '事前登録ありがとうございます': 'Thank you for pre-registering',
      '開発進捗状況': 'Development Progress',
      'フェーズ 1：基盤システム': 'Phase 1: Foundation System',
      '事前登録・認証・データベース構築完了': 'Pre-registration, auth, and database complete',
      'フェーズ 2：コア機能開発': 'Phase 2: Core Feature Development',
      'AIディベートエンジン、観戦システム': 'AI Debate Engine, Spectator System',
      'フェーズ 3：正式リリース': 'Phase 3: Official Release',
      'チャット・ランキング・コミュニティ機能追加': 'Chat, rankings, and community features',
      'デモプレビュー': 'Demo Preview',
      'メインページを見る': 'View Main Page',
      'リリースまで': 'Until Release',
      'リリース日が確定次第、お知らせします': 'Release date will be announced when confirmed',
      'ホームに戻る': 'Back to Home',
      'サポートチャットでお問い合わせ': 'Contact via Support Chat',
      '今後の予定': 'Future Plans',
      '早期アクセス': 'Early Access',
      '正式リリース前に新機能を体験可能': 'Experience new features before official release',
      '特別特典': 'Special Benefits',
      '事前登録者限定のバッジとクレジット': 'Exclusive badges and credits for pre-registrants',
      'お問い合わせはチャットで対応します': 'Contact us via chat support',
      '完了': 'Complete',
      'デモ': 'Demo',
      '予定': 'Planned',
      // === Tickets ===
      'サポート': 'Support',
      '新しいチケット': 'New Ticket',
      '件名': 'Subject',
      'メッセージ': 'Message',
      '送信する': 'Submit',
      '解決済み': 'Resolved',
      '対応中': 'In Progress',
      'オープン': 'Open',
      // === Watch ===
      'ディベート観戦': 'Watch Debate',
      'ディベート進行': 'Debate Progress',
      'コメント': 'Comments',
      'コメントを投稿しました！': 'Comment posted!',
      'コメントを入力...': 'Enter a comment...',
      'コメント送信': 'Send Comment',
      'AI審査員の評価': 'AI Judge Evaluation',
      'どちらの意見が優勢だと思いますか？': 'Which opinion do you think is winning?',
      '意見Aが優勢': 'Opinion A leads',
      '意見Bが優勢': 'Opinion B leads',
      '投票は何度でも変更できます': 'You can change your vote anytime',
      'まず、あなたの立場を選択してください': 'First, choose your stance',
      'ディベートテーマ': 'Debate Theme',
      '意見Aを支持': 'Support Opinion A',
      '意見Bを支持': 'Support Opinion B',
      '投票後に観戦画面が表示されます': 'Viewing screen will appear after voting',
      'マッチ一覧': 'Match List',
      '人が観戦中': 'viewers',
      'ディベート制約': 'Debate Rules',
      '総時間': 'Total Time',
      'AIモデル': 'AI Model',
      '最大文字数': 'Max Characters',
      '最終結果': 'Final Results',
      '勝者': 'Winner',
      // === Main ===
      '現在開催中のディベートマッチ': 'Currently Running Debate Matches',
      'ライブ中': 'Live',
      // === User Profile ===
      '登録日': 'Registered',
      '総ディベート数': 'Total Debates',
      '勝利数': 'Wins',
      '敗北数': 'Losses',
      '引き分け': 'Draws',
      '勝率': 'Win Rate',
      '投稿数': 'Posts',
      'プライバシー設定': 'Privacy Settings',
      '非公開': 'Private',
      '総ディベート数を公開': 'Show Total Debates',
      '勝利数を公開': 'Show Wins',
      '敗北数を公開': 'Show Losses',
      '引き分けを公開': 'Show Draws',
      '勝率を公開': 'Show Win Rate',
      '投稿数を公開': 'Show Posts',
      'クレジットを公開': 'Show Credits',
      // === Common ===
      'クレジット不足': 'Insufficient Credits',
      'テクノロジー': 'Technology', '社会': 'Society', '哲学': 'Philosophy',
      '環境': 'Environment', '文化': 'Culture', '経済': 'Economy', 'その他': 'Other',
      '教育': 'Education', '政治': 'Politics',
      '次のステップ': 'Next Steps',
      '読み込み中...': 'Loading...',
      'テーマを読み込み中...': 'Loading themes...',
      '立場A': 'Position A', '立場B': 'Position B',
      '票': 'votes',
      '今日': 'Today', '昨日': 'Yesterday',
      '日前': ' days ago',
      // === MyPage Stats ===
      '統計情報': 'Statistics',
      'コミュニティ投稿': 'Community Posts',
      '公開プロフィールを見る': 'View Public Profile',
      '変更を保存': 'Save Changes',
      'ニックネームを入力': 'Enter nickname',
      'ユーザーIDを入力': 'Enter user ID',
      '文字の英数字、ハイフン、アンダースコアのみ': 'Alphanumeric, hyphens, and underscores only',
      'アバター選択': 'Select Avatar',
      'ロボット': 'Robot', 'ピクセル': 'Pixel', 'パターン': 'Pattern', 'サムネ': 'Thumbs', 'シェイプ': 'Shapes',
      '画像をアップロード（クリックして選択）': 'Upload image (click to select)',
      'プロフィールを更新しました！': 'Profile updated!',
      '通信エラーが発生しました': 'Communication error occurred',
      // === Watch Page Extended ===
      'ディベート開始待ち': 'Waiting for debate to start',
      '待機中': 'Standby',
      '開始前': 'Not started',
      '残り時間': 'Time Left',
      '集計中...': 'Counting...',
      '評価中...': 'Evaluating...',
      '意見A支持': 'Support A',
      '意見B支持': 'Support B',
      '意見A': 'Opinion A', '意見B': 'Opinion B',
      '賛成': 'Agree', '反対': 'Disagree',
      '賛成側勝利': 'Agree wins', '反対側勝利': 'Disagree wins',
      // === Footer ===
      'メインページ': 'Main Page',
      'サポート': 'Support',
      // === Archive ===
      'アーカイブはまだありません': 'No archives yet',
      'アーカイブを読み込み中...': 'Loading archives...',
      'アーカイブで視聴': 'Watch in Archive',
      '読み込みに失敗しました': 'Failed to load',
      // === Main Page ===
      '現在開催中のディベートはありません': 'No debates currently running',
      '新しいディベートが開催されるまでお待ちください。': 'Please wait until a new debate is hosted.',
      'または、デモページでディベートの様子をご覧いただけます。': 'Or view the demo page to see how debates work.',
      'デモを見る': 'Watch Demo',
      '今すぐ観戦': 'Watch Now',
      '予約する': 'Reserve',
      '結果を見る': 'View Results',
      '人 観戦中': ' viewers',
      '日時未定': 'TBD',
      // === Command Panel ===
      '利用可能なコマンド': 'Available Commands',
      '実行': 'Execute',
      '実行中...': 'Executing...',
      'コマンドを入力': 'Enter command',
      '即時開始＋終了後自動アーカイブ': 'Start now + auto archive',
      '分後にディベート開始予約': 'Schedule debate start in min',
      '分後に予約開始': 'Schedule in min',
      'ユーザーxxxにyコイン付与': 'Grant y coins to user xxx',
      '現在のディベート削除': 'Delete current debate',
      'ランダムテーマで新規': 'New with random theme',
      '観戦ページ(/watch)でのみ使用可能です': 'Only available on Watch page (/watch)',
      // === Theme Vote Extended ===
      '削除': 'Delete',
      'このテーマを削除しますか？': 'Delete this theme?',
      'テーマの読み込みに失敗しました': 'Failed to load themes',
      'まだテーマが提案されていません': 'No themes proposed yet',
      'テーマを提案しました！': 'Theme proposed!',
      '20クレジット消費': '20 credits',
      '投票に失敗しました': 'Failed to vote',
      // === Privacy ===
      '総ディベート数を公開': 'Show Total Debates',
      '勝利数を公開': 'Show Wins',
      '敗北数を公開': 'Show Losses',
      '引き分けを公開': 'Show Draws',
      '勝率を公開': 'Show Win Rate',
      '投稿数を公開': 'Show Posts',
      'クレジットを公開': 'Show Credits',
    },
    zh: {
      'ホーム': '首页', '仕組み': '运作方式', 'カテゴリー': '分类', '機能': '功能',
      'ログアウト': '退出', '始める': '开始', 'ログイン': '登录',
      'お知らせ': '公告', '観戦': '观战', '対戦': '对战', 'アーカイブ': '档案',
      'テーマ投票': '主题投票', 'コミュニティ': '社区', 'マイページ': '我的页面',
      'サポートチャット': '在线客服', 'サポートチャット管理': '客服管理', 'コマンド': '命令',
      '利用規約': '使用条款', 'プライバシー': '隐私政策', 'プライバシーポリシー': '隐私政策', '特商法': '法律信息', '特定商取引法': '商业交易法',
      'AI vs AI ディベートショーを観戦しよう': '观看AI对AI辩论秀',
      '最先端のAI同士が繰り広げる白熱したディベートを楽しむ': '享受尖端AI之间的激烈辩论',
      '観戦でクレジット獲得、自分でもAIと対決可能': '观看获得积分，也可以亲自挑战AI',
      '事前登録ボーナス': '预注册奖金', '無料プレゼント': '免费赠送',
      'メインページへ': '前往主页', '事前登録して始める': '预注册开始',
      'リアルタイム接続数': '实时连接数', '累計訪問者数': '累计访问量', '総登録ユーザー数': '注册用户数',
      'クレジットシステム': '积分系统', '獲得方法': '获取方式', '使い道': '使用方式',
      '主な機能': '主要功能', '無料で始める': '免费开始', '対戦モード': '对战模式',
      '対戦機能は現在開発中です': '对战功能正在开发中', 'テーマ投票・提案': '主题投票与提案',
      'コミュニティチャット': '社区聊天', '送信': '发送', '投稿する': '发布',
      '特定商取引法に基づく表記': '商业交易法信息', '戻る': '返回', 'メインに戻る': '返回主页',
      '登録完了！': '注册完成！', '保有クレジット': '持有积分', '付与クレジット': '赠送积分', '登録番号': '注册编号',
      'かんたん': '简单', 'ふつう': '普通', 'むずかしい': '困难',
      'テーマ提案': '提案主题', '投票する': '投票', '投票済み': '已投票', '取り消す': '取消投票', '採用': '采纳', '投票を取り消す': '取消投票',
      'プロフィール設定': '个人资料设置', '保存する': '保存', 'ニックネーム': '昵称',
      '解決済み': '已解决', '対応中': '处理中', 'オープン': '待处理',
      'テクノロジー': '科技', '社会': '社会', '哲学': '哲学', '環境': '环境', '文化': '文化', '経済': '经济', 'その他': '其他', '教育': '教育', '政治': '政治',
      '現在開催中のディベートマッチ': '正在进行的辩论赛', 'ライブ中': '直播中',
      'ディベート進行': '辩论进行中', 'コメント': '评论', 'AI審査員の評価': 'AI评委评分',
      '登録日': '注册日期', '総ディベート数': '总辩论数', '勝利数': '胜场', '敗北数': '败场', '引き分け': '平局', '勝率': '胜率', '投稿数': '帖子数',
      'プライバシー設定': '隐私设置', '非公開': '未公开',
      '読み込み中...': '加载中...', '票': '票', '今日': '今天', '昨日': '昨天',
      '統計情報': '统计信息', 'コミュニティ投稿': '社区发帖', '公開プロフィールを見る': '查看公开资料',
      '変更を保存': '保存更改', 'アバター選択': '选择头像', '削除': '删除',
      'ディベート開始待ち': '等待辩论开始', '待機中': '等待中', '開始前': '未开始',
      '残り時間': '剩余时间', '評価中...': '评估中...', '集計中...': '统计中...',
      '意見A': '观点A', '意見B': '观点B', '意見A支持': '支持A', '意見B支持': '支持B',
      '賛成': '赞成', '反対': '反对', '賛成側勝利': '赞成方获胜', '反対側勝利': '反对方获胜',
      'メインページ': '主页', 'サポート': '客服',
      '現在開催中のディベートはありません': '当前没有进行中的辩论',
      '今すぐ観戦': '立即观看', '予約する': '预约', '結果を見る': '查看结果',
      '利用可能なコマンド': '可用命令', '実行': '执行', '実行中...': '执行中...',
    },
    ko: {
      'ホーム': '홈', '仕組み': '작동 방식', 'カテゴリー': '카테고리', '機能': '기능',
      'ログアウト': '로그아웃', '始める': '시작', 'ログイン': '로그인',
      'お知らせ': '공지사항', '観戦': '관전', '対戦': '대전', 'アーカイブ': '아카이브',
      'テーマ投票': '테마 투표', 'コミュニティ': '커뮤니티', 'マイページ': '마이페이지',
      'サポートチャット': '고객 지원', 'サポートチャット管理': '지원 관리', 'コマンド': '명령',
      '利用規約': '이용약관', 'プライバシー': '개인정보', 'プライバシーポリシー': '개인정보 보호정책', '特商法': '법적 고지', '特定商取引法': '상거래법',
      'AI vs AI ディベートショーを観戦しよう': 'AI 대 AI 토론쇼를 관전하세요',
      '最先端のAI同士が繰り広げる白熱したディベートを楽しむ': '최첨단 AI들의 열띤 토론을 즐기세요',
      '観戦でクレジット獲得、自分でもAIと対決可能': '관전으로 크레딧 획득, AI와 직접 대결 가능',
      '事前登録ボーナス': '사전등록 보너스', '無料プレゼント': '무료 선물',
      'メインページへ': '메인 페이지로', '事前登録して始める': '사전등록하고 시작',
      'リアルタイム接続数': '실시간 접속', '累計訪問者数': '누적 방문자', '総登録ユーザー数': '등록 사용자',
      'クレジットシステム': '크레딧 시스템', '主な機能': '주요 기능', '無料で始める': '무료로 시작',
      '対戦モード': '대전 모드', '対戦機能は現在開発中です': '대전 기능은 현재 개발 중입니다',
      'テーマ投票・提案': '테마 투표 & 제안', 'コミュニティチャット': '커뮤니티 채팅',
      '送信': '보내기', '投稿する': '게시', '特定商取引法に基づく表記': '상거래법 표기', '戻る': '돌아가기', 'メインに戻る': '메인으로',
      '登録完了！': '등록 완료!', '保有クレジット': '보유 크레딧', '付与クレジット': '지급 크레딧', '登録番号': '등록 번호',
      'かんたん': '쉬움', 'ふつう': '보통', 'むずかしい': '어려움',
      'テーマ提案': '테마 제안', '投票する': '투표', '投票済み': '투표 완료', '取り消す': '취소', '採用': '채택', '投票を取り消す': '투표 취소',
      'プロフィール設定': '프로필 설정', '保存する': '저장', 'ニックネーム': '닉네임',
      '解決済み': '해결됨', '対応中': '처리중', 'オープン': '대기중',
      'テクノロジー': '기술', '社会': '사회', '哲学': '철학', '環境': '환경', '文化': '문화', '経済': '경제', 'その他': '기타', '教育': '교육', '政治': '정치',
      '現在開催中のディベートマッチ': '현재 진행 중인 토론 매치', 'ライブ中': '라이브',
      'ディベート進行': '토론 진행', 'コメント': '댓글', 'AI審査員の評価': 'AI 심사위원 평가',
      '登録日': '등록일', '総ディベート数': '총 토론 수', '勝利数': '승리', '敗北数': '패배', '引き分け': '무승부', '勝率': '승률', '投稿数': '게시물',
      'プライバシー設定': '개인정보 설정', '非公開': '비공개',
      '読み込み中...': '로딩 중...', '票': '표', '今日': '오늘', '昨日': '어제',
      '統計情報': '통계', 'コミュニティ投稿': '커뮤니티 게시물', '公開プロフィールを見る': '공개 프로필 보기',
      '変更を保存': '변경 저장', 'アバター選択': '아바타 선택', '削除': '삭제',
      'ディベート開始待ち': '토론 시작 대기', '待機中': '대기 중', '開始前': '시작 전',
      '残り時間': '남은 시간', '評価中...': '평가 중...', '集計中...': '집계 중...',
      '意見A': '의견A', '意見B': '의견B', '意見A支持': 'A 지지', '意見B支持': 'B 지지',
      '賛成': '찬성', '反対': '반대', '賛成側勝利': '찬성측 승리', '反対側勝利': '반대측 승리',
      'メインページ': '메인 페이지', 'サポート': '지원',
      '現在開催中のディベートはありません': '현재 진행 중인 토론이 없습니다',
      '今すぐ観戦': '지금 관전', '予約する': '예약', '結果を見る': '결과 보기',
      '利用可能なコマンド': '사용 가능 명령', '実行': '실행', '実行中...': '실행 중...',
    },
    es: {
      'ホーム': 'Inicio', '仕組み': 'Cómo funciona', 'カテゴリー': 'Categorías', '機能': 'Funciones',
      'ログアウト': 'Cerrar sesión', '始める': 'Empezar', 'ログイン': 'Iniciar sesión',
      'お知らせ': 'Anuncios', '観戦': 'Ver', '対戦': 'Batalla', 'アーカイブ': 'Archivo',
      'テーマ投票': 'Votar tema', 'コミュニティ': 'Comunidad', 'マイページ': 'Mi página',
      'サポートチャット': 'Soporte', 'サポートチャット管理': 'Admin Soporte', 'コマンド': 'Comandos',
      '利用規約': 'Términos', 'プライバシー': 'Privacidad', 'プライバシーポリシー': 'Política de privacidad', '特商法': 'Legal', '特定商取引法': 'Ley comercial',
      'AI vs AI ディベートショーを観戦しよう': 'Mira shows de debate IA vs IA',
      '最先端のAI同士が繰り広げる白熱したディベートを楽しむ': 'Disfruta de debates intensos entre IAs de vanguardia',
      '観戦でクレジット獲得、自分でもAIと対決可能': 'Gana créditos viendo, desafía a la IA tú mismo',
      '事前登録ボーナス': 'Bono de pre-registro', '無料プレゼント': 'Regalo gratis',
      'メインページへ': 'Ir al inicio', '事前登録して始める': 'Pre-registrarse',
      'リアルタイム接続数': 'En vivo', '累計訪問者数': 'Visitantes', '総登録ユーザー数': 'Usuarios',
      'クレジットシステム': 'Sistema de créditos', '主な機能': 'Funciones', '無料で始める': 'Gratis',
      '対戦モード': 'Modo batalla', '対戦機能は現在開発中です': 'Función en desarrollo',
      'テーマ投票・提案': 'Votar y proponer temas', 'コミュニティチャット': 'Chat',
      '送信': 'Enviar', '投稿する': 'Publicar', '戻る': 'Volver', 'メインに戻る': 'Volver',
      '登録完了！': '¡Registro completo!', '保有クレジット': 'Créditos actuales', '付与クレジット': 'Créditos otorgados', '登録番号': 'N° registro',
      'かんたん': 'Fácil', 'ふつう': 'Normal', 'むずかしい': 'Difícil',
      'テーマ提案': 'Proponer', '投票する': 'Votar', '投票済み': 'Votado', '取り消す': 'Cancelar', '採用': 'Adoptar', '投票を取り消す': 'Cancelar voto',
      'プロフィール設定': 'Perfil', '保存する': 'Guardar', 'ニックネーム': 'Apodo',
      '解決済み': 'Resuelto', '対応中': 'En curso', 'オープン': 'Abierto',
      'テクノロジー': 'Tecnología', '社会': 'Sociedad', '哲学': 'Filosofía', '環境': 'Medio ambiente', '文化': 'Cultura', '経済': 'Economía', 'その他': 'Otros', '教育': 'Educación', '政治': 'Política',
      '現在開催中のディベートマッチ': 'Debates en curso', 'ライブ中': 'En vivo',
      'ディベート進行': 'Debate', 'コメント': 'Comentarios', 'AI審査員の評価': 'Evaluación AI',
      '登録日': 'Registrado', '総ディベート数': 'Total Debates', '勝利数': 'Victorias', '敗北数': 'Derrotas', '引き分け': 'Empates', '勝率': 'Tasa', '投稿数': 'Posts',
      'プライバシー設定': 'Privacidad', '非公開': 'Privado',
      '読み込み中...': 'Cargando...', '票': 'votos', '今日': 'Hoy', '昨日': 'Ayer',
      '統計情報': 'Estadísticas', 'コミュニティ投稿': 'Posts', '公開プロフィールを見る': 'Ver perfil público',
      '変更を保存': 'Guardar', 'アバター選択': 'Seleccionar avatar', '削除': 'Eliminar',
      'ディベート開始待ち': 'Esperando debate', '待機中': 'En espera', '開始前': 'No iniciado',
      '残り時間': 'Tiempo restante', '評価中...': 'Evaluando...', '集計中...': 'Contando...',
      '意見A': 'Opinión A', '意見B': 'Opinión B', '意見A支持': 'Apoyo A', '意見B支持': 'Apoyo B',
      '賛成': 'A favor', '反対': 'En contra', '賛成側勝利': 'Gana A favor', '反対側勝利': 'Gana En contra',
      'メインページ': 'Inicio', 'サポート': 'Soporte',
      '現在開催中のディベートはありません': 'No hay debates en curso',
      '今すぐ観戦': 'Ver ahora', '予約する': 'Reservar', '結果を見る': 'Ver resultados',
      '利用可能なコマンド': 'Comandos', '実行': 'Ejecutar', '実行中...': 'Ejecutando...',
    },
    fr: {
      'ホーム': 'Accueil', '仕組み': 'Fonctionnement', 'カテゴリー': 'Catégories', '機能': 'Fonctionnalités',
      'ログアウト': 'Déconnexion', '始める': 'Commencer', 'ログイン': 'Connexion',
      'お知らせ': 'Annonces', '観戦': 'Regarder', '対戦': 'Combat', 'アーカイブ': 'Archives',
      'テーマ投票': 'Vote thème', 'コミュニティ': 'Communauté', 'マイページ': 'Mon profil',
      'サポートチャット': 'Support', 'サポートチャット管理': 'Admin Support', 'コマンド': 'Commandes',
      '利用規約': 'Conditions', 'プライバシー': 'Confidentialité', 'プライバシーポリシー': 'Politique de confidentialité', '特商法': 'Mentions légales', '特定商取引法': 'Loi commerciale',
      'AI vs AI ディベートショーを観戦しよう': 'Regardez des débats IA contre IA',
      '最先端のAI同士が繰り広げる白熱したディベートを楽しむ': "Profitez de débats intenses entre IAs de pointe",
      '観戦でクレジット獲得、自分でもAIと対決可能': "Gagnez des crédits en regardant, défiez l'IA",
      '事前登録ボーナス': 'Bonus pré-inscription', '無料プレゼント': 'Cadeau gratuit',
      'メインページへ': "Aller à l'accueil", '事前登録して始める': "S'inscrire",
      'クレジットシステム': 'Système de crédits', '主な機能': 'Fonctionnalités', '無料で始める': 'Gratuit',
      '対戦モード': 'Mode combat', '対戦機能は現在開発中です': 'En développement',
      'テーマ投票・提案': 'Voter et proposer', 'コミュニティチャット': 'Chat',
      '送信': 'Envoyer', '投稿する': 'Publier', '戻る': 'Retour', 'メインに戻る': 'Retour',
      '登録完了！': 'Inscription terminée !', '保有クレジット': 'Crédits actuels', '付与クレジット': 'Crédits accordés', '登録番号': "N° d'inscription",
      'テーマ提案': 'Proposer', '投票する': 'Voter', '投票済み': 'Voté', '取り消す': 'Annuler', '採用': 'Adopter', '投票を取り消す': 'Annuler vote',
      'プロフィール設定': 'Paramètres', '保存する': 'Sauvegarder', 'ニックネーム': 'Pseudo',
      '解決済み': 'Résolu', '対応中': 'En cours', 'オープン': 'Ouvert',
      'テクノロジー': 'Technologie', '社会': 'Société', '哲学': 'Philosophie', '環境': 'Environnement', '文化': 'Culture', '経済': 'Économie', 'その他': 'Autres', '教育': 'Éducation', '政治': 'Politique',
      '現在開催中のディベートマッチ': 'Débats en cours', 'ライブ中': 'En direct',
      'ディベート進行': 'Débat', 'コメント': 'Commentaires', 'AI審査員の評価': 'Évaluation IA',
      '登録日': 'Inscrit le', '総ディベート数': 'Total Débats', '勝利数': 'Victoires', '敗北数': 'Défaites', '引き分け': 'Nuls', '勝率': 'Taux', '投稿数': 'Posts',
      'プライバシー設定': 'Confidentialité', '非公開': 'Privé',
      '読み込み中...': 'Chargement...', '票': 'votes', '今日': "Aujourd'hui", '昨日': 'Hier',
      '統計情報': 'Statistiques', 'コミュニティ投稿': 'Publications', '公開プロフィールを見る': 'Voir profil public',
      '変更を保存': 'Sauvegarder', 'アバター選択': 'Choisir avatar', '削除': 'Supprimer',
      'ディベート開始待ち': 'En attente', '待機中': 'En attente', '開始前': 'Non commencé',
      '残り時間': 'Temps restant', '評価中...': 'Évaluation...', '集計中...': 'Comptage...',
      '意見A': 'Opinion A', '意見B': 'Opinion B', '意見A支持': 'Soutien A', '意見B支持': 'Soutien B',
      '賛成': 'Pour', '反対': 'Contre', '賛成側勝利': 'Pour gagne', '反対側勝利': 'Contre gagne',
      'メインページ': 'Accueil', 'サポート': 'Support',
      '現在開催中のディベートはありません': 'Aucun débat en cours',
      '今すぐ観戦': 'Regarder', '予約する': 'Réserver', '結果を見る': 'Voir résultats',
      '利用可能なコマンド': 'Commandes', '実行': 'Exécuter', '実行中...': 'En cours...',
    }
  };

  function detectLang(){
    var s=localStorage.getItem('ai-debate-lang');
    if(s)return s;
    var b=(navigator.language||'ja').toLowerCase();
    if(b.startsWith('en'))return'en';
    if(b.startsWith('zh'))return'zh';
    if(b.startsWith('ko'))return'ko';
    if(b.startsWith('es'))return'es';
    if(b.startsWith('fr'))return'fr';
    return'ja';
  }

  function translateAll(lang){
    if(lang==='ja'||!T[lang])return;
    var d=T[lang];
    var keys=Object.keys(d).sort(function(a,b){return b.length-a.length;});
    
    function translateNode(root) {
      var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null,false);
      var nodes=[];
      while(walker.nextNode())nodes.push(walker.currentNode);
      nodes.forEach(function(n){
        var t=n.textContent;
        if(!t||!t.trim())return;
        var changed=false;
        keys.forEach(function(k){
          if(t.indexOf(k)!==-1){
            t=t.split(k).join(d[k]);
            changed=true;
          }
        });
        if(changed)n.textContent=t;
      });
    }
    
    translateNode(document.body);
    
    // Translate placeholder attributes
    document.querySelectorAll('[placeholder]').forEach(function(el){
      var p=el.getAttribute('placeholder');
      keys.forEach(function(k){
        if(p && p.indexOf(k)!==-1) p=p.split(k).join(d[k]);
      });
      if(p !== el.getAttribute('placeholder')) el.setAttribute('placeholder',p);
    });
    // Translate title attributes
    document.querySelectorAll('[title]').forEach(function(el){
      var t=el.getAttribute('title');
      if(t&&d[t])el.setAttribute('title',d[t]);
    });
    document.documentElement.lang=lang==='zh'?'zh-CN':lang==='ko'?'ko-KR':lang;
    
    // Observe DOM changes for dynamically loaded content
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        m.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) translateNode(node);
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function createSwitcher(lang){
    var sw=document.createElement('div');
    sw.id='lang-switcher';
    sw.style.cssText='position:fixed;bottom:20px;left:20px;z-index:9999;display:flex;gap:4px;background:rgba(0,0,0,0.9);border:1px solid rgba(0,255,255,0.3);border-radius:10px;padding:6px 8px;backdrop-filter:blur(10px);';
    var langs=[{c:'ja',l:'JP'},{c:'en',l:'EN'},{c:'zh',l:'中'},{c:'ko',l:'한'},{c:'es',l:'ES'},{c:'fr',l:'FR'}];
    langs.forEach(function(x){
      var b=document.createElement('button');
      b.textContent=x.l;
      b.style.cssText='padding:4px 8px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;border:1px solid transparent;background:transparent;color:#9ca3af;transition:all 0.2s;min-width:32px;';
      if(x.c===lang){b.style.background='rgba(0,255,255,0.25)';b.style.borderColor='#06b6d4';b.style.color='#00ffff';}
      b.addEventListener('click',function(){localStorage.setItem('ai-debate-lang',x.c);location.reload();});
      sw.appendChild(b);
    });
    document.body.appendChild(sw);
  }

  document.addEventListener('DOMContentLoaded',function(){
    var old=document.getElementById('lang-switcher');
    if(old)old.remove();
    var lang=detectLang();
    createSwitcher(lang);
    translateAll(lang);
  });
})();
</script>
`;
