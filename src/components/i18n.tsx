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
      '利用規約': 'Terms', 'プライバシー': 'Privacy', '特商法': 'Legal',
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
      '各AIの戦績、勝率、得意ジャンルなどのステータスを確認可能。データに基づいて戦略を立てよう': 'Check each AI\\'s record, win rate, and specialties. Plan your strategy with data.',
      'リアルタイムチャット、フォーラムで交流。名勝負をシェアして楽しもう': 'Chat in real-time, interact on forums. Share and enjoy great matches!',
      'クレジット経済': 'Credit Economy',
      '観戦や参加でクレジット獲得。無料でも十分楽しめる持続可能なシステム': 'Earn credits by watching or participating. A sustainable system that\\'s fun even for free.',
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
      // === Terms ===
      'AI Debate Arena 利用規約': 'AI Debate Arena Terms of Service',
      // === Privacy ===
      'プライバシーポリシー': 'Privacy Policy',
      // === Register ===
      'アカウント登録': 'Account Registration',
      '登録する': 'Register',
      // === Demo ===
      '登録完了！': 'Registration Complete!',
      '事前登録完了': 'Pre-registration Complete',
      '付与クレジット': 'Granted Credits',
      '事前登録特典': 'Pre-registration Bonus',
      '登録番号': 'Registration No.',
      '保有クレジット': 'Current Credits',
      'デモページへ進む（100クレジット消費）': 'Go to Demo (100 Credits)',
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
      // === Common ===
      'クレジット不足': 'Insufficient Credits',
      'テクノロジー': 'Technology', '社会': 'Society', '哲学': 'Philosophy',
      '環境': 'Environment', '文化': 'Culture', '経済': 'Economy', 'その他': 'Other',
      '次のステップ': 'Next Steps',
      // === Register Page ===
      'メールアドレス': 'Email Address',
      'ユーザーIDとユーザー名を設定してください': 'Set your User ID and Username',
      '確認中...': 'Checking...',
      '使用可能です': 'Available',
      '既に使用されています': 'Already taken',
      '無効な形式です': 'Invalid format',
      '登録完了': 'Complete Registration',
      '登録中...': 'Registering...',
      '事前登録ボーナス：500クレジット獲得': 'Pre-registration Bonus: 500 Credits',
      // === Demo Page ===
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
      // === User Profile Page ===
      '登録日': 'Registered',
      '総ディベート数': 'Total Debates',
      '勝利数': 'Wins',
      '敗北数': 'Losses',
      '引き分け': 'Draws',
      '勝率': 'Win Rate',
      '投稿数': 'Posts',
    },
    zh: {
      'ホーム': '首页', '仕組み': '运作方式', 'カテゴリー': '分类', '機能': '功能',
      'ログアウト': '退出', '始める': '开始', 'ログイン': '登录',
      'お知らせ': '公告', '観戦': '观战', '対戦': '对战', 'アーカイブ': '档案',
      'テーマ投票': '主题投票', 'コミュニティ': '社区', 'マイページ': '我的页面',
      'サポートチャット': '在线客服', '利用規約': '使用条款', 'プライバシー': '隐私政策', '特商法': '法律信息',
      'AI vs AI ディベートショーを観戦しよう': '观看AI对AI辩论秀',
      '最先端のAI同士が繰り広げる白熱したディベートを楽しむ': '享受尖端AI之间的激烈辩论',
      '観戦でクレジット獲得、自分でもAIと対決可能': '观看获得积分，也可以亲自挑战AI',
      '事前登録ボーナス': '预注册奖金', '無料プレゼント': '免费赠送',
      'メインページへ': '前往主页', '事前登録して始める': '预注册开始',
      'リアルタイム接続数': '实时连接数', '累計訪問者数': '累计访问量', '総登録ユーザー数': '注册用户数',
      'サービスリリースまで': '距服务发布', 'リリース日確定次第、お知らせします': '发布日期确定后将通知',
      'クレジットシステム': '积分系统', '獲得方法': '获取方式', '使い道': '使用方式',
      '主な機能': '主要功能', '無料で始める': '免费开始', '対戦モード': '对战模式',
      '対戦機能は現在開発中です': '对战功能正在开发中', 'テーマ投票・提案': '主题投票与提案',
      'コミュニティチャット': '社区聊天', '送信': '发送', '投稿する': '发布',
      '特定商取引法に基づく表記': '商业交易法信息', '戻る': '返回',
      '登録完了！': '注册完成！', '保有クレジット': '持有积分', '付与クレジット': '赠送积分', '登録番号': '注册编号',
      'かんたん': '简单', 'ふつう': '普通', 'むずかしい': '困难',
      'テーマ提案': '提案主题', '投票する': '投票', '投票済み': '已投票', '取り消す': '取消投票', '採用': '采纳',
      'プロフィール設定': '个人资料设置', '保存する': '保存', 'ニックネーム': '昵称',
      '解決済み': '已解决', '対応中': '处理中', 'オープン': '待处理',
      'テクノロジー': '科技', '社会': '社会', '哲学': '哲学', '環境': '环境', '文化': '文化', '経済': '经济', 'その他': '其他',
    },
    ko: {
      'ホーム': '홈', '仕組み': '작동 방식', 'カテゴリー': '카테고리', '機能': '기능',
      'ログアウト': '로그아웃', '始める': '시작', 'ログイン': '로그인',
      'お知らせ': '공지사항', '観戦': '관전', '対戦': '대전', 'アーカイブ': '아카이브',
      'テーマ投票': '테마 투표', 'コミュニティ': '커뮤니티', 'マイページ': '마이페이지',
      'サポートチャット': '고객 지원', '利用規約': '이용약관', 'プライバシー': '개인정보', '特商法': '법적 고지',
      'AI vs AI ディベートショーを観戦しよう': 'AI 대 AI 토론쇼를 관전하세요',
      '最先端のAI同士が繰り広げる白熱したディベートを楽しむ': '최첨단 AI들의 열띤 토론을 즐기세요',
      '観戦でクレジット獲得、自分でもAIと対決可能': '관전으로 크레딧 획득, AI와 직접 대결 가능',
      '事前登録ボーナス': '사전등록 보너스', '無料プレゼント': '무료 선물',
      'メインページへ': '메인 페이지로', '事前登録して始める': '사전등록하고 시작',
      'リアルタイム接続数': '실시간 접속', '累計訪問者数': '누적 방문자', '総登録ユーザー数': '등록 사용자',
      'サービスリリースまで': '서비스 출시까지', 'リリース日確定次第、お知らせします': '출시일 확정 시 안내드리겠습니다',
      'クレジットシステム': '크레딧 시스템', '主な機能': '주요 기능', '無料で始める': '무료로 시작',
      '対戦モード': '대전 모드', '対戦機能は現在開発中です': '대전 기능은 현재 개발 중입니다',
      'テーマ投票・提案': '테마 투표 & 제안', 'コミュニティチャット': '커뮤니티 채팅',
      '送信': '보내기', '投稿する': '게시', '特定商取引法に基づく表記': '상거래법 표기', '戻る': '돌아가기',
      '登録完了！': '등록 완료!', '保有クレジット': '보유 크레딧', '付与クレジット': '지급 크레딧', '登録番号': '등록 번호',
      'かんたん': '쉬움', 'ふつう': '보통', 'むずかしい': '어려움',
      'テーマ提案': '테마 제안', '投票する': '투표', '投票済み': '투표 완료', '取り消す': '취소', '採用': '채택',
      'プロフィール設定': '프로필 설정', '保存する': '저장', 'ニックネーム': '닉네임',
      '解決済み': '해결됨', '対応中': '처리중', 'オープン': '대기중',
      'テクノロジー': '기술', '社会': '사회', '哲学': '철학', '環境': '환경', '文化': '문화', '経済': '경제', 'その他': '기타',
    },
    es: {
      'ホーム': 'Inicio', '仕組み': 'Cómo funciona', 'カテゴリー': 'Categorías', '機能': 'Funciones',
      'ログアウト': 'Cerrar sesión', '始める': 'Empezar', 'ログイン': 'Iniciar sesión',
      'お知らせ': 'Anuncios', '観戦': 'Ver', '対戦': 'Batalla', 'アーカイブ': 'Archivo',
      'テーマ投票': 'Votar tema', 'コミュニティ': 'Comunidad', 'マイページ': 'Mi página',
      'サポートチャット': 'Soporte', '利用規約': 'Términos', 'プライバシー': 'Privacidad', '特商法': 'Legal',
      'AI vs AI ディベートショーを観戦しよう': 'Mira shows de debate IA vs IA',
      '最先端のAI同士が繰り広げる白熱したディベートを楽しむ': 'Disfruta de debates intensos entre IAs de vanguardia',
      '観戦でクレジット獲得、自分でもAIと対決可能': 'Gana créditos viendo, desafía a la IA tú mismo',
      '事前登録ボーナス': 'Bono de pre-registro', '無料プレゼント': 'Regalo gratis',
      'メインページへ': 'Ir al inicio', '事前登録して始める': 'Pre-registrarse',
      'リアルタイム接続数': 'Conexiones en vivo', '累計訪問者数': 'Visitantes totales', '総登録ユーザー数': 'Usuarios registrados',
      'サービスリリースまで': 'Hasta el lanzamiento', 'リリース日確定次第、お知らせします': 'Se notificará cuando se confirme la fecha',
      'クレジットシステム': 'Sistema de créditos', '主な機能': 'Funciones principales', '無料で始める': 'Empezar gratis',
      '対戦モード': 'Modo batalla', '対戦機能は現在開発中です': 'La función de batalla está en desarrollo',
      'テーマ投票・提案': 'Votación y propuesta de temas', 'コミュニティチャット': 'Chat comunitario',
      '送信': 'Enviar', '投稿する': 'Publicar', '特定商取引法に基づく表記': 'Información legal', '戻る': 'Volver',
      '登録完了！': '¡Registro completo!', '保有クレジット': 'Créditos actuales', '付与クレジット': 'Créditos otorgados', '登録番号': 'N° de registro',
      'かんたん': 'Fácil', 'ふつう': 'Normal', 'むずかしい': 'Difícil',
      'テーマ提案': 'Proponer tema', '投票する': 'Votar', '投票済み': 'Votado', '取り消す': 'Cancelar', '採用': 'Adoptar',
      'プロフィール設定': 'Configuración de perfil', '保存する': 'Guardar', 'ニックネーム': 'Apodo',
      '解決済み': 'Resuelto', '対応中': 'En curso', 'オープン': 'Abierto',
      'テクノロジー': 'Tecnología', '社会': 'Sociedad', '哲学': 'Filosofía', '環境': 'Medio ambiente', '文化': 'Cultura', '経済': 'Economía', 'その他': 'Otros',
    },
    fr: {
      'ホーム': 'Accueil', '仕組み': 'Fonctionnement', 'カテゴリー': 'Catégories', '機能': 'Fonctionnalités',
      'ログアウト': 'Déconnexion', '始める': 'Commencer', 'ログイン': 'Connexion',
      'お知らせ': 'Annonces', '観戦': 'Regarder', '対戦': 'Combat', 'アーカイブ': 'Archives',
      'テーマ投票': 'Vote thème', 'コミュニティ': 'Communauté', 'マイページ': 'Mon profil',
      'サポートチャット': 'Support', '利用規約': 'Conditions', 'プライバシー': 'Confidentialité', '特商法': 'Mentions légales',
      'AI vs AI ディベートショーを観戦しよう': 'Regardez des débats IA contre IA',
      '最先端のAI同士が繰り広げる白熱したディベートを楽しむ': 'Profitez de débats intenses entre IAs de pointe',
      '観戦でクレジット獲得、自分でもAIと対決可能': 'Gagnez des crédits en regardant, défiez l\\'IA vous-même',
      '事前登録ボーナス': 'Bonus pré-inscription', '無料プレゼント': 'Cadeau gratuit',
      'メインページへ': 'Aller à l\\'accueil', '事前登録して始める': 'S\\'inscrire',
      'リアルタイム接続数': 'Connexions en direct', '累計訪問者数': 'Visiteurs totaux', '総登録ユーザー数': 'Utilisateurs inscrits',
      'サービスリリースまで': 'Avant le lancement', 'リリース日確定次第、お知らせします': 'Nous vous informerons de la date de sortie',
      'クレジットシステム': 'Système de crédits', '主な機能': 'Fonctionnalités', '無料で始める': 'Commencer gratuitement',
      '対戦モード': 'Mode combat', '対戦機能は現在開発中です': 'La fonction combat est en cours de développement',
      'テーマ投票・提案': 'Vote et proposition de thèmes', 'コミュニティチャット': 'Chat communautaire',
      '送信': 'Envoyer', '投稿する': 'Publier', '特定商取引法に基づく表記': 'Mentions légales', '戻る': 'Retour',
      '登録完了！': 'Inscription terminée !', '保有クレジット': 'Crédits actuels', '付与クレジット': 'Crédits accordés', '登録番号': 'N° d\\'inscription',
      'かんたん': 'Facile', 'ふつう': 'Normal', 'むずかしい': 'Difficile',
      'テーマ提案': 'Proposer un thème', '投票する': 'Voter', '投票済み': 'Voté', '取り消す': 'Annuler', '採用': 'Adopter',
      'プロフィール設定': 'Paramètres du profil', '保存する': 'Sauvegarder', 'ニックネーム': 'Pseudo',
      '解決済み': 'Résolu', '対応中': 'En cours', 'オープン': 'Ouvert',
      'テクノロジー': 'Technologie', '社会': 'Société', '哲学': 'Philosophie', '環境': 'Environnement', '文化': 'Culture', '経済': 'Économie', 'その他': 'Autres',
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
    // Sort keys by length descending for greedy matching
    var keys=Object.keys(d).sort(function(a,b){return b.length-a.length;});
    var walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
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
    // Translate placeholder attributes
    document.querySelectorAll('[placeholder]').forEach(function(el){
      var p=el.getAttribute('placeholder');
      if(p&&d[p])el.setAttribute('placeholder',d[p]);
    });
    // Translate title attributes
    document.querySelectorAll('[title]').forEach(function(el){
      var t=el.getAttribute('title');
      if(t&&d[t])el.setAttribute('title',d[t]);
    });
    document.documentElement.lang=lang==='zh'?'zh-CN':lang==='ko'?'ko-KR':lang;
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

  // Remove old i18n switcher if present (from app.js)
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
