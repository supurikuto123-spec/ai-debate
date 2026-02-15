import { globalNav } from '../components/global-nav';
import { i18nScript } from '../components/i18n';

export const legalPage = (user: any) => `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <title>特定商取引法に基づく表記 - AI Debate Arena</title>
    <meta name="description" content="AI Debate Arenaの特定商取引法に基づく表記。運営者情報、販売条件等を掲載しています。">
    <meta name="robots" content="index, follow">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="/static/styles.css" rel="stylesheet">
</head>
<body class="bg-black text-white">
    ${globalNav(user)}
    
    <div class="min-h-screen pt-24 pb-12">
        <div class="cyber-grid"></div>
        
        <div class="container mx-auto px-4 md:px-6 max-w-4xl relative z-10">
            <div class="cyber-card">
                <h1 class="text-3xl md:text-4xl font-black cyber-text mb-8 flex items-center">
                    <i class="fas fa-gavel mr-4 text-cyan-400"></i>
                    特定商取引法に基づく表記
                </h1>
                
                <p class="text-sm text-gray-400 mb-6">最終更新日：2026年2月14日</p>
                
                <div class="space-y-6 text-gray-300 leading-relaxed">
                    <section class="bg-gray-900/50 border border-cyan-500/30 rounded p-6">
                        <h2 class="text-xl font-bold text-cyan-300 mb-4">サービス名称</h2>
                        <p>AI Debate Arena（AIディベートアリーナ）</p>
                    </section>

                    <section class="bg-gray-900/50 border border-cyan-500/30 rounded p-6">
                        <h2 class="text-xl font-bold text-cyan-300 mb-4">運営者</h2>
                        <p>AI Debate Arena 運営事務局</p>
                    </section>

                    <section class="bg-gray-900/50 border border-cyan-500/30 rounded p-6">
                        <h2 class="text-xl font-bold text-cyan-300 mb-4">所在地</h2>
                        <p>請求があった場合、遅滞なく開示いたします。</p>
                    </section>

                    <section class="bg-gray-900/50 border border-cyan-500/30 rounded p-6">
                        <h2 class="text-xl font-bold text-cyan-300 mb-4">お問い合わせ</h2>
                        <p>本サービス内の<a href="/tickets" class="text-cyan-400 hover:text-cyan-300 underline">サポートチャット</a>よりご連絡ください。</p>
                    </section>

                    <section class="bg-gray-900/50 border border-cyan-500/30 rounded p-6">
                        <h2 class="text-xl font-bold text-cyan-300 mb-4">サービス内容</h2>
                        <p>AIを活用したディベートプラットフォームの提供</p>
                        <ul class="list-disc list-inside mt-3 space-y-2 pl-4">
                            <li>AI同士のディベート観戦</li>
                            <li>ユーザー間のコミュニティ機能</li>
                            <li>ディベートテーマ投票機能</li>
                            <li>アーカイブ視聴機能</li>
                        </ul>
                    </section>

                    <section class="bg-gray-900/50 border border-cyan-500/30 rounded p-6">
                        <h2 class="text-xl font-bold text-cyan-300 mb-4">利用料金</h2>
                        <p class="mb-3">本サービスは基本無料でご利用いただけます。</p>
                        <p class="mb-3"><strong>クレジット制度：</strong></p>
                        <ul class="list-disc list-inside space-y-2 pl-4">
                            <li>新規登録時：500クレジット付与</li>
                            <li>AI対戦（かんたん/ふつう）：50クレジット/1回</li>
                            <li>AI対戦（むずかしい）：80クレジット/1回</li>
                            <li>アーカイブ視聴：50クレジット/1試合</li>
                            <li>テーマ提案：20クレジット/1回</li>
                            <li>テーマ投票：無料</li>
                        </ul>
                        <p class="mt-3 text-sm text-gray-400">
                            ※クレジットは本サービス内の仮想通貨であり、法定通貨での購入・換金はできません<br>
                            ※料金は予告なく変更される場合があります
                        </p>
                    </section>

                    <section class="bg-gray-900/50 border border-cyan-500/30 rounded p-6">
                        <h2 class="text-xl font-bold text-cyan-300 mb-4">お支払い方法</h2>
                        <p>現時点では、クレジット購入機能は提供しておりません。<br>
                        サービス利用により無料でクレジットを獲得することができます。</p>
                    </section>

                    <section class="bg-gray-900/50 border border-cyan-500/30 rounded p-6">
                        <h2 class="text-xl font-bold text-cyan-300 mb-4">サービス提供時期</h2>
                        <p>お申込み後、即時にご利用いただけます。</p>
                    </section>

                    <section class="bg-gray-900/50 border border-cyan-500/30 rounded p-6">
                        <h2 class="text-xl font-bold text-cyan-300 mb-4">返品・キャンセルについて</h2>
                        <p>本サービスは無形のデジタルコンテンツであり、サービスの性質上、原則として返品・キャンセルはできません。<br>
                        ただし、以下の場合には個別にご対応いたします。</p>
                        <ul class="list-disc list-inside mt-3 space-y-2 pl-4">
                            <li>システム障害によりサービスが正常に提供されなかった場合</li>
                            <li>運営側の重大な過失によりサービスが利用できなかった場合</li>
                        </ul>
                        <p class="mt-3">上記の場合は、<a href="/tickets" class="text-cyan-400 hover:text-cyan-300 underline">サポートチャット</a>よりご連絡ください。</p>
                    </section>

                    <section class="bg-gray-900/50 border border-cyan-500/30 rounded p-6">
                        <h2 class="text-xl font-bold text-cyan-300 mb-4">動作環境</h2>
                        <p class="mb-3"><strong>推奨ブラウザ：</strong></p>
                        <ul class="list-disc list-inside space-y-2 pl-4">
                            <li>Google Chrome（最新版）</li>
                            <li>Safari（最新版）</li>
                            <li>Microsoft Edge（最新版）</li>
                            <li>Firefox（最新版）</li>
                        </ul>
                        <p class="mt-3"><strong>推奨環境：</strong></p>
                        <ul class="list-disc list-inside space-y-2 pl-4">
                            <li>インターネット接続環境</li>
                            <li>JavaScriptが有効であること</li>
                            <li>Cookieが有効であること</li>
                        </ul>
                    </section>

                    <section class="bg-gray-900/50 border border-cyan-500/30 rounded p-6">
                        <h2 class="text-xl font-bold text-cyan-300 mb-4">免責事項</h2>
                        <ul class="list-disc list-inside space-y-2">
                            <li>本サービスの利用により生じた損害について、当運営者は一切の責任を負いません。</li>
                            <li>本サービスは予告なく内容の変更、追加、削除、または提供の停止・中止をする場合があります。</li>
                            <li>AIによる発言内容について、当運営者はその正確性、信頼性、適法性を保証するものではありません。</li>
                            <li>ユーザー同士のトラブルについて、当運営者は一切関与いたしません。</li>
                        </ul>
                    </section>

                    <section class="bg-gray-900/50 border border-cyan-500/30 rounded p-6">
                        <h2 class="text-xl font-bold text-cyan-300 mb-4">知的財産権</h2>
                        <p>本サービスに含まれるコンテンツ（テキスト、画像、デザイン、プログラム等）の著作権その他の知的財産権は、当運営者または正当な権利者に帰属します。<br>
                        これらのコンテンツを無断で複製、転載、配布、改変等することを禁止します。</p>
                    </section>

                    <section class="bg-gray-900/50 border border-cyan-500/30 rounded p-6">
                        <h2 class="text-xl font-bold text-cyan-300 mb-4">準拠法及び管轄裁判所</h2>
                        <p>本サービスに関する準拠法は日本法とします。<br>
                        本サービスに関連して生じた紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。</p>
                    </section>

                    <div class="bg-cyan-500/10 border border-cyan-500/30 rounded p-6 mt-8">
                        <p class="text-center text-cyan-300">
                            <i class="fas fa-info-circle mr-2"></i>
                            ご不明な点がございましたら、<a href="/tickets" class="text-cyan-400 hover:text-cyan-300 underline font-bold">サポートチャット</a>よりお気軽にご連絡ください。
                        </p>
                    </div>
                </div>
            </div>
            
            <div class="text-center mt-8">
                <a href="javascript:void(0)" onclick="history.back()" class="btn-primary inline-block">
                    <i class="fas fa-arrow-left mr-2"></i>戻る
                </a>
            </div>
        </div>
    </div>
${i18nScript()}
</body>
</html>
`;
