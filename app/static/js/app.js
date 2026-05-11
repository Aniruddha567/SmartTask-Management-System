// Utility for showing toasts
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'bx-info-circle';
    if(type === 'success') icon = 'bx-check-circle';
    if(type === 'error') icon = 'bx-error-circle';
    
    toast.innerHTML = `<i class='bx ${icon}'></i> <span>${message}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Only run dashboard logic if we are on dashboard
if (window.location.pathname === '/dashboard') {
    let currentUserId = null;
    
    // Setup Socket.IO
    const socket = io();
    
    socket.on('connect', () => {
        console.log('Connected to WebSocket');
    });

    socket.on('task_update', (data) => {
        if (data.action === 'create' || data.action === 'update') {
            // Check if task belongs to current user
            if(data.task.user_id === currentUserId) {
                showToast(`Task ${data.action}d`, 'info');
                loadTasks();
                loadAnalytics();
            }
        } else if (data.action === 'delete') {
            showToast('Task deleted', 'info');
            loadTasks();
            loadAnalytics();
        }
    });

    // Initialize Dashboard
    async function initDashboard() {
        await fetchUser();
        await loadTasks();
        await loadAnalytics();
    }

    async function fetchUser() {
        try {
            const res = await fetch('/api/user');
            if (res.ok) {
                const data = await res.json();
                currentUserId = data.id;
                document.getElementById('welcome-msg').textContent = `Welcome, ${data.username}`;
            } else {
                window.location.href = '/login';
            }
        } catch (e) {
            console.error(e);
        }
    }

    // Load Analytics
    async function loadAnalytics() {
        try {
            const res = await fetch('/api/analytics');
            if (res.ok) {
                const data = await res.json();
                document.getElementById('stat-total').textContent = data.total_tasks;
                document.getElementById('stat-completed').textContent = data.completed_tasks;
                document.getElementById('stat-pending').textContent = data.pending_tasks;
                document.getElementById('stat-percent').textContent = `${data.completion_percentage}%`;
                document.getElementById('stat-progress-fill').style.width = `${data.completion_percentage}%`;
            }
        } catch (e) {
            console.error('Failed to load analytics', e);
        }
    }

    // Load Tasks
    async function loadTasks() {
        try {
            const res = await fetch('/api/tasks');
            if (res.ok) {
                const tasks = await res.json();
                renderTasks(tasks);
            }
        } catch (e) {
            console.error('Failed to load tasks', e);
        }
    }

    function renderTasks(tasks) {
        const container = document.getElementById('tasks-container');
        container.innerHTML = '';
        
        if (tasks.length === 0) {
            container.innerHTML = '<div class="empty-state">No tasks found. Add one!</div>';
            return;
        }

        tasks.forEach(task => {
            const dateStr = new Date(task.created_date).toLocaleString();
            const isCompleted = task.status === 'Completed';
            
            const div = document.createElement('div');
            div.className = `task-item ${isCompleted ? 'completed' : ''}`;
            
            div.innerHTML = `
                <div class="task-info">
                    <div class="task-header">
                        <span class="task-title">${task.title}</span>
                        <span class="badge badge-${task.priority}">${task.priority}</span>
                    </div>
                    <div class="task-desc">${task.description || 'No description'}</div>
                    <div class="task-meta">
                        <span><i class='bx bx-calendar'></i> ${dateStr}</span>
                        <span><i class='bx bx-loader-circle'></i> ${task.status}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="btn-icon success" onclick="toggleStatus(${task.id}, '${task.status}')" title="Toggle Status">
                        <i class='bx ${isCompleted ? 'bx-undo' : 'bx-check'}'></i>
                    </button>
                    <button class="btn-icon danger" onclick="deleteTask(${task.id})" title="Delete Task">
                        <i class='bx bx-trash'></i>
                    </button>
                </div>
            `;
            container.appendChild(div);
        });
    }

    // Form Submissions
    document.getElementById('add-task-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('task-title').value;
        const desc = document.getElementById('task-desc').value;
        const priority = document.getElementById('task-priority').value;

        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description: desc, priority, status: 'Pending' })
            });
            if (res.ok) {
                document.getElementById('add-task-form').reset();
            }
        } catch (e) {
            showToast('Failed to add task', 'error');
        }
    });

    document.getElementById('logout-btn')?.addEventListener('click', async () => {
        await fetch('/api/logout', { method: 'POST' });
        window.location.href = '/login';
    });

    // Global Action Handlers
    window.toggleStatus = async (taskId, currentStatus) => {
        const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
        try {
            await fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
        } catch (e) {
            showToast('Failed to update status', 'error');
        }
    };

    window.deleteTask = async (taskId) => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        try {
            await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
        } catch (e) {
            showToast('Failed to delete task', 'error');
        }
    };

    initDashboard();
}
