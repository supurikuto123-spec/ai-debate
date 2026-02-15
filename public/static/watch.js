            // Debate and User data
            const appData = document.getElementById('app-data');
            if (!appData) {
                console.error('CRITICAL: app-data element not found!');
                throw new Error('App data element not found');
            }
            
            console.log('App data element:', appData);
            console.log('Dataset:', appData.dataset);
            
            const DEBATE_ID = appData.dataset.debateId;
            const DEBATE_THEME = appData.dataset.debateTheme;
            const OPINION_A = appData.dataset.opinionA;
            const OPINION_B = appData.dataset.opinionB;
            const currentUser = {
                user_id: appData.dataset.userId,
                credits: parseInt(appData.dataset.userCredits)
            };
            
            console.log('DEBATE_ID:', DEBATE_ID);
            console.log('DEBATE_THEME:', DEBATE_THEME);
            console.log('OPINION_A:', OPINION_A);
            console.log('OPINION_B:', OPINION_B);
            console.log('currentUser:', currentUser);

            // Vote state
            let userVote = null;
            let hasVoted = false;
            let voteData = {
                agree: 5,
                disagree: 5,
                total: 10
            };
            
            console.log('Initial votes (5:5):', voteData);
            
            // AI評価システム用グローバル変数
            let aiVotesDistribution = { agree: 0, disagree: 0 };
            let lastHumanVoterCount = 0;
            let fogMode = false;
            let finalVotingMode = false;
            
            // AI審査官の立場を保持
            let aiJudgeStances = {
                judge1: null, // 'agree' or 'disagree'
                judge2: null,
                judge3: null
            };

            // D1から投票をロード（ランダム票を保護するため無効化）
            async function loadVotesFromD1() {
                console.log('D1 vote loading disabled to protect initial 5:5 votes');
            }

            // 10秒ごとにランダム変動（常に合計10票を維持、5:5近辺で揺らぐ）
            setInterval(() => {
                // 1〜2票をランダムに入れ替え（5:5付近を維持）
                const swapCount = Math.random() < 0.5 ? 1 : 2;
                
                for (let i = 0; i < swapCount; i++) {
                    if (Math.random() < 0.5) {
                        if (voteData.agree > 3) { // 最低3票は維持
                            voteData.agree--;
                            voteData.disagree++;
                        }
                    } else {
                        if (voteData.disagree > 3) {
                            voteData.disagree--;
                            voteData.agree++;
                        }
                    }
                }
                
                voteData.total = voteData.agree + voteData.disagree;
                updateVoteDisplay();
            }, 10000);

            // Submit initial vote from modal
            async function submitVote(side) {
                userVote = side;
                hasVoted = true;
                voteData[side]++;
                voteData.total++;

                // localStorageに保存
                const storageKey = 'debate_vote_' + DEBATE_ID + '_' + currentUser.user_id;
                localStorage.setItem(storageKey, side);

                // D1に保存
                try {
                    await fetch('/api/vote', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            debateId: DEBATE_ID,
                            userId: currentUser.user_id,
                            vote: side
                        })
                    });
                } catch (error) {
                    console.error('Failed to save vote:', error);
                }

                // Hide modal
                document.getElementById('voteModal').classList.add('hidden');

                // Update UI
                updateVoteDisplay();
                updateViewerCount();
                highlightSelectedButton(side);
                
                showToast('投票が完了しました！観戦を開始します');
            }
            window.submitVote = submitVote;

            // Change vote (also works as initial vote)
            async function changeVote(side) {
                if (!hasVoted) {
                    await submitVote(side);
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

                // D1に保存
                try {
                    await fetch('/api/vote', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            debateId: DEBATE_ID,
                            userId: currentUser.user_id,
                            vote: side
                        })
                    });
                } catch (error) {
                    console.error('Failed to update vote:', error);
                }

                // Update UI
                updateVoteDisplay();
                updateViewerCount();
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
                if (fogMode) {
                    document.getElementById('agreePercent').textContent = '???';
                    document.getElementById('disagreePercent').textContent = '???';
                    document.getElementById('agreePercentSymbol').textContent = '';
                    document.getElementById('disagreePercentSymbol').textContent = '';
                    document.getElementById('voteStatus').innerHTML = '<i class="fas fa-eye-slash mr-2"></i>非公開中 - 投票確定で解除';
                    document.getElementById('agreeBar').style.width = '50%';
                    document.getElementById('disagreeBar').style.width = '50%';
                    
                    // AI審査員も「???」表示（立場が確定済みでも霧中は隠す）
                    ['judge1-eval', 'judge2-eval', 'judge3-eval'].forEach(id => {
                        const elem = document.getElementById(id);
                        if (elem) {
                            elem.textContent = '???';
                            elem.className = 'text-sm text-gray-400 cursor-pointer';
                            elem.title = '投票確定で立場が公開されます';
                        }
                    });
                    return;
                }
                
                if (voteData.total > 0) {
                    const agreePercent = Math.round((voteData.agree / voteData.total) * 100);
                    const disagreePercent = 100 - agreePercent;

                    document.getElementById('agreePercent').textContent = agreePercent;
                    document.getElementById('disagreePercent').textContent = disagreePercent;
                    document.getElementById('agreePercentSymbol').textContent = '% (' + voteData.agree + '票)';
                    document.getElementById('disagreePercentSymbol').textContent = '% (' + voteData.disagree + '票)';
                    document.getElementById('voteStatus').innerHTML = '<i class="fas fa-users mr-2"></i>総投票数: ' + voteData.total.toLocaleString() + '人';
                    document.getElementById('agreeBar').style.width = agreePercent + '%';
                    document.getElementById('disagreeBar').style.width = disagreePercent + '%';
                    
                    updateViewerCount();
                    
                    // AI審査官の立場を表示（霧モードでない場合）
                    updateJudgeDisplay();
                } else {
                    document.getElementById('agreePercent').textContent = '--';
                    document.getElementById('disagreePercent').textContent = '--';
                    document.getElementById('agreePercentSymbol').textContent = '';
                    document.getElementById('disagreePercentSymbol').textContent = '';
                    document.getElementById('voteStatus').innerHTML = '<i class="fas fa-hourglass-half mr-2"></i>投票を待っています';
                    document.getElementById('agreeBar').style.width = '50%';
                    document.getElementById('disagreeBar').style.width = '50%';
                }
            }
            
            // AI審査官の立場を更新表示
            function updateJudgeDisplay() {
                const judges = [
                    { id: 'judge1-eval', stance: aiJudgeStances.judge1 },
                    { id: 'judge2-eval', stance: aiJudgeStances.judge2 },
                    { id: 'judge3-eval', stance: aiJudgeStances.judge3 }
                ];
                
                judges.forEach(judge => {
                    const elem = document.getElementById(judge.id);
                    if (!elem) return;
                    
                    if (judge.stance) {
                        const winner = judge.stance === 'agree' ? '意見A' : '意見B';
                        const color = judge.stance === 'agree' ? 'text-green-400' : 'text-red-400';
                        const icon = judge.stance === 'agree' ? 'fa-check-circle' : 'fa-times-circle';
                        elem.className = 'text-sm font-bold ' + color;
                        elem.innerHTML = '<i class="fas ' + icon + ' mr-1"></i>' + winner + ' 優勢';
                    } else {
                        elem.className = 'text-sm text-gray-400';
                        elem.textContent = '評価中...';
                    }
                });
            }

            // Post comment
            async function postComment() {
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

                // Check for !sa command (dev user only) - ディベート開始 + アーカイブ自動保存
                if (text === '!sa' && currentUser.user_id === 'dev') {
                    input.value = '';
                    showToast('ディベートを開始します（アーカイブ保存有効）...');
                    window.archiveOnComplete = true;
                    startDebate();
                    return;
                }

                // Check for !dela command (dev user only) - コメント+ディベート削除
                if (text === '!dela' && currentUser.user_id === 'dev') {
                    input.value = '';
                    const commentsList = document.getElementById('commentsList');
                    commentsList.innerHTML = '';
                    const debateMessages = document.getElementById('debateMessages');
                    debateMessages.innerHTML = '<div class="text-center text-gray-400 p-8"><i class="fas fa-info-circle text-4xl mb-4 text-cyan-400"></i><p class="text-lg">devユーザーでコメント欄に <span class="text-cyan-300 font-bold">!s</span> と入力してディベートを開始</p></div>';
                    conversationHistory = [];
                    debateActive = false;
                    lastCommentCount = 0;
                    lastMessageCount = 0;
                    document.getElementById('commentCount').textContent = '0';
                    
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
                        if (debateTimer) clearTimeout(debateTimer);
                        conversationHistory = [];
                        
                        const commentInput = document.getElementById('commentInput');
                        if (commentInput) {
                            commentInput.disabled = false;
                            commentInput.placeholder = 'コメントを入力...';
                        }
                        const commentBtn = document.getElementById('postCommentBtn');
                        if (commentBtn) {
                            commentBtn.disabled = false;
                            commentBtn.style.opacity = '1';
                        }
                        
                        showToast('ディベートを停止しました（新規開始可能）');
                    } else {
                        showToast('ディベートは実行されていません');
                    }
                    return;
                }

                // Check for !deld command (dev user only)
                if (text === '!deld' && currentUser.user_id === 'dev') {
                    input.value = '';
                    const debateMessages = document.getElementById('debateMessages');
                    debateMessages.innerHTML = '<div class="text-center text-gray-400 p-8"><i class="fas fa-info-circle text-4xl mb-4 text-cyan-400"></i><p class="text-lg">devユーザーでコメント欄に <span class="text-cyan-300 font-bold">!s</span> と入力してディベートを開始</p></div>';
                    conversationHistory = [];
                    debateActive = false;
                    
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
                const wasAtBottom = commentsList.scrollHeight - commentsList.scrollTop - commentsList.clientHeight < 5;
                
                const commentDiv = document.createElement('div');
                const stanceClass = userVote === 'agree' ? 'comment-agree' : 'comment-disagree';
                const stanceColor = userVote === 'agree' ? 'green' : 'red';
                const stanceIcon = userVote === 'agree' ? 'thumbs-up' : 'thumbs-down';
                const stanceText = userVote === 'agree' ? '意見A支持' : '意見B支持';
                const avatarGradient = userVote === 'agree' ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500';
                
                const formattedText = text;
                
                commentDiv.className = 'comment-item ' + stanceClass + ' bg-gray-900/50 p-3 rounded border border-cyan-500/30';
                
                const initial = currentUser.user_id.charAt(0).toUpperCase();
                commentDiv.innerHTML = '<div class="flex items-center mb-2"><div class="w-8 h-8 rounded-full bg-gradient-to-br ' + avatarGradient + ' flex items-center justify-center text-xs font-bold mr-2">' + initial + '</div><div class="flex-1"><p class="text-sm font-bold">@' + currentUser.user_id + '</p><p class="text-xs text-' + stanceColor + '-400"><i class="fas fa-' + stanceIcon + ' mr-1"></i>' + stanceText + '</p></div></div><p class="text-sm text-gray-200">' + formattedText + '</p>';

                commentsList.appendChild(commentDiv);
                
                if (wasAtBottom) {
                    requestAnimationFrame(() => {
                        commentsList.scrollTop = commentsList.scrollHeight;
                    });
                }

                saveCommentToD1(text);
                lastCommentCount++;

                const count = parseInt(document.getElementById('commentCount').textContent);
                document.getElementById('commentCount').textContent = count + 1;

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
            async function getAIEvaluations(message, side) {
                try {
                    await performAIVoting(side);
                    
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
                    const fullDebate = conversationHistory.map(msg => {
                        const sideName = msg.side === 'agree' ? '意見A' : '意見B';
                        return '[' + sideName + ']: ' + msg.content;
                    }).join('\n');
                    
                    const prompt = [
                        '直近3発言：',
                        fullDebate.split('\n').slice(-3).join('\n'),
                        '',
                        '最新「' + message + '」を評価：',
                        '1. 立場を守っているか',
                        '2. 相手を認めていないか',
                        '3. 具体的に反論しているか',
                        '',
                        '評価基準：',
                        '!! = 決定的 / ! = 優勢 / ? = 劣勢 / ?? = 致命的',
                        '',
                        '【重要】必ずJSON形式で返してください。他の文章は不要です。',
                        '出力例: {"symbol": "!!", "comment": "決定的な主張"}',
                        '出力形式: {"symbol": "!!" or "!" or "?" or "??" or null, "comment": "15字以内"}'
                    ].join('\n');

                    const response = await fetch('/api/debate/evaluate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prompt })
                    });
                    
                    const data = await response.json();
                    
                    try {
                        const result = JSON.parse(data.message);
                        if (result.symbol && ['!!', '!', '?', '??'].includes(result.symbol)) {
                            return { symbol: result.symbol, comment: result.comment || '評価中...', support: side, shouldVote: true };
                        } else {
                            return { symbol: null, comment: '', support: side, shouldVote: false };
                        }
                    } catch (e) {
                        const msg = data.message;
                        if (msg.includes('!!')) return { symbol: '!!', comment: '圧倒的な説得力', support: side, shouldVote: true };
                        if (msg.includes('??')) return { symbol: '??', comment: '意図不明', support: side, shouldVote: true };
                        if (msg.includes('!')) return { symbol: '!', comment: '有力な主張', support: side, shouldVote: true };
                        if (msg.includes('?')) return { symbol: '?', comment: '根拠不足', support: side, shouldVote: true };
                        return { symbol: null, comment: '', support: side, shouldVote: false };
                    }
                } catch (error) {
                    console.error('AI evaluation error:', error);
                    return { symbol: null, comment: '', support: side, shouldVote: false };
                }
            }
            
            // AI投票：3ターン目以降に判定
            async function performAIVoting(currentSide) {
                try {
                    const currentTurn = conversationHistory.length;
                    if (currentTurn < 3) return;
                    
                    const fullDebate = conversationHistory.map(msg => {
                        const sideName = msg.side === 'agree' ? '意見A' : '意見B';
                        return '[' + sideName + ']: ' + msg.content;
                    }).join('\n');
                    
                    // 3つのAIに並列で評価
                    const judgments = await Promise.all([
                        getAIJudgment(fullDebate, 'AI-Judge-1', 0.7),
                        getAIJudgment(fullDebate, 'AI-Judge-2', 0.8),
                        getAIJudgment(fullDebate, 'AI-Judge-3', 0.9)
                    ]);
                    
                    // AI審査官の立場を保存
                    judgments.forEach((judgment, index) => {
                        if (judgment && judgment.winner) {
                            const key = 'judge' + (index + 1);
                            aiJudgeStances[key] = judgment.winner;
                        }
                    });
                    
                    // 霧モードでなければ表示更新
                    if (!fogMode) {
                        updateJudgeDisplay();
                    }
                    
                    // AI票を追加（人間投票者数に基づいて配分）
                    const currentAIVotes = aiVotesDistribution.agree + aiVotesDistribution.disagree;
                    const currentHumanVoters = voteData.total - currentAIVotes;
                    const targetAIVotesTotal = currentHumanVoters;
                    const currentAITotal = aiVotesDistribution.agree + aiVotesDistribution.disagree;
                    
                    if (targetAIVotesTotal > currentAITotal) {
                        const votesToAdd = targetAIVotesTotal - currentAITotal;
                        const votesPerAI = Math.floor(votesToAdd / 3);
                        
                        if (votesPerAI > 0) {
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
                            
                            updateVoteDisplay();
                        }
                    }
                } catch (error) {
                    console.error('AI voting error:', error);
                }
            }
            
            async function getAIJudgment(fullDebate, aiName, temperature) {
                try {
                    const prompt = [
                        'テーマ：' + DEBATE_THEME,
                        '意見A：' + OPINION_A,
                        '意見B：' + OPINION_B,
                        '',
                        '以下のディベート全体を評価してください：',
                        fullDebate,
                        '',
                        '以下の観点で総合的に判定：',
                        '1. 立場の一貫性（ぶれていないか）',
                        '2. 具体性（データ・事例があるか）',
                        '3. 論理性（相手の弱点を指摘できているか）',
                        '',
                        'どちらが現時点で優勢か判定してください。',
                        '必ずJSON形式で返してください: {"winner": "agree"} or {"winner": "disagree"}'
                    ].join('\n');
                    
                    const response = await fetch('/api/debate/evaluate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prompt })
                    });
                    
                    const data = await response.json();
                    try {
                        const result = JSON.parse(data.message);
                        return result;
                    } catch {
                        const msg = (data.message || '').toLowerCase();
                        const hasAgree = msg.includes('意見a') || msg.includes('agree');
                        const hasDisagree = msg.includes('意見b') || msg.includes('disagree');
                        
                        if (hasAgree && !hasDisagree) return { winner: 'agree' };
                        if (hasDisagree && !hasAgree) return { winner: 'disagree' };
                        return { winner: Math.random() < 0.5 ? 'agree' : 'disagree' };
                    }
                } catch (error) {
                    console.error('AI judgment error:', error);
                    return { winner: Math.random() < 0.5 ? 'agree' : 'disagree' };
                }
            }
            
            function displayAIEvaluation(evaluation, side) {
                if (!evaluation || !evaluation.symbol) return;
                
                const container = document.getElementById('debateMessages');
                const bubbles = container.querySelectorAll('.bubble');
                const lastBubble = bubbles[bubbles.length - 1];
                
                if (!lastBubble) return;
                if (lastBubble.querySelector('.ai-eval-icon')) return;
                
                let symbolHtml = '';
                
                if (evaluation.symbol === '!!') {
                    symbolHtml = '<div class="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg" style="filter: drop-shadow(0 0 4px rgba(16, 185, 129, 0.8));"><span class="text-white text-xl font-bold">!!</span></div>';
                } else if (evaluation.symbol === '!') {
                    symbolHtml = '<div class="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg" style="filter: drop-shadow(0 0 4px rgba(16, 185, 129, 0.8));"><span class="text-white text-xl font-bold">!</span></div>';
                } else if (evaluation.symbol === '?') {
                    symbolHtml = '<div class="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shadow-lg" style="filter: drop-shadow(0 0 4px rgba(245, 158, 11, 0.8));"><span class="text-white text-xl font-bold">?</span></div>';
                } else if (evaluation.symbol === '??') {
                    symbolHtml = '<div class="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shadow-lg" style="filter: drop-shadow(0 0 4px rgba(239, 68, 68, 0.8));"><span class="text-white text-xl font-bold">??</span></div>';
                }
                
                const iconDiv = document.createElement('div');
                iconDiv.className = 'ai-eval-icon absolute top-2 ' + (side === 'agree' ? 'left-2' : 'right-2');
                iconDiv.innerHTML = symbolHtml;
                
                lastBubble.style.position = 'relative';
                lastBubble.appendChild(iconDiv);
            }
            
            // ???解除：投票確定で霧モードを解除
            function revealFogMode() {
                if (!fogMode) return;
                
                fogMode = false;
                
                // ゲージを復活
                const agreeBar = document.getElementById('agreeBar');
                const disagreeBar = document.getElementById('disagreeBar');
                agreeBar.style.filter = 'none';
                disagreeBar.style.filter = 'none';
                agreeBar.style.background = '';
                disagreeBar.style.background = '';
                agreeBar.style.transition = 'width 0.5s ease';
                disagreeBar.style.transition = 'width 0.5s ease';
                
                // 投票ボタンを無効化
                document.getElementById('voteAgreeBtn').disabled = true;
                document.getElementById('voteDisagreeBtn').disabled = true;
                document.getElementById('voteAgreeBtn').style.opacity = '0.5';
                document.getElementById('voteDisagreeBtn').style.opacity = '0.5';
                
                // 数値を表示
                updateVoteDisplay();
                showToast('投票が確定されました！結果が公開されます');
            }
            
            // 最終投票モーダルを表示
            function showFinalVotingModal() {
                finalVotingMode = true;
                
                const modalHTML = '<div id="finalVoteModal" class="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50"><div class="bg-gray-900 border-4 border-cyan-500 rounded-lg p-8 max-w-lg w-full mx-4 shadow-2xl"><h2 class="text-3xl font-bold text-cyan-400 mb-4 text-center"><i class="fas fa-gavel mr-2"></i>最終判定</h2><p class="text-white text-center mb-6">ディベート終了！<br><span class="text-cyan-300">1分以内</span>に最終的な支持を決定してください。</p><div class="grid grid-cols-2 gap-4"><button id="finalVoteAgree" class="bg-green-500/20 border-2 border-green-500 hover:bg-green-500/40 p-6 rounded transition-all"><i class="fas fa-check-circle text-4xl mb-2"></i><p class="font-bold">意見Aを支持</p></button><button id="finalVoteDisagree" class="bg-red-500/20 border-2 border-red-500 hover:bg-red-500/40 p-6 rounded transition-all"><i class="fas fa-times-circle text-4xl mb-2"></i><p class="font-bold">意見Bを支持</p></button></div><p class="text-xs text-gray-400 text-center mt-4">未選択の場合、現在の投票がそのまま反映されます</p></div></div>';
                document.body.insertAdjacentHTML('beforeend', modalHTML);
                
                document.getElementById('finalVoteAgree').addEventListener('click', () => submitFinalVote('agree'));
                document.getElementById('finalVoteDisagree').addEventListener('click', () => submitFinalVote('disagree'));
                
                setTimeout(() => finalizeFinalVote(), 60000);
            }
            
            function submitFinalVote(side) {
                if (hasVoted && userVote !== side) {
                    voteData[userVote]--;
                    voteData[side]++;
                    userVote = side;
                    
                    const storageKey = 'debate_vote_' + DEBATE_ID + '_' + currentUser.user_id;
                    localStorage.setItem(storageKey, side);
                }
                
                const modal = document.getElementById('finalVoteModal');
                if (modal) modal.remove();
                
                showToast('最終投票を受け付けました！');
                
                setTimeout(() => performFinalAIJudgment(), 2000);
            }
            
            function finalizeFinalVote() {
                const modal = document.getElementById('finalVoteModal');
                if (modal) modal.remove();
                
                showToast('時間切れ！現在の投票で確定しました。');
                setTimeout(() => performFinalAIJudgment(), 2000);
            }
            
            async function performFinalAIJudgment() {
                showToast('AIによる最終評価を実施中...');
                
                const fullDebate = conversationHistory.map(msg => msg.content).join('\n');
                
                try {
                    const judgments = await Promise.all([
                        getFinalJudgment(fullDebate, 'AI-Judge-1', 0.7),
                        getFinalJudgment(fullDebate, 'AI-Judge-2', 0.8),
                        getFinalJudgment(fullDebate, 'AI-Judge-3', 0.9)
                    ]);
                    
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
                    
                    displayFinalResults(judgments);
                } catch (error) {
                    console.error('Final judgment error:', error);
                    showToast('AI評価エラー');
                }
            }
            
            async function getFinalJudgment(debate, aiName, temperature) {
                try {
                    const prompt = [
                        '以下のディベート全体を評価してください：',
                        debate,
                        '',
                        'あなたは' + aiName + 'です。どちらが説得力があったか判定し、理由を簡潔に述べてください（50文字以内）。',
                        '必ずJSON形式で返してください: {"winner": "agree" or "disagree", "reason": "50字以内"}'
                    ].join('\n');
                    
                    const response = await fetch('/api/debate/evaluate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prompt })
                    });
                    
                    const data = await response.json();
                    try {
                        return JSON.parse(data.message);
                    } catch {
                        return { winner: Math.random() < 0.5 ? 'agree' : 'disagree', reason: '評価中...' };
                    }
                } catch (error) {
                    return null;
                }
            }
            
            function displayFinalResults(judgments) {
                // 霧モードを解除
                fogMode = false;
                document.getElementById('agreeBar').style.filter = 'none';
                document.getElementById('disagreeBar').style.filter = 'none';
                document.getElementById('agreeBar').style.background = '';
                document.getElementById('disagreeBar').style.background = '';
                
                updateVoteDisplay();
                
                const winner = voteData.agree > voteData.disagree ? '意見A' : '意見B';
                const winnerColor = voteData.agree > voteData.disagree ? 'text-green-400' : 'text-red-400';
                
                const judgmentComments = judgments.map((j, i) => {
                    const judgeNum = i + 1;
                    const reason = j ? (j.reason || '評価中...') : '評価中...';
                    const judgeWinner = j ? (j.winner === 'agree' ? '意見A支持' : '意見B支持') : '不明';
                    const judgeColor = j ? (j.winner === 'agree' ? 'text-green-400' : 'text-red-400') : 'text-gray-400';
                    return '<div class="mb-2"><span class="text-cyan-400 font-bold">AI-Judge-' + judgeNum + ':</span> <span class="' + judgeColor + '">' + judgeWinner + '</span> - ' + reason + '</div>';
                }).join('');
                
                const resultHTML = '<div id="resultModal" class="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50"><div class="bg-gray-900 border-4 border-cyan-500 rounded-lg p-8 max-w-2xl w-full mx-4 shadow-2xl"><h2 class="text-4xl font-bold text-cyan-400 mb-6 text-center"><i class="fas fa-trophy mr-2"></i>ディベート結果</h2><div class="text-center mb-6"><p class="text-2xl mb-2">勝者:</p><p class="text-5xl font-bold ' + winnerColor + '">' + winner + '</p></div><div class="bg-gray-800 p-4 rounded mb-6"><h3 class="text-xl font-bold text-cyan-400 mb-4">最終投票結果</h3><div class="grid grid-cols-2 gap-4 text-center"><div><p class="text-3xl font-bold text-green-400">' + voteData.agree + '</p><p class="text-sm text-gray-400">意見A支持</p></div><div><p class="text-3xl font-bold text-red-400">' + voteData.disagree + '</p><p class="text-sm text-gray-400">意見B支持</p></div></div></div><div class="bg-gray-800 p-4 rounded mb-6"><h3 class="text-xl font-bold text-cyan-400 mb-4">AI審査員の評価</h3><div class="text-sm text-white">' + judgmentComments + '</div></div><button onclick="location.href=\'/main\'" class="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 rounded"><i class="fas fa-home mr-2"></i>メインに戻る</button></div></div>';
                document.body.insertAdjacentHTML('beforeend', resultHTML);
                
                // !saコマンドが使われた場合、アーカイブに保存
                if (window.archiveOnComplete) {
                    const agreePercent = Math.round((voteData.agree / voteData.total) * 100);
                    const disagreePercent = 100 - agreePercent;
                    saveToArchive(winner, agreePercent, disagreePercent);
                }
            }
            
            // アーカイブ保存関数
            async function saveToArchive(winner, agreePercent, disagreePercent) {
                try {
                    const aiJudgesVotes = [
                        { judge: 'Judge-GPT', vote: aiJudgeStances.judge1 || 'agree' },
                        { judge: 'Judge-Claude', vote: aiJudgeStances.judge2 || 'disagree' },
                        { judge: 'Judge-Gemini', vote: aiJudgeStances.judge3 || 'agree' }
                    ];
                    
                    const response = await fetch('/api/archive/save', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            debate_id: DEBATE_ID,
                            title: DEBATE_THEME,
                            topic: DEBATE_THEME,
                            agree_position: OPINION_A,
                            disagree_position: OPINION_B,
                            agree_votes: voteData.agree,
                            disagree_votes: voteData.disagree,
                            winner: winner === '意見A' ? 'agree' : 'disagree',
                            messages: JSON.stringify(conversationHistory),
                            ai_judges_votes: JSON.stringify(aiJudgesVotes)
                        })
                    });
                    
                    const result = await response.json();
                    if (result.success) {
                        showToast('ディベートがアーカイブに保存されました');
                        window.archiveOnComplete = false;
                    } else {
                        console.error('Archive save failed:', result.error);
                        showToast('アーカイブ保存に失敗: ' + (result.error || '不明なエラー'));
                    }
                } catch (error) {
                    console.error('Archive save error:', error);
                    showToast('アーカイブ保存エラー');
                }
            }

            // Debate timer reference
            let debateTimer = null;

            // 観戦人数を実データに更新
            function updateViewerCount() {
                document.getElementById('viewerCount').textContent = voteData.total.toLocaleString();
            }
            
            setInterval(updateViewerCount, 2000);

            // Debate system
            let debateActive = false;
            let debateStartTime = 0;
            const MAX_DEBATE_TIME = 60;
            const MAX_CHARS = 150;
            
            document.getElementById('debateTimeLimit').textContent = MAX_DEBATE_TIME + '秒';
            document.getElementById('debateCharLimit').textContent = MAX_CHARS + '文字';
            
            let conversationHistory = [];
            let aiVotes = { agree: 0, disagree: 0 };
            let aiJudges = [];

            async function startDebate() {
                if (debateActive) {
                    showToast('ディベートは既に実行中です');
                    return;
                }
                
                debateActive = true;
                debateStartTime = Date.now();
                conversationHistory = [];
                aiJudgeStances = { judge1: null, judge2: null, judge3: null };
                
                const startTimeElement = document.getElementById('debateStartTime');
                if (startTimeElement) {
                    const date = new Date(debateStartTime);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    const hours = String(date.getHours()).padStart(2, '0');
                    const minutes = String(date.getMinutes()).padStart(2, '0');
                    startTimeElement.textContent = year + '/' + month + '/' + day + ' ' + hours + ':' + minutes + ' 開始';
                }
                
                const debateMessages = document.getElementById('debateMessages');
                debateMessages.innerHTML = '<div class="text-center text-cyan-300 p-4"><i class="fas fa-spinner fa-spin mr-2"></i>ディベート開始...</div>';
                
                updateDebateTimer();
                await generateAIResponse('agree');
            }

            function updateDebateTimer() {
                if (!debateActive) return;
                
                const elapsed = Math.floor((Date.now() - debateStartTime) / 1000);
                const remaining = MAX_DEBATE_TIME - elapsed;
                
                // 残り10%で霧モードオン
                if (remaining <= MAX_DEBATE_TIME * 0.1 && !fogMode && !finalVotingMode) {
                    fogMode = true;
                    showToast('ゲージ非公開化！残り時間わずか。投票を確定して結果を見よう！');
                    
                    const agreeBar = document.getElementById('agreeBar');
                    const disagreeBar = document.getElementById('disagreeBar');
                    agreeBar.style.transition = 'none';
                    disagreeBar.style.transition = 'none';
                    agreeBar.style.filter = 'blur(20px)';
                    disagreeBar.style.filter = 'blur(20px)';
                    agreeBar.style.background = 'linear-gradient(90deg, #333, #555, #333)';
                    disagreeBar.style.background = 'linear-gradient(90deg, #333, #555, #333)';
                    
                    updateVoteDisplay();
                }
                
                if (remaining <= 0) {
                    debateActive = false;
                    startFinalVotingPeriod();
                    return;
                }
                
                const minutes = Math.floor(remaining / 60);
                const seconds = remaining % 60;
                document.getElementById('remainingTime').textContent = minutes + ':' + seconds.toString().padStart(2, '0');
                
                debateTimer = setTimeout(updateDebateTimer, 1000);
            }

            // 最終投票期間（1分間）
            function startFinalVotingPeriod() {
                showToast('ディベート終了！1分以内に最終投票を確定してください');
                
                const confirmBtn = document.createElement('button');
                confirmBtn.id = 'confirmVoteBtn';
                confirmBtn.className = 'w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 px-6 rounded-lg text-xl mt-6 transition-all animate-pulse';
                confirmBtn.innerHTML = '<i class="fas fa-check-circle mr-2"></i>投票を確定する（???を解除）';
                
                const predictionSection = document.querySelector('.vote-prediction-btn').parentElement.parentElement;
                predictionSection.appendChild(confirmBtn);
                
                let finalVotingTimeLeft = 60;
                let userConfirmed = false;
                
                const countdownDiv = document.createElement('div');
                countdownDiv.id = 'finalCountdown';
                countdownDiv.className = 'text-center text-xl text-cyan-400 mt-4';
                countdownDiv.textContent = '残り時間: 60秒';
                predictionSection.appendChild(countdownDiv);
                
                // 確定ボタンクリック → ???解除
                confirmBtn.addEventListener('click', () => {
                    if (!hasVoted) {
                        showToast('エラー: まず意見を選択してください');
                        return;
                    }
                    userConfirmed = true;
                    confirmBtn.disabled = true;
                    confirmBtn.classList.remove('animate-pulse');
                    confirmBtn.textContent = '投票確定済み - 結果を待っています...';
                    
                    // ???解除
                    revealFogMode();
                });
                
                const finalTimer = setInterval(() => {
                    finalVotingTimeLeft--;
                    countdownDiv.textContent = '残り時間: ' + finalVotingTimeLeft + '秒';
                    
                    if (finalVotingTimeLeft <= 0) {
                        clearInterval(finalTimer);
                        
                        if (!hasVoted) {
                            showToast('エラー: 投票が必要です');
                            document.getElementById('voteModal').classList.remove('hidden');
                            return;
                        }
                        
                        if (!userConfirmed) {
                            showToast('時間切れ - 現在の選択で自動確定しました');
                            revealFogMode();
                        }
                        
                        showFinalResults();
                    }
                }, 1000);
            }

            // 最終結果表示
            function showFinalResults() {
                const commentInput = document.getElementById('commentInput');
                if (commentInput) {
                    commentInput.disabled = true;
                    commentInput.placeholder = 'ディベートが終了しました';
                }
                const commentBtn = document.getElementById('postCommentBtn');
                if (commentBtn) {
                    commentBtn.disabled = true;
                    commentBtn.style.opacity = '0.5';
                }
                
                const agreePercent = Math.round((voteData.agree / voteData.total) * 100);
                const disagreePercent = 100 - agreePercent;
                const winner = voteData.agree > voteData.disagree ? '意見A' : '意見B';
                const winnerColor = voteData.agree > voteData.disagree ? 'text-green-400' : 'text-red-400';
                
                const resultModal = document.createElement('div');
                resultModal.className = 'fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50';
                resultModal.innerHTML = '<div class="cyber-card max-w-3xl w-full mx-4"><h2 class="text-4xl font-bold text-center mb-8"><i class="fas fa-trophy mr-3 text-yellow-400"></i>最終結果</h2><div class="text-center mb-8"><p class="text-2xl mb-4">勝者</p><p class="text-5xl font-bold ' + winnerColor + ' mb-4">' + winner + '</p></div><div class="grid grid-cols-2 gap-6 mb-8"><div class="text-center p-6 bg-green-500/20 rounded"><p class="text-xl mb-2">意見A</p><p class="text-sm text-cyan-300 mb-3"><i class="fas fa-brain mr-2"></i>GPT-4o</p><p class="text-4xl font-bold text-green-400">' + agreePercent + '%</p><p class="text-sm text-gray-400 mt-2">' + voteData.agree + ' 票</p></div><div class="text-center p-6 bg-red-500/20 rounded"><p class="text-xl mb-2">意見B</p><p class="text-sm text-purple-300 mb-3"><i class="fas fa-lightbulb mr-2"></i>Claude-3.5</p><p class="text-4xl font-bold text-red-400">' + disagreePercent + '%</p><p class="text-sm text-gray-400 mt-2">' + voteData.disagree + ' 票</p></div></div><div class="text-center"><p class="text-lg text-gray-400 mb-6">総投票数: ' + voteData.total + ' 人</p><button onclick="location.href=\'/main\'" class="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg"><i class="fas fa-home mr-2"></i>メインページへ</button></div></div>';
                
                document.body.appendChild(resultModal);
                
                if (window.archiveOnComplete) {
                    saveToArchive(winner, agreePercent, disagreePercent);
                }
            }

            async function generateAIResponse(side) {
                if (!debateActive) return;
                
                const lastOpponentMessage = conversationHistory.length > 0 
                    ? conversationHistory[conversationHistory.length - 1].content 
                    : '';
                
                const systemPrompt = 'あなたはディベートの参加者です。以下のルールを厳守してください：\n\n【厳守事項】\n1. 自分の立場を一貫して主張する\n2. 相手の立場の論点を認めない\n3. 相手の発言の矛盾・弱点を指摘する\n4. 具体的な根拠を示す（データ・事例・統計など）\n5. 180文字ぴったり、句点（。）で終える\n\n【禁止事項】\n- 相手の論点を認める表現（「確かに」「一方で」など）\n- 抽象的で曖昧な表現（「可能性がある」「考えられる」など）\n- 架空の統計や数値';
                
                let conversationToSend = conversationHistory;
                if (conversationHistory.length === 0) {
                    const initialContext = side === 'agree'
                        ? '【テーマ】' + DEBATE_THEME + '\n【あなたの立場】' + OPINION_A
                        : '【テーマ】' + DEBATE_THEME + '\n【あなたの立場】' + OPINION_B;
                    
                    conversationToSend = [{
                        side: side,
                        content: initialContext,
                        role: 'user'
                    }];
                }
                
                try {
                    const response = await fetch('/api/debate/generate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            systemPrompt,
                            conversationHistory: conversationToSend,
                            maxTokens: 220,
                            temperature: 0.7
                        })
                    });
                    
                    if (!response.ok) {
                        throw new Error('API request failed');
                    }
                    
                    const data = await response.json();
                    
                    if (data.message && debateActive) {
                        conversationHistory.push({
                            role: side === 'agree' ? 'assistant' : 'user',
                            content: data.message,
                            side: side
                        });
                        
                        const actualModel = data.model || 'gpt-4.1-nano';
                        
                        await addDebateMessageWithTyping(side, data.message, actualModel);
                        
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
                const aiModel = 'GPT-4o';
                const iconClass = side === 'agree' ? 'fa-brain' : 'fa-lightbulb';
                const gradientClass = side === 'agree' ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500';
                const opinionLabel = side === 'agree' ? '意見A' : '意見B';
                
                const bubbleHTML = '<div class="bubble ' + bubbleClass + ' p-4 text-white shadow-lg" style="width: 100%;"><div class="flex items-center gap-3 mb-2"><div class="w-8 h-8 rounded-full bg-gradient-to-br ' + gradientClass + ' flex items-center justify-center flex-shrink-0"><i class="fas ' + iconClass + ' text-sm"></i></div><span class="font-bold text-sm flex-shrink-0">' + aiModel + '</span><span class="text-xs opacity-75 flex-shrink-0">' + opinionLabel + '</span></div><div class="text-sm leading-relaxed" style="word-wrap: break-word; white-space: pre-wrap;">' + message + '</div></div>';
                
                container.insertAdjacentHTML('beforeend', bubbleHTML);
            }

            async function addDebateMessageWithTyping(side, message, actualModel) {
                return new Promise((resolve) => {
                const container = document.getElementById('debateMessages');
                
                const bubbleClass = side === 'agree' ? 'bubble-agree' : 'bubble-disagree';
                const aiModel = actualModel || 'GPT-4o';
                const iconClass = side === 'agree' ? 'fa-brain' : 'fa-lightbulb';
                const gradientClass = side === 'agree' ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500';
                const opinionLabel = side === 'agree' ? '意見A' : '意見B';
                
                const bubbleDiv = document.createElement('div');
                bubbleDiv.className = 'bubble ' + bubbleClass + ' p-4 text-white shadow-lg';
                bubbleDiv.style.width = '100%';
                bubbleDiv.style.position = 'relative';
                bubbleDiv.innerHTML = '<div class="flex items-center gap-3 mb-2"><div class="w-8 h-8 rounded-full bg-gradient-to-br ' + gradientClass + ' flex items-center justify-center flex-shrink-0"><i class="fas ' + iconClass + ' text-sm"></i></div><span class="font-bold text-sm flex-shrink-0">' + aiModel + '</span><span class="text-xs opacity-75 flex-shrink-0">' + opinionLabel + '</span></div><div class="text-sm leading-relaxed typing-text" style="word-wrap: break-word; white-space: pre-wrap;"></div>';
                
                const bottomDistance = container.scrollHeight - container.scrollTop - container.clientHeight;
                const wasAtBottom = bottomDistance < 5;
                
                container.appendChild(bubbleDiv);
                
                const textElement = bubbleDiv.querySelector('.typing-text');
                let charIndex = 0;
                const typingSpeed = 30;
                
                function typeChar() {
                    if (charIndex < message.length && debateActive) {
                        textElement.textContent += message.charAt(charIndex);
                        charIndex++;
                        
                        if (wasAtBottom) {
                            requestAnimationFrame(() => {
                                container.scrollTop = container.scrollHeight;
                            });
                        }
                        
                        setTimeout(typeChar, typingSpeed);
                    } else {
                        saveDebateMessageToD1(side, aiModel, message);
                        lastMessageCount++;
                        
                        const currentTurn = conversationHistory.length;
                        if (!fogMode && currentTurn >= 3) {
                            getAIEvaluations(message, side);
                        }
                        
                        resolve();
                    }
                }
                
                typeChar();
                });
            }

            async function saveDebateMessageToD1(side, model, content) {
                try {
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

            let lastMessageCount = 0;
            async function loadDebateMessagesFromD1() {
                try {
                    const response = await fetch('/api/debate/' + DEBATE_ID + '/messages');
                    const data = await response.json();
                    
                    if (data.messages && data.messages.length > 0) {
                        if (data.messages.length > lastMessageCount) {
                            for (let i = lastMessageCount; i < data.messages.length; i++) {
                                const msg = data.messages[i];
                                addDebateMessage(msg.side, msg.content);
                            }
                            lastMessageCount = data.messages.length;
                        }
                    }
                } catch (error) {
                    console.error('Failed to load debate messages:', error);
                }
            }

            let lastCommentCount = 0;
            async function loadCommentsFromD1() {
                try {
                    const response = await fetch('/api/comments/' + DEBATE_ID);
                    const data = await response.json();
                    
                    if (data.comments && data.comments.length > 0) {
                        const commentsList = document.getElementById('commentsList');
                        
                        if (data.comments.length > lastCommentCount) {
                            const newComments = data.comments.slice(lastCommentCount);
                            const wasAtBottom = commentsList.scrollHeight - commentsList.scrollTop - commentsList.clientHeight < 5;
                            
                            for (const comment of newComments) {
                                const stanceClass = comment.vote === 'agree' ? 'comment-agree' : 'comment-disagree';
                                const stanceColor = comment.vote === 'agree' ? 'green' : 'red';
                                const stanceIcon = comment.vote === 'agree' ? 'thumbs-up' : 'thumbs-down';
                                const stanceText = comment.vote === 'agree' ? '意見A支持' : '意見B支持';
                                const avatarGradient = comment.vote === 'agree' ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500';
                                const initial = comment.username.charAt(0).toUpperCase();
                                
                                const commentDiv = document.createElement('div');
                                commentDiv.className = 'comment-item ' + stanceClass + ' bg-gray-900/50 p-3 rounded border border-cyan-500/30';
                                commentDiv.innerHTML = '<div class="flex items-center mb-2"><div class="w-8 h-8 rounded-full bg-gradient-to-br ' + avatarGradient + ' flex items-center justify-center text-xs font-bold mr-2">' + initial + '</div><div class="flex-1"><p class="text-sm font-bold">@' + comment.username + '</p><p class="text-xs text-' + stanceColor + '-400"><i class="fas fa-' + stanceIcon + ' mr-1"></i>' + stanceText + '</p></div></div><p class="text-sm text-gray-200">' + comment.content + '</p>';
                                
                                commentsList.appendChild(commentDiv);
                            }
                            
                            if (wasAtBottom) {
                                requestAnimationFrame(() => {
                                    commentsList.scrollTop = commentsList.scrollHeight;
                                });
                            }
                            
                            // コメント数を更新
                            document.getElementById('commentCount').textContent = data.comments.length;
                            lastCommentCount = data.comments.length;
                        }
                    }
                } catch (error) {
                    console.error('Failed to load comments:', error);
                }
            }

            function startRealtimeSync() {
                setInterval(() => {
                    loadDebateMessagesFromD1();
                    loadCommentsFromD1();
                }, 2000);
            }

            // クレジット同期（ページロード時にDBから最新を取得）
            async function syncCredits() {
                try {
                    const response = await fetch('/api/user');
                    if (response.ok) {
                        const userData = await response.json();
                        if (userData.credits !== undefined) {
                            currentUser.credits = userData.credits;
                            // ナビバーのクレジット表示を更新
                            const creditDisplays = document.querySelectorAll('.credit-display span, .nav-credits');
                            creditDisplays.forEach(el => {
                                if (el.textContent.match(/\d+/) || el.textContent.includes('Credits')) {
                                    if (currentUser.user_id === 'dev') {
                                        el.textContent = el.textContent.includes('Credits') ? '∞ Credits' : '∞';
                                    }
                                }
                            });
                        }
                    }
                } catch (e) {
                    console.error('Credit sync error:', e);
                }
            }

            // Initialize on page load
            window.addEventListener('DOMContentLoaded', () => {
                console.log('Page loaded, initializing...');
                
                const agreeModalBtn = document.getElementById('voteAgreeModalBtn');
                const disagreeModalBtn = document.getElementById('voteDisagreeModalBtn');
                const agreeBtn = document.getElementById('voteAgreeBtn');
                const disagreeBtn = document.getElementById('voteDisagreeBtn');
                
                if (agreeModalBtn) {
                    agreeModalBtn.addEventListener('click', () => submitVote('agree'));
                }
                if (disagreeModalBtn) {
                    disagreeModalBtn.addEventListener('click', () => submitVote('disagree'));
                }
                if (agreeBtn) {
                    agreeBtn.addEventListener('click', () => changeVote('agree'));
                }
                if (disagreeBtn) {
                    disagreeBtn.addEventListener('click', () => changeVote('disagree'));
                }
                
                loadVotesFromD1();
                updateVoteDisplay();
                loadDebateMessagesFromD1();
                loadCommentsFromD1();
                startRealtimeSync();
                syncCredits();
                
                // localStorageから投票を復元
                const storageKey = 'debate_vote_' + DEBATE_ID + '_' + currentUser.user_id;
                const savedVote = localStorage.getItem(storageKey);
                
                if (savedVote) {
                    userVote = savedVote;
                    hasVoted = true;
                    document.getElementById('voteModal').classList.add('hidden');
                    highlightSelectedButton(savedVote);
                } else {
                    document.getElementById('voteModal').classList.remove('hidden');
                }
                
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
