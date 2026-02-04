            // Debate and User data
            const appData = document.getElementById('app-data');
            if (!appData) {
                console.error('CRITICAL: app-data element not found!');
                throw new Error('App data element not found');
            }
            
            console.log('App data element:', appData);
            console.log('Dataset:', appData.dataset);
            
            const DEBATE_ID = appData.dataset.debateId;
            const currentUser = {
                user_id: appData.dataset.userId,
                credits: parseInt(appData.dataset.userCredits)
            };
            
            console.log('DEBATE_ID:', DEBATE_ID);
            console.log('currentUser:', currentUser);

            // Vote state
            let userVote = null;
            let hasVoted = false;
            let voteData = {
                agree: 0,
                disagree: 0,
                total: 0
            };
            
            // AI評価システム用グローバル変数
            let aiVotesDistribution = { agree: 0, disagree: 0 };  // 3つのAIの投票配分
            let lastUserCount = 0;  // 前回のユーザー総数（差分計算用）
            let fogMode = false;  // ゲージ霧モード（残り10%で有効）
            let finalVotingMode = false;  // 最終投票モード（1分猶予）

            // Initialize demo votes (10 random voters)
            function initDemoVotes() {
                // 10人のランダム投票者を生成
                for (let i = 0; i < 10; i++) {
                    const randomVote = Math.random() > 0.5 ? 'agree' : 'disagree';
                    voteData[randomVote]++;
                    voteData.total++;
                }
            }

            // Submit initial vote from modal
            function submitVote(side) {
                userVote = side;
                hasVoted = true;
                voteData[side]++;
                voteData.total++;

                // localStorageに保存
                const storageKey = 'debate_vote_' + DEBATE_ID + '_' + currentUser.user_id;
                localStorage.setItem(storageKey, side);

                // Hide modal
                document.getElementById('voteModal').classList.add('hidden');

                // Update UI
                updateVoteDisplay();
                highlightSelectedButton(side);
                
                showToast('投票が完了しました！観戦を開始します');
            }
            window.submitVote = submitVote;

            // Change vote (also works as initial vote)
            function changeVote(side) {
                if (!hasVoted) {
                    // 初回投票として扱う
                    submitVote(side);
                    return;
                }

                if (userVote === side) {
                    showToast('既にこの意見に投票済みです');
                    return;
                }

                // Update vote
                voteData[userVote]--;
                voteData[side]++;
                userVote = side;

                // Update localStorage
                const storageKey = 'debate_vote_' + DEBATE_ID + '_' + currentUser.user_id;
                localStorage.setItem(storageKey, side);

                // Update UI
                updateVoteDisplay();
                highlightSelectedButton(side);
                
                const message = side === 'agree' ? '意見Aに変更しました！' : '意見Bに変更しました！';
                showToast(message);
            }
            window.changeVote = changeVote;

            // Highlight selected button
            function highlightSelectedButton(side) {
                const agreeBtn = document.getElementById('voteAgreeBtn');
                const disagreeBtn = document.getElementById('voteDisagreeBtn');
                
                if (side === 'agree') {
                    agreeBtn.classList.add('ring-4', 'ring-green-400');
                    disagreeBtn.classList.remove('ring-4', 'ring-red-400');
                } else {
                    disagreeBtn.classList.add('ring-4', 'ring-red-400');
                    agreeBtn.classList.remove('ring-4', 'ring-green-400');
                }
            }

            // Update vote display
            function updateVoteDisplay() {
                if (voteData.total < 5) {
                    // Less than 5 votes - show "集計中"
                    document.getElementById('agreePercent').textContent = '--';
                    document.getElementById('disagreePercent').textContent = '--';
                    document.getElementById('agreePercentSymbol').textContent = '';
                    document.getElementById('disagreePercentSymbol').textContent = '';
                    document.getElementById('voteStatus').innerHTML = '<i class="fas fa-hourglass-half mr-2"></i>集計中... (' + voteData.total + '/5人)';
                    document.getElementById('agreeBar').style.width = '50%';
                    document.getElementById('disagreeBar').style.width = '50%';
                } else {
                    // 5 or more votes - show percentage
                    const agreePercent = Math.round((voteData.agree / voteData.total) * 100);
                    const disagreePercent = 100 - agreePercent;

                    document.getElementById('agreePercent').textContent = agreePercent;
                    document.getElementById('disagreePercent').textContent = disagreePercent;
                    document.getElementById('agreePercentSymbol').textContent = '% (' + voteData.agree + '票)';
                    document.getElementById('disagreePercentSymbol').textContent = '% (' + voteData.disagree + '票)';
                    document.getElementById('voteStatus').innerHTML = '<i class="fas fa-users mr-2"></i>総投票数: ' + voteData.total.toLocaleString() + '人';
                    document.getElementById('agreeBar').style.width = agreePercent + '%';
                    document.getElementById('disagreeBar').style.width = disagreePercent + '%';
                    
                    // 観戦人数も更新
                    updateViewerCount();
                }
            }

            // Post comment
            function postComment() {
                const input = document.getElementById('commentInput');
                const text = input.value.trim();
                
                if (!text) {
                    showToast('コメントを入力してください');
                    return;
                }

                if (!hasVoted) {
                    showToast('投票してからコメントしてください');
                    return;
                }

                // Check for !s command (dev user only) - ディベート開始
                if (text === '!s' && currentUser.user_id === 'dev') {
                    input.value = '';
                    showToast('ディベートを開始します...');
                    startDebate();
                    return;
                }

                // Check for !dela command (dev user only) - コメント+ディベート削除
                if (text === '!dela' && currentUser.user_id === 'dev') {
                    input.value = '';
                    const commentsList = document.getElementById('commentsList');
                    commentsList.innerHTML = '';
                    const debateMessages = document.getElementById('debateMessages');
                    debateMessages.innerHTML = `
                        <div class="text-center text-gray-400 p-8">
                            <i class="fas fa-info-circle text-4xl mb-4 text-cyan-400"></i>
                            <p class="text-lg">devユーザーでコメント欄に <span class="text-cyan-300 font-bold">!s</span> と入力してディベートを開始</p>
                        </div>
                    `;
                    conversationHistory = [];
                    debateActive = false;
                    lastCommentCount = 0; // カウントをリセット
                    
                    // D1からも削除（await で完了を待つ）
                    await fetch('/api/comments/' + DEBATE_ID, { method: 'DELETE' });
                    await fetch('/api/debate/' + DEBATE_ID + '/messages', { method: 'DELETE' });
                    
                    showToast('コメントとディベート履歴を削除しました');
                    return;
                }

                // Check for !stop command (dev user only)
                if (text === '!stop' && currentUser.user_id === 'dev') {
                    input.value = '';
                    if (debateActive) {
                        debateActive = false;
                        showToast('ディベートを停止しました');
                    } else {
                        showToast('ディベートは実行されていません');
                    }
                    return;
                }



                // Check for !deld command (dev user only) - 全ディベート履歴削除
                if (text === '!deld' && currentUser.user_id === 'dev') {
                    input.value = '';
                    const debateMessages = document.getElementById('debateMessages');
                    debateMessages.innerHTML = `
                        <div class="text-center text-gray-400 p-8">
                            <i class="fas fa-info-circle text-4xl mb-4 text-cyan-400"></i>
                            <p class="text-lg">devユーザーでコメント欄に <span class="text-cyan-300 font-bold">!debate</span> と入力してディベートを開始</p>
                        </div>
                    `;
                    conversationHistory = []; // 会話履歴もクリア
                    debateActive = false; // ディベート停止
                    
                    // D1データベースからも削除
                    fetch('/api/debate/' + DEBATE_ID + '/messages', { method: 'DELETE' })
                        .then(() => showToast('全ディベート履歴を削除しました'))
                        .catch(err => showToast('削除エラー: ' + err.message));
                    
                    return;
                }

                if (text.length > 500) {
                    showToast('コメントは500文字以内で入力してください');
                    return;
                }

                // Create comment element
                const commentsList = document.getElementById('commentsList');
                const commentDiv = document.createElement('div');
                const stanceClass = userVote === 'agree' ? 'comment-agree' : 'comment-disagree';
                const stanceColor = userVote === 'agree' ? 'green' : 'red';
                const stanceIcon = userVote === 'agree' ? 'thumbs-up' : 'thumbs-down';
                const stanceText = userVote === 'agree' ? '意見A支持' : '意見B支持';
                const avatarGradient = userVote === 'agree' ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500';
                
                // @メンション機能削除（そのまま表示）
                const formattedText = text;
                
                commentDiv.className = 'comment-item ' + stanceClass + ' bg-gray-900/50 p-3 rounded border border-cyan-500/30';
                
                const initial = currentUser.user_id.charAt(0).toUpperCase();
                commentDiv.innerHTML = `
                    <div class="flex items-center mb-2">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-xs font-bold mr-2">
                            ${initial}
                        </div>
                        <div class="flex-1">
                            <p class="text-sm font-bold">@${currentUser.user_id}</p>
                            <p class="text-xs text-${stanceColor}-400">
                                <i class="fas fa-${stanceIcon} mr-1"></i>${stanceText}
                            </p>
                        </div>
                    </div>
                    <p class="text-sm text-gray-200">${formattedText}</p>
                `;

                // Add to top
                commentsList.appendChild(commentDiv);
                commentsList.scrollTop = commentsList.scrollHeight; // 最下部にスクロール

                // D1に保存
                saveCommentToD1(text);

                // Update count
                const count = parseInt(document.getElementById('commentCount').textContent);
                document.getElementById('commentCount').textContent = count + 1;

                // Clear input
                input.value = '';
                showToast('コメントを投稿しました！');
            }
            window.postComment = postComment;

            // コメントをD1に保存
            async function saveCommentToD1(content) {
                try {
                    await fetch('/api/comment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            debateId: DEBATE_ID,
                            userId: currentUser.user_id,
                            username: currentUser.user_id,
                            vote: userVote,
                            content: content
                        })
                    });
                } catch (error) {
                    console.error('Failed to save comment:', error);
                }
            }

            // コメント入力をクリアする関数
            function clearCommentInput() {
                const input = document.getElementById('commentInput');
                input.value = '';
            }
            window.clearCommentInput = clearCommentInput;

            // Show toast
            function showToast(message) {
                const toast = document.getElementById('toast');
                const toastMessage = document.getElementById('toastMessage');
                toastMessage.textContent = message;
                toast.classList.remove('hidden');
                setTimeout(() => {
                    toast.classList.add('hidden');
                }, 3000);
            }
            
            // AI評価システム（3つのAIが評価）
            // AI評価システム：符号出現時のみ評価・投票
            async function getAIEvaluations(message, side) {
                try {
                    // 全ディベート内容を送って3つのAIに常に評価させる
                    await performAIVoting(side);
                    
                    // 符号判定も並行して実行
                    const evaluation = await getAIEvaluation(message, side);
                    if (evaluation.shouldVote) {
                        displayAIEvaluation(evaluation, side);
                    }
                } catch (error) {
                    console.error('AI evaluation error:', error);
                }
            }
            
            async function getAIEvaluation(message, side) {
                try {
                    // AIに評価させる（毎ターン）
                    const fullDebate = conversationHistory.map(msg => {
                        const sideName = msg.side === 'agree' ? '意見A' : '意見B';
                        return '[' + sideName + ']: ' + msg.content;
                    }).join(String.fromCharCode(10));
                    
                    const promptParts = [
                        '以下のディベート全体を評価してください：',
                        fullDebate,
                        '',
                        '最新の発言「' + message + '」を評価してください。',
                        '',
                        '評価基準：',
                        '- !! : とても良い（形勢が一気に変わるような決定的な発言）',
                        '- ! : 優れた意見（有利に働く発言）',
                        '- それ未満の優れた意見 : 符号なし（評価は必要だが表示不要）',
                        '- ? : 悪手（相手の意見に飲まれている、形勢が逆転しそう）',
                        '- ?? : 意図不明（何が目的かわからないほど的外れor致命的な失言）',
                        '',
                        '!! ! ? ?? に当てはまる場合のみ、符号と短いコメント（15文字以内）を返してください。',
                        'それ以外の場合は符号なしで返してください。',
                        '',
                        'Output format: JSON with symbol (!! or ! or ? or ?? or null) and comment (string or empty)'
                    ];
                    const prompt = promptParts.join(String.fromCharCode(10));

                    const response = await fetch('/api/debate/generate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            systemPrompt: 'あなたはディベート評価の専門家です。客観的に評価してください。',
                            conversationHistory: [{ role: 'user', content: prompt }],
                            maxTokens: 80,
                            temperature: 0.8
                        })
                    });
                    
                    const data = await response.json();
                    
                    try {
                        // JSONパース試行
                        const result = JSON.parse(data.message);
                        
                        if (result.symbol && ['!!', '!', '?', '??'].includes(result.symbol)) {
                            return { 
                                symbol: result.symbol, 
                                comment: result.comment || '評価中...', 
                                support: side, 
                                shouldVote: true 
                            };
                        } else {
                            // 符号なし
                            return { symbol: null, comment: '', support: side, shouldVote: false };
                        }
                    } catch {
                        // JSONパース失敗：文字列から符号を抽出
                        const message = data.message;
                        if (message.includes('!!')) {
                            return { symbol: '!!', comment: '圧倒的な説得力', support: side, shouldVote: true };
                        } else if (message.includes('!') && !message.includes('!!')) {
                            return { symbol: '!', comment: '有力な主張', support: side, shouldVote: true };
                        } else if (message.includes('??')) {
                            return { symbol: '??', comment: '意図不明', support: side, shouldVote: true };
                        } else if (message.includes('?') && !message.includes('??')) {
                            return { symbol: '?', comment: '根拠不足', support: side, shouldVote: true };
                        } else {
                            return { symbol: null, comment: '', support: side, shouldVote: false };
                        }
                    }
                } catch (error) {
                    console.error('AI evaluation error:', error);
                    return { symbol: null, comment: '', support: side, shouldVote: false };
                }
            }
            
            // AI投票：符号出現時のみ、全文を送って3つのAIが再評価
            async function performAIVoting(currentSide) {
                try {
                    // 全ディベート内容を結合
                    const fullDebate = conversationHistory.map(msg => {
                        const sideName = msg.side === 'agree' ? '意見A' : '意見B';
                        return '[' + sideName + ']: ' + msg.content;
                    }).join(String.fromCharCode(10));
                    
                    // 3つのAIに並列で評価させる
                    const judgments = await Promise.all([
                        getAIJudgment(fullDebate, 'AI-Judge-1', 0.7),
                        getAIJudgment(fullDebate, 'AI-Judge-2', 0.8),
                        getAIJudgment(fullDebate, 'AI-Judge-3', 0.9)
                    ]);
                    
                    // UI更新：各審査員の評価を表示
                    judgments.forEach((judgment, index) => {
                        const judgeId = 'judge' + (index + 1) + '-eval';
                        const elem = document.getElementById(judgeId);
                        if (elem && judgment && judgment.winner) {
                            const winner = judgment.winner === 'agree' ? '意見A' : '意見B';
                            const color = judgment.winner === 'agree' ? 'text-green-400' : 'text-red-400';
                            elem.className = 'text-sm ' + color;
                            elem.textContent = winner + ' が優勢';
                        }
                    });
                    
                    // 現在のユーザー総数を取得
                    const currentUserCount = voteData.total;
                    
                    // 増加分のユーザー数を計算
                    const newUsers = currentUserCount - lastUserCount;
                    
                    // 3つのAIに均等配分（増加分のみ）
                    const votesPerAI = Math.floor(newUsers / 3);
                    
                    if (votesPerAI > 0) {
                        // 各AIの判定に基づいて投票
                        judgments.forEach(judgment => {
                            if (judgment && judgment.winner) {
                                if (judgment.winner === 'agree') {
                                    aiVotesDistribution.agree += votesPerAI;
                                    voteData.agree += votesPerAI;
                                } else {
                                    aiVotesDistribution.disagree += votesPerAI;
                                    voteData.disagree += votesPerAI;
                                }
                                voteData.total += votesPerAI;
                            }
                        });
                        
                        // 最後のユーザー数を更新
                        lastUserCount = currentUserCount;
                        
                        // ゲージを更新
                        updateVoteDisplay();
                    }
                } catch (error) {
                    console.error('AI voting error:', error);
                }
            }
            
            async function getAIJudgment(fullDebate, aiName, temperature) {
                try {
                    const promptParts = [
                        '以下のディベート全体を評価してください：',
                        fullDebate,
                        '',
                        'どちらが現時点で優勢か判定してください。',
                        'Output format: JSON with winner (agree or disagree)'
                    ];
                    const prompt = promptParts.join(String.fromCharCode(10));
                    
                    const response = await fetch('/api/debate/generate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            systemPrompt: 'あなたは公平なディベート審査員です。',
                            conversationHistory: [{ role: 'user', content: prompt }],
                            maxTokens: 50,
                            temperature: temperature
                        })
                    });
                    
                    const data = await response.json();
                    try {
                        // JSONパース試行
                        const result = JSON.parse(data.message);
                        return result;
                    } catch {
                        // パース失敗時は文字列から判定
                        if (data.message.includes('agree') || data.message.includes('意見A')) {
                            return { winner: 'agree' };
                        } else {
                            return { winner: 'disagree' };
                        }
                    }
                } catch (error) {
                    return { winner: 'agree' };  // デフォルト
                }
            }
            
            function displayAIEvaluation(evaluation, side) {
                if (!evaluation || !evaluation.symbol) return;
                
                // 最後に追加したメッセージバブルを取得
                const container = document.getElementById('debateMessages');
                const bubbles = container.querySelectorAll('.bubble');
                const lastBubble = bubbles[bubbles.length - 1];
                
                if (!lastBubble) return;
                
                // アイコンをSVGで作成
                let symbolSvg = '';
                let symbolColor = '';
                
                if (evaluation.symbol === '!!') {
                    symbolColor = '#10b981'; // green
                    symbolSvg = '<svg width="32" height="32" viewBox="0 0 32 32" style="filter: drop-shadow(0 0 4px rgba(16, 185, 129, 0.8));"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="' + symbolColor + '" font-size="24" font-weight="bold">!!</text></svg>';
                } else if (evaluation.symbol === '!') {
                    symbolColor = '#10b981'; // green
                    symbolSvg = '<svg width="24" height="32" viewBox="0 0 24 32" style="filter: drop-shadow(0 0 4px rgba(16, 185, 129, 0.8));"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="' + symbolColor + '" font-size="24" font-weight="bold">!</text></svg>';
                } else if (evaluation.symbol === '?') {
                    symbolColor = '#f59e0b'; // orange
                    symbolSvg = '<svg width="24" height="32" viewBox="0 0 24 32" style="filter: drop-shadow(0 0 4px rgba(245, 158, 11, 0.8));"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="' + symbolColor + '" font-size="24" font-weight="bold">?</text></svg>';
                } else if (evaluation.symbol === '??') {
                    symbolColor = '#ef4444'; // red
                    symbolSvg = '<svg width="32" height="32" viewBox="0 0 32 32" style="filter: drop-shadow(0 0 4px rgba(239, 68, 68, 0.8));"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="' + symbolColor + '" font-size="24" font-weight="bold">??</text></svg>';
                }
                
                // 枠の端（左上または右上）にアイコンを配置
                const iconDiv = document.createElement('div');
                iconDiv.className = 'absolute top-2 ' + (side === 'agree' ? 'left-2' : 'right-2');
                iconDiv.innerHTML = symbolSvg;
                
                // バブルをrelativeに設定
                lastBubble.style.position = 'relative';
                lastBubble.appendChild(iconDiv);
            }
            
            // 最終投票モーダルを表示
            function showFinalVotingModal() {
                finalVotingMode = true;
                
                // モーダル作成
                const modalHTML = '<div id="finalVoteModal" class="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50">' +
                    '<div class="bg-gray-900 border-4 border-cyan-500 rounded-lg p-8 max-w-lg w-full mx-4 shadow-2xl">' +
                        '<h2 class="text-3xl font-bold text-cyan-400 mb-4 text-center">' +
                            '<i class="fas fa-gavel mr-2"></i>最終判定' +
                        '</h2>' +
                        '<p class="text-white text-center mb-6">' +
                            'ディベート終了！<br>' +
                            '<span class="text-cyan-300">1分以内</span>に最終的な支持を決定してください。' +
                        '</p>' +
                        '<div class="grid grid-cols-2 gap-4">' +
                            '<button id="finalVoteAgree" class="bg-green-500/20 border-2 border-green-500 hover:bg-green-500/40 p-6 rounded transition-all">' +
                                '<i class="fas fa-check-circle text-4xl mb-2"></i>' +
                                '<p class="font-bold">意見Aを支持</p>' +
                            '</button>' +
                            '<button id="finalVoteDisagree" class="bg-red-500/20 border-2 border-red-500 hover:bg-red-500/40 p-6 rounded transition-all">' +
                                '<i class="fas fa-times-circle text-4xl mb-2"></i>' +
                                '<p class="font-bold">意見Bを支持</p>' +
                            '</button>' +
                        '</div>' +
                        '<p class="text-xs text-gray-400 text-center mt-4">' +
                            '未選択の場合、現在の投票がそのまま反映されます' +
                        '</p>' +
                    '</div>' +
                '</div>';
                document.body.insertAdjacentHTML('beforeend', modalHTML);
                
                // イベントリスナー
                document.getElementById('finalVoteAgree').addEventListener('click', () => {
                    submitFinalVote('agree');
                });
                document.getElementById('finalVoteDisagree').addEventListener('click', () => {
                    submitFinalVote('disagree');
                });
                
                // 60秒後に自動終了
                setTimeout(() => {
                    finalizeFinalVote();
                }, 60000);
            }
            
            function submitFinalVote(side) {
                // 既存の投票を変更
                if (hasVoted && userVote !== side) {
                    voteData[userVote]--;
                    voteData[side]++;
                    userVote = side;
                    
                    // localStorageに保存
                    const storageKey = 'debate_vote_' + DEBATE_ID + '_' + currentUser.user_id;
                    localStorage.setItem(storageKey, side);
                }
                
                // モーダルを閉じる
                const modal = document.getElementById('finalVoteModal');
                if (modal) modal.remove();
                
                showToast('最終投票を受け付けました！');
                
                // AI最終評価へ
                setTimeout(() => {
                    performFinalAIJudgment();
                }, 2000);
            }
            
            function finalizeFinalVote() {
                // 時間切れ：現在の投票をそのまま確定
                const modal = document.getElementById('finalVoteModal');
                if (modal) modal.remove();
                
                showToast('時間切れ！現在の投票で確定しました。');
                
                // AI最終評価へ
                setTimeout(() => {
                    performFinalAIJudgment();
                }, 2000);
            }
            
            // AI最終評価・投票・結果表示
            async function performFinalAIJudgment() {
                showToast('AIによる最終評価を実施中...');
                
                // 全会話を再評価
                const fullDebate = conversationHistory.map(msg => msg.content).join(String.fromCharCode(10));
                
                try {
                    // 3つのAIによる最終評価
                    const judgments = await Promise.all([
                        getFinalJudgment(fullDebate, 'AI-Judge-1', 0.7),
                        getFinalJudgment(fullDebate, 'AI-Judge-2', 0.8),
                        getFinalJudgment(fullDebate, 'AI-Judge-3', 0.9)
                    ]);
                    
                    // AI投票を集計
                    const totalUsers = voteData.total;
                    const votesPerAI = Math.floor(totalUsers / 3);
                    
                    judgments.forEach(judgment => {
                        if (judgment && judgment.winner) {
                            if (judgment.winner === 'agree') {
                                voteData.agree += votesPerAI;
                            } else {
                                voteData.disagree += votesPerAI;
                            }
                            voteData.total += votesPerAI;
                        }
                    });
                    
                    // 最終結果を表示
                    displayFinalResults(judgments);
                } catch (error) {
                    console.error('Final judgment error:', error);
                    showToast('AI評価エラー');
                }
            }
            
            async function getFinalJudgment(debate, aiName, temperature) {
                try {
                    const promptParts = [
                        '以下のディベート全体を評価してください：',
                        debate,
                        '',
                        'あなたは' + aiName + 'です。どちらが説得力があったか判定し、理由を簡潔に述べてください（50文字以内）。',
                        'Output format: JSON with winner (agree or disagree) and reason (50 chars max)'
                    ];
                    const prompt = promptParts.join(String.fromCharCode(10));
                    
                    const response = await fetch('/api/debate/generate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            systemPrompt: 'あなたは公平なディベート審査員です。',
                            conversationHistory: [{ role: 'user', content: prompt }],
                            maxTokens: 100,
                            temperature: temperature
                        })
                    });
                    
                    const data = await response.json();
                    try {
                        return JSON.parse(data.message);
                    } catch {
                        return { winner: 'agree', reason: '評価中...' };
                    }
                } catch (error) {
                    return null;
                }
            }
            
            function displayFinalResults(judgments) {
                // ゲージの霧を解除
                document.getElementById('agreeBar').style.filter = 'none';
                document.getElementById('disagreeBar').style.filter = 'none';
                
                // 結果を更新
                updateVoteDisplay();
                
                // 勝者を決定
                const winner = voteData.agree > voteData.disagree ? '意見A' : '意見B';
                const winnerColor = voteData.agree > voteData.disagree ? 'text-green-400' : 'text-red-400';
                
                // AI評価コメントを表示
                const judgmentComments = judgments.map((j, i) => {
                    const judgeNum = i + 1;
                    const reason = j ? (j.reason || '評価中...') : '評価中...';
                    return '<div class="mb-2"><span class="text-cyan-400 font-bold">AI-Judge-' + judgeNum + ':</span> ' + reason + '</div>';
                }).join('');
                
                // 結果モーダル
                const resultHTML = '<div id="resultModal" class="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50">' +
                    '<div class="bg-gray-900 border-4 border-cyan-500 rounded-lg p-8 max-w-2xl w-full mx-4 shadow-2xl">' +
                        '<h2 class="text-4xl font-bold text-cyan-400 mb-6 text-center">' +
                            '<i class="fas fa-trophy mr-2"></i>ディベート結果' +
                        '</h2>' +
                        '<div class="text-center mb-6">' +
                            '<p class="text-2xl mb-2">勝者:</p>' +
                            '<p class="text-5xl font-bold ' + winnerColor + '">' + winner + '</p>' +
                        '</div>' +
                        '<div class="bg-gray-800 p-4 rounded mb-6">' +
                            '<h3 class="text-xl font-bold text-cyan-400 mb-4">最終投票結果</h3>' +
                            '<div class="grid grid-cols-2 gap-4 text-center">' +
                                '<div>' +
                                    '<p class="text-3xl font-bold text-green-400">' + voteData.agree + '</p>' +
                                    '<p class="text-sm text-gray-400">意見A支持</p>' +
                                '</div>' +
                                '<div>' +
                                    '<p class="text-3xl font-bold text-red-400">' + voteData.disagree + '</p>' +
                                    '<p class="text-sm text-gray-400">意見B支持</p>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="bg-gray-800 p-4 rounded mb-6">' +
                            '<h3 class="text-xl font-bold text-cyan-400 mb-4">AI審査員の評価</h3>' +
                            '<div class="text-sm text-white">' +
                                judgmentComments +
                            '</div>' +
                        '</div>' +
                        '<button onclick="location.href=\'/main\'" class="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 rounded">' +
                            '<i class="fas fa-home mr-2"></i>メインに戻る' +
                        '</button>' +
                    '</div>' +
                '</div>';
                document.body.insertAdjacentHTML('beforeend', resultHTML);
            }

            // Auto-scroll debate messages
            setInterval(() => {
                const container = document.getElementById('debateMessages');
                container.scrollTop = container.scrollHeight;
            }, 500);

            // Debate timer (managed by updateDebateTimer)
            setInterval(() => {
                remainingSeconds--;
                const minutes = Math.floor(remainingSeconds / 60);
                const seconds = remainingSeconds % 60;
                document.getElementById('remainingTime').textContent = 
                    `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }, 1000);

            // 観戦人数を実データに更新
            function updateViewerCount() {
                document.getElementById('viewerCount').textContent = voteData.total.toLocaleString();
            }
            
            // 定期的に観戦人数を更新
            setInterval(updateViewerCount, 2000);

            // Debate system
            let debateActive = false;
            let debateStartTime = 0;
            const MAX_DEBATE_TIME = 60; // 60 seconds
            const MAX_CHARS = 150;
            
            // Update UI with actual values
            document.getElementById('debateTimeLimit').textContent = MAX_DEBATE_TIME + '秒';
            document.getElementById('debateCharLimit').textContent = MAX_CHARS + '文字';
            
            let conversationHistory = []; // 会話履歴を保持
            // fogMode is already declared at line 32
            let aiVotes = { agree: 0, disagree: 0 }; // AI投票数
            let aiJudges = []; // 3つのAI評価者

            async function startDebate() {
                if (debateActive) {
                    showToast('ディベートは既に実行中です');
                    return;
                }
                
                debateActive = true;
                debateStartTime = Date.now();
                conversationHistory = []; // 会話履歴をリセット
                
                // 開始時刻を表示
                const startTimeElement = document.getElementById('debateStartTime');
                if (startTimeElement) {
                    const date = new Date(debateStartTime);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    const hours = String(date.getHours()).padStart(2, '0');
                    const minutes = String(date.getMinutes()).padStart(2, '0');
                    startTimeElement.textContent = `${year}/${month}/${day} ${hours}:${minutes} 開始`;
                }
                
                const debateMessages = document.getElementById('debateMessages');
                debateMessages.innerHTML = '<div class="text-center text-cyan-300 p-4"><i class="fas fa-spinner fa-spin mr-2"></i>ディベート開始...</div>';
                
                // Start countdown timer
                updateDebateTimer();
                
                // Start first AI response
                await generateAIResponse('agree');
            }

            function updateDebateTimer() {
                if (!debateActive) return;
                
                const elapsed = Math.floor((Date.now() - debateStartTime) / 1000);
                const remaining = MAX_DEBATE_TIME - elapsed;
                
                // 残り10%で霧モードオン（ゲージ非公開）
                if (remaining <= MAX_DEBATE_TIME * 0.1 && !fogMode) {
                    fogMode = true;
                    showToast('⚠️ ゲージ非公開化！残り時間わずか。');
                    document.getElementById('agreePercent').textContent = '???';
                    document.getElementById('disagreePercent').textContent = '???';
                    document.getElementById('voteStatus').textContent = '❓ 集計中...';
                    // ゲージを完全に隠す（blur + グラデーション + アニメーション削除）
                    const agreeBar = document.getElementById('agreeBar');
                    const disagreeBar = document.getElementById('disagreeBar');
                    agreeBar.style.transition = 'none'; // アニメーション削除
                    disagreeBar.style.transition = 'none';
                    agreeBar.style.filter = 'blur(20px)';
                    disagreeBar.style.filter = 'blur(20px)';
                    agreeBar.style.background = 'linear-gradient(90deg, #333, #555, #333)';
                    disagreeBar.style.background = 'linear-gradient(90deg, #333, #555, #333)';
                }
                
                if (remaining <= 0) {
                    debateActive = false;
                    
                    // 最終投票期間を開始（1分間）
                    startFinalVotingPeriod();
                    return;
                }
                
                const minutes = Math.floor(remaining / 60);
                const seconds = remaining % 60;
                document.getElementById('remainingTime').textContent = 
                    `${minutes}:${seconds.toString().padStart(2, '0')}`;
                
                setTimeout(updateDebateTimer, 1000);
            }

            // 最終投票期間（1分間）
            function startFinalVotingPeriod() {
                showToast('⏰ ディベート終了！1分以内に最終投票を確定してください');
                
                // 投票確定ボタンを表示
                const confirmBtn = document.createElement('button');
                confirmBtn.id = 'confirmVoteBtn';
                confirmBtn.className = 'w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 px-6 rounded-lg text-xl mt-6 transition-all';
                confirmBtn.innerHTML = '<i class="fas fa-check-circle mr-2"></i>投票を確定する';
                
                // Winner Prediction セクションに追加
                const predictionSection = document.querySelector('.vote-prediction-btn').parentElement.parentElement;
                predictionSection.appendChild(confirmBtn);
                
                let finalVotingTimeLeft = 60; // 60秒
                let userConfirmed = false;
                
                // カウントダウン表示を追加
                const countdownDiv = document.createElement('div');
                countdownDiv.id = 'finalCountdown';
                countdownDiv.className = 'text-center text-xl text-cyan-400 mt-4';
                countdownDiv.textContent = '残り時間: 60秒';
                predictionSection.appendChild(countdownDiv);
                
                // 確定ボタンクリック
                confirmBtn.addEventListener('click', () => {
                    if (!hasVoted) {
                        showToast('エラー: まず意見を選択してください');
                        return;
                    }
                    userConfirmed = true;
                    confirmBtn.disabled = true;
                    confirmBtn.textContent = '投票確定済み - 他の参加者を待っています...';
                    showToast('✅ 投票が確定されました');
                    
                    // ゲージを復活させる
                    const agreeBar = document.getElementById('agreeBar');
                    const disagreeBar = document.getElementById('disagreeBar');
                    agreeBar.style.transition = 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'; // アニメーション復活
                    disagreeBar.style.transition = 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                    agreeBar.style.filter = 'none';
                    disagreeBar.style.filter = 'none';
                    agreeBar.style.background = '';
                    disagreeBar.style.background = '';
                    
                    // 投票ボタンを無効化
                    document.getElementById('voteAgreeBtn').disabled = true;
                    document.getElementById('voteDisagreeBtn').disabled = true;
                    document.getElementById('voteAgreeBtn').style.opacity = '0.5';
                    document.getElementById('voteDisagreeBtn').style.opacity = '0.5';
                    
                    // 数値を表示
                    updateVoteDisplay();
                });
                
                // カウントダウンタイマー
                const finalTimer = setInterval(() => {
                    finalVotingTimeLeft--;
                    countdownDiv.textContent = '残り時間: ' + finalVotingTimeLeft + '秒';
                    
                    if (finalVotingTimeLeft <= 0) {
                        clearInterval(finalTimer);
                        
                        // 未投票の場合はエラー
                        if (!hasVoted) {
                            showToast('エラー: 投票が必要です');
                            // 投票モーダルを再表示
                            document.getElementById('voteModal').classList.remove('hidden');
                            return;
                        }
                        
                        // 未確定でも自動確定
                        if (!userConfirmed) {
                            showToast('⏰ 時間切れ - 現在の選択で自動確定しました');
                        }
                        
                        // 結果画面へ遷移
                        showFinalResults();
                    }
                }, 1000);
            }

            // 最終結果表示
            function showFinalResults() {
                const agreePercent = Math.round((voteData.agree / voteData.total) * 100);
                const disagreePercent = 100 - agreePercent;
                const winner = voteData.agree > voteData.disagree ? '意見A' : '意見B';
                const winnerColor = voteData.agree > voteData.disagree ? 'text-green-400' : 'text-red-400';
                
                // 結果モーダルを作成
                const resultModal = document.createElement('div');
                resultModal.className = 'fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50';
                resultModal.innerHTML = '<div class="cyber-card max-w-2xl w-full mx-4">' +
                    '<h2 class="text-4xl font-bold text-center mb-8">' +
                        '<i class="fas fa-trophy mr-3 text-yellow-400"></i>' +
                        '最終結果' +
                    '</h2>' +
                    '<div class="text-center mb-8">' +
                        '<p class="text-2xl mb-4">勝者</p>' +
                        '<p class="text-5xl font-bold ' + winnerColor + ' mb-4">' + winner + '</p>' +
                    '</div>' +
                    '<div class="grid grid-cols-2 gap-6 mb-8">' +
                        '<div class="text-center p-6 bg-green-500/20 rounded">' +
                            '<p class="text-xl mb-2">意見A</p>' +
                            '<p class="text-4xl font-bold text-green-400">' + agreePercent + '%</p>' +
                            '<p class="text-sm text-gray-400 mt-2">' + voteData.agree + ' 票</p>' +
                        '</div>' +
                        '<div class="text-center p-6 bg-red-500/20 rounded">' +
                            '<p class="text-xl mb-2">意見B</p>' +
                            '<p class="text-4xl font-bold text-red-400">' + disagreePercent + '%</p>' +
                            '<p class="text-sm text-gray-400 mt-2">' + voteData.disagree + ' 票</p>' +
                        '</div>' +
                    '</div>' +
                    '<div class="text-center">' +
                        '<p class="text-lg text-gray-400 mb-6">総投票数: ' + voteData.total + ' 人</p>' +
                        '<button onclick="location.href=\'/\'" class="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg">' +
                            '<i class="fas fa-home mr-2"></i>トップページへ' +
                        '</button>' +
                    '</div>' +
                '</div>';
                
                document.body.appendChild(resultModal);
            }

            async function generateAIResponse(side) {
                if (!debateActive) return;
                
                const turnNumber = conversationHistory.length + 1;
                const systemPrompt = side === 'agree' 
                    ? `ターン${turnNumber}: AIは仕事を創出する立場。前回の議論を踏まえ、新しい角度から主張。データや事例を1つ挙げ、簡潔に反論。130文字厳守。`
                    : `ターン${turnNumber}: AIは仕事を奪う立場。前回の議論を踏まえ、新しい角度から主張。データや事例を1つ挙げ、簡潔に反論。130文字厳守。`;
                
                try {
                    const response = await fetch('/api/debate/generate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            systemPrompt,
                            conversationHistory, // 会話履歴を送信
                            maxTokens: 80,  // 短くする
                            temperature: 0.9  // 多様性を増やす
                        })
                    });
                    
                    if (!response.ok) {
                        throw new Error('API request failed');
                    }
                    
                    const data = await response.json();
                    
                    if (data.message && debateActive) {
                        // 会話履歴に追加
                        conversationHistory.push({
                            role: side === 'agree' ? 'assistant' : 'user',
                            content: data.message,
                            side: side
                        });
                        
                        addDebateMessageWithTyping(side, data.message); // タイピング演出版を使用
                        
                        // 5ターン目に強制評価（デモ用）
                        const turnNumber = conversationHistory.length;
                        
                        // Continue with opposite side after 3 seconds
                        setTimeout(() => {
                            if (debateActive) {
                                const nextSide = side === 'agree' ? 'disagree' : 'agree';
                                generateAIResponse(nextSide);
                            }
                        }, 3000);
                    }
                } catch (error) {
                    console.error('Debate error:', error);
                    showToast('ディベート生成エラー: ' + error.message);
                    debateActive = false;
                }
            }

            function addDebateMessage(side, message) {
                const container = document.getElementById('debateMessages');
                const bubbleClass = side === 'agree' ? 'bubble-agree' : 'bubble-disagree';
                const aiModel = side === 'agree' ? 'GPT-4o' : 'Claude-3.5';
                const iconClass = side === 'agree' ? 'fa-brain' : 'fa-lightbulb';
                
                const bubbleHTML = `
                    <div class="bubble ${bubbleClass} p-4 text-white shadow-lg">
                        <div class="flex items-center mb-2">
                            <div class="w-10 h-10 rounded-full bg-gradient-to-br ${side === 'agree' ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500'} flex items-center justify-center mr-3">
                                <i class="fas ${iconClass}"></i>
                            </div>
                            <div>
                                <p class="font-bold">${aiModel}</p>
                                <p class="text-xs opacity-75">${side === 'agree' ? '意見A' : '意見B'}</p>
                            </div>
                        </div>
                        <p class="text-sm leading-relaxed">${message}</p>
                    </div>
                `;
                
                container.insertAdjacentHTML('beforeend', bubbleHTML);
                container.scrollTop = container.scrollHeight;
            }

            // メッセージ追加関数（瞬時表示 + AI評価）
            function addDebateMessageWithTyping(side, message) {
                const container = document.getElementById('debateMessages');
                const bubbleClass = side === 'agree' ? 'bubble-agree' : 'bubble-disagree';
                const aiModel = side === 'agree' ? 'GPT-4o' : 'Claude-3.5';
                const iconClass = side === 'agree' ? 'fa-brain' : 'fa-lightbulb';
                const gradientClass = side === 'agree' ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500';
                const opinionLabel = side === 'agree' ? '意見A' : '意見B';
                
                // 枠を先に生成（1行レイアウト）
                const bubbleDiv = document.createElement('div');
                bubbleDiv.className = 'bubble ' + bubbleClass + ' p-4 text-white shadow-lg';
                bubbleDiv.style.minHeight = '60px';  // 最小高さを固定
                bubbleDiv.innerHTML = '<div class="flex items-center gap-3">' +
                    '<div class="w-8 h-8 rounded-full bg-gradient-to-br ' + gradientClass + ' flex items-center justify-center flex-shrink-0">' +
                        '<i class="fas ' + iconClass + ' text-sm"></i>' +
                    '</div>' +
                    '<span class="font-bold text-sm flex-shrink-0">' + aiModel + '</span>' +
                    '<span class="text-xs opacity-75 flex-shrink-0">' + opinionLabel + '</span>' +
                    '<span class="text-sm leading-relaxed typing-text flex-1"></span>' +
                '</div>';
                
                container.appendChild(bubbleDiv);
                
                // 自動スクロール（即座に）
                container.scrollTop = container.scrollHeight;
                
                // 枠が完全に描画されるまで待つ（50ms）
                setTimeout(() => {
                    // タイピング演出開始
                    const textElement = bubbleDiv.querySelector('.typing-text');
                    let charIndex = 0;
                    const typingSpeed = 30; // 30ms per character
                    
                    function typeChar() {
                        if (charIndex < message.length && debateActive) {
                            textElement.textContent += message.charAt(charIndex);
                            charIndex++;
                            // タイピング中も自動スクロール
                            container.scrollTop = container.scrollHeight;
                            setTimeout(typeChar, typingSpeed);
                        } else {
                            // タイピング完了後にD1保存とAI評価
                            saveDebateMessageToD1(side, aiModel, message);
                            
                            if (!fogMode) {
                                getAIEvaluations(message, side);
                            }
                        }
                    }
                    
                    typeChar();
                }, 50);
            }

            // ディベートメッセージをD1に保存
            async function saveDebateMessageToD1(side, model, content) {
                try {
                    // パラメータ検証
                    if (!side || !model || !content) {
                        console.error('Invalid parameters:', { side, model, content });
                        return;
                    }
                    
                    await fetch('/api/debate/message', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            debateId: DEBATE_ID,
                            side: side,
                            model: model,
                            content: content
                        })
                    });
                } catch (error) {
                    console.error('Failed to save debate message:', error);
                }
            }

            // ディベートメッセージをD1から読み込み
            let lastMessageCount = 0;
            async function loadDebateMessagesFromD1() {
                try {
                    const response = await fetch('/api/debate/' + DEBATE_ID + '/messages');
                    const data = await response.json();
                    
                    if (data.messages && data.messages.length > 0) {
                        // 新しいメッセージがある場合のみ更新
                        if (data.messages.length !== lastMessageCount) {
                            const container = document.getElementById('debateMessages');
                            container.innerHTML = ''; // クリア
                            
                            for (const msg of data.messages) {
                                addDebateMessage(msg.side, msg.content);
                            }
                            
                            lastMessageCount = data.messages.length;
                        }
                    }
                } catch (error) {
                    console.error('Failed to load debate messages:', error);
                }
            }

            // コメントをD1から読み込み
            let lastCommentCount = 0;
            async function loadCommentsFromD1() {
                try {
                    const response = await fetch('/api/comments/' + DEBATE_ID);
                    const data = await response.json();
                    
                    if (data.comments && data.comments.length > 0) {
                        const commentsList = document.getElementById('commentsList');
                        
                        // 新しいコメントのみ追加（増分更新）
                        if (data.comments.length > lastCommentCount) {
                            const newComments = data.comments.slice(lastCommentCount);
                            
                            for (const comment of newComments) {
                                const stanceClass = comment.vote === 'agree' ? 'comment-agree' : 'comment-disagree';
                                const stanceColor = comment.vote === 'agree' ? 'green' : 'red';
                                const stanceIcon = comment.vote === 'agree' ? 'thumbs-up' : 'thumbs-down';
                                const stanceText = comment.vote === 'agree' ? '意見A支持' : '意見B支持';
                                const avatarGradient = comment.vote === 'agree' ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500';
                                const initial = comment.username.charAt(0).toUpperCase();
                                const formattedContent = comment.content;
                                
                                const commentDiv = document.createElement('div');
                                commentDiv.className = 'comment-item ' + stanceClass + ' bg-gray-900/50 p-3 rounded border border-cyan-500/30';
                                commentDiv.innerHTML = `
                                    <div class="flex items-center mb-2">
                                        <div class="w-8 h-8 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-xs font-bold mr-2">
                                            ${initial}
                                        </div>
                                        <div class="flex-1">
                                            <p class="text-sm font-bold">@${comment.username}</p>
                                            <p class="text-xs text-${stanceColor}-400">
                                                <i class="fas fa-${stanceIcon} mr-1"></i>${stanceText}
                                            </p>
                                        </div>
                                    </div>
                                    <p class="text-sm text-gray-200">${formattedContent}</p>
                                `;
                                
                                commentsList.appendChild(commentDiv);
                            }
                            
                            // 最下部にスクロール
                            commentsList.scrollTop = commentsList.scrollHeight;
                            lastCommentCount = data.comments.length;
                        }
                    }
                } catch (error) {
                    console.error('Failed to load comments:', error);
                }
            }

            // リアルタイム同期（2秒ごとにポーリング）
            function startRealtimeSync() {
                setInterval(() => {
                    loadDebateMessagesFromD1();
                    loadCommentsFromD1();
                }, 2000);
            }

            // Initialize on page load
            window.addEventListener('DOMContentLoaded', () => {
                console.log('Page loaded, initializing...');
                
                // 投票ボタンのイベントリスナーを先に設定
                const agreeModalBtn = document.getElementById('voteAgreeModalBtn');
                const disagreeModalBtn = document.getElementById('voteDisagreeModalBtn');
                const agreeBtn = document.getElementById('voteAgreeBtn');
                const disagreeBtn = document.getElementById('voteDisagreeBtn');
                
                console.log('Button elements found:', {
                    agreeModalBtn: !!agreeModalBtn,
                    disagreeModalBtn: !!disagreeModalBtn,
                    agreeBtn: !!agreeBtn,
                    disagreeBtn: !!disagreeBtn
                });
                
                if (agreeModalBtn) {
                    agreeModalBtn.addEventListener('click', () => {
                        console.log('Agree modal button clicked');
                        submitVote('agree');
                    });
                    console.log('Agree modal button listener added');
                } else {
                    console.error('Agree modal button not found!');
                }
                
                if (disagreeModalBtn) {
                    disagreeModalBtn.addEventListener('click', () => {
                        console.log('Disagree modal button clicked');
                        submitVote('disagree');
                    });
                    console.log('Disagree modal button listener added');
                } else {
                    console.error('Disagree modal button not found!');
                }
                
                if (agreeBtn) {
                    agreeBtn.addEventListener('click', () => {
                        console.log('Agree button clicked');
                        changeVote('agree');
                    });
                } else {
                    console.error('Agree button not found!');
                }
                
                if (disagreeBtn) {
                    disagreeBtn.addEventListener('click', () => {
                        console.log('Disagree button clicked');
                        changeVote('disagree');
                    });
                } else {
                    console.error('Disagree button not found!');
                }
                
                initDemoVotes();
                updateVoteDisplay();
                loadDebateMessagesFromD1(); // ディベートメッセージを読み込み
                loadCommentsFromD1(); // コメントを読み込み
                
                // リアルタイム同期を開始
                startRealtimeSync();
                
                // localStorageから投票を復元
                const storageKey = 'debate_vote_' + DEBATE_ID + '_' + currentUser.user_id;
                const savedVote = localStorage.getItem(storageKey);
                
                if (savedVote) {
                    // 既に投票済み - モーダルをスキップ
                    userVote = savedVote;
                    hasVoted = true;
                    document.getElementById('voteModal').classList.add('hidden');
                    highlightSelectedButton(savedVote);
                    console.log('Restored vote from localStorage:', savedVote);
                } else {
                    // 未投票 - モーダルを表示
                    document.getElementById('voteModal').classList.remove('hidden');
                    console.log('No saved vote, showing modal');
                }
                
                // コメントボタンのイベントリスナー
                const postCommentBtn = document.getElementById('postCommentBtn');
                const clearCommentBtn = document.getElementById('clearCommentBtn');
                
                if (postCommentBtn) {
                    postCommentBtn.addEventListener('click', postComment);
                }
                
                if (clearCommentBtn) {
                    clearCommentBtn.addEventListener('click', clearCommentInput);
                }
                
                console.log('Initialization complete!');
            });
