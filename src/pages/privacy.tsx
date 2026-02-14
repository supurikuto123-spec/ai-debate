import { globalNav } from '../components/global-nav';

export const privacyPage = (user: any) => `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <title>プライバシーポリシー - AI Debate Arena</title>
    <meta name="description" content="AI Debate Arenaのプライバシーポリシー。個人情報の取扱い、Cookie利用、第三者提供等について説明しています。">
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
                    <i class="fas fa-shield-alt mr-4 text-cyan-400"></i>
                    プライバシーポリシー
                </h1>
                
                <p class="text-sm text-gray-400 mb-6">最終更新日：2026年2月14日</p>
                
                <div class="space-y-8 text-gray-300 leading-relaxed">
                    <section>
                        <p>AI Debate Arena（以下「当サービス」といいます）の運営者（以下「当社」といいます）は、当サービスをご利用になるお客様（以下「ユーザー」といいます）のプライバシーを尊重し、ユーザーの個人情報（個人情報の保護に関する法律第2条第1項により定義された「個人情報」をいいます。以下同じ）の管理に細心の注意を払い、これを取扱うものとします。</p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-cyan-300 mb-4">第1条（個人情報の取得）</h2>
                        <ol class="list-decimal list-inside space-y-2 pl-4">
                            <li>当社は、ユーザーから以下の個人情報を取得することがあります。
                                <ol class="list-[lower-alpha] list-inside space-y-1 pl-8 mt-2">
                                    <li>氏名、ユーザーID、メールアドレス、生年月日、性別、職業等の個人を識別できる情報</li>
                                    <li>Google等の外部サービスと連携してユーザーが当サービスを利用する場合、当該外部サービスからユーザーが同意の上で提供される情報（氏名、メールアドレス、プロフィール画像等）</li>
                                    <li>当サービスの利用履歴、クレジット消費履歴、投票履歴、コメント投稿履歴等の行動履歴</li>
                                    <li>IPアドレス、Cookie情報、端末情報、OSの種類、ブラウザの種類、アクセス日時等のアクセスログ情報</li>
                                    <li>その他、当社が定める入力フォームにユーザーが入力する情報</li>
                                </ol>
                            </li>
                            <li>当社は、適法かつ公正な手段によって個人情報を取得します。</li>
                        </ol>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-cyan-300 mb-4">第2条（個人情報の利用目的）</h2>
                        <p>当社は、取得した個人情報を以下の目的で利用します。</p>
                        <ol class="list-decimal list-inside space-y-2 pl-4 mt-4">
                            <li>当サービスの提供、運営、維持、保護及び改善のため</li>
                            <li>ユーザーの認証、本人確認のため</li>
                            <li>ユーザーへの連絡、問い合わせへの対応のため</li>
                            <li>サービス利用料金の請求のため</li>
                            <li>当サービスに関する規約、ポリシー等（以下「規約等」といいます）に違反する行為に対する対応のため</li>
                            <li>当サービスに関する規約等の変更などを通知するため</li>
                            <li>メンテナンス、重要なお知らせなど必要に応じた連絡のため</li>
                            <li>統計データの作成等、個人を識別できない形式に加工した上で利用するため</li>
                            <li>当サービスの新機能、更新情報、キャンペーン等の案内のため</li>
                            <li>マーケティング調査、分析及びそれに基づくサービス改善のため</li>
                            <li>不正利用の防止、セキュリティの維持のため</li>
                            <li>前各号に関連して必要となる業務のため</li>
                            <li>その他、上記利用目的に付随する目的のため</li>
                        </ol>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-cyan-300 mb-4">第3条（個人情報の第三者提供）</h2>
                        <ol class="list-decimal list-inside space-y-2 pl-4">
                            <li>当社は、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。
                                <ol class="list-[lower-alpha] list-inside space-y-1 pl-8 mt-2">
                                    <li>法令に基づく場合</li>
                                    <li>人の生命、身体又は財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき</li>
                                    <li>公衆衛生の向上又は児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき</li>
                                    <li>国の機関もしくは地方公共団体又はその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき</li>
                                    <li>予め次の事項を告知あるいは公表をしている場合
                                        <ol class="list-[lower-roman] list-inside space-y-1 pl-8 mt-2">
                                            <li>利用目的に第三者への提供を含むこと</li>
                                            <li>第三者に提供されるデータの項目</li>
                                            <li>第三者への提供の手段又は方法</li>
                                            <li>本人の求めに応じて個人情報の第三者への提供を停止すること</li>
                                        </ol>
                                    </li>
                                </ol>
                            </li>
                            <li>前項の定めにかかわらず、次に掲げる場合は第三者には該当しないものとします。
                                <ol class="list-[lower-alpha] list-inside space-y-1 pl-8 mt-2">
                                    <li>当社が利用目的の達成に必要な範囲内において個人情報の取扱いの全部又は一部を委託する場合</li>
                                    <li>合併その他の事由による事業の承継に伴って個人情報が提供される場合</li>
                                    <li>個人情報を特定の者との間で共同して利用する場合であって、その旨並びに共同して利用される個人情報の項目、共同して利用する者の範囲、利用する者の利用目的及び当該個人情報の管理について責任を有する者の氏名又は名称について、あらかじめ本人に通知し、又は本人が容易に知り得る状態に置いているとき</li>
                                </ol>
                            </li>
                        </ol>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-cyan-300 mb-4">第4条（個人情報の開示・訂正・削除）</h2>
                        <ol class="list-decimal list-inside space-y-2 pl-4">
                            <li>当社は、ユーザーから、個人情報保護法の定めに基づき個人情報の開示を求められたときは、ユーザーご本人からのご請求であることを確認の上で、ユーザーに対し、遅滞なく開示を行います（当該個人情報が存在しないときにはその旨を通知いたします）。ただし、個人情報保護法その他の法令により、当社が開示の義務を負わない場合は、この限りではありません。</li>
                            <li>当社は、ユーザーから、個人情報が真実でないという理由によって、個人情報保護法の定めに基づきその内容の訂正、追加又は削除（以下「訂正等」といいます）を求められた場合には、ユーザーご本人からのご請求であることを確認の上で、利用目的の達成に必要な範囲内において、遅滞なく必要な調査を行い、その結果に基づき、個人情報の内容の訂正等を行い、その旨をユーザーに通知します（訂正等を行わない旨の決定をしたときは、ユーザーに対しその旨を通知いたします）。ただし、個人情報保護法その他の法令により、当社が訂正等の義務を負わない場合は、この限りではありません。</li>
                            <li>ユーザーは、当社に対して、個人情報の利用の停止又は消去（以下「利用停止等」といいます）を請求することができます。当社は、ユーザーから、ユーザーの個人情報が、あらかじめ公表された利用目的の範囲を超えて取り扱われているという理由又は偽りその他不正の手段により取得されたものであるという理由により、その利用の停止又は消去を求められた場合において、そのご請求に理由があることが判明した場合には、ユーザーご本人からのご請求であることを確認の上で、遅滞なく個人情報の利用停止等を行い、その旨をユーザーに通知します。ただし、個人情報保護法その他の法令により、当社が利用停止等の義務を負わない場合は、この限りではありません。</li>
                        </ol>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-cyan-300 mb-4">第5条（Cookieその他の技術の利用）</h2>
                        <ol class="list-decimal list-inside space-y-2 pl-4">
                            <li>当サービスは、Cookie及びこれに類する技術を利用することがあります。これらの技術は、当社による当サービスの利用状況等の把握に役立ち、サービス向上に資するものです。Cookieを無効化されたいユーザーは、ウェブブラウザの設定を変更することによりCookieを無効化することができます。ただし、Cookieを無効化すると、当サービスの一部の機能をご利用いただけなくなる場合があります。</li>
                            <li>当社は、Google Analytics等のアクセス解析ツールを使用しています。これらのツールはCookieを使用して情報を収集しますが、個人を特定する情報は収集しません。この機能はCookieを無効にすることで収集を拒否することができます。詳しくは各サービスプロバイダーのプライバシーポリシーをご確認ください。</li>
                        </ol>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-cyan-300 mb-4">第6条（統計データの利用）</h2>
                        <p>当社は、提供を受けた個人情報をもとに、個人を特定できないよう加工した統計データを作成することがあります。個人を特定できない統計データについては、当社は何ら制限なく利用することができるものとします。</p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-cyan-300 mb-4">第7条（個人情報の安全管理）</h2>
                        <ol class="list-decimal list-inside space-y-2 pl-4">
                            <li>当社は、個人情報の漏えい、滅失又は毀損の防止その他の個人情報の安全管理のために必要かつ適切な措置を講じます。</li>
                            <li>当社は、個人情報を取り扱う従業員や委託先に対して、必要かつ適切な監督を行います。</li>
                            <li>当社は、個人情報への不正アクセス、個人情報の漏えい、滅失、毀損等のリスクに対して、合理的な安全対策を実施します。ただし、完全な安全性を保証するものではありません。</li>
                        </ol>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-cyan-300 mb-4">第8条（外部サービスとの連携）</h2>
                        <ol class="list-decimal list-inside space-y-2 pl-4">
                            <li>当サービスは、Googleログイン等の外部サービスとの連携機能を提供しています。ユーザーがこれらの外部サービスとの連携を利用する場合、当該外部サービスのプライバシーポリシー及び利用規約が適用されます。</li>
                            <li>当社は、外部サービスのプライバシー保護の方針及びセキュリティについて責任を負いません。外部サービスをご利用の際は、当該外部サービスのプライバシーポリシー等をご確認ください。</li>
                        </ol>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-cyan-300 mb-4">第9条（未成年者の個人情報）</h2>
                        <p>当社は、未成年者が親権者等の法定代理人の同意を得ずに個人情報を提供している場合、親権者等の法定代理人は当社に対し、当該個人情報の利用停止又は消去を請求することができます。</p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-cyan-300 mb-4">第10条（お問い合わせ窓口）</h2>
                        <p>本ポリシーに関するお問い合わせは、当サービス内のお問い合わせフォームまたは運営者が別途指定する方法にてご連絡ください。</p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-cyan-300 mb-4">第11条（プライバシーポリシーの変更手続）</h2>
                        <ol class="list-decimal list-inside space-y-2 pl-4">
                            <li>当社は、法令改正への対応の必要性及び事業上の必要性に応じて、本ポリシーを変更する場合があります。本ポリシーを変更する場合、変更後の本ポリシーの施行時期及び内容を当サービス上での表示その他の適切な方法により周知し、またはユーザーに通知します。</li>
                            <li>変更後の本ポリシーは、別段の定めがない限り、当サービス上に表示した時点より効力を生じるものとします。</li>
                        </ol>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-cyan-300 mb-4">第12条（準拠法及び管轄裁判所）</h2>
                        <ol class="list-decimal list-inside space-y-2 pl-4">
                            <li>本ポリシーの準拠法は日本法とします。</li>
                            <li>本ポリシーに起因し、または関連する一切の紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。</li>
                        </ol>
                    </section>

                    <section class="bg-cyan-500/10 border border-cyan-500/30 rounded p-6 mt-8">
                        <h3 class="text-xl font-bold text-cyan-300 mb-3">
                            <i class="fas fa-info-circle mr-2"></i>個人情報の取扱いに関する追加情報
                        </h3>
                        <div class="space-y-2 text-sm">
                            <p><strong>運営者名称：</strong>AI Debate Arena 運営事務局</p>
                            <p><strong>個人情報保護管理者：</strong>運営責任者</p>
                            <p><strong>取得する個人情報の項目：</strong>氏名、メールアドレス、ユーザーID、利用履歴、アクセスログ等</p>
                            <p><strong>個人情報の取得方法：</strong>ウェブフォームへの入力、外部サービス連携、Cookie等</p>
                        </div>
                    </section>
                </div>
            </div>
            
            <div class="text-center mt-8">
                <a href="/community" class="btn-primary inline-block">
                    <i class="fas fa-arrow-left mr-2"></i>戻る
                </a>
            </div>
        </div>
    </div>
</body>
</html>
`;
