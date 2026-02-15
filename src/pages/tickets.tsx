import { globalNav } from '../components/global-nav';

export const ticketsPage = (user: any) => `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>サポートチケット - AI Debate</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/styles.css" rel="stylesheet">
        <style>
            .chat-container {
                display: flex;
                height: calc(100vh - 200px);
                max-height: 700px;
                border: 1px solid rgba(6, 182, 212, 0.3);
                border-radius: 12px;
                overflow: hidden;
                background: rgba(0, 10, 20, 0.9);
            }
            .ticket-sidebar {
                width: 320px;
                border-right: 1px solid rgba(6, 182, 212, 0.2);
                display: flex;
                flex-direction: column;
                flex-shrink: 0;
            }
            .ticket-sidebar-header {
                padding: 16px;
                border-bottom: 1px solid rgba(6, 182, 212, 0.2);
                background: rgba(6, 182, 212, 0.05);
            }
            .ticket-list-container {
                flex: 1;
                overflow-y: auto;
            }
            .ticket-item {
                padding: 14px 16px;
                border-bottom: 1px solid rgba(255,255,255,0.05);
                cursor: pointer;
                transition: background 0.2s;
            }
            .ticket-item:hover {
                background: rgba(6, 182, 212, 0.1);
            }
            .ticket-item.active {
                background: rgba(6, 182, 212, 0.15);
                border-left: 3px solid #06b6d4;
            }
            .chat-main {
                flex: 1;
                display: flex;
                flex-direction: column;
            }
            .chat-header {
                padding: 16px 20px;
                border-bottom: 1px solid rgba(6, 182, 212, 0.2);
                background: rgba(6, 182, 212, 0.05);
            }
            .chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .chat-input-area {
                padding: 16px 20px;
                border-top: 1px solid rgba(6, 182, 212, 0.2);
                background: rgba(0, 10, 20, 0.95);
            }
            .msg-user {
                align-self: flex-end;
                max-width: 80%;
                background: linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(6, 182, 212, 0.15));
                border: 1px solid rgba(6, 182, 212, 0.3);
                border-radius: 16px 16px 4px 16px;
                padding: 12px 16px;
            }
            .msg-staff {
                align-self: flex-start;
                max-width: 80%;
                background: linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(168, 85, 247, 0.15));
                border: 1px solid rgba(168, 85, 247, 0.3);
                border-radius: 16px 16px 16px 4px;
                padding: 12px 16px;
            }
            .msg-sender {
                font-size: 12px;
                font-weight: 700;
                margin-bottom: 4px;
            }
            .msg-text {
                font-size: 14px;
                line-height: 1.6;
                white-space: pre-wrap;
                word-break: break-word;
            }
            .msg-time {
                font-size: 11px;
                color: #6b7280;
                margin-top: 4px;
                text-align: right;
            }
            .status-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                display: inline-block;
                margin-right: 6px;
            }
            .status-dot.open { background: #22d3ee; }
            .status-dot.in_progress { background: #fbbf24; }
            .status-dot.resolved { background: #34d399; }
            .status-dot.closed { background: #9ca3af; }
            
            @media (max-width: 768px) {
                .chat-container { flex-direction: column; height: calc(100vh - 160px); }
                .ticket-sidebar { width: 100%; max-height: 200px; border-right: none; border-bottom: 1px solid rgba(6, 182, 212, 0.2); }
                .ticket-item { padding: 10px 12px; }
            }
        </style>
    </head>
    <body class="bg-black text-white min-h-screen">
        ${globalNav(user)}
        
        <div class="container mx-auto px-4 py-20">
            <div class="max-w-6xl mx-auto">
                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-3xl font-bold cyber-text">
                        <i class="fas fa-headset mr-3"></i>サポート
                    </h1>
                    <button id="new-ticket-btn" class="btn-primary text-sm">
                        <i class="fas fa-plus mr-2"></i>新しいチケット
                    </button>
                </div>
                
                <div class="chat-container">
                    <!-- Sidebar: Ticket List -->
                    <div class="ticket-sidebar">
                        <div class="ticket-sidebar-header">
                            <div class="text-sm font-bold text-cyan-400">チケット一覧</div>
                        </div>
                        <div id="ticket-list" class="ticket-list-container">
                            <div class="text-center text-gray-500 py-8 text-sm">
                                <i class="fas fa-spinner fa-spin text-lg mb-2"></i>
                                <div>読み込み中...</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Main: Chat Area -->
                    <div class="chat-main">
                        <div id="chat-header" class="chat-header hidden">
                            <div class="flex justify-between items-center">
                                <div>
                                    <div id="chat-subject" class="font-bold text-lg"></div>
                                    <div id="chat-status" class="text-sm text-gray-400"></div>
                                </div>
                            </div>
                        </div>
                        <div id="chat-messages" class="chat-messages">
                            <div class="flex-1 flex items-center justify-center text-gray-500">
                                <div class="text-center">
                                    <i class="fas fa-comments text-5xl mb-4 text-cyan-500/30"></i>
                                    <p class="text-lg">チケットを選択してチャットを表示</p>
                                    <p class="text-sm mt-2">左のリストからチケットを選ぶか、新しいチケットを作成してください</p>
                                </div>
                            </div>
                        </div>
                        <div id="chat-input-area" class="chat-input-area hidden">
                            <div class="flex gap-3">
                                <textarea id="reply-input" rows="1" 
                                    class="flex-1 bg-gray-900 border border-cyan-500/40 rounded-lg px-4 py-3 text-white text-sm resize-none focus:outline-none focus:border-cyan-400"
                                    placeholder="メッセージを入力..."
                                    onkeydown="if(event.key==='Enter' && !event.shiftKey){event.preventDefault();sendReply()}"
                                ></textarea>
                                <button onclick="sendReply()" class="bg-cyan-500 hover:bg-cyan-600 text-white px-5 rounded-lg transition flex items-center">
                                    <i class="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- New Ticket Modal -->
        <div id="new-ticket-modal" class="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 hidden">
            <div class="cyber-card max-w-lg w-full mx-4">
                <h2 class="text-2xl font-bold mb-6">
                    <i class="fas fa-ticket-alt mr-2 text-cyan-400"></i>新しいチケット
                </h2>
                <form id="new-ticket-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-bold mb-2">件名 *</label>
                        <input type="text" id="ticket-subject" required 
                               class="w-full bg-gray-900 border border-cyan-500 rounded px-4 py-2 text-white"
                               placeholder="問題の概要">
                    </div>
                    <div>
                        <label class="block text-sm font-bold mb-2">詳細 *</label>
                        <textarea id="ticket-message" required rows="4"
                                  class="w-full bg-gray-900 border border-cyan-500 rounded px-4 py-2 text-white"
                                  placeholder="問題の詳細"></textarea>
                    </div>
                    <div class="flex gap-4">
                        <button type="submit" class="btn-primary flex-1">
                            <i class="fas fa-paper-plane mr-2"></i>送信
                        </button>
                        <button type="button" onclick="document.getElementById('new-ticket-modal').classList.add('hidden')" class="btn-secondary flex-1">
                            キャンセル
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
        <script>
            let currentTicketId = null;
            let ticketsData = [];
            let messageRefreshInterval = null;
            
            async function loadTickets() {
                try {
                    const response = await fetch('/api/tickets');
                    const data = await response.json();
                    
                    if (data.success) {
                        ticketsData = data.tickets;
                        renderTicketList(data.tickets);
                    }
                } catch (error) {
                    console.error('Load tickets error:', error);
                    document.getElementById('ticket-list').innerHTML = 
                        '<div class="text-center text-red-400 py-8 text-sm">読み込みエラー</div>';
                }
            }
            
            function renderTicketList(tickets) {
                const container = document.getElementById('ticket-list');
                
                if (tickets.length === 0) {
                    container.innerHTML = '<div class="text-center text-gray-500 py-8 text-sm"><i class="fas fa-inbox text-2xl mb-2"></i><div>チケットがありません</div></div>';
                    return;
                }
                
                container.innerHTML = tickets.map(t => \`
                    <div class="ticket-item \${currentTicketId === t.id ? 'active' : ''}" 
                         onclick="openTicket('\${t.id}')">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="status-dot \${t.status}"></span>
                            <span class="text-sm font-bold truncate flex-1">\${t.subject}</span>
                        </div>
                        <div class="flex justify-between text-xs text-gray-500">
                            <span>\${getStatusLabel(t.status)}</span>
                            <span>\${formatDate(t.updated_at || t.created_at)}</span>
                        </div>
                    </div>
                \`).join('');
            }
            
            function getStatusLabel(status) {
                return { open: '未対応', in_progress: '対応中', resolved: '解決済み', closed: 'クローズ' }[status] || status;
            }
            
            function formatDate(dateStr) {
                if (!dateStr) return '';
                const d = new Date(dateStr);
                const now = new Date();
                const diff = now - d;
                if (diff < 60000) return 'たった今';
                if (diff < 3600000) return Math.floor(diff/60000) + '分前';
                if (diff < 86400000) return Math.floor(diff/3600000) + '時間前';
                return d.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
            }
            
            async function openTicket(ticketId) {
                currentTicketId = ticketId;
                
                // Update sidebar highlight
                document.querySelectorAll('.ticket-item').forEach((el, i) => {
                    el.classList.toggle('active', ticketsData[i] && ticketsData[i].id === ticketId);
                });
                
                const ticket = ticketsData.find(t => t.id === ticketId);
                
                // Show header and input
                document.getElementById('chat-header').classList.remove('hidden');
                document.getElementById('chat-input-area').classList.remove('hidden');
                document.getElementById('chat-subject').textContent = ticket ? ticket.subject : 'チケット';
                
                const statusLabel = ticket ? getStatusLabel(ticket.status) : '';
                document.getElementById('chat-status').innerHTML = '<span class="status-dot ' + (ticket ? ticket.status : '') + '"></span>' + statusLabel;
                
                // Hide input if resolved/closed
                if (ticket && (ticket.status === 'resolved' || ticket.status === 'closed')) {
                    document.getElementById('chat-input-area').classList.add('hidden');
                }
                
                await loadMessages(ticketId);
                
                // Set up auto-refresh for messages
                if (messageRefreshInterval) clearInterval(messageRefreshInterval);
                messageRefreshInterval = setInterval(() => loadMessages(ticketId, true), 5000);
            }
            
            async function loadMessages(ticketId, silent) {
                try {
                    const response = await fetch('/api/tickets/' + ticketId + '/messages');
                    const data = await response.json();
                    
                    if (data.success) {
                        renderMessages(data.messages);
                    }
                } catch (error) {
                    if (!silent) console.error('Load messages error:', error);
                }
            }
            
            function renderMessages(messages) {
                const container = document.getElementById('chat-messages');
                const wasAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;
                
                container.innerHTML = messages.map(msg => {
                    const isStaff = msg.is_staff_reply;
                    const cls = isStaff ? 'msg-staff' : 'msg-user';
                    const senderName = isStaff ? 'サポートスタッフ' : (msg.nickname || msg.user_id || 'あなた');
                    const senderIcon = isStaff ? '<i class="fas fa-headset mr-1 text-purple-400"></i>' : '<i class="fas fa-user mr-1 text-cyan-400"></i>';
                    const time = new Date(msg.created_at).toLocaleString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                    
                    return '<div class="' + cls + '">' +
                        '<div class="msg-sender">' + senderIcon + senderName + '</div>' +
                        '<div class="msg-text">' + escapeHtml(msg.message) + '</div>' +
                        '<div class="msg-time">' + time + '</div>' +
                    '</div>';
                }).join('');
                
                if (wasAtBottom) {
                    requestAnimationFrame(() => { container.scrollTop = container.scrollHeight; });
                }
            }
            
            function escapeHtml(text) {
                const div = document.createElement('div');
                div.textContent = text;
                return div.innerHTML;
            }
            
            async function sendReply() {
                const input = document.getElementById('reply-input');
                const message = input.value.trim();
                if (!message || !currentTicketId) return;
                
                input.value = '';
                input.style.height = 'auto';
                
                try {
                    const response = await fetch('/api/tickets/' + currentTicketId + '/reply', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message })
                    });
                    
                    const data = await response.json();
                    if (data.success) {
                        await loadMessages(currentTicketId);
                    } else {
                        alert(data.error || 'エラーが発生しました');
                    }
                } catch (error) {
                    console.error('Reply error:', error);
                    alert('送信エラー');
                }
            }
            
            // New ticket
            document.getElementById('new-ticket-btn').addEventListener('click', () => {
                document.getElementById('new-ticket-modal').classList.remove('hidden');
            });
            
            document.getElementById('new-ticket-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const subject = document.getElementById('ticket-subject').value;
                const message = document.getElementById('ticket-message').value;
                
                try {
                    const response = await fetch('/api/tickets/create', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ subject, message })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        document.getElementById('new-ticket-modal').classList.add('hidden');
                        document.getElementById('new-ticket-form').reset();
                        await loadTickets();
                        openTicket(data.ticket_id);
                    } else {
                        alert(data.error || 'エラーが発生しました');
                    }
                } catch (error) {
                    console.error('Create ticket error:', error);
                    alert('エラーが発生しました');
                }
            });
            
            // Auto-resize textarea
            document.getElementById('reply-input').addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = Math.min(this.scrollHeight, 120) + 'px';
            });
            
            loadTickets();
        </script>
    </body>
    </html>
`
