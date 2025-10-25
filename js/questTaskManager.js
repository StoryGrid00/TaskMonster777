// ===================================
// QUEST TASK MANAGER
// Manages quest tasks separately from regular tasks
// ===================================

class QuestTaskManager {
    constructor() {
        this.questTasks = this.loadQuestTasks();
    }

    // Load quest tasks from localStorage
    loadQuestTasks() {
        try {
            const stored = localStorage.getItem('questTasks');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading quest tasks:', error);
            return [];
        }
    }

    // Save quest tasks to localStorage
    saveQuestTasks() {
        try {
            localStorage.setItem('questTasks', JSON.stringify(this.questTasks));
        } catch (error) {
            console.error('Error saving quest tasks:', error);
        }
    }

    // Add a new quest task
    addQuestTask(quest) {
        const questTask = {
            id: `quest_${quest.id}_${Date.now()}`,
            text: quest.text,
            category: quest.category,
            difficulty: quest.difficulty,
            xp: quest.xp,
            deadline: quest.duration, // hours until deadline
            createdAt: Date.now(),
            completed: false
        };

        this.questTasks.push(questTask);
        this.saveQuestTasks();
        this.updateDisplay();
        return questTask;
    }

    // Complete a quest task
    completeQuestTask(taskId) {
        const task = this.questTasks.find(t => t.id === taskId);
        if (!task) return;

        task.completed = true;

        // Award XP
        if (window.gameState) {
            window.gameState.jerryXP = (window.gameState.jerryXP || 0) + task.xp;
            
            // Check for level up
            if (typeof checkLevelUp === 'function') {
                checkLevelUp();
            }
            
            // Save game state
            if (typeof saveGameState === 'function') {
                saveGameState();
            }
            
            // Update UI
            if (typeof updateUI === 'function') {
                updateUI();
            }
        }

        // Remove from quest tasks
        this.questTasks = this.questTasks.filter(t => t.id !== taskId);
        this.saveQuestTasks();
        this.updateDisplay();

        // Show completion message
        this.showCompletionMessage(task);
    }

    // Delete a quest task
    deleteQuestTask(taskId) {
        const task = this.questTasks.find(t => t.id === taskId);
        if (!task) return;

        // Apply XP penalty if deadline passed
        const hoursElapsed = (Date.now() - task.createdAt) / (1000 * 60 * 60);
        if (hoursElapsed > task.deadline) {
            const penalty = Math.floor(task.xp * 1.5);
            if (window.gameState) {
                window.gameState.xp = Math.max(0, (window.gameState.xp || 0) - penalty);
                
                if (typeof saveGameState === 'function') {
                    saveGameState();
                }
                if (typeof updateUI === 'function') {
                    updateUI();
                }
            }
            
            this.showPenaltyMessage(task, penalty);
        }

        this.questTasks = this.questTasks.filter(t => t.id !== taskId);
        this.saveQuestTasks();
        this.updateDisplay();
    }

    // Update the quest tasks display
    updateDisplay() {
        const questTasksList = document.getElementById('questTasksList');
        const questTasksCard = document.getElementById('questTasksCard');

        if (!questTasksList || !questTasksCard) return;

        // Show/hide card based on whether there are quest tasks
        if (this.questTasks.length === 0) {
            questTasksCard.style.display = 'none';
            return;
        }

        questTasksCard.style.display = 'block';

        // Render quest tasks
        questTasksList.innerHTML = this.questTasks.map(task => this.renderQuestTask(task)).join('');
    }

    // Render a single quest task
    renderQuestTask(task) {
        const hoursElapsed = (Date.now() - task.createdAt) / (1000 * 60 * 60);
        const hoursRemaining = Math.max(0, task.deadline - hoursElapsed);
        const isExpired = hoursRemaining === 0;

        const difficultyClass = task.difficulty.toLowerCase();
        
        return `
            <div class="quest-task-item" data-task-id="${task.id}">
                <div class="quest-task-header">
                    <div class="quest-task-checkbox" onclick="questTaskManager.completeQuestTask('${task.id}')"></div>
                    <div class="quest-task-content">
                        <div class="quest-task-text">${task.text}</div>
                        <div class="quest-task-meta">
                            <span class="quest-task-badge quest-task-category">${task.category}</span>
                            <span class="quest-task-badge quest-task-difficulty ${difficultyClass}">${task.difficulty}</span>
                            <span class="quest-task-xp">⭐ ${task.xp} XP</span>
                            <span class="quest-task-deadline ${isExpired ? 'expired' : ''}">
                                ⏰ ${isExpired ? 'Expired!' : `${Math.ceil(hoursRemaining)}h remaining`}
                            </span>
                        </div>
                        <div class="quest-task-actions">
                            <button class="quest-task-delete" onclick="questTaskManager.deleteQuestTask('${task.id}')">
                                🗑️ Abandon Quest
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Show completion message
    showCompletionMessage(task) {
        if (typeof showNotification === 'function') {
            showNotification(`Quest Complete! +${task.xp} XP`, 'success');
        } else {
            alert(`Quest Complete! You earned ${task.xp} XP!`);
        }
    }

    // Show penalty message
    showPenaltyMessage(task, penalty) {
        if (typeof showNotification === 'function') {
            showNotification(`Quest Abandoned! -${penalty} XP penalty`, 'error');
        } else {
            alert(`Quest abandoned after deadline. You lost ${penalty} XP.`);
        }
    }

    // Check for expired quests
    checkExpiredQuests() {
        let hasExpired = false;
        
        this.questTasks.forEach(task => {
            const hoursElapsed = (Date.now() - task.createdAt) / (1000 * 60 * 60);
            if (hoursElapsed > task.deadline) {
                hasExpired = true;
            }
        });

        if (hasExpired) {
            this.updateDisplay();
        }
    }
}

// Initialize quest task manager
window.questTaskManager = new QuestTaskManager();

// Update display on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.questTaskManager.updateDisplay();
    });
} else {
    window.questTaskManager.updateDisplay();
}

// Check for expired quests every minute
setInterval(() => {
    if (window.questTaskManager) {
        window.questTaskManager.checkExpiredQuests();
    }
}, 60000);

