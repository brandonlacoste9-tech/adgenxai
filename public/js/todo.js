// To-Do List Application with Local Storage
// AdGenXAI - BEE-SHIP Platform

(function() {
    'use strict';

    // State
    let tasks = [];
    let currentFilter = 'all';

    // DOM Elements
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    const taskCount = document.getElementById('taskCount');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Local Storage Key
    const STORAGE_KEY = 'adgenxai_todo_tasks';

    // Initialize app
    function init() {
        loadTasksFromStorage();
        setupEventListeners();
        renderTasks();
    }

    // Event Listeners
    function setupEventListeners() {
        // Add task
        addTaskBtn.addEventListener('click', addTask);
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTask();
            }
        });

        // Filter buttons
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                currentFilter = e.target.dataset.filter;
                renderTasks();
            });
        });

        // Clear buttons
        clearCompletedBtn.addEventListener('click', clearCompleted);
        clearAllBtn.addEventListener('click', clearAll);
    }

    // Load tasks from localStorage
    function loadTasksFromStorage() {
        try {
            const storedTasks = localStorage.getItem(STORAGE_KEY);
            if (storedTasks) {
                tasks = JSON.parse(storedTasks);
            }
        } catch (error) {
            console.error('Error loading tasks from localStorage:', error);
            tasks = [];
        }
    }

    // Save tasks to localStorage
    function saveTasksToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch (error) {
            console.error('Error saving tasks to localStorage:', error);
            alert('Unable to save tasks. Your browser may have storage restrictions.');
        }
    }

    // Add new task
    function addTask() {
        const taskText = taskInput.value.trim();
        
        if (!taskText) {
            taskInput.focus();
            return;
        }

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString()
        };

        tasks.unshift(newTask); // Add to beginning of array
        saveTasksToStorage();
        renderTasks();
        
        // Clear input and focus
        taskInput.value = '';
        taskInput.focus();

        // Add subtle animation feedback
        const firstTask = taskList.querySelector('.task-item');
        if (firstTask) {
            firstTask.style.backgroundColor = '#dbeafe';
            setTimeout(() => {
                firstTask.style.backgroundColor = '';
            }, 500);
        }
    }

    // Toggle task completion
    function toggleTask(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasksToStorage();
            renderTasks();
        }
    }

    // Delete task
    function deleteTask(id) {
        const taskIndex = tasks.findIndex(t => t.id === id);
        if (taskIndex !== -1) {
            // Confirm deletion
            const task = tasks[taskIndex];
            const confirmDelete = confirm(`Delete task: "${task.text}"?`);
            
            if (confirmDelete) {
                tasks.splice(taskIndex, 1);
                saveTasksToStorage();
                renderTasks();
            }
        }
    }

    // Clear completed tasks
    function clearCompleted() {
        const completedCount = tasks.filter(t => t.completed).length;
        
        if (completedCount === 0) {
            alert('No completed tasks to clear.');
            return;
        }

        const confirmClear = confirm(`Clear ${completedCount} completed task(s)?`);
        
        if (confirmClear) {
            tasks = tasks.filter(t => !t.completed);
            saveTasksToStorage();
            renderTasks();
        }
    }

    // Clear all tasks
    function clearAll() {
        if (tasks.length === 0) {
            alert('No tasks to clear.');
            return;
        }

        const confirmClear = confirm(`Delete all ${tasks.length} task(s)? This cannot be undone.`);
        
        if (confirmClear) {
            tasks = [];
            saveTasksToStorage();
            renderTasks();
        }
    }

    // Get filtered tasks
    function getFilteredTasks() {
        switch (currentFilter) {
            case 'active':
                return tasks.filter(t => !t.completed);
            case 'completed':
                return tasks.filter(t => t.completed);
            default:
                return tasks;
        }
    }

    // Format date for display
    function formatDate(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
    }

    // Render tasks
    function renderTasks() {
        const filteredTasks = getFilteredTasks();
        
        // Clear task list
        taskList.innerHTML = '';

        // Show/hide empty state
        if (filteredTasks.length === 0) {
            emptyState.classList.add('show');
            
            // Update empty state message based on filter
            const emptyMessage = emptyState.querySelector('p');
            if (currentFilter === 'active' && tasks.length > 0) {
                emptyMessage.textContent = 'No active tasks. Great job! 🎉';
            } else if (currentFilter === 'completed' && tasks.length > 0) {
                emptyMessage.textContent = 'No completed tasks yet.';
            } else {
                emptyMessage.textContent = 'No tasks yet. Add one above to get started!';
            }
        } else {
            emptyState.classList.remove('show');
        }

        // Render each task
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item' + (task.completed ? ' completed' : '');
            li.setAttribute('data-task-id', task.id);

            li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="task-checkbox" 
                    ${task.completed ? 'checked' : ''}
                    aria-label="Mark task as ${task.completed ? 'incomplete' : 'complete'}"
                >
                <span class="task-text">${escapeHtml(task.text)}</span>
                <span class="task-time">${formatDate(task.createdAt)}</span>
                <button class="delete-btn" aria-label="Delete task">Delete</button>
            `;

            // Add event listeners
            const checkbox = li.querySelector('.task-checkbox');
            const deleteBtn = li.querySelector('.delete-btn');

            checkbox.addEventListener('change', () => toggleTask(task.id));
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            taskList.appendChild(li);
        });

        // Update task count
        updateTaskCount();
    }

    // Update task count display
    function updateTaskCount() {
        const total = tasks.length;
        const active = tasks.filter(t => !t.completed).length;
        const completed = tasks.filter(t => t.completed).length;

        let countText = '';
        switch (currentFilter) {
            case 'active':
                countText = `${active} active task${active !== 1 ? 's' : ''}`;
                break;
            case 'completed':
                countText = `${completed} completed task${completed !== 1 ? 's' : ''}`;
                break;
            default:
                countText = `${total} task${total !== 1 ? 's' : ''}`;
        }

        taskCount.textContent = countText;
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
