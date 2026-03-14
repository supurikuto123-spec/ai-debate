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
    credits: parseInt(appData.dataset.userCredits),
    avatar_type: appData.dataset.avatarType || '',
    avatar_value: appData.dataset.avatarValue || '',
    avatar_url: appData.dataset.avatarUrl || '',
    username: appData.dataset.username || appData.dataset.userId
};

// These will be loaded from DB
let DEBATE_THEME = '';
let OPINION_A = '';
let OPINION_B = '';

// Vote state - starts at 5:5, no random changes, no AI votes
let userVote = null;
let hasVoted = false;
let voteData = { agree: 0, disagree: 0, total: 0 };

// Fog mode & AI judges
let fogMode = false;
let finalVotingMode = false;
let aiJudgeStances = { judge1: null };

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
let AI_MODEL_DISPLAY = 'gpt-5.1';

// ===== Load debate theme from DB =====
async function loadDebateTheme() {
    try {
        const response = await fetch('/api/debate/' + DEBATE_ID + '/theme');
        if (!response.ok) return;
        const data = await response.json();

        DEBATE_THEME = data.topic || data.title || 'テーマ未設定';
        OPINION_A = data.agree_position || '賛成意見';
        OPINION_B = data.disagree_position || '反対意見';

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
            AI_MODEL_DISPLAY = data.display_name || data.model || 'gpt-5.1';
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
            body: JSON.stringify({ debateId: DEBATE_ID, vote: side })
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
            body: JSON.stringify({ debateId: DEBATE_ID, vote: side })
        });
    } catch (error) {
        console.error('Failed to update vote:', error);
    }

    updateVoteDisplay();
    highlightSelectedButton(side);
    showToast(side === 'agree' ? 'Aetherに変更しました！' : 'Novaに変更しました！');
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
    const elem = document.getElementById('judge1-eval');
    if (!elem) return;

    const stance = aiJudgeStances.judge1;
    if (stance) {
        const winner = stance === 'agree' ? 'Aether' : 'Nova';
        const color = stance === 'agree' ? 'text-green-400' : 'text-red-400';
        const icon = stance === 'agree' ? 'fa-check-circle' : 'fa-times-circle';
        elem.className = 'text-sm font-bold ' + color;
        elem.innerHTML = '<i class="fas ' + icon + ' mr-1"></i>' + winner + ' 優勢';
    } else {
        elem.className = 'text-sm text-gray-400';
        elem.textContent = '評価中...';
    }
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

    // Commands are NOT allowed inside debate comments anymore
    // Commands must be used from the Commands tab only
    if (text.startsWith('!')) {
        showToast('コマンドはメニューの「コマンド」タブから使用してください');
        return;
    }

    if (text.length > 500) { showToast('コメントは500文字以内で入力してください'); return; }

    const commentsList = document.getElementById('commentsList');
    const wasAtBottom = commentsList.scrollHeight - commentsList.scrollTop - commentsList.clientHeight < 5;

    const commentDiv = document.createElement('div');
    const stanceClass = userVote === 'agree' ? 'comment-agree' : 'comment-disagree';
    const stanceColor = userVote === 'agree' ? 'green' : 'red';
    const stanceIcon = userVote === 'agree' ? 'thumbs-up' : 'thumbs-down';
    const stanceText = userVote === 'agree' ? 'Aether支持' : 'Nova支持';
    const avatarGradient = userVote === 'agree' ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500';
    const borderColor = userVote === 'agree' ? '#22c55e' : '#ef4444';
    const isDevSelf = currentUser.user_id === 'dev';
    const selfFrameStyle = isDevSelf
        ? 'border:3px solid transparent;background-image:linear-gradient(#111,#111),conic-gradient(from 0deg,#ffd700,#ff00ff,#00ffff,#22c55e,#ffd700);background-origin:border-box;background-clip:padding-box,border-box;box-shadow:0 0 15px rgba(255,215,0,0.4);'
        : 'border:2px solid ' + borderColor + ';';

    let selfAvatarHtml;
    if (currentUser.avatar_url) {
        selfAvatarHtml = '<img src="' + escapeHtml(currentUser.avatar_url) + '" alt="avatar" style="width:32px;height:32px;border-radius:50%;object-fit:cover;' + selfFrameStyle + '">';
    } else if (currentUser.avatar_type && currentUser.avatar_type !== 'upload') {
        const seed = currentUser.avatar_value || currentUser.user_id;
        const dicebearUrl = 'https://api.dicebear.com/7.x/' + encodeURIComponent(currentUser.avatar_type) + '/svg?seed=' + encodeURIComponent(seed);
        selfAvatarHtml = '<img src="' + dicebearUrl + '" alt="avatar" style="width:32px;height:32px;border-radius:50%;object-fit:cover;' + selfFrameStyle + '">';
    } else {
        const initial = currentUser.user_id.charAt(0).toUpperCase();
        selfAvatarHtml = '<div class="bg-gradient-to-br ' + avatarGradient + ' flex items-center justify-center text-xs font-bold" style="width:32px;height:32px;border-radius:50%;flex-shrink:0;' + selfFrameStyle + '">' + initial + '</div>';
    }

    commentDiv.className = 'comment-item ' + stanceClass + ' bg-gray-900/50 p-3 rounded';
    commentDiv.style.borderLeft = '3px solid ' + borderColor;
    commentDiv.innerHTML = '<div class="flex items-center mb-2"><div style="flex-shrink:0;margin-right:8px;">' + selfAvatarHtml + '</div><div class="flex-1 min-w-0"><a href="/user/' + currentUser.user_id + '" class="text-sm font-bold hover:text-cyan-400 transition-colors">@' + escapeHtml(currentUser.username || currentUser.user_id) + '</a>' + (isDevSelf ? '<span style="margin-left:4px;background:linear-gradient(135deg,#ffd700,#ff8c00);color:#000;font-size:9px;font-weight:900;padding:1px 6px;border-radius:8px;">DEV</span>' : '') + '<p class="text-xs text-' + stanceColor + '-400"><i class="fas fa-' + stanceIcon + ' mr-1"></i>' + stanceText + '</p></div></div><p class="text-sm text-gray-200">' + escapeHtml(text) + '</p>';

    commentsList.appendChild(commentDiv);
    if (wasAtBottom) requestAnimationFrame(() => { commentsList.scrollTop = commentsList.scrollHeight; });

    saveCommentToD1(text);
    lastCommentCount++;
    document.getElementById('commentCount').textContent = parseInt(document.getElementById('commentCount').textContent) + 1;
    input.value = '';
    showToast('コメントを投稿しました！');
}
window.postComment = postComment;

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function saveCommentToD1(content) {
    try {
        await fetch('/api/comment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                debateId: DEBATE_ID,
                vote: userVote, content: content
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

// ===== AI Evaluation System — 統合モード =====
// ターン3以降: mode:'evaluate' で symbol + winner を1回のAPI呼び出しで取得
// ターン1〜2: mode:'symbol' のみ (履歴が浅いため winner は省略)

async function getAIEvaluations(message, side) {
    try {
        const myLabel = side === 'agree' ? 'Aether(賛成)' : 'Nova(反対)';
        const myOpinion = side === 'agree' ? OPINION_A : OPINION_B;
        const opponentOpinion = side === 'agree' ? OPINION_B : OPINION_A;

        const fullHistory = conversationHistory.map(msg =>
            '[' + (msg.side === 'agree' ? 'Aether' : 'Nova') + ']: ' + msg.content
        ).join('\n');

        // キャッシュ効率のため固定テンプレート構造を維持
        const prompt = [
            'THEME: ' + DEBATE_THEME,
            'STANCE_' + (side === 'agree' ? 'A' : 'B') + ': ' + myOpinion,
            'STANCE_' + (side === 'agree' ? 'B' : 'A') + ': ' + opponentOpinion,
            'HISTORY:\n' + (fullHistory || '(none)'),
            'TARGET [' + myLabel + ']: ' + message
        ].join('\n');

        // ターン3以降は統合モード (symbol + winner を1回で取得)
        const currentTurn = conversationHistory.length;
        const useEvaluateMode = currentTurn >= 3;

        const response = await fetch('/api/debate/evaluate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, mode: useEvaluateMode ? 'evaluate' : 'symbol' })
        });

        const data = await response.json();

        let symbol = null;
        let winner = null;

        try {
            const result = JSON.parse(data.message);
            const validSymbols = ['!!', '!', '?', '??'];

            if (validSymbols.includes(result.symbol)) symbol = result.symbol;
            if (result.winner === 'agree' || result.winner === 'disagree') winner = result.winner;
        } catch (e) {
            // フォールバック: テキストからシンボルを検出
            const msg = data.message || '';
            if (msg.includes('!!')) symbol = '!!';
            else if (msg.includes('??')) symbol = '??';
            else {
                const symMatch = msg.match(/"symbol"\s*:\s*"([!?]+)"/);
                if (symMatch && ['!!', '!', '?', '??'].includes(symMatch[1])) symbol = symMatch[1];
                else if (msg.includes('"!"')) symbol = '!';
                else if (msg.includes('"?"')) symbol = '?';
            }
            // winner フォールバック
            if (msg.includes('"agree"')) winner = 'agree';
            else if (msg.includes('"disagree"')) winner = 'disagree';
        }

        // シンボル表示
        if (symbol) {
            displayAIEvaluation({ symbol, support: side, shouldVote: true }, side);
        }

        // winner更新 (統合モード時のみ)
        if (useEvaluateMode && winner) {
            aiJudgeStances['judge1'] = winner;
            if (!fogMode) {
                updateJudgeDisplay();
            }
        }
    } catch (error) {
        console.error('AI evaluation error:', error);
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

    // Make globally accessible for command panel
    window.debateActive = true;

    // Synchronization: Check if debate already has messages in DB
    // If yes, join existing debate instead of creating new one
    try {
        const existingMsgs = await fetch('/api/debate/' + DEBATE_ID + '/messages');
        const existingData = await existingMsgs.json();
        if (existingData.messages && existingData.messages.length > 0) {
            // Debate already running - sync with existing
            showToast('既存のディベートに同期します...');
            lastMessageCount = 0;
            await loadDebateMessagesFromD1();
            debateActive = true;
            debateStartTime = Date.now() - (existingData.messages.length * 5000);
            conversationHistory = existingData.messages.map(m => ({
                role: m.side === 'agree' ? 'assistant' : 'user',
                content: m.content,
                side: m.side
            }));
            updateDebateTimer();
            // Continue generating from where it left off
            if (currentUser.user_id === 'dev') {
                const lastSide = existingData.messages[existingData.messages.length - 1].side;
                const nextSide = lastSide === 'agree' ? 'disagree' : 'agree';
                setTimeout(() => generateAIResponse(nextSide), 3000);
            }
            return;
        }
    } catch (e) {
        console.log('No existing debate found, starting fresh');
    }

    debateActive = true;
    debateStartTime = Date.now();
    conversationHistory = [];
    aiJudgeStances = { judge1: null };

    const startTimeElement = document.getElementById('debateStartTime');
    if (startTimeElement) {
        const d = new Date(debateStartTime);
        startTimeElement.textContent = d.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) + ' 開始';
    }

    document.getElementById('debateMessages').innerHTML = '<div class="text-center text-cyan-300 p-4"><i class="fas fa-spinner fa-spin mr-2"></i>ディベート開始...</div>';

    // Mark debate as active in DB
    if (currentUser.user_id === 'dev') {
        try {
            await fetch('/api/debate/' + DEBATE_ID + '/status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'active' })
            });
        } catch (e) { }
    }

    updateDebateTimer();

    if (currentUser.user_id === 'dev') {
        await generateAIResponse('agree');
    }
}
window.startDebate = startDebate;

function updateDebateTimer() {
    if (!debateActive) return;

    const elapsed = Math.floor((Date.now() - debateStartTime) / 1000);
    const remaining = MAX_DEBATE_TIME - elapsed;

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

// ===== Final Results =====

async function showFinalResults() {
    const commentInput = document.getElementById('commentInput');
    if (commentInput) { commentInput.disabled = true; commentInput.placeholder = 'ディベートが終了しました'; }
    const commentBtn = document.getElementById('postCommentBtn');
    if (commentBtn) { commentBtn.disabled = true; commentBtn.style.opacity = '0.5'; }

    fogMode = false;
    document.getElementById('agreeBar').style.filter = 'none';
    document.getElementById('disagreeBar').style.filter = 'none';
    document.getElementById('agreeBar').style.background = '';
    document.getElementById('disagreeBar').style.background = '';
    updateVoteDisplay();

    // AI judging is ALWAYS performed (used as tiebreaker)
    // ターン3以降はgetAIEvaluationsで随時更新済み
    // ターンが少ない場合はここで最終審判を実施
    if (conversationHistory.length >= 2 && !aiJudgeStances['judge1']) {
        showToast('AIによる最終評価を実施中...');
        // 最終審判: 統合モードで実行 (symbolは不要なのでjudgeモードで後方互換)
        try {
            const fullDebate = conversationHistory.map(msg =>
                '[' + (msg.side === 'agree' ? 'A' : 'B') + ']: ' + msg.content
            ).join('\n');
            const prompt = [
                'THEME: ' + DEBATE_THEME,
                'STANCE_A: ' + OPINION_A,
                'STANCE_B: ' + OPINION_B,
                'HISTORY:\n' + fullDebate,
                'TARGET [最終審判]: ディベート全体を評価してください'
            ].join('\n');
            const resp = await fetch('/api/debate/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, mode: 'evaluate' })
            });
            const respData = await resp.json();
            try {
                const result = JSON.parse(respData.message);
                if (result.winner === 'agree' || result.winner === 'disagree') {
                    aiJudgeStances['judge1'] = result.winner;
                }
            } catch (e) { /* ignore */ }
        } catch (e) {
            console.error('Final judgment error:', e);
        }
        if (!fogMode) updateJudgeDisplay();
    }

    const total = voteData.total || 1;
    const agreePercent = total > 0 ? Math.round((voteData.agree / total) * 100) : 50;
    const disagreePercent = 100 - agreePercent;

    // === Winner determination ===
    // 1. Vote majority wins
    // 2. If tied, AI judge majority (3 judges) decides
    // 3. No draws - one side always wins
    let winnerSide; // 'agree' | 'disagree'
    let winnerReason = '';

    if (voteData.agree > voteData.disagree) {
        winnerSide = 'agree';
        winnerReason = '投票多数';
    } else if (voteData.disagree > voteData.agree) {
        winnerSide = 'disagree';
        winnerReason = '投票多数';
    } else {
        // Tie: use AI judges
        // シングル審判（1体）
        if (aiJudgeStances.judge1 === 'agree') {
            winnerSide = 'agree';
        } else if (aiJudgeStances.judge1 === 'disagree') {
            winnerSide = 'disagree';
        } else {
            // 審判未確定の場合は投票多数に戻す
            winnerSide = 'agree';
        }
        winnerReason = 'AI審査員判定（投票同数）';
    }

    const winner = winnerSide === 'agree' ? 'Aether' : 'Nova';
    const winnerColor = winnerSide === 'agree' ? 'text-green-400' : 'text-red-400';

    // 審判結果表示（1体）
    const judgeStance = aiJudgeStances.judge1;
    const judgeWinner = judgeStance ? (judgeStance === 'agree' ? 'Aether支持' : 'Nova支持') : '判定なし';
    const judgeColor = judgeStance ? (judgeStance === 'agree' ? 'text-green-400' : 'text-red-400') : 'text-gray-400';
    const judgeHTML = '<div class="mb-2"><span class="text-cyan-400 font-bold">AI-Judge:</span> <span class="' + judgeColor + '">' + judgeWinner + '</span></div>';

    const reasonHtml = winnerReason ? '<p class="text-sm text-gray-400 mt-2">決定理由: ' + winnerReason + '</p>' : '';

    const resultModal = document.createElement('div');
    resultModal.className = 'fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50';
    resultModal.innerHTML = '<div class="cyber-card max-w-3xl w-full mx-4">' +
        '<h2 class="text-4xl font-bold text-center mb-8"><i class="fas fa-trophy mr-3 text-yellow-400"></i>最終結果</h2>' +
        '<div class="text-center mb-8"><p class="text-2xl mb-4">勝者</p><p class="text-5xl font-bold ' + winnerColor + ' mb-4">' + winner + '</p>' + reasonHtml + '</div>' +
        '<div class="grid grid-cols-2 gap-6 mb-8">' +
        '<div class="text-center p-6 bg-green-500/20 rounded"><p class="text-xl mb-2"><i class="fas fa-brain mr-1"></i>Aether (賛成)</p><p class="text-4xl font-bold text-green-400">' + agreePercent + '%</p><p class="text-sm text-gray-400 mt-2">' + voteData.agree + ' 票</p></div>' +
        '<div class="text-center p-6 bg-red-500/20 rounded"><p class="text-xl mb-2"><i class="fas fa-fire mr-1"></i>Nova (反対)</p><p class="text-4xl font-bold text-red-400">' + disagreePercent + '%</p><p class="text-sm text-gray-400 mt-2">' + voteData.disagree + ' 票</p></div>' +
        '</div>' +
        '<div class="bg-gray-800 p-4 rounded mb-6"><h3 class="text-xl font-bold text-cyan-400 mb-4"><i class="fas fa-gavel mr-2"></i>AI審査員の評価</h3><div class="text-sm text-white">' + judgeHTML + '</div></div>' +
        '<div class="text-center grid grid-cols-2 gap-4">' +
        '<button onclick="location.href=\'/main\'" class="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg"><i class="fas fa-home mr-2"></i>メインページ</button>' +
        '<button onclick="location.href=\'/archive\'" class="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-lg"><i class="fas fa-archive mr-2"></i>アーカイブ</button>' +
        '</div>' +
        '<p class="text-lg text-gray-400 text-center mt-4">総投票数: ' + voteData.total + ' 人</p>' +
        '</div>';

    document.body.appendChild(resultModal);

    // Mark debate as completed in DB (pass winnerSide for tie-break logic)
    try {
        await fetch('/api/debate/' + DEBATE_ID + '/status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'completed', winner: winnerSide })
        });
    } catch (e) { }

    // Auto-archive is now handled by the backend when status is set to 'completed'
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
                winner: winner === 'Aether' ? 'agree' : 'disagree',
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

    const myOpinion = side === 'agree' ? OPINION_A : OPINION_B;
    const opponentOpinion = side === 'agree' ? OPINION_B : OPINION_A;
    const myName = side === 'agree' ? 'Aether' : 'Nova';

    // 全履歴を送信（AIが全発言を記憶した状態でディベートする）
    // キャッシュ効率のため固定フォーマットで整形
    const allHistory = conversationHistory.map(m =>
        '[' + (m.side === 'agree' ? 'Aether' : 'Nova') + ']: ' + m.content
    ).join('\n');

    // 相手の直前発言を取得（反論必須化のため）
    const opponentSide = side === 'agree' ? 'disagree' : 'agree';
    const opponentMsgs = conversationHistory.filter(m => m.side === opponentSide);
    const lastOpponentMsg = opponentMsgs.length > 0 ? opponentMsgs[opponentMsgs.length - 1].content : null;

    // 自分側の過去発言の要点リストを構築（抽象論ループ抑制）
    const myMsgs = conversationHistory.filter(m => m.side === side);
    const myArgCount = myMsgs.length;

    // ── systemPrompt ──────────────────────────────────────────────────────
    // 固定部分を先頭に置き、可変部分（テーマ・立場・履歴）を末尾に集約
    const closingExample = side === 'agree'
        ? 'したがって、' + DEBATE_THEME.substring(0, 20) + 'について、私は賛成の立場である。'
        : 'したがって、' + DEBATE_THEME.substring(0, 20) + 'について、私は反対の立場である。';

    const systemPrompt =
        'あなたはプロのAIディベーターです。\n' +
        '【絶対ルール（全ターン共通）】\n' +
        '1. 【最重要】発言の最後は必ず自分の立場「' + myOpinion + '」を支持する結論で締めること。' +
           '例：「' + closingExample + '」のような形で論題への賛否を明示すること。\n' +
        '2. 【必須】相手の直前発言の具体的な弱点を1つ以上指摘してから自分の主張を述べること。相手への反論なしは失格。\n' +
        '3. 同一文のコピペ繰り返しは禁止。既出論点の深掘り・補強・別角度再構成は積極的に行うこと。\n' +
        '4. 抽象語（「内面が大事」「心の豊かさ」等）だけで終わらせない。相手のどこが弱いかを具体的に示す。\n' +
        '5. 300文字以内・句点（。）で終える。冒頭にラベル・記号不要。\n' +
        '【あなたの名前】' + myName + '\n' +
        '【ディベートテーマ】' + DEBATE_THEME + '\n' +
        '【あなたの固定立場（変更禁止）】' + myOpinion + '\n' +
        '【相手の立場】' + opponentOpinion + '\n' +
        '【全ディベート履歴】\n' + (allHistory || '（ディベート開始）');

    // ── messagesを構築 ────────────────────────────────────────────────────
    let messagesToSend;
    if (conversationHistory.length === 0) {
        // 初回: 立場宣言 + 最初の論拠
        messagesToSend = [{
            role: 'user',
            content: 'テーマ「' + DEBATE_THEME + '」について立場「' + myOpinion + '」で最初の主張を述べてください。' +
                '自分の立場を明確に宣言し、その根拠を具体的に示してください。' +
                '最後は「したがってお金持ちは～」など論題への賛否を明示して締めること。300文字以内・句点で終えること。'
        }];
    } else {
        // 継続ターン: 全履歴をrole変換（自分=assistant、相手=user）
        messagesToSend = conversationHistory.map(m => ({
            role: m.side === side ? 'assistant' : 'user',
            content: m.content
        }));

        // 継続ターン用の指示（毎回立場を再固定 + 相手直前発言への反論必須）
        let turnInstruction = '【立場再確認】あなたの立場は「' + myOpinion + '」です。この立場は絶対に変えないこと。\n';
        if (lastOpponentMsg) {
            turnInstruction += '【必須反論】相手の直前発言：「' + lastOpponentMsg.substring(0, 80) + (lastOpponentMsg.length > 80 ? '…' : '') + '」\n' +
                'この発言の具体的な弱点を指摘したうえで、立場「' + myOpinion + '」を強化する主張を続けてください。\n';
        }
        if (myArgCount >= 2) {
            turnInstruction += '【深掘り指示】既出論点（' + myArgCount + '回発言済）を別角度・具体例・比較で補強すること。抽象論の単純反復は不可。\n';
        }
        turnInstruction += '【締め方必須】発言の最後は必ず「したがって、' + myOpinion + '」または同等の表現で自陣営の立場を明示して終えること。\n' +
            '300文字以内・句点で終えること。';

        messagesToSend.push({
            role: 'user',
            content: turnInstruction
        });
    }

    try {
        const response = await fetch('/api/debate/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                systemPrompt,
                conversationHistory: messagesToSend,
                maxTokens: 340,
                temperature: 0.85
            })
        });

        if (!response.ok) throw new Error('API request failed');
        const data = await response.json();

        if (data.message && debateActive) {
            // 完全一致の重複のみ再試行（部分的な類似は許容）
            const lastSameSide = [...conversationHistory].reverse().find(m => m.side === side);
            if (lastSameSide && lastSameSide.content === data.message) {
                console.warn('[Debate] 完全重複検出、再試行...');
                const retry = await fetch('/api/debate/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ systemPrompt, conversationHistory: messagesToSend, maxTokens: 340, temperature: 1.0 })
                });
                const retryData = await retry.json();
                if (retryData.message && retryData.message !== data.message) {
                    data.message = retryData.message;
                }
            }

            conversationHistory.push({
                role: side === 'agree' ? 'assistant' : 'user',
                content: data.message,
                side: side
            });

            const actualModel = data.model || 'gpt-5.1';
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
    const iconClass = side === 'agree' ? 'fa-brain' : 'fa-fire';
    const gradientClass = side === 'agree' ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500';
    const opinionLabel = side === 'agree' ? 'Aether' : 'Nova';
    const aiModel = model || 'AI';

    container.insertAdjacentHTML('beforeend', '<div class="bubble ' + bubbleClass + ' p-4 text-white shadow-lg" style="width: 100%;"><div class="flex items-center gap-3 mb-2"><div class="w-8 h-8 rounded-full bg-gradient-to-br ' + gradientClass + ' flex items-center justify-center flex-shrink-0"><i class="fas ' + iconClass + ' text-sm"></i></div><span class="font-bold text-sm flex-shrink-0">' + aiModel + '</span><span class="text-xs opacity-75 flex-shrink-0">' + opinionLabel + '</span></div><div class="text-sm leading-relaxed" style="word-wrap: break-word; white-space: pre-wrap;">' + message + '</div></div>');
}

async function addDebateMessageWithTyping(side, message, actualModel) {
    return new Promise((resolve) => {
        const container = document.getElementById('debateMessages');
        const bubbleClass = side === 'agree' ? 'bubble-agree' : 'bubble-disagree';
        const iconClass = side === 'agree' ? 'fa-brain' : 'fa-fire';
        const gradientClass = side === 'agree' ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500';
        const opinionLabel = side === 'agree' ? 'Aether' : 'Nova';

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

            // If messages exist but debate not active locally, sync conversationHistory
            if (data.messages.length > 0 && conversationHistory.length === 0) {
                conversationHistory = data.messages.map(m => ({
                    role: m.side === 'agree' ? 'assistant' : 'user',
                    content: m.content,
                    side: m.side
                }));
            }
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
                const stanceText = c.vote === 'agree' ? 'Aether支持' : 'Nova支持';
                const avatarGradient = c.vote === 'agree' ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500';
                const borderColor = c.vote === 'agree' ? '#22c55e' : '#ef4444';

                // Build avatar HTML: prefer real avatar, fallback to initial
                let avatarHtml;
                const isDevCommentUser = c.user_id === 'dev';
                const frameStyle = isDevCommentUser
                    ? 'border:3px solid transparent;background-image:linear-gradient(#111,#111),conic-gradient(from 0deg,#ffd700,#ff00ff,#00ffff,#22c55e,#ffd700);background-origin:border-box;background-clip:padding-box,border-box;box-shadow:0 0 15px rgba(255,215,0,0.4);'
                    : 'border:2px solid ' + borderColor + ';';

                if (c.avatar_url) {
                    avatarHtml = '<img src="' + escapeHtml(c.avatar_url) + '" alt="avatar" style="width:32px;height:32px;border-radius:50%;object-fit:cover;' + frameStyle + '">';
                } else if (c.avatar_type && c.avatar_type !== 'upload') {
                    const seed = c.avatar_value || c.user_id;
                    const dicebearUrl = 'https://api.dicebear.com/7.x/' + encodeURIComponent(c.avatar_type) + '/svg?seed=' + encodeURIComponent(seed);
                    avatarHtml = '<img src="' + dicebearUrl + '" alt="avatar" style="width:32px;height:32px;border-radius:50%;object-fit:cover;' + frameStyle + '">';
                } else {
                    const initial = c.username ? c.username.charAt(0).toUpperCase() : '?';
                    avatarHtml = '<div class="bg-gradient-to-br ' + avatarGradient + ' flex items-center justify-center text-xs font-bold" style="width:32px;height:32px;border-radius:50%;flex-shrink:0;' + frameStyle + '">' + initial + '</div>';
                }

                const div = document.createElement('div');
                div.className = 'comment-item ' + stanceClass + ' bg-gray-900/50 p-3 rounded';
                div.style.borderLeft = '3px solid ' + borderColor;
                div.innerHTML = '<div class="flex items-center mb-2"><div style="flex-shrink:0;margin-right:8px;">' + avatarHtml + '</div><div class="flex-1 min-w-0"><a href="/user/' + c.user_id + '" class="text-sm font-bold hover:text-cyan-400 transition-colors">@' + escapeHtml(c.username || 'unknown') + '</a>' + (isDevCommentUser ? '<span style="margin-left:4px;background:linear-gradient(135deg,#ffd700,#ff8c00);color:#000;font-size:9px;font-weight:900;padding:1px 6px;border-radius:8px;">DEV</span>' : '') + '<p class="text-xs text-' + stanceColor + '-400"><i class="fas fa-' + stanceIcon + ' mr-1"></i>' + stanceText + '</p></div></div><p class="text-sm text-gray-200" style="word-break:break-all;white-space:pre-wrap;">' + escapeHtml(c.content) + '</p>';
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
                if (navCredits) navCredits.textContent = Number(userData.credits).toLocaleString();
                if (window.updateCreditsDisplay) window.updateCreditsDisplay(userData.credits);
            }
        }
    } catch (e) { console.error('Credit sync error:', e); }
}

// ===== AI Profiles =====

const AI_PROFILES = {
    aether: {
        name: 'Aether',
        role: '賛成側 AI ディベーター',
        icon: 'fas fa-brain',
        gradient: 'from-green-500 to-emerald-500',
        trait: '論理的・データ重視',
        style: '構造的に根拠を積み上げる'
    },
    nova: {
        name: 'Nova',
        role: '反対側 AI ディベーター',
        icon: 'fas fa-fire',
        gradient: 'from-red-500 to-rose-500',
        trait: '批判的・反証重視',
        style: '矛盾を鋭く突く'
    }
};

function showAIProfile(aiId) {
    const profile = AI_PROFILES[aiId];
    if (!profile) return;
    const modal = document.getElementById('aiProfileModal');
    document.getElementById('aiProfileIcon').className = 'w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center bg-gradient-to-br ' + profile.gradient;
    document.getElementById('aiProfileIcon').innerHTML = '<i class="' + profile.icon + ' text-white text-3xl"></i>';
    document.getElementById('aiProfileName').textContent = profile.name;
    document.getElementById('aiProfileRole').textContent = profile.role;
    document.getElementById('aiProfileModel').textContent = AI_MODEL_DISPLAY;
    document.getElementById('aiProfileTrait').textContent = profile.trait;
    document.getElementById('aiProfileStyle').textContent = profile.style;
    modal.classList.remove('hidden');
}
window.showAIProfile = showAIProfile;

// ===== Initialize =====

window.addEventListener('DOMContentLoaded', async () => {
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
    setInterval(async () => {
        loadDebateMessagesFromD1();
        loadCommentsFromD1();

        if (!debateActive && !finalVotingMode) {
            try {
                const res = await fetch('/api/debate/' + DEBATE_ID + '/theme');
                if (res.ok) {
                    const data = await res.json();
                    if (data.status === 'live' || (data.status === 'upcoming' && data.scheduled_at && new Date(data.scheduled_at) <= new Date())) {
                        startDebate();
                    }
                }
            } catch (e) { }
        }

        try {
            const vRes = await fetch('/api/votes/' + DEBATE_ID);
            if (vRes.ok) {
                const vData = await vRes.json();
                if (vData && typeof vData.total === 'number') {
                    if (voteData.agree !== vData.agree || voteData.disagree !== vData.disagree || voteData.total !== vData.total) {
                        voteData.agree = vData.agree;
                        voteData.disagree = vData.disagree;
                        voteData.total = vData.total;
                        updateVoteDisplay();
                    }
                }
            }
        } catch (e) { }
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
