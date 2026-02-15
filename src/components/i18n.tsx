// Complete i18n system - full page translation via pre-built dictionaries
// Each page element gets translated entirely (not partial text replacement)

// Supported languages
const SUPPORTED_LANGS = ['ja', 'en', 'zh', 'ko', 'es', 'fr'] as const;

// Complete translation dictionaries
const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    // Navigation
    'ホーム': 'Home', '仕組み': 'How It Works', 'カテゴリー': 'Categories', '機能': 'Features',
    'ログアウト': 'Logout', '始める': 'Start', 'ログイン': 'Login',
    'お知らせ': 'Announcements', '観戦': 'Watch', '対戦': 'Battle', 'アーカイブ': 'Archive',
    'テーマ投票': 'Theme Vote', 'コミュニティ': 'Community', 'マイページ': 'My Page',
    'サポートチャット': 'Support', '管理者チャット': 'Admin Chat', 'サポートチャット管理': 'Support Admin',
    '利用規約': 'Terms', 'プライバシー': 'Privacy', 'プライバシーポリシー': 'Privacy Policy',
    '特商法': 'Legal', '特定商取引法': 'Commercial Law', 'コマンド': 'Commands',
    // Homepage
    'AI vs AI ディベートショーを観戦しよう': 'Watch AI vs AI Debate Shows',
    '最先端のAI同士が繰り広げる白熱したディベートを楽しむ': 'Enjoy heated debates between cutting-edge AIs',
    '観戦でクレジット獲得、自分でもAIと対決可能': 'Earn credits by watching, challenge AI yourself',
    '事前登録ボーナス': 'Pre-registration Bonus', '無料プレゼント': 'Free Gift',
    'メインページへ': 'Go to Main Page', '事前登録して始める': 'Pre-register & Start',
    'リアルタイム接続数': 'Live Connections', '累計訪問者数': 'Total Visitors', '総登録ユーザー数': 'Registered Users',
    'サービスリリースまで': 'Until Service Launch',
    'リリース日確定次第、お知らせします': 'We will notify when the release date is set',
    'AI vs AI 試合を観戦': 'Watch AI vs AI Matches',
    '試合を作成する': 'Create a Match', '自分も参戦': 'Join the Battle',
    'クレジットシステム': 'Credit System', '獲得方法': 'How to Earn', '使い道': 'How to Spend',
    '新規登録ボーナス': 'Sign-up Bonus', '毎日ログイン': 'Daily Login',
    '主な機能': 'Key Features', '定期開催の試合': 'Regular Matches',
    'レーティングシステム': 'Rating System', 'AIステータス': 'AI Status',
    'クレジット経済': 'Credit Economy', 'サブスク無制限': 'Unlimited Subscription',
    '無料で始める': 'Start Free',
    // Main
    '現在開催中のディベートマッチ': 'Currently Running Debate Matches',
    'すべて': 'All', 'ライブ中': 'Live', '予定': 'Scheduled', '終了': 'Finished',
    '今すぐ観戦': 'Watch Now', '詳細を見る': 'View Details',
    '現在開催中のディベートはありません': 'No debates currently running',
    'デモを見る': 'Watch Demo', '人 観戦中': ' viewers', '日時未定': 'TBD',
    // Watch
    'ディベート観戦': 'Watch Debate', 'ディベート進行': 'Debate Progress', 'コメント': 'Comments',
    'コメントを入力...': 'Enter a comment...', 'コメント送信': 'Send Comment',
    'AI審査員の評価': 'AI Judge Evaluation',
    'どちらの意見が優勢だと思いますか？': 'Which opinion do you think is winning?',
    'まず、あなたの立場を選択してください': 'First, choose your stance',
    'ディベートテーマ': 'Debate Theme', '投票後に観戦画面が表示されます': 'Viewing screen appears after voting',
    'マッチ一覧': 'Match List', '人が観戦中': 'viewers',
    'ディベート制約': 'Debate Rules', '総時間': 'Total Time', 'AIモデル': 'AI Model', '最大文字数': 'Max Characters',
    '最終結果': 'Final Results', '勝者': 'Winner',
    'ディベート開始待ち': 'Waiting for debate', '待機中': 'Standby', '開始前': 'Not started',
    '残り時間': 'Time Left', '集計中...': 'Counting...', '評価中...': 'Evaluating...',
    '投票は何度でも変更できます': 'You can change your vote anytime',
    // Battle
    '対戦モード': 'Battle Mode', 'AIとディベートで対決しよう': 'Challenge AI in a debate!',
    '対戦機能は現在開発中です': 'Battle feature is under development',
    '開発中 - リリース日未定': 'In Development - Release TBD',
    '実装予定の機能': 'Planned Features', 'AI対戦': 'AI Battle', 'ユーザー対戦': 'User Battle',
    'テーマ選択': 'Theme Selection', '難易度システム': 'Difficulty System',
    '対戦クレジット（予定）': 'Battle Credits (Planned)',
    'かんたん': 'Easy', 'ふつう': 'Normal', 'むずかしい': 'Hard',
    'テーマ投票へ': 'Theme Vote', '観戦へ': 'Watch', 'コミュニティへ': 'Community',
    // Theme Vote
    'テーマ投票・提案': 'Theme Vote & Proposal', 'テーマ提案': 'Propose Theme',
    '投票する': 'Vote', '投票済み': 'Voted', '取り消す': 'Cancel Vote', '採用': 'Adopt',
    '投票順': 'By Votes', '新着順': 'By New', '採用済み': 'Adopted',
    // Community
    'コミュニティチャット': 'Community Chat', '送信': 'Send',
    // MyPage
    'プロフィール設定': 'Profile Settings', 'ニックネーム': 'Nickname', 'ユーザーID': 'User ID',
    '保存する': 'Save', '変更を保存': 'Save Changes', 'アバター選択': 'Select Avatar',
    '統計情報': 'Statistics', '公開プロフィールを見る': 'View Public Profile',
    // Profile
    '登録日': 'Registered', '総ディベート数': 'Total Debates', '勝利数': 'Wins',
    '敗北数': 'Losses', '引き分け': 'Draws', '勝率': 'Win Rate', '投稿数': 'Posts',
    'プライバシー設定': 'Privacy Settings', '非公開': 'Private',
    // Archive
    'ディベートアーカイブ': 'Debate Archive', '購入済み': 'Purchased',
    // Tickets
    'サポート': 'Support', '新しいチケット': 'New Ticket', '件名': 'Subject',
    'メッセージ': 'Message', '送信する': 'Submit',
    '解決済み': 'Resolved', '対応中': 'In Progress', 'オープン': 'Open',
    // Common
    'クレジット不足': 'Insufficient Credits', '読み込み中...': 'Loading...',
    '戻る': 'Back', 'メインに戻る': 'Back to Main', 'メインページ': 'Main Page',
    '登録完了！': 'Registration Complete!', '保有クレジット': 'Current Credits',
    '削除': 'Delete', '票': 'votes', '今日': 'Today', '昨日': 'Yesterday',
    'テクノロジー': 'Technology', '社会': 'Society', '哲学': 'Philosophy',
    '環境': 'Environment', '文化': 'Culture', '経済': 'Economy', 'その他': 'Other',
    '教育': 'Education', '政治': 'Politics',
    '賛成': 'Agree', '反対': 'Disagree', '賛成側勝利': 'Agree wins', '反対側勝利': 'Disagree wins',
    '実行': 'Execute', '実行中...': 'Executing...', 'コマンドを入力': 'Enter command',
    'ライブ配信': 'Live Streaming',
    'プロフィール': 'Profile',
    'Aether': 'Aether', 'Nova': 'Nova',
  },
  zh: {
    'ホーム': '首页', '仕組み': '运作方式', 'カテゴリー': '分类', '機能': '功能',
    'ログアウト': '退出', '始める': '开始', 'お知らせ': '公告', '観戦': '观战',
    '対戦': '对战', 'アーカイブ': '档案', 'テーマ投票': '主题投票', 'コミュニティ': '社区',
    'マイページ': '我的页面', 'サポートチャット': '在线客服', 'コマンド': '命令',
    '利用規約': '使用条款', 'プライバシーポリシー': '隐私政策', '特定商取引法': '商业交易法',
    'AI vs AI ディベートショーを観戦しよう': '观看AI对AI辩论秀',
    '現在開催中のディベートマッチ': '正在进行的辩论赛', 'すべて': '全部',
    'ライブ中': '直播中', '予定': '预定', '終了': '已结束',
    '今すぐ観戦': '立即观看', '詳細を見る': '查看详情',
    '対戦モード': '对战模式', 'テーマ投票・提案': '主题投票与提案',
    'コミュニティチャット': '社区聊天', '送信': '发送',
    'プロフィール設定': '个人资料设置', '保存する': '保存',
    '戻る': '返回', 'メインページ': '主页', 'サポート': '客服',
    '読み込み中...': '加载中...', '削除': '删除', '票': '票',
    'テクノロジー': '科技', '社会': '社会', '哲学': '哲学', '環境': '环境',
    '文化': '文化', '経済': '经济', 'その他': '其他', '教育': '教育', '政治': '政治',
    '賛成': '赞成', '反対': '反对', '実行': '执行',
    'ディベート進行': '辩论进行中', 'コメント': '评论', 'AI審査員の評価': 'AI评委评分',
    '非公開': '未公开', '解決済み': '已解决', '対応中': '处理中', 'オープン': '待处理',
    'Aether': 'Aether', 'Nova': 'Nova',
  },
  ko: {
    'ホーム': '홈', '仕組み': '작동 방식', 'カテゴリー': '카테고리', '機能': '기능',
    'ログアウト': '로그아웃', '始める': '시작', 'お知らせ': '공지', '観戦': '관전',
    '対戦': '대전', 'アーカイブ': '아카이브', 'テーマ投票': '테마 투표', 'コミュニティ': '커뮤니티',
    'マイページ': '마이페이지', 'サポートチャット': '고객 지원', 'コマンド': '명령',
    '利用規約': '이용약관', 'プライバシーポリシー': '개인정보 보호정책', '特定商取引法': '상거래법',
    'AI vs AI ディベートショーを観戦しよう': 'AI 대 AI 토론쇼를 관전하세요',
    '現在開催中のディベートマッチ': '현재 진행 중인 토론 매치', 'すべて': '전체',
    'ライブ中': '라이브', '予定': '예정', '終了': '종료',
    '今すぐ観戦': '지금 관전', '詳細を見る': '상세 보기',
    '対戦モード': '대전 모드', 'コミュニティチャット': '커뮤니티 채팅', '送信': '보내기',
    'プロフィール設定': '프로필 설정', '保存する': '저장',
    '戻る': '돌아가기', 'メインページ': '메인 페이지', 'サポート': '지원',
    '読み込み中...': '로딩 중...', '削除': '삭제', '票': '표',
    '賛成': '찬성', '反対': '반대', '実行': '실행',
    '非公開': '비공개', '解決済み': '해결됨', '対応中': '처리중', 'オープン': '대기중',
    'Aether': 'Aether', 'Nova': 'Nova',
  },
  es: {
    'ホーム': 'Inicio', '仕組み': 'Cómo funciona', 'カテゴリー': 'Categorías', '機能': 'Funciones',
    'ログアウト': 'Cerrar sesión', '始める': 'Empezar', 'お知らせ': 'Anuncios', '観戦': 'Ver',
    '対戦': 'Batalla', 'アーカイブ': 'Archivo', 'テーマ投票': 'Votar tema', 'コミュニティ': 'Comunidad',
    'マイページ': 'Mi página', 'サポートチャット': 'Soporte', 'コマンド': 'Comandos',
    '利用規約': 'Términos', 'プライバシーポリシー': 'Privacidad', '特定商取引法': 'Legal',
    'すべて': 'Todo', 'ライブ中': 'En vivo', '予定': 'Programado', '終了': 'Finalizado',
    '今すぐ観戦': 'Ver ahora', '詳細を見る': 'Ver detalles',
    '戻る': 'Volver', 'メインページ': 'Inicio', 'サポート': 'Soporte',
    '読み込み中...': 'Cargando...', '削除': 'Eliminar', '票': 'votos',
    '賛成': 'A favor', '反対': 'En contra', '実行': 'Ejecutar',
    '非公開': 'Privado', '解決済み': 'Resuelto', '対応中': 'En curso', 'オープン': 'Abierto',
    'Aether': 'Aether', 'Nova': 'Nova',
  },
  fr: {
    'ホーム': 'Accueil', '仕組み': 'Fonctionnement', 'カテゴリー': 'Catégories', '機能': 'Fonctionnalités',
    'ログアウト': 'Déconnexion', '始める': 'Commencer', 'お知らせ': 'Annonces', '観戦': 'Regarder',
    '対戦': 'Combat', 'アーカイブ': 'Archives', 'テーマ投票': 'Vote thème', 'コミュニティ': 'Communauté',
    'マイページ': 'Mon profil', 'サポートチャット': 'Support', 'コマンド': 'Commandes',
    '利用規約': 'Conditions', 'プライバシーポリシー': 'Confidentialité', '特定商取引法': 'Mentions légales',
    'すべて': 'Tout', 'ライブ中': 'En direct', '予定': 'Prévu', '終了': 'Terminé',
    '今すぐ観戦': 'Regarder', '詳細を見る': 'Voir détails',
    '戻る': 'Retour', 'メインページ': 'Accueil', 'サポート': 'Support',
    '読み込み中...': 'Chargement...', '削除': 'Supprimer', '票': 'votes',
    '賛成': 'Pour', '反対': 'Contre', '実行': 'Exécuter',
    '非公開': 'Privé', '解決済み': 'Résolu', '対応中': 'En cours', 'オープン': 'Ouvert',
    'Aether': 'Aether', 'Nova': 'Nova',
  }
};

export const i18nScript = () => `
<script>
(function(){
  var T = ${JSON.stringify(TRANSLATIONS)};

  function detectLang(){
    var s = localStorage.getItem('ai-debate-lang');
    if(s && T[s]) return s;
    var b = (navigator.language || 'ja').toLowerCase();
    if(b.startsWith('en')) return 'en';
    if(b.startsWith('zh')) return 'zh';
    if(b.startsWith('ko')) return 'ko';
    if(b.startsWith('es')) return 'es';
    if(b.startsWith('fr')) return 'fr';
    return 'ja';
  }

  function translatePage(lang) {
    if(lang === 'ja' || !T[lang]) return;
    var dict = T[lang];
    // Sort keys by length descending to replace longer strings first
    var keys = Object.keys(dict).sort(function(a,b){ return b.length - a.length; });

    // Translate all text nodes in the DOM
    function walkAndTranslate(root) {
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
      var textNodes = [];
      while(walker.nextNode()) textNodes.push(walker.currentNode);
      
      for(var i = 0; i < textNodes.length; i++) {
        var node = textNodes[i];
        var original = node.textContent;
        if(!original || !original.trim()) continue;
        
        var text = original;
        var changed = false;
        for(var k = 0; k < keys.length; k++) {
          if(text.indexOf(keys[k]) !== -1) {
            text = text.split(keys[k]).join(dict[keys[k]]);
            changed = true;
          }
        }
        if(changed) node.textContent = text;
      }
    }

    walkAndTranslate(document.body);

    // Translate placeholder/title attributes
    document.querySelectorAll('[placeholder]').forEach(function(el){
      var p = el.getAttribute('placeholder');
      for(var k = 0; k < keys.length; k++) {
        if(p && p.indexOf(keys[k]) !== -1) p = p.split(keys[k]).join(dict[keys[k]]);
      }
      if(p !== el.getAttribute('placeholder')) el.setAttribute('placeholder', p);
    });
    document.querySelectorAll('[title]').forEach(function(el){
      var t = el.getAttribute('title');
      if(t && dict[t]) el.setAttribute('title', dict[t]);
    });

    // Update lang attribute
    var langMap = { zh: 'zh-CN', ko: 'ko-KR' };
    document.documentElement.lang = langMap[lang] || lang;

    // Observe DOM changes for dynamically loaded content
    var obs = new MutationObserver(function(muts){
      muts.forEach(function(m){
        m.addedNodes.forEach(function(n){ if(n.nodeType === 1) walkAndTranslate(n); });
      });
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  function createSwitcher(lang){
    var sw = document.createElement('div');
    sw.id = 'lang-switcher';
    sw.style.cssText = 'position:fixed;bottom:20px;left:20px;z-index:9999;display:flex;gap:4px;background:rgba(0,0,0,0.9);border:1px solid rgba(0,255,255,0.3);border-radius:10px;padding:6px 8px;backdrop-filter:blur(10px);';
    var langs = [{c:'ja',l:'JP'},{c:'en',l:'EN'},{c:'zh',l:'中'},{c:'ko',l:'한'},{c:'es',l:'ES'},{c:'fr',l:'FR'}];
    langs.forEach(function(x){
      var b = document.createElement('button');
      b.textContent = x.l;
      b.style.cssText = 'padding:4px 8px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;border:1px solid transparent;background:transparent;color:#9ca3af;transition:all 0.2s;min-width:32px;';
      if(x.c === lang){ b.style.background = 'rgba(0,255,255,0.25)'; b.style.borderColor = '#06b6d4'; b.style.color = '#00ffff'; }
      b.addEventListener('click', function(){ localStorage.setItem('ai-debate-lang', x.c); location.reload(); });
      sw.appendChild(b);
    });
    document.body.appendChild(sw);
  }

  document.addEventListener('DOMContentLoaded', function(){
    var old = document.getElementById('lang-switcher');
    if(old) old.remove();
    var lang = detectLang();
    createSwitcher(lang);
    translatePage(lang);
  });
})();
</script>
`;
