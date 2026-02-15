// ===== Debate Watch Page - watch.js =====
// All data loaded from DB, no hardcoded sample values

const appData = document.getElementById('app-data');
if (!appData) {
    console.error('CRITICAL: app-data element not found!');
    throw new Error('App data element not found');
}

const DEBATE_ID = appData.dataset.debateId;
const currentUser = {
    user_id: appData.dataset.userId,
    credits: parseInt(appData.dataset.userCredits)
};

// These will be loaded from DB
let DEBATE_THEME = '';
let OPINION_A = '';
let OPINION_B = '';

// Vote state - starts at 5:5, no random changes, no AI votes
let userVote = null;
let hasVoted = false;
let voteData = { agree: 5, disagree: 5, total: 10 };

// Fog mode & AI judges
let fogMode = false;
let finalVotingMode = false;
let aiJudgeStances = { judge1: null, judge2: null, judge3: null };

// Debate state
let debateActive = false;
let debateStartTime = 0;
let debateTimer = null;
const MAX_DEBATE_TIME = 60;
const MAX_CHARS = 180;
let conversationHistory = [];
let lastMessageCount = 0;
let lastCommentCount = 0;

// Current AI model name (fetched from API)
let AI_MODEL_DISPLAY = 'gpt-4.1-nano';

// ===== Load debate theme from DB =====
async function loadDebateTheme() {
    try {
        const response = await fetch('/api/debate/' + DEBATE_ID + '/theme');
        if (!response.ok) return;
        const data = await response.json();
        
        DEBATE_THEME = data.topic || data.title || 'テーマ未設定';
        OPINION_A = data.agree_position || '意見A';
        OPINION_B = data.disagree_position || '意見B';
        
        // Update all UI elements with real data
        const titleEl = document.getElementById('debateTitle');
        if (titleEl) titleEl.textContent = DEBATE_THEME;
        
        const modalTheme = document.getElementById('modalTheme');
        if (modalTheme) modalTheme.textContent = DEBATE_THEME;
        
        const modalA = document.getElementById('modalOpinionA');
        if (modalA) modalA.textContent = OPINION_A;
        
        const modalB = document.getElementById('modalOpinionB');
        if (modalB) modalB.textContent = OPINION_B;
        
        const summaryA = document.getElementById('summaryOpinionA');
        if (summaryA) summaryA.textContent = OPINION_A;
        
        const summaryB = document.getElementById('summaryOpinionB');
        if (summaryB) summaryB.textContent = OPINION_B;
        
    } catch (error) {
        console.error('Failed to load debate theme:', error);
    }
}

// ===== Load AI Model Info =====
async function loadModelInfo() {
    try {
        const response = await fetch('/api/debate/model-info');
        if (!response.ok) return;
        const data = await response.json();
        if (data.success) {
            AI_MODEL_DISPLAY = data.display_name || data.model || 'gpt-4.1-nano';
            // Update model labels in the UI
            const modelLabelA = document.getElementById('modelLabelA');
            const modelLabelB = document.getElementById('modelLabelB');
            const modelInfo = document.getElementById('debateModelInfo');
            if (modelLabelA) modelLabelA.textContent = AI_MODEL_DISPLAY;
            if (modelLabelB) modelLabelB.textContent = AI_MODEL_DISPLAY;
            if (modelInfo) modelInfo.textContent = AI_MODEL_DISPLAY;
        }
    } catch (error) {
        console.error('Failed to load model info:', error);
    }
}

// ===== Vote Functions =====

async function submitVote(side) {
    userVote = side;
    hasVoted = true;
    voteData[side]++;
    voteData.total++;

    localStorage.setItem('debate_vote_' + DEBATE_ID + '_' + currentUser.user_id, side);

    try {
        await fetch('/api/vote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ debateId: DEBATE_ID, userId: currentUser.user_id, vote: side })
        });
    } catch (error) {
        console.error('Failed to save vote:', error);
    }

    document.getElementById('voteModal').classList.add('hidden');
    updateVoteDisplay();
    highlightSelectedButton(side);
    showToast('投票が完了しました！観戦を開始します');
}
window.submitVote = submitVote;

async function changeVote(side) {
    if (!hasVoted) {
        await submitVote(side);
        return;
    }
    if (userVote === side) {
        showToast('既にこの意見に投票済みです');
        return;
    }

    voteData[userVote]--;
    voteData[side]++;
    userVote = side;

    localStorage.setItem('debate_vote_' + DEBATE_ID + '_' + currentUser.user_id, side);

    try {
        await fetch('/api/vote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ debateId: DEBATE_ID, userId: currentUser.user_id, vote: side })
        });
    } catch (error) {
        console.error('Failed to update vote:', error);
    }

    updateVoteDisplay();
    highlightSelectedButton(side);
    showToast(side === 'agree' ? '意見Aに変更しました！' : '意見Bに変更しました！');
}
window.changeVote = changeVote;

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

// ===== Vote Display =====

function updateVoteDisplay() {
    if (fogMode) {
        document.getElementById('agreePercent').textContent = '???';
        document.getElementById('disagreePercent').textContent = '???';
        document.getElementById('agreePercentSymbol').textContent = '';
        document.getElementById('disagreePercentSymbol').textContent = '';
        document.getElementById('voteStatus').innerHTML = '<i class="fas fa-eye-slash mr-2"></i>非公開中 - 投票確定で解除';
        document.getElementById('agreeBar').style.width = '50%';
        document.getElementById('disagreeBar').style.width = '50%';
        
        // AI judges also hidden in fog mode
        ['judge1-eval', 'judge2-eval', 'judge3-eval'].forEach(id => {
            const elem = document.getElementById(id);
            if (elem) {
                elem.textContent = '???';
                elem.className = 'text-sm text-gray-400';
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
        document.getElementById('voteStatus').innerHTML = '<i class="fas fa-users mr-2"></i>総投票数: ' + voteData.total + '人';
        document.getElementById('agreeBar').style.width = agreePercent + '%';
        document.getElementById('disagreeBar').style.width = disagreePercent + '%';
        
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

function updateViewerCount() {
    document.getElementById('viewerCount').textContent = voteData.total.toLocaleString();
}

// ===== Fog Mode / ???  =====

function revealFogMode() {
    if (!fogMode) return;
    
    fogMode = false;
    
    const agreeBar = document.getElementById('agreeBar');
    const disagreeBar = document.getElementById('disagreeBar');
    agreeBar.style.filter = 'none';
    disagreeBar.style.filter = 'none';
    agreeBar.style.background = '';
    disagreeBar.style.background = '';
    agreeBar.style.transition = 'width 0.5s ease';
    disagreeBar.style.transition = 'width 0.5s ease';
    
    // Disable vote change buttons after confirmation
    document.getElementById('voteAgreeBtn').disabled = true;
    document.getElementById('voteDisagreeBtn').disabled = true;
    document.getElementById('voteAgreeBtn').style.opacity = '0.5';
    document.getElementById('voteDisagreeBtn').style.opacity = '0.5';
    
    updateVoteDisplay();
    showToast('投票が確定されました！結果が公開されます');
}

// ===== Comment System =====

async function postComment() {
    const input = document.getElementById('commentInput');
    const text = input.value.trim();
    
    if (!text) { showToast('コメントを入力してください'); return; }
    if (!hasVoted) { showToast('投票してからコメントしてください'); return; }

    // Dev commands
    if (currentUser.user_id === 'dev') {
        if (text === '!s') {
            input.value = '';
            showToast('ディベートを開始します...');
            startDebate();
            return;
        }
        if (text === '!sa') {
            input.value = '';
            showToast('ディベートを開始します（アーカイブ保存有効）...');
            window.archiveOnComplete = true;
            startDebate();
            return;
        }
        if (text === '!dela') {
            input.value = '';
            document.getElementById('commentsList').innerHTML = '';
            document.getElementById('debateMessages').innerHTML = '<div class="text-center text-gray-400 p-8"><i class="fas fa-info-circle text-4xl mb-4 text-cyan-400"></i><p class="text-lg">devユーザーでコメント欄に <span class="text-cyan-300 font-bold">!s</span> と入力してディベートを開始</p></div>';
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
        if (text === '!stop') {
            input.value = '';
            if (debateActive) {
                debateActive = false;
                if (debateTimer) clearTimeout(debateTimer);
                conversationHistory = [];
                const ci = document.getElementById('commentInput');
                if (ci) { ci.disabled = false; ci.placeholder = 'コメントを入力...'; }
                const cb = document.getElementById('postCommentBtn');
                if (cb) { cb.disabled = false; cb.style.opacity = '1'; }
                showToast('ディベートを停止しました');
            } else {
                showToast('ディベートは実行されていません');
            }
            return;
        }
        if (text === '!deld') {
            input.value = '';
            document.getElementById('debateMessages').innerHTML = '<div class="text-center text-gray-400 p-8"><i class="fas fa-info-circle text-4xl mb-4 text-cyan-400"></i><p class="text-lg">devユーザーでコメント欄に <span class="text-cyan-300 font-bold">!s</span> と入力してディベートを開始</p></div>';
            conversationHistory = [];
            debateActive = false;
            fetch('/api/debate/' + DEBATE_ID + '/messages', { method: 'DELETE' })
                .then(() => showToast('ディベート履歴を削除しました'))
                .catch(err => showToast('削除エラー: ' + err.message));
            return;
        }
    }

    if (text.length > 500) { showToast('コメントは500文字以内で入力してください'); return; }

    const commentsList = document.getElementById('commentsList');
    const wasAtBottom = commentsList.scrollHeight - commentsList.scrollTop - commentsList.clientHeight < 5;
    
    const commentDiv = document.createElement('div');
    const stanceClass = userVote === 'agree' ? 'comment-agree' : 'comment-disagree';
    const stanceColor = userVote === 'agree' ? 'green' : 'red';
    const stanceIcon = userVote === 'agree' ? 'thumbs-up' : 'thumbs-down';
    const stanceText = userVote === 'agree' ? '意見A支持' : '意見B支持';
    const avatarGradient = userVote === 'agree' ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500';
    const initial = currentUser.user_id.charAt(0).toUpperCase();
    
    commentDiv.className = 'comment-item ' + stanceClass + ' bg-gray-900/50 p-3 rounded border border-cyan-500/30';
    commentDiv.innerHTML = '<div class="flex items-center mb-2"><div class="w-8 h-8 rounded-full bg-gradient-to-br ' + avatarGradient + ' flex items-center justify-center text-xs font-bold mr-2">' + initial + '</div><div class="flex-1"><p class="text-sm font-bold">@' + currentUser.user_id + '</p><p class="text-xs text-' + stanceColor + '-400"><i class="fas fa-' + stanceIcon + ' mr-1"></i>' + stanceText + '</p></div></div><p class="text-sm text-gray-200">' + text + '</p>';

    commentsList.appendChild(commentDiv);
    if (wasAtBottom) requestAnimationFrame(() => { commentsList.scrollTop = commentsList.scrollHeight; });

    saveCommentToD1(text);
    lastCommentCount++;
    document.getElementById('commentCount').textContent = parseInt(document.getElementById('commentCount').textContent) + 1;
    input.value = '';
    showToast('コメントを投稿しました！');
}
window.postComment = postComment;

async function saveCommentToD1(content) {
    try {
        await fetch('/api/comment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                debateId: DEBATE_ID, userId: currentUser.user_id,
                username: currentUser.user_id, vote: userVote, content: content
            })
        });
    } catch (error) { console.error('Failed to save comment:', error); }
}

function clearCommentInput() { document.getElementById('commentInput').value = ''; }
window.clearCommentInput = clearCommentInput;

// ===== Toast =====
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => { toast.classList.add('hidden'); }, 3000);
}

// ===== AI Evaluation System (judges only, no vote manipulation) =====

async function getAIEvaluations(message, side) {
    try {
        const evaluation = await getAIEvaluation(message, side);
        if (evaluation.shouldVote) {
            displayAIEvaluation(evaluation, side);
        }
        
        // Run judge evaluations after 3 turns
        const currentTurn = conversationHistory.length;
        if (currentTurn >= 3) {
            await performAIJudging();
        }
    } catch (error) {
        console.error('AI evaluation error:', error);
    }
}

async function getAIEvaluation(message, side) {
    try {
        const fullDebate = conversationHistory.map(msg => {
            return '[' + (msg.side === 'agree' ? '意見A' : '意見B') + ']: ' + msg.content;
        }).join('\n');
        
        const prompt = [
            '直近3発言：', fullDebate.split('\n').slice(-3).join('\n'), '',
            '最新「' + message + '」を評価：',
            '1. 立場を守っているか', '2. 相手を認めていないか', '3. 具体的に反論しているか', '',
            '評価基準：!! = 決定的 / ! = 優勢 / ? = 劣勢 / ?? = 致命的', '',
            '【重要】必ずJSON形式で返してください。',
            '出力形式: {"symbol": "!!" or "!" or "?" or "??", "comment": "15字以内"}'
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
                return { symbol: result.symbol, comment: result.comment || '', support: side, shouldVote: true };
            }
            return { symbol: null, comment: '', support: side, shouldVote: false };
        } catch (e) {
            const msg = data.message;
            if (msg.includes('!!')) return { symbol: '!!', comment: '圧倒的', support: side, shouldVote: true };
            if (msg.includes('??')) return { symbol: '??', comment: '意図不明', support: side, shouldVote: true };
            if (msg.includes('!')) return { symbol: '!', comment: '有力', support: side, shouldVote: true };
            if (msg.includes('?')) return { symbol: '?', comment: '根拠不足', support: side, shouldVote: true };
            return { symbol: null, comment: '', support: side, shouldVote: false };
        }
    } catch (error) {
        return { symbol: null, comment: '', support: side, shouldVote: false };
    }
}

// AI Judging: determine stance only (no vote manipulation)
async function performAIJudging() {
    try {
        const fullDebate = conversationHistory.map(msg => {
            return '[' + (msg.side === 'agree' ? '意見A' : '意見B') + ']: ' + msg.content;
        }).join('\n');
        
        const judgments = await Promise.all([
            getAIJudgment(fullDebate, 'AI-Judge-1', 0.7),
            getAIJudgment(fullDebate, 'AI-Judge-2', 0.8),
            getAIJudgment(fullDebate, 'AI-Judge-3', 0.9)
        ]);
        
        judgments.forEach((judgment, index) => {
            if (judgment && judgment.winner) {
                aiJudgeStances['judge' + (index + 1)] = judgment.winner;
            }
        });
        
        if (!fogMode) {
            updateJudgeDisplay();
        }
    } catch (error) {
        console.error('AI judging error:', error);
    }
}

async function getAIJudgment(fullDebate, aiName, temperature) {
    try {
        const prompt = [
            'テーマ：' + DEBATE_THEME,
            '意見A：' + OPINION_A, '意見B：' + OPINION_B, '',
            '以下のディベート全体を評価してください：', fullDebate, '',
            '観点: 1.立場の一貫性 2.具体性 3.論理性', '',
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
            return JSON.parse(data.message);
        } catch {
            const msg = (data.message || '').toLowerCase();
            if (msg.includes('意見a') || msg.includes('agree')) return { winner: 'agree' };
            if (msg.includes('意見b') || msg.includes('disagree')) return { winner: 'disagree' };
            return { winner: Math.random() < 0.5 ? 'agree' : 'disagree' };
        }
    } catch (error) {
        return { winner: Math.random() < 0.5 ? 'agree' : 'disagree' };
    }
}

function displayAIEvaluation(evaluation, side) {
    if (!evaluation || !evaluation.symbol) return;
    
    const container = document.getElementById('debateMessages');
    const bubbles = container.querySelectorAll('.bubble');
    const lastBubble = bubbles[bubbles.length - 1];
    if (!lastBubble || lastBubble.querySelector('.ai-eval-icon')) return;
    
    let symbolHtml = '';
    const colors = { '!!': 'bg-green-500', '!': 'bg-green-500', '?': 'bg-orange-500', '??': 'bg-red-500' };
    const color = colors[evaluation.symbol] || 'bg-gray-500';
    symbolHtml = '<div class="w-10 h-10 rounded-full ' + color + ' flex items-center justify-center shadow-lg"><span class="text-white text-xl font-bold">' + evaluation.symbol + '</span></div>';
    
    const iconDiv = document.createElement('div');
    iconDiv.className = 'ai-eval-icon absolute top-2 ' + (side === 'agree' ? 'left-2' : 'right-2');
    iconDiv.innerHTML = symbolHtml;
    
    lastBubble.style.position = 'relative';
    lastBubble.appendChild(iconDiv);
}

// ===== Debate System =====

async function startDebate() {
    if (debateActive) { showToast('ディベートは既に実行中です'); return; }
    
    debateActive = true;
    debateStartTime = Date.now();
    conversationHistory = [];
    aiJudgeStances = { judge1: null, judge2: null, judge3: null };
    
    const startTimeElement = document.getElementById('debateStartTime');
    if (startTimeElement) {
        const d = new Date(debateStartTime);
        startTimeElement.textContent = d.getFullYear() + '/' + String(d.getMonth()+1).padStart(2,'0') + '/' + String(d.getDate()).padStart(2,'0') + ' ' + String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0') + ' 開始';
    }
    
    document.getElementById('debateMessages').innerHTML = '<div class="text-center text-cyan-300 p-4"><i class="fas fa-spinner fa-spin mr-2"></i>ディベート開始...</div>';
    
    updateDebateTimer();
    await generateAIResponse('agree');
}

function updateDebateTimer() {
    if (!debateActive) return;
    
    const elapsed = Math.floor((Date.now() - debateStartTime) / 1000);
    const remaining = MAX_DEBATE_TIME - elapsed;
    
    // Fog mode at remaining 10%
    if (remaining <= MAX_DEBATE_TIME * 0.1 && !fogMode && !finalVotingMode) {
        fogMode = true;
        showToast('ゲージ非公開化！投票を確定して結果を見よう！');
        
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

// ===== Final Voting Period =====

function startFinalVotingPeriod() {
    showToast('ディベート終了！1分以内に投票を確定してください');
    
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
    
    confirmBtn.addEventListener('click', () => {
        if (!hasVoted) { showToast('エラー: まず意見を選択してください'); return; }
        userConfirmed = true;
        confirmBtn.disabled = true;
        confirmBtn.classList.remove('animate-pulse');
        confirmBtn.textContent = '投票確定済み - 結果を待っています...';
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

// ===== Final Results (with AI judge results) =====

async function showFinalResults() {
    const commentInput = document.getElementById('commentInput');
    if (commentInput) { commentInput.disabled = true; commentInput.placeholder = 'ディベートが終了しました'; }
    const commentBtn = document.getElementById('postCommentBtn');
    if (commentBtn) { commentBtn.disabled = true; commentBtn.style.opacity = '0.5'; }
    
    // Ensure fog is lifted
    fogMode = false;
    document.getElementById('agreeBar').style.filter = 'none';
    document.getElementById('disagreeBar').style.filter = 'none';
    document.getElementById('agreeBar').style.background = '';
    document.getElementById('disagreeBar').style.background = '';
    updateVoteDisplay();
    
    // Run final AI judgment if not already done
    if (!aiJudgeStances.judge1 && conversationHistory.length >= 2) {
        showToast('AIによる最終評価を実施中...');
        await performAIJudging();
    }
    
    const agreePercent = Math.round((voteData.agree / voteData.total) * 100);
    const disagreePercent = 100 - agreePercent;
    const winner = voteData.agree > voteData.disagree ? '意見A' : '意見B';
    const winnerColor = voteData.agree > voteData.disagree ? 'text-green-400' : 'text-red-400';
    
    // Build AI judge results HTML
    let judgeHTML = '';
    ['judge1', 'judge2', 'judge3'].forEach((key, i) => {
        const stance = aiJudgeStances[key];
        const judgeWinner = stance ? (stance === 'agree' ? '意見A支持' : '意見B支持') : '判定なし';
        const judgeColor = stance ? (stance === 'agree' ? 'text-green-400' : 'text-red-400') : 'text-gray-400';
        judgeHTML += '<div class="mb-2"><span class="text-cyan-400 font-bold">AI-Judge-' + (i+1) + ':</span> <span class="' + judgeColor + '">' + judgeWinner + '</span></div>';
    });
    
    const resultModal = document.createElement('div');
    resultModal.className = 'fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50';
    resultModal.innerHTML = '<div class="cyber-card max-w-3xl w-full mx-4">' +
        '<h2 class="text-4xl font-bold text-center mb-8"><i class="fas fa-trophy mr-3 text-yellow-400"></i>最終結果</h2>' +
        '<div class="text-center mb-8"><p class="text-2xl mb-4">勝者</p><p class="text-5xl font-bold ' + winnerColor + ' mb-4">' + winner + '</p></div>' +
        '<div class="grid grid-cols-2 gap-6 mb-8">' +
            '<div class="text-center p-6 bg-green-500/20 rounded"><p class="text-xl mb-2">意見A (Agree)</p><p class="text-4xl font-bold text-green-400">' + agreePercent + '%</p><p class="text-sm text-gray-400 mt-2">' + voteData.agree + ' 票</p></div>' +
            '<div class="text-center p-6 bg-red-500/20 rounded"><p class="text-xl mb-2">意見B (Disagree)</p><p class="text-4xl font-bold text-red-400">' + disagreePercent + '%</p><p class="text-sm text-gray-400 mt-2">' + voteData.disagree + ' 票</p></div>' +
        '</div>' +
        '<div class="bg-gray-800 p-4 rounded mb-6"><h3 class="text-xl font-bold text-cyan-400 mb-4"><i class="fas fa-gavel mr-2"></i>AI審査員の評価</h3><div class="text-sm text-white">' + judgeHTML + '</div></div>' +
        '<div class="text-center grid grid-cols-2 gap-4">' +
            '<button onclick="location.href=\'/main\'" class="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg"><i class="fas fa-home mr-2"></i>メインページ</button>' +
            '<button onclick="location.href=\'/archive\'" class="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-lg"><i class="fas fa-archive mr-2"></i>アーカイブ</button>' +
        '</div>' +
        '<p class="text-lg text-gray-400 text-center mt-4">総投票数: ' + voteData.total + ' 人</p>' +
        '</div>';
    
    document.body.appendChild(resultModal);
    
    // Archive if !sa was used
    if (window.archiveOnComplete) {
        saveToArchive(winner, agreePercent, disagreePercent);
    }
}

// ===== Archive Save =====

async function saveToArchive(winner, agreePercent, disagreePercent) {
    try {
        const response = await fetch('/api/archive/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                debate_id: DEBATE_ID + '_' + Date.now(),
                title: DEBATE_THEME,
                topic: DEBATE_THEME,
                agree_position: OPINION_A,
                disagree_position: OPINION_B,
                agree_votes: voteData.agree,
                disagree_votes: voteData.disagree,
                winner: winner === '意見A' ? 'agree' : 'disagree',
                messages: JSON.stringify(conversationHistory)
            })
        });
        
        const result = await response.json();
        if (result.success) {
            showToast('ディベートがアーカイブに保存されました');
            window.archiveOnComplete = false;
        } else {
            showToast('アーカイブ保存に失敗: ' + (result.error || '不明'));
        }
    } catch (error) {
        console.error('Archive save error:', error);
        showToast('アーカイブ保存エラー');
    }
}

// ===== AI Response Generation =====

async function generateAIResponse(side) {
    if (!debateActive) return;
    
    const systemPrompt = 'あなたはディベートの参加者です。以下のルールを厳守してください：\n\n【厳守事項】\n1. 自分の立場を一貫して主張する\n2. 相手の立場の論点を認めない\n3. 相手の発言の矛盾・弱点を指摘する\n4. 具体的な根拠を示す\n5. 180文字以内、句点（。）で終える\n\n【禁止事項】\n- 相手の論点を認める表現（「確かに」「一方で」など）\n- 抽象的で曖昧な表現';
    
    let conversationToSend = conversationHistory;
    if (conversationHistory.length === 0) {
        const initialContext = side === 'agree'
            ? '【テーマ】' + DEBATE_THEME + '\n【あなたの立場】' + OPINION_A
            : '【テーマ】' + DEBATE_THEME + '\n【あなたの立場】' + OPINION_B;
        
        conversationToSend = [{ side: side, content: initialContext, role: 'user' }];
    }
    
    try {
        const response = await fetch('/api/debate/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ systemPrompt, conversationHistory: conversationToSend, maxTokens: 220, temperature: 0.7 })
        });
        
        if (!response.ok) throw new Error('API request failed');
        const data = await response.json();
        
        if (data.message && debateActive) {
            conversationHistory.push({
                role: side === 'agree' ? 'assistant' : 'user',
                content: data.message, side: side
            });
            
            const actualModel = data.model || 'gpt-4.1-nano';
            await addDebateMessageWithTyping(side, data.message, actualModel);
            
            setTimeout(() => {
                if (debateActive) {
                    generateAIResponse(side === 'agree' ? 'disagree' : 'agree');
                }
            }, 3000);
        }
    } catch (error) {
        console.error('Debate error:', error);
        showToast('ディベート生成エラー: ' + error.message);
        debateActive = false;
    }
}

function addDebateMessage(side, message, model) {
    const container = document.getElementById('debateMessages');
    const bubbleClass = side === 'agree' ? 'bubble-agree' : 'bubble-disagree';
    const iconClass = side === 'agree' ? 'fa-brain' : 'fa-lightbulb';
    const gradientClass = side === 'agree' ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500';
    const opinionLabel = side === 'agree' ? '意見A' : '意見B';
    const aiModel = model || 'AI';
    
    container.insertAdjacentHTML('beforeend', '<div class="bubble ' + bubbleClass + ' p-4 text-white shadow-lg" style="width: 100%;"><div class="flex items-center gap-3 mb-2"><div class="w-8 h-8 rounded-full bg-gradient-to-br ' + gradientClass + ' flex items-center justify-center flex-shrink-0"><i class="fas ' + iconClass + ' text-sm"></i></div><span class="font-bold text-sm flex-shrink-0">' + aiModel + '</span><span class="text-xs opacity-75 flex-shrink-0">' + opinionLabel + '</span></div><div class="text-sm leading-relaxed" style="word-wrap: break-word; white-space: pre-wrap;">' + message + '</div></div>');
}

async function addDebateMessageWithTyping(side, message, actualModel) {
    return new Promise((resolve) => {
        const container = document.getElementById('debateMessages');
        const bubbleClass = side === 'agree' ? 'bubble-agree' : 'bubble-disagree';
        const iconClass = side === 'agree' ? 'fa-brain' : 'fa-lightbulb';
        const gradientClass = side === 'agree' ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500';
        const opinionLabel = side === 'agree' ? '意見A' : '意見B';
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'bubble ' + bubbleClass + ' p-4 text-white shadow-lg';
        bubbleDiv.style.width = '100%';
        bubbleDiv.style.position = 'relative';
        bubbleDiv.innerHTML = '<div class="flex items-center gap-3 mb-2"><div class="w-8 h-8 rounded-full bg-gradient-to-br ' + gradientClass + ' flex items-center justify-center flex-shrink-0"><i class="fas ' + iconClass + ' text-sm"></i></div><span class="font-bold text-sm flex-shrink-0">' + actualModel + '</span><span class="text-xs opacity-75 flex-shrink-0">' + opinionLabel + '</span></div><div class="text-sm leading-relaxed typing-text" style="word-wrap: break-word; white-space: pre-wrap;"></div>';
        
        const wasAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 5;
        container.appendChild(bubbleDiv);
        
        const textElement = bubbleDiv.querySelector('.typing-text');
        let charIndex = 0;
        
        function typeChar() {
            if (charIndex < message.length && debateActive) {
                textElement.textContent += message.charAt(charIndex);
                charIndex++;
                if (wasAtBottom) requestAnimationFrame(() => { container.scrollTop = container.scrollHeight; });
                setTimeout(typeChar, 30);
            } else {
                saveDebateMessageToD1(side, actualModel, message);
                lastMessageCount++;
                if (!fogMode && conversationHistory.length >= 3) {
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
        if (!side || !model || !content) return;
        await fetch('/api/debate/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ debateId: DEBATE_ID, side: side, model: model, content: content })
        });
    } catch (error) { console.error('Failed to save debate message:', error); }
}

// ===== Realtime Sync =====

async function loadDebateMessagesFromD1() {
    try {
        const response = await fetch('/api/debate/' + DEBATE_ID + '/messages');
        const data = await response.json();
        
        if (data.messages && data.messages.length > lastMessageCount) {
            for (let i = lastMessageCount; i < data.messages.length; i++) {
                const msg = data.messages[i];
                addDebateMessage(msg.side, msg.content, msg.model);
            }
            lastMessageCount = data.messages.length;
        }
    } catch (error) { console.error('Failed to load debate messages:', error); }
}

async function loadCommentsFromD1() {
    try {
        const response = await fetch('/api/comments/' + DEBATE_ID);
        const data = await response.json();
        
        if (data.comments && data.comments.length > lastCommentCount) {
            const commentsList = document.getElementById('commentsList');
            const wasAtBottom = commentsList.scrollHeight - commentsList.scrollTop - commentsList.clientHeight < 5;
            
            for (let i = lastCommentCount; i < data.comments.length; i++) {
                const c = data.comments[i];
                const stanceClass = c.vote === 'agree' ? 'comment-agree' : 'comment-disagree';
                const stanceColor = c.vote === 'agree' ? 'green' : 'red';
                const stanceIcon = c.vote === 'agree' ? 'thumbs-up' : 'thumbs-down';
                const stanceText = c.vote === 'agree' ? '意見A支持' : '意見B支持';
                const avatarGradient = c.vote === 'agree' ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500';
                const initial = c.username.charAt(0).toUpperCase();
                
                const div = document.createElement('div');
                div.className = 'comment-item ' + stanceClass + ' bg-gray-900/50 p-3 rounded border border-cyan-500/30';
                div.innerHTML = '<div class="flex items-center mb-2"><div class="w-8 h-8 rounded-full bg-gradient-to-br ' + avatarGradient + ' flex items-center justify-center text-xs font-bold mr-2">' + initial + '</div><div class="flex-1"><p class="text-sm font-bold">@' + c.username + '</p><p class="text-xs text-' + stanceColor + '-400"><i class="fas fa-' + stanceIcon + ' mr-1"></i>' + stanceText + '</p></div></div><p class="text-sm text-gray-200">' + c.content + '</p>';
                commentsList.appendChild(div);
            }
            
            if (wasAtBottom) requestAnimationFrame(() => { commentsList.scrollTop = commentsList.scrollHeight; });
            document.getElementById('commentCount').textContent = data.comments.length;
            lastCommentCount = data.comments.length;
        }
    } catch (error) { console.error('Failed to load comments:', error); }
}

// ===== Credit Sync =====

async function syncCredits() {
    try {
        const response = await fetch('/api/user');
        if (response.ok) {
            const userData = await response.json();
            if (userData.credits !== undefined) {
                currentUser.credits = userData.credits;
                const navCredits = document.getElementById('navCredits');
                if (navCredits) navCredits.textContent = userData.credits.toLocaleString();
            }
        }
    } catch (e) { console.error('Credit sync error:', e); }
}

// ===== Initialize =====

window.addEventListener('DOMContentLoaded', async () => {
    // Load debate theme and model info from DB first
    await Promise.all([loadDebateTheme(), loadModelInfo()]);
    
    document.getElementById('debateTimeLimit').textContent = MAX_DEBATE_TIME + '秒';
    document.getElementById('debateCharLimit').textContent = MAX_CHARS + '文字';
    
    const agreeModalBtn = document.getElementById('voteAgreeModalBtn');
    const disagreeModalBtn = document.getElementById('voteDisagreeModalBtn');
    const agreeBtn = document.getElementById('voteAgreeBtn');
    const disagreeBtn = document.getElementById('voteDisagreeBtn');
    
    if (agreeModalBtn) agreeModalBtn.addEventListener('click', () => submitVote('agree'));
    if (disagreeModalBtn) disagreeModalBtn.addEventListener('click', () => submitVote('disagree'));
    if (agreeBtn) agreeBtn.addEventListener('click', () => changeVote('agree'));
    if (disagreeBtn) disagreeBtn.addEventListener('click', () => changeVote('disagree'));
    
    updateVoteDisplay();
    loadDebateMessagesFromD1();
    loadCommentsFromD1();
    syncCredits();
    
    // Realtime sync every 2 seconds
    setInterval(() => {
        loadDebateMessagesFromD1();
        loadCommentsFromD1();
    }, 2000);
    setInterval(updateViewerCount, 2000);
    
    // Restore vote from localStorage
    const savedVote = localStorage.getItem('debate_vote_' + DEBATE_ID + '_' + currentUser.user_id);
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
    if (postCommentBtn) postCommentBtn.addEventListener('click', postComment);
    if (clearCommentBtn) clearCommentBtn.addEventListener('click', clearCommentInput);
});
