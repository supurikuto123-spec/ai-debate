import { globalNav } from '../components/global-nav';

export const adminTicketsPage = (user: any) => `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>チケット管理 - AI Debate Admin</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/styles.css" rel="stylesheet">
        <style>
            .chat-container {
                display: flex;
                height: calc(100vh - 220px);
                max-height: 750px;
                border: 1px solid rgba(239, 68, 68, 0.3);
                border-radius: 12px;
                overflow: hidden;
                background: rgba(0, 10, 20, 0.9);
            }
            .ticket-sidebar {
                width: 360px;
                border-right: 1px solid rgba(239, 68, 68, 0.2);
                display: flex;
                flex-direction: column;
                flex-shrink: 0;
            }
            .ticket-sidebar-header {
                padding: 16px;
                border-bottom: 1px solid rgba(239, 68, 68, 0.2);
                background: rgba(239, 68, 68, 0.05);
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
                background: rgba(239, 68, 68, 0.1);
            }
            .ticket-item.active {
                background: rgba(239, 68, 68, 0.15);
                border-left: 3px solid #ef4444;
            }
            .chat-main {
                flex: 1;
                display: flex;
                flex-direction: column;
            }
            .chat-header {
                padding: 16px 20px;
                border-bottom: 1px solid rgba(239, 68, 68, 0.2);
                background: rgba(239, 68, 68, 0.05);
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
                border-top: 1px solid rgba(239, 68, 68, 0.2);
                background: rgba(0, 10, 20, 0.95);
            }
            .msg-user {
                align-self: flex-start;
                max-width: 80%;
                background: linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(6, 182, 212, 0.15));
                border: 1px solid rgba(6, 182, 212, 0.3);
                border-radius: 16px 16px 16px 4px;
                padding: 12px 16px;
            }
            .msg-staff {
                align-self: flex-end;
                max-width: 80%;
                background: linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(239, 68, 68, 0.15));
                border: 1px solid rgba(239, 68, 68, 0.3);
                border-radius: 16px 16px 4px 16px;
                padding: 12px 16px;
            }
            .msg-sender { font-size: 12px; font-weight: 700; margin-bottom: 4px; }
            .msg-text { font-size: 14px; line-height: 1.6; white-space: pre-wrap; word-break: break-word; }
            .msg-time { font-size: 11px; color: #6b7280; margin-top: 4px; text-align: right; }
            .status-dot {
                width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 6px;
            }
            .status-dot.open { background: #22d3ee; }
            .status-dot.in_progress { background: #fbbf24; }
            .status-dot.resolved { background: #34d399; }
            .status-dot.closed { background: #9ca3af; }
            .status-badge {
                font-size: 11px; padding: 2px 8px; border-radius: 10px; font-weight: 700;
            }
            .status-badge.open { background: #22d3ee20; color: #22d3ee; }
            .status-badge.in_progress { background: #fbbf2420; color: #fbbf24; }
            .status-badge.resolved { background: #34d39920; color: #34d399; }
            .status-badge.closed { background: #9ca3af20; color: #9ca3af; }
            
            @media (max-width: 768px) {
                .chat-container { flex-direction: column; height: calc(100vh - 200px); }
                .ticket-sidebar { width: 100%; max-height: 220px; border-right: none; border-bottom: 1px solid rgba(239, 68, 68, 0.2); }
            }
        </style>
    </head>
    <body class="bg-black text-white min-h-screen">
        ${globalNav(user)}
        
        <div class="container mx-auto px-4 py-20">
            <h1 class="text-3xl font-bold mb-4 cyber-text">
                <i class="fas fa-tools mr-3 text-red-500"></i>チケット管理 (DEV)
            </h1>
            
            <!-- Status Counts -->
            <div class="grid grid-cols-4 gap-3 mb-6">
                <div class="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 text-center">
                    <div class="text-2xl font-bold text-cyan-400" id="count-open">0</div>
                    <div class="text-xs text-gray-400">未対応</div>
                </div>
                <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-center">
                    <div class="text-2xl font-bold text-yellow-400" id="count-in-progress">0</div>
                    <div class="text-xs text-gray-400">対応中</div>
                </div>
                <div class="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                    <div class="text-2xl font-bold text-green-400" id="count-resolved">0</div>
                    <div class="text-xs text-gray-400">解決済み</div>
                </div>
                <div class="bg-gray-500/10 border border-gray-500/30 rounded-lg p-3 text-center">
                    <div class="text-2xl font-bold text-gray-400" id="count-closed">0</div>
                    <div class="text-xs text-gray-400">クローズ</div>
                </div>
            </div>
            
            <div class="chat-container">
                <!-- Sidebar -->
                <div class="ticket-sidebar">
                    <div class="ticket-sidebar-header">
                        <div class="text-sm font-bold text-red-400"><i class="fas fa-ticket-alt mr-1"></i> 全チケット</div>
                    </div>
                    <div id="ticket-list" class="ticket-list-container">
                        <div class="text-center text-gray-500 py-8 text-sm">
                            <i class="fas fa-spinner fa-spin text-lg mb-2"></i>
                            <div>読み込み中...</div>
                        </div>
                    </div>
                </div>
                
                <!-- Chat Area -->
                <div class="chat-main">
                    <div id="chat-header" class="chat-header hidden">
                        <div class="flex justify-between items-center flex-wrap gap-2">
                            <div>
                                <div id="chat-subject" class="font-bold text-lg"></div>
                                <div id="chat-user-info" class="text-xs text-gray-400"></div>
                            </div>
                            <div class="flex items-center gap-3">
                                <select id="status-select" class="bg-gray-900 border border-red-500/50 rounded px-3 py-1 text-sm">
                                    <option value="open">未対応</option>
                                    <option value="in_progress">対応中</option>
                                    <option value="resolved">解決済み</option>
                                    <option value="closed">クローズ</option>
                                </select>
                                <button onclick="updateStatus()" class="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded transition">
                                    <i class="fas fa-save mr-1"></i>更新
                                </button>
                            </div>
                        </div>
                    </div>
                    <div id="chat-messages" class="chat-messages">
                        <div class="flex-1 flex items-center justify-center text-gray-500">
                            <div class="text-center">
                                <i class="fas fa-shield-alt text-5xl mb-4 text-red-500/30"></i>
                                <p class="text-lg">チケットを選択</p>
                                <p class="text-sm mt-2">左のリストからチケットを選んで対応してください</p>
                            </div>
                        </div>
                    </div>
                    <div id="chat-input-area" class="chat-input-area hidden">
                        <div class="flex gap-3">
                            <textarea id="reply-input" rows="1" 
                                class="flex-1 bg-gray-900 border border-red-500/40 rounded-lg px-4 py-3 text-white text-sm resize-none focus:outline-none focus:border-red-400"
                                placeholder="スタッフとして返信..."
                                onkeydown="if(event.key==='Enter' && !event.shiftKey){event.preventDefault();sendReply()}"
                            ></textarea>
                            <button onclick="sendReply()" class="bg-red-500 hover:bg-red-600 text-white px-5 rounded-lg transition flex items-center">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <script>
            let currentTicketId = null;
            let allTickets = [];
            let messageRefreshInterval = null;
            
            async function loadTickets() {
                try {
                    const response = await fetch('/api/admin/tickets');
                    const data = await response.json();
                    
                    if (data.success) {
                        allTickets = data.tickets;
                        renderTicketList(allTickets);
                        updateCounts(allTickets);
                    }
                } catch (error) {
                    console.error('Load tickets error:', error);
                }
            }
            
            function updateCounts(tickets) {
                const counts = { open: 0, in_progress: 0, resolved: 0, closed: 0 };
                tickets.forEach(t => { if (counts[t.status] !== undefined) counts[t.status]++; });
                document.getElementById('count-open').textContent = counts.open;
                document.getElementById('count-in-progress').textContent = counts.in_progress;
                document.getElementById('count-resolved').textContent = counts.resolved;
                document.getElementById('count-closed').textContent = counts.closed;
            }
            
            function renderTicketList(tickets) {
                const container = document.getElementById('ticket-list');
                
                if (tickets.length === 0) {
                    container.innerHTML = '<div class="text-center text-gray-500 py-8 text-sm"><i class="fas fa-inbox text-2xl mb-2"></i><div>チケットなし</div></div>';
                    return;
                }
                
                container.innerHTML = tickets.map(t => \`
                    <div class="ticket-item \${currentTicketId === t.id ? 'active' : ''}" 
                         onclick="openTicket('\${t.id}')">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="status-dot \${t.status}"></span>
                            <span class="text-sm font-bold truncate flex-1">\${t.subject}</span>
                            <span class="status-badge \${t.status}">\${getStatusLabel(t.status)}</span>
                        </div>
                        <div class="flex justify-between text-xs text-gray-500">
                            <span><i class="fas fa-user mr-1"></i>\${t.nickname || t.user_id}</span>
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
                const ticket = allTickets.find(t => t.id === ticketId);
                
                // Re-render sidebar to show active state
                renderTicketList(allTickets);
                
                // Show header and input
                document.getElementById('chat-header').classList.remove('hidden');
                document.getElementById('chat-input-area').classList.remove('hidden');
                document.getElementById('chat-subject').textContent = ticket ? ticket.subject : 'チケット';
                document.getElementById('chat-user-info').innerHTML = ticket 
                    ? '<i class="fas fa-user mr-1"></i>' + (ticket.nickname || ticket.user_id) + ' ・ <i class="fas fa-envelope mr-1"></i>' + (ticket.email || 'N/A')
                    : '';
                
                if (ticket) {
                    document.getElementById('status-select').value = ticket.status;
                }
                
                await loadMessages(ticketId);
                
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
                    const senderName = isStaff ? 'スタッフ (あなた)' : (msg.nickname || msg.user_id || 'ユーザー');
                    const senderIcon = isStaff ? '<i class="fas fa-shield-alt mr-1 text-red-400"></i>' : '<i class="fas fa-user mr-1 text-cyan-400"></i>';
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
                        loadTickets(); // Refresh sidebar
                    } else {
                        alert(data.error || 'エラーが発生しました');
                    }
                } catch (error) {
                    console.error('Reply error:', error);
                }
            }
            
            async function updateStatus() {
                if (!currentTicketId) return;
                const status = document.getElementById('status-select').value;
                
                try {
                    const response = await fetch('/api/admin/tickets/' + currentTicketId + '/status', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status })
                    });
                    
                    const data = await response.json();
                    if (data.success) {
                        alert('ステータスを更新しました');
                        loadTickets();
                    }
                } catch (error) {
                    console.error('Update status error:', error);
                }
            }
            
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
