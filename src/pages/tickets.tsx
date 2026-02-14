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
    </head>
    <body class="bg-black text-white min-h-screen">
        ${globalNav(user)}
        
        <div class="container mx-auto px-6 py-24">
            <div class="max-w-4xl mx-auto">
                <h1 class="text-4xl font-bold mb-8 cyber-text">
                    <i class="fas fa-headset mr-3"></i>サポートチケット
                </h1>
                
                <div class="grid md:grid-cols-2 gap-6 mb-8">
                    <div class="cyber-card">
                        <h3 class="text-xl font-bold mb-2"><i class="fas fa-info-circle mr-2 text-cyan-400"></i>チケットについて</h3>
                        <p class="text-gray-400 text-sm">
                            問題や質問がある場合、サポートチケットを作成してください。1ユーザーにつき1件のオープンチケットのみ作成可能です。
                        </p>
                    </div>
                    <div class="cyber-card">
                        <h3 class="text-xl font-bold mb-2"><i class="fas fa-clock mr-2 text-yellow-400"></i>対応時間</h3>
                        <p class="text-gray-400 text-sm">
                            通常24時間以内に返信いたします。緊急の場合は優先度を「高」に設定してください。
                        </p>
                    </div>
                </div>
                
                <button id="new-ticket-btn" class="btn-primary mb-8">
                    <i class="fas fa-plus mr-2"></i>新しいチケットを作成
                </button>
                
                <div id="tickets-list" class="space-y-4">
                    <div class="text-center text-gray-400 py-8">
                        <i class="fas fa-spinner fa-spin text-3xl mb-4"></i>
                        <p>読み込み中...</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- New Ticket Modal -->
        <div id="new-ticket-modal" class="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 hidden">
            <div class="cyber-card max-w-2xl w-full mx-4">
                <h2 class="text-3xl font-bold mb-6">
                    <i class="fas fa-ticket-alt mr-2 text-cyan-400"></i>新しいチケットを作成
                </h2>
                <form id="new-ticket-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-bold mb-2">件名 *</label>
                        <input type="text" id="ticket-subject" required 
                               class="w-full bg-gray-900 border border-cyan-500 rounded px-4 py-2 text-white"
                               placeholder="問題の概要を入力してください">
                    </div>
                    <div>
                        <label class="block text-sm font-bold mb-2">優先度</label>
                        <select id="ticket-priority" 
                                class="w-full bg-gray-900 border border-cyan-500 rounded px-4 py-2 text-white">
                            <option value="low">低</option>
                            <option value="normal" selected>普通</option>
                            <option value="high">高</option>
                            <option value="urgent">緊急</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-bold mb-2">詳細 *</label>
                        <textarea id="ticket-message" required rows="6"
                                  class="w-full bg-gray-900 border border-cyan-500 rounded px-4 py-2 text-white"
                                  placeholder="問題の詳細を入力してください"></textarea>
                    </div>
                    <div class="flex gap-4">
                        <button type="submit" class="btn-primary flex-1">
                            <i class="fas fa-paper-plane mr-2"></i>送信
                        </button>
                        <button type="button" id="cancel-ticket-btn" class="btn-secondary flex-1">
                            キャンセル
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
        <!-- Ticket Detail Modal -->
        <div id="ticket-detail-modal" class="fixed inset-0 bg-black/90 backdrop-blur-md overflow-y-auto z-50 hidden">
            <div class="min-h-screen flex items-center justify-center p-4">
                <div class="cyber-card max-w-3xl w-full">
                    <div class="flex justify-between items-start mb-6">
                        <h2 id="ticket-detail-subject" class="text-2xl font-bold"></h2>
                        <button id="close-detail-btn" class="text-gray-400 hover:text-white">
                            <i class="fas fa-times text-2xl"></i>
                        </button>
                    </div>
                    <div id="ticket-detail-info" class="mb-6"></div>
                    <div id="ticket-messages" class="space-y-4 mb-6 max-h-96 overflow-y-auto"></div>
                    <form id="reply-form" class="space-y-4">
                        <textarea id="reply-message" rows="4" 
                                  class="w-full bg-gray-900 border border-cyan-500 rounded px-4 py-2 text-white"
                                  placeholder="返信を入力してください"></textarea>
                        <button type="submit" class="btn-primary">
                            <i class="fas fa-reply mr-2"></i>返信
                        </button>
                    </form>
                </div>
            </div>
        </div>
        
        <script>
            let currentTicketId = null;
            
            // Load tickets
            async function loadTickets() {
                try {
                    const response = await fetch('/api/tickets');
                    const data = await response.json();
                    
                    if (data.success) {
                        renderTickets(data.tickets);
                    }
                } catch (error) {
                    console.error('Load tickets error:', error);
                    document.getElementById('tickets-list').innerHTML = 
                        '<div class="text-center text-red-400 py-8">読み込みエラー</div>';
                }
            }
            
            function renderTickets(tickets) {
                const container = document.getElementById('tickets-list');
                
                if (tickets.length === 0) {
                    container.innerHTML = \`
                        <div class="text-center text-gray-400 py-8">
                            <i class="fas fa-inbox text-4xl mb-4"></i>
                            <p>チケットがありません</p>
                        </div>
                    \`;
                    return;
                }
                
                container.innerHTML = tickets.map(ticket => \`
                    <div class="cyber-card cursor-pointer hover:border-cyan-300 transition" 
                         onclick="openTicket('\${ticket.id}')">
                        <div class="flex justify-between items-start">
                            <div class="flex-1">
                                <h3 class="text-xl font-bold mb-2">\${ticket.subject}</h3>
                                <div class="flex gap-4 text-sm text-gray-400">
                                    <span><i class="fas fa-clock mr-1"></i>\${new Date(ticket.created_at).toLocaleString('ja-JP')}</span>
                                    <span class="status-\${ticket.status}">
                                        <i class="fas fa-circle mr-1"></i>\${getStatusLabel(ticket.status)}
                                    </span>
                                    <span class="priority-\${ticket.priority}">
                                        <i class="fas fa-flag mr-1"></i>\${getPriorityLabel(ticket.priority)}
                                    </span>
                                </div>
                            </div>
                            <i class="fas fa-chevron-right text-cyan-400"></i>
                        </div>
                    </div>
                \`).join('');
            }
            
            function getStatusLabel(status) {
                const labels = {
                    open: '未対応',
                    in_progress: '対応中',
                    resolved: '解決済み',
                    closed: 'クローズ'
                };
                return labels[status] || status;
            }
            
            function getPriorityLabel(priority) {
                const labels = {
                    low: '低',
                    normal: '普通',
                    high: '高',
                    urgent: '緊急'
                };
                return labels[priority] || priority;
            }
            
            // New ticket
            document.getElementById('new-ticket-btn').addEventListener('click', () => {
                document.getElementById('new-ticket-modal').classList.remove('hidden');
            });
            
            document.getElementById('cancel-ticket-btn').addEventListener('click', () => {
                document.getElementById('new-ticket-modal').classList.add('hidden');
            });
            
            document.getElementById('new-ticket-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const subject = document.getElementById('ticket-subject').value;
                const message = document.getElementById('ticket-message').value;
                const priority = document.getElementById('ticket-priority').value;
                
                try {
                    const response = await fetch('/api/tickets/create', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ subject, message, priority })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        document.getElementById('new-ticket-modal').classList.add('hidden');
                        document.getElementById('new-ticket-form').reset();
                        loadTickets();
                        alert('チケットを作成しました');
                    } else {
                        alert(data.error || 'エラーが発生しました');
                    }
                } catch (error) {
                    console.error('Create ticket error:', error);
                    alert('エラーが発生しました');
                }
            });
            
            // Open ticket detail
            async function openTicket(ticketId) {
                currentTicketId = ticketId;
                
                try {
                    const response = await fetch(\`/api/tickets/\${ticketId}/messages\`);
                    const data = await response.json();
                    
                    if (data.success) {
                        renderTicketDetail(data.messages);
                        document.getElementById('ticket-detail-modal').classList.remove('hidden');
                    }
                } catch (error) {
                    console.error('Open ticket error:', error);
                }
            }
            
            function renderTicketDetail(messages) {
                if (messages.length === 0) return;
                
                const firstMessage = messages[0];
                document.getElementById('ticket-detail-subject').textContent = firstMessage.subject || 'チケット詳細';
                
                const messagesContainer = document.getElementById('ticket-messages');
                messagesContainer.innerHTML = messages.map(msg => \`
                    <div class="\${msg.is_staff_reply ? 'bg-cyan-500/10 border-l-4 border-cyan-500' : 'bg-gray-800'} p-4 rounded">
                        <div class="flex justify-between mb-2">
                            <span class="font-bold">\${msg.is_staff_reply ? 'サポートスタッフ' : msg.nickname || msg.user_id}</span>
                            <span class="text-sm text-gray-400">\${new Date(msg.created_at).toLocaleString('ja-JP')}</span>
                        </div>
                        <p class="text-gray-300">\${msg.message}</p>
                    </div>
                \`).join('');
            }
            
            document.getElementById('close-detail-btn').addEventListener('click', () => {
                document.getElementById('ticket-detail-modal').classList.add('hidden');
            });
            
            document.getElementById('reply-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const message = document.getElementById('reply-message').value;
                if (!message || !currentTicketId) return;
                
                try {
                    const response = await fetch(\`/api/tickets/\${currentTicketId}/reply\`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        document.getElementById('reply-message').value = '';
                        openTicket(currentTicketId); // Reload messages
                    } else {
                        alert(data.error || 'エラーが発生しました');
                    }
                } catch (error) {
                    console.error('Reply error:', error);
                    alert('エラーが発生しました');
                }
            });
            
            // Initial load
            loadTickets();
        </script>
        
        <style>
            .status-open { color: #22d3ee; }
            .status-in_progress { color: #fbbf24; }
            .status-resolved { color: #34d399; }
            .status-closed { color: #9ca3af; }
            
            .priority-low { color: #9ca3af; }
            .priority-normal { color: #60a5fa; }
            .priority-high { color: #fb923c; }
            .priority-urgent { color: #ef4444; }
        </style>
    </body>
    </html>
`
