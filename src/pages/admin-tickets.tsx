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
    </head>
    <body class="bg-black text-white min-h-screen">
        ${globalNav(user)}
        
        <div class="container mx-auto px-6 py-24">
            <h1 class="text-4xl font-bold mb-8 cyber-text">
                <i class="fas fa-tools mr-3 text-red-500"></i>チケット管理 (DEV)
            </h1>
            
            <div class="grid grid-cols-4 gap-4 mb-8">
                <div class="cyber-card text-center">
                    <div class="text-3xl font-bold text-cyan-400" id="count-open">0</div>
                    <div class="text-sm text-gray-400">未対応</div>
                </div>
                <div class="cyber-card text-center">
                    <div class="text-3xl font-bold text-yellow-400" id="count-in-progress">0</div>
                    <div class="text-sm text-gray-400">対応中</div>
                </div>
                <div class="cyber-card text-center">
                    <div class="text-3xl font-bold text-green-400" id="count-resolved">0</div>
                    <div class="text-sm text-gray-400">解決済み</div>
                </div>
                <div class="cyber-card text-center">
                    <div class="text-3xl font-bold text-gray-400" id="count-closed">0</div>
                    <div class="text-sm text-gray-400">クローズ</div>
                </div>
            </div>
            
            <div id="tickets-list" class="space-y-4">
                <div class="text-center text-gray-400 py-8">
                    <i class="fas fa-spinner fa-spin text-3xl mb-4"></i>
                    <p>読み込み中...</p>
                </div>
            </div>
        </div>
        
        <!-- Ticket Detail Modal -->
        <div id="ticket-detail-modal" class="fixed inset-0 bg-black/90 backdrop-blur-md overflow-y-auto z-50 hidden">
            <div class="min-h-screen flex items-center justify-center p-4">
                <div class="cyber-card max-w-4xl w-full">
                    <div class="flex justify-between items-start mb-6">
                        <div>
                            <h2 id="ticket-detail-subject" class="text-2xl font-bold mb-2"></h2>
                            <div id="ticket-detail-info" class="text-sm text-gray-400"></div>
                        </div>
                        <button id="close-detail-btn" class="text-gray-400 hover:text-white">
                            <i class="fas fa-times text-2xl"></i>
                        </button>
                    </div>
                    
                    <div class="mb-6">
                        <label class="block text-sm font-bold mb-2">ステータス変更</label>
                        <select id="status-select" class="bg-gray-900 border border-cyan-500 rounded px-4 py-2">
                            <option value="open">未対応</option>
                            <option value="in_progress">対応中</option>
                            <option value="resolved">解決済み</option>
                            <option value="closed">クローズ</option>
                        </select>
                        <button id="update-status-btn" class="btn-primary ml-4">
                            <i class="fas fa-save mr-2"></i>更新
                        </button>
                    </div>
                    
                    <div id="ticket-messages" class="space-y-4 mb-6 max-h-96 overflow-y-auto"></div>
                    
                    <form id="reply-form" class="space-y-4">
                        <textarea id="reply-message" rows="4" 
                                  class="w-full bg-gray-900 border border-cyan-500 rounded px-4 py-2 text-white"
                                  placeholder="返信を入力してください (スタッフとして返信されます)"></textarea>
                        <button type="submit" class="btn-primary">
                            <i class="fas fa-reply mr-2"></i>スタッフとして返信
                        </button>
                    </form>
                </div>
            </div>
        </div>
        
        <script>
            let currentTicketId = null;
            let allTickets = [];
            
            async function loadTickets() {
                try {
                    const response = await fetch('/api/admin/tickets');
                    const data = await response.json();
                    
                    if (data.success) {
                        allTickets = data.tickets;
                        renderTickets(allTickets);
                        updateCounts(allTickets);
                    }
                } catch (error) {
                    console.error('Load tickets error:', error);
                }
            }
            
            function updateCounts(tickets) {
                const counts = {
                    open: 0,
                    in_progress: 0,
                    resolved: 0,
                    closed: 0
                };
                
                tickets.forEach(t => {
                    if (counts[t.status] !== undefined) {
                        counts[t.status]++;
                    }
                });
                
                document.getElementById('count-open').textContent = counts.open;
                document.getElementById('count-in-progress').textContent = counts.in_progress;
                document.getElementById('count-resolved').textContent = counts.resolved;
                document.getElementById('count-closed').textContent = counts.closed;
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
                         onclick="openTicket('\${ticket.id}', '\${ticket.status}')">
                        <div class="flex justify-between items-start">
                            <div class="flex-1">
                                <div class="flex items-center gap-4 mb-2">
                                    <h3 class="text-xl font-bold">\${ticket.subject}</h3>
                                    <span class="status-\${ticket.status} text-sm px-3 py-1 rounded-full">
                                        \${getStatusLabel(ticket.status)}
                                    </span>
                                    <span class="priority-\${ticket.priority} text-sm px-3 py-1 rounded-full">
                                        \${getPriorityLabel(ticket.priority)}
                                    </span>
                                </div>
                                <div class="flex gap-4 text-sm text-gray-400">
                                    <span><i class="fas fa-user mr-1"></i>\${ticket.nickname || ticket.user_id}</span>
                                    <span><i class="fas fa-envelope mr-1"></i>\${ticket.email || 'N/A'}</span>
                                    <span><i class="fas fa-clock mr-1"></i>\${new Date(ticket.created_at).toLocaleString('ja-JP')}</span>
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
            
            async function openTicket(ticketId, currentStatus) {
                currentTicketId = ticketId;
                
                try {
                    const response = await fetch(\`/api/tickets/\${ticketId}/messages\`);
                    const data = await response.json();
                    
                    if (data.success) {
                        const ticket = allTickets.find(t => t.id === ticketId);
                        renderTicketDetail(data.messages, ticket);
                        document.getElementById('status-select').value = currentStatus;
                        document.getElementById('ticket-detail-modal').classList.remove('hidden');
                    }
                } catch (error) {
                    console.error('Open ticket error:', error);
                }
            }
            
            function renderTicketDetail(messages, ticket) {
                if (messages.length === 0) return;
                
                document.getElementById('ticket-detail-subject').textContent = ticket.subject;
                document.getElementById('ticket-detail-info').innerHTML = \`
                    <div>ユーザー: \${ticket.nickname || ticket.user_id} (\${ticket.email || 'N/A'})</div>
                    <div>作成日時: \${new Date(ticket.created_at).toLocaleString('ja-JP')}</div>
                    <div>優先度: \${getPriorityLabel(ticket.priority)}</div>
                \`;
                
                const messagesContainer = document.getElementById('ticket-messages');
                messagesContainer.innerHTML = messages.map(msg => \`
                    <div class="\${msg.is_staff_reply ? 'bg-red-500/10 border-l-4 border-red-500' : 'bg-gray-800'} p-4 rounded">
                        <div class="flex justify-between mb-2">
                            <span class="font-bold">
                                \${msg.is_staff_reply ? '🛡️ サポートスタッフ' : '👤 ' + (msg.nickname || msg.user_id)}
                            </span>
                            <span class="text-sm text-gray-400">\${new Date(msg.created_at).toLocaleString('ja-JP')}</span>
                        </div>
                        <p class="text-gray-300 whitespace-pre-wrap">\${msg.message}</p>
                    </div>
                \`).join('');
            }
            
            document.getElementById('close-detail-btn').addEventListener('click', () => {
                document.getElementById('ticket-detail-modal').classList.add('hidden');
            });
            
            document.getElementById('update-status-btn').addEventListener('click', async () => {
                const status = document.getElementById('status-select').value;
                if (!currentTicketId) return;
                
                try {
                    const response = await fetch(\`/api/admin/tickets/\${currentTicketId}/status\`, {
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
                        const ticket = allTickets.find(t => t.id === currentTicketId);
                        openTicket(currentTicketId, ticket.status);
                        loadTickets();
                    }
                } catch (error) {
                    console.error('Reply error:', error);
                }
            });
            
            loadTickets();
        </script>
        
        <style>
            .status-open { background: #22d3ee20; color: #22d3ee; }
            .status-in_progress { background: #fbbf2420; color: #fbbf24; }
            .status-resolved { background: #34d39920; color: #34d399; }
            .status-closed { background: #9ca3af20; color: #9ca3af; }
            
            .priority-low { background: #9ca3af20; color: #9ca3af; }
            .priority-normal { background: #60a5fa20; color: #60a5fa; }
            .priority-high { background: #fb923c20; color: #fb923c; }
            .priority-urgent { background: #ef444420; color: #ef4444; }
        </style>
    </body>
    </html>
`
