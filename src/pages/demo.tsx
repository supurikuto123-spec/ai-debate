export const demoPage = (user: any) => `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=1280, initial-scale=0.5, maximum-scale=1.0, user-scalable=yes">
        <title>事前登録完了 - AI Debate | マイページ</title>
        <meta name="description" content="AI Debateへの登録が完了しました。500クレジットを獲得！AI同士のディベート対決を楽しもう。">
        <meta name="robots" content="noindex, nofollow">
        <link rel="canonical" href="https://ai-debate.jp/demo">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/styles.css" rel="stylesheet">
    </head>
    <body class="bg-black text-white overflow-x-hidden">
        <!-- Navigation -->
        <nav class="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b-2 border-cyan-500">
            <div class="container mx-auto px-6 py-4 flex justify-between items-center">
                <div class="flex items-center space-x-3">
                    <div class="cyber-logo w-10 h-10 flex items-center justify-center">
                        <svg class="w-8 h-8 text-cyan-400">
                            <use href="#icon-brain"/>
                        </svg>
                    </div>
                    <span class="text-2xl font-bold cyber-text">AI Debate</span>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="credit-display">
                        <svg class="w-5 h-5 text-yellow-400"><use href="#icon-credit"/></svg>
                        <span class="text-sm font-bold">${user.credits}</span>
                    </div>
                    <div class="text-sm text-gray-400">@${user.user_id}</div>
                    <a href="/logout" class="btn-secondary text-sm px-4 py-2">ログアウト</a>
                </div>
            </div>
        </nav>

        <!-- SVG Icons Definition -->
        <svg style="display: none;">
            <defs>
                <symbol id="icon-credit" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
                    <text x="12" y="15" text-anchor="middle" font-size="10" font-weight="bold" fill="#000">C</text>
                </symbol>
                <symbol id="icon-brain" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm0 2c2.76 0 5 2.24 5 5 0 1.64-.8 3.09-2.03 4H9.03C7.8 12.09 7 10.64 7 9c0-2.76 2.24-5 5-5z"/>
                </symbol>
            </defs>
        </svg>

        <!-- Main Content -->
        <section class="min-h-screen flex items-center justify-center relative pt-20">
            <div class="cyber-grid"></div>
            <div class="container mx-auto px-6 text-center relative z-10 py-20">
                <!-- Success Animation -->
                <div class="success-checkmark" style="margin-bottom: 8rem;">
                    <div class="check-icon">
                        <span class="icon-line line-tip"></span>
                        <span class="icon-line line-long"></span>
                        <div class="icon-circle"></div>
                        <div class="icon-fix"></div>
                    </div>
                </div>

                <div class="glitch-wrapper mb-6" style="margin-top: 2rem;">
                    <h1 class="text-5xl md:text-7xl font-black glitch" data-text="登録完了！">
                        登録完了！
                    </h1>
                </div>

                <p class="text-2xl md:text-3xl mb-4 text-cyan-300 neon-text">
                    事前登録ありがとうございます
                </p>

                <p class="text-lg mb-8 text-gray-300 max-w-2xl mx-auto">
                    <strong class="text-cyan-400">${user.username}</strong> さん（@${user.user_id}）<br>
                    特別ボーナスとして <strong class="text-yellow-400">${user.credits}クレジット</strong> を付与しました
                </p>

                <!-- Stats Cards -->
                <div class="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <svg class="w-10 h-10 text-yellow-400"><use href="#icon-credit"/></svg>
                        </div>
                        <div class="stat-value">${user.credits}</div>
                        <div class="stat-label">クレジット</div>
                        <div class="stat-badge bonus">事前登録特典</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">
                            <div class="text-4xl">◈</div>
                        </div>
                        <div class="stat-value">+200</div>
                        <div class="stat-label">お得！</div>
                        <div class="stat-badge">通常は300</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">
                            <div class="text-4xl">⊚</div>
                        </div>
                        <div class="stat-value">#${user.registration_number || 1}</div>
                        <div class="stat-label text-center">登録番号</div>
                    </div>
                </div>

                <!-- Progress Section -->
                <div class="max-w-3xl mx-auto mb-12">
                    <div class="progress-box">
                        <h3 class="text-2xl font-bold mb-6 cyber-text">開発進捗状況</h3>
                        
                        <div class="progress-item completed">
                            <div class="progress-status">✓</div>
                            <div class="progress-content">
                                <h4 class="text-lg font-bold">フェーズ 1：基盤システム</h4>
                                <p class="text-sm text-gray-400">事前登録・認証・データベース構築完了</p>
                            </div>
                            <div class="progress-badge">完了</div>
                        </div>

                        <div class="progress-item in-progress">
                            <div class="progress-status pulse">▶</div>
                            <div class="progress-content">
                                <h4 class="text-lg font-bold">フェーズ 2：コア機能開発</h4>
                                <p class="text-sm text-gray-400">AIディベートエンジン、観戦システム実装中</p>
                            </div>
                            <div class="progress-badge current">開発中</div>
                        </div>

                        <div class="progress-item upcoming">
                            <div class="progress-status">○</div>
                            <div class="progress-content">
                                <h4 class="text-lg font-bold">フェーズ 3：正式リリース</h4>
                                <p class="text-sm text-gray-400">チャット・ランキング・コミュニティ機能追加</p>
                            </div>
                            <div class="progress-badge">予定</div>
                        </div>
                    </div>
                </div>

                <!-- Countdown Section -->
                <div class="max-w-3xl mx-auto mb-12">
                    <div class="countdown-box">
                        <h3 class="text-2xl font-bold mb-4 cyber-text">リリースまで</h3>
                        <div class="countdown-display">
                            <div class="digital-meter">
                                <div class="meter-segment">!</div>
                                <div class="meter-segment">E</div>
                                <div class="meter-separator">:</div>
                                <div class="meter-segment">R</div>
                                <div class="meter-segment">R</div>
                                <div class="meter-separator">:</div>
                                <div class="meter-segment">O</div>
                                <div class="meter-segment">R</div>
                            </div>
                            <p class="text-sm text-gray-400 mt-4">
                                リリース日が確定次第、メールでお知らせします<br>
                                <span class="text-cyan-400">${user.email}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Next Steps -->
                <div class="max-w-2xl mx-auto">
                    <h3 class="text-2xl font-bold mb-6">今後の予定</h3>
                    <div class="text-left space-y-4 mb-8">
                        <div class="info-item">
                            <div class="info-icon">
                                <svg class="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <div>
                                <h4 class="font-bold">メール通知</h4>
                                <p class="text-sm text-gray-400">重要なアップデートをメールでお知らせ</p>
                            </div>
                        </div>
                        <div class="info-item">
                            <div class="info-icon">
                                <svg class="w-6 h-6 text-magenta-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                            </div>
                            <div>
                                <h4 class="font-bold">早期アクセス</h4>
                                <p class="text-sm text-gray-400">正式リリース前に新機能を体験可能</p>
                            </div>
                        </div>
                        <div class="info-item">
                            <div class="info-icon">
                                <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                                </svg>
                            </div>
                            <div>
                                <h4 class="font-bold">特別特典</h4>
                                <p class="text-sm text-gray-400">事前登録者限定のバッジとクレジット</p>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4 justify-center">
                        <a href="/" class="btn-glow text-xl px-12 py-4">
                            ホームに戻る
                        </a>
                        <a href="/logout" class="btn-outline text-xl px-12 py-4">
                            ログアウト
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="py-12 border-t-2 border-cyan-500/30">
            <div class="container mx-auto px-6 text-center">
                <p class="text-gray-400 mb-4">
                    ご質問やフィードバックは<br>
                    <a href="mailto:support@aidebate.example.com" class="text-cyan-400 hover:text-cyan-300">support@aidebate.example.com</a>
                </p>
                <p class="text-gray-500">&copy; 2026 AI Debate. All rights reserved.</p>
            </div>
        </footer>

        <style>
            /* Success Checkmark Animation */
            .success-checkmark {
                width: 120px;
                height: 120px;
                margin: 0 auto;
            }

            .check-icon {
                width: 120px;
                height: 120px;
                position: relative;
                border-radius: 50%;
                box-sizing: content-box;
                border: 4px solid #00ff00;
                animation: checkmarkPulse 1s ease-out, checkmarkGlow 2s ease-in-out infinite;
            }

            .icon-line {
                height: 5px;
                background-color: #00ff00;
                display: block;
                border-radius: 2px;
                position: absolute;
                z-index: 10;
            }

            .icon-line.line-tip {
                top: 56px;
                left: 22px;
                width: 30px;
                transform: rotate(45deg);
                animation: checkmarkTip 0.75s;
            }

            .icon-line.line-long {
                top: 48px;
                right: 16px;
                width: 60px;
                transform: rotate(-45deg);
                animation: checkmarkLong 0.75s;
            }

            .icon-circle {
                top: -4px;
                left: -4px;
                z-index: 10;
                width: 120px;
                height: 120px;
                border-radius: 50%;
                position: absolute;
                box-sizing: content-box;
                border: 4px solid rgba(0, 255, 0, 0.2);
            }

            .icon-fix {
                top: 12px;
                width: 10px;
                left: 32px;
                z-index: 1;
                height: 100px;
                position: absolute;
                transform: rotate(-45deg);
                background-color: #000;
            }

            @keyframes checkmarkTip {
                0% {
                    width: 0;
                    left: 6px;
                    top: 28px;
                }
                54% {
                    width: 0;
                    left: 6px;
                    top: 28px;
                }
                70% {
                    width: 50px;
                    left: -8px;
                    top: 56px;
                }
                84% {
                    width: 25px;
                    left: 16px;
                    top: 60px;
                }
                100% {
                    width: 30px;
                    left: 22px;
                    top: 56px;
                }
            }

            @keyframes checkmarkLong {
                0% {
                    width: 0;
                    right: 60px;
                    top: 54px;
                }
                65% {
                    width: 0;
                    right: 60px;
                    top: 54px;
                }
                84% {
                    width: 70px;
                    right: 0;
                    top: 42px;
                }
                100% {
                    width: 60px;
                    right: 16px;
                    top: 48px;
                }
            }

            @keyframes checkmarkPulse {
                0% {
                    transform: scale(0);
                    opacity: 0;
                }
                50% {
                    transform: scale(1.1);
                    opacity: 1;
                }
                100% {
                    transform: scale(1);
                    opacity: 1;
                }
            }

            @keyframes checkmarkGlow {
                0%, 100% {
                    box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
                }
                50% {
                    box-shadow: 0 0 40px rgba(0, 255, 0, 0.8);
                }
            }

            /* Stat Cards */
            .stat-card {
                background: linear-gradient(135deg, rgba(0, 255, 255, 0.05), rgba(255, 0, 255, 0.05));
                border: 2px solid rgba(0, 255, 255, 0.3);
                border-radius: 16px;
                padding: 2rem;
                text-align: center;
            }

            .stat-icon {
                margin: 0 auto 1rem;
            }

            .stat-value {
                font-size: 3rem;
                font-weight: 900;
                font-family: 'Orbitron', sans-serif;
                background: linear-gradient(45deg, #00ffff, #ff00ff);
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .stat-label {
                font-size: 1rem;
                color: #888;
                margin-bottom: 0.5rem;
            }

            .stat-badge {
                display: inline-block;
                padding: 0.25rem 0.75rem;
                border-radius: 12px;
                font-size: 0.75rem;
                font-weight: 700;
                background: rgba(100, 100, 100, 0.3);
                color: #ccc;
            }

            .stat-badge.bonus {
                background: linear-gradient(135deg, #ffd700, #ff8800);
                color: #000;
            }

            /* Progress Box */
            .progress-box {
                background: linear-gradient(135deg, rgba(0, 255, 255, 0.05), rgba(255, 0, 255, 0.05));
                border: 2px solid rgba(0, 255, 255, 0.3);
                border-radius: 20px;
                padding: 2rem;
            }

            .progress-item {
                display: flex;
                align-items: center;
                gap: 1.5rem;
                padding: 1.5rem;
                margin-bottom: 1rem;
                border-radius: 12px;
                background: rgba(0, 0, 0, 0.3);
                border: 2px solid transparent;
                transition: all 0.3s ease;
            }

            .progress-item.completed {
                border-color: rgba(0, 255, 0, 0.5);
            }

            .progress-item.in-progress {
                border-color: rgba(0, 255, 255, 0.5);
                animation: progressPulse 2s ease-in-out infinite;
            }

            .progress-item.upcoming {
                opacity: 0.6;
            }

            .progress-status {
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                font-weight: 900;
            }

            .progress-status.pulse {
                animation: pulse 2s ease-in-out infinite;
            }

            .progress-content {
                flex: 1;
                text-align: left;
            }

            .progress-badge {
                padding: 0.5rem 1rem;
                border-radius: 12px;
                font-size: 0.85rem;
                font-weight: 700;
                background: rgba(100, 100, 100, 0.3);
            }

            .progress-badge.current {
                background: linear-gradient(135deg, #00ffff, #0080ff);
                color: #000;
            }

            @keyframes progressPulse {
                0%, 100% {
                    box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
                }
                50% {
                    box-shadow: 0 0 40px rgba(0, 255, 255, 0.6);
                }
            }

            @keyframes pulse {
                0%, 100% {
                    opacity: 1;
                }
                50% {
                    opacity: 0.5;
                }
            }

            /* Countdown Box */
            .countdown-box {
                background: linear-gradient(135deg, rgba(0, 255, 255, 0.05), rgba(255, 0, 255, 0.05));
                border: 2px solid rgba(0, 255, 255, 0.3);
                border-radius: 20px;
                padding: 2rem;
            }

            /* Digital Countdown Meter */
            .countdown-display {
                text-align: center;
            }

            .digital-meter {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 0.5rem;
                margin: 2rem 0;
                font-family: 'Orbitron', monospace;
            }

            .meter-segment {
                width: 60px;
                height: 80px;
                background: #000;
                border: 3px solid #ff0000;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 3rem;
                font-weight: 900;
                color: #ff0000;
                text-shadow: 0 0 20px #ff0000;
                animation: segmentFlicker 2s infinite;
            }

            .meter-segment.error-char {
                font-size: 2.5rem;
                letter-spacing: 0;
            }

            .meter-separator {
                font-size: 3rem;
                font-weight: 900;
                color: #ff0000;
                text-shadow: 0 0 20px #ff0000;
                animation: separatorBlink 1s infinite;
            }

            .meter-label {
                font-size: 0.9rem;
                color: #666;
                letter-spacing: 2rem;
                margin-left: 1rem;
            }

            .meter-error {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1rem;
                margin: 1.5rem 0;
                padding: 1rem;
                background: rgba(255, 0, 0, 0.1);
                border: 2px dashed #ff0000;
                border-radius: 8px;
                font-family: 'Courier New', monospace;
                font-size: 1.1rem;
                color: #ff0000;
                font-weight: 700;
            }

            .error-blink {
                animation: errorBlink 0.5s infinite;
            }

            @keyframes segmentFlicker {
                0%, 100% {
                    opacity: 1;
                }
                50% {
                    opacity: 0.8;
                }
            }

            @keyframes separatorBlink {
                0%, 49% {
                    opacity: 1;
                }
                50%, 100% {
                    opacity: 0.3;
                }
            }

            @keyframes errorBlink {
                0%, 49% {
                    opacity: 1;
                }
                50%, 100% {
                    opacity: 0;
                }
            }

            @media (max-width: 768px) {
                .meter-segment {
                    width: 40px;
                    height: 60px;
                    font-size: 2rem;
                }

                .meter-separator {
                    font-size: 2rem;
                }

                .meter-label {
                    letter-spacing: 1rem;
                    font-size: 0.75rem;
                }

                .meter-error {
                    font-size: 0.85rem;
                }
            }

            /* Info Items */
            .info-item {
                display: flex;
                align-items: start;
                gap: 1rem;
                padding: 1rem;
                background: rgba(0, 255, 255, 0.05);
                border-radius: 12px;
                border: 1px solid rgba(0, 255, 255, 0.2);
            }

            .info-icon {
                font-size: 2rem;
            }
        </style>
    </body>
    </html>
`
