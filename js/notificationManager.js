// ===================================
// NOTIFICATION MANAGER
// Push notifications for task reminders
// ===================================

class NotificationManager {
    constructor() {
        this.notificationIntervals = new Map(); // Store intervals for each task
        this.permissionGranted = false;
        this.init();
    }

    // Initialize notification system
    async init() {
        // Check if browser supports notifications
        if (!('Notification' in window)) {
            console.warn('This browser does not support desktop notifications');
            return;
        }

        // Check current permission status
        if (Notification.permission === 'granted') {
            this.permissionGranted = true;
        } else if (Notification.permission !== 'denied') {
            // Request permission if not denied
            const permission = await Notification.requestPermission();
            this.permissionGranted = (permission === 'granted');
        }
    }

    // Request notification permission
    async requestPermission() {
        if (!('Notification' in window)) {
            return false;
        }

        const permission = await Notification.requestPermission();
        this.permissionGranted = (permission === 'granted');
        return this.permissionGranted;
    }

    // Send a notification
    sendNotification(title, body, icon = 'assets/logo/favicon.png') {
        // Check if notifications are enabled in game settings
        if (!window.gameState || !window.gameState.notifications) {
            return;
        }

        if (!this.permissionGranted) {
            console.log('Notification permission not granted');
            return;
        }

        try {
            const notification = new Notification(title, {
                body: body,
                icon: icon,
                badge: icon,
                tag: 'task-monsters-reminder',
                requireInteraction: false,
                silent: false
            });

            // Auto-close after 10 seconds
            setTimeout(() => notification.close(), 10000);

            // Optional: Handle click event
            notification.onclick = function() {
                window.focus();
                notification.close();
            };
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    }

    // Schedule notifications for a task
    scheduleTaskNotifications(task, taskIndex) {
        // Clear any existing notifications for this task
        this.clearTaskNotifications(taskIndex);

        // Check if task has a due date
        if (!task.dueDate) {
            return;
        }

        // Check if notifications are enabled
        if (!window.gameState || !window.gameState.notifications) {
            return;
        }

        const dueTime = new Date(task.dueDate).getTime();
        const now = Date.now();

        // Notification intervals: 20, 15, 10, 5, 2 minutes before due
        const intervals = [20, 15, 10, 5, 2]; // minutes

        intervals.forEach(minutes => {
            const notificationTime = dueTime - (minutes * 60 * 1000);
            const timeUntilNotification = notificationTime - now;

            // Only schedule if the notification time is in the future
            if (timeUntilNotification > 0) {
                const timeoutId = setTimeout(() => {
                    this.sendNotification(
                        `⏰ Task Reminder: ${minutes} minutes left!`,
                        `"${task.title}" is due in ${minutes} minutes`,
                        'assets/logo/favicon.png'
                    );
                }, timeUntilNotification);

                // Store the timeout ID
                const key = `${taskIndex}-${minutes}`;
                if (!this.notificationIntervals.has(taskIndex)) {
                    this.notificationIntervals.set(taskIndex, new Map());
                }
                this.notificationIntervals.get(taskIndex).set(minutes, timeoutId);
            }
        });
    }

    // Clear all notifications for a specific task
    clearTaskNotifications(taskIndex) {
        if (this.notificationIntervals.has(taskIndex)) {
            const taskIntervals = this.notificationIntervals.get(taskIndex);
            taskIntervals.forEach(timeoutId => {
                clearTimeout(timeoutId);
            });
            this.notificationIntervals.delete(taskIndex);
        }
    }

    // Reschedule all task notifications
    rescheduleAllNotifications() {
        // Clear all existing notifications
        this.notificationIntervals.forEach((taskIntervals, taskIndex) => {
            taskIntervals.forEach(timeoutId => {
                clearTimeout(timeoutId);
            });
        });
        this.notificationIntervals.clear();

        // Reschedule for all active tasks
        if (window.gameState && window.gameState.tasks) {
            window.gameState.tasks.forEach((task, index) => {
                if (!task.completed && task.dueDate) {
                    this.scheduleTaskNotifications(task, index);
                }
            });
        }
    }

    // Clear all notifications
    clearAllNotifications() {
        this.notificationIntervals.forEach((taskIntervals, taskIndex) => {
            taskIntervals.forEach(timeoutId => {
                clearTimeout(timeoutId);
            });
        });
        this.notificationIntervals.clear();
    }
}

// Initialize notification manager globally
window.notificationManager = new NotificationManager();

// Request permission when user enables notifications
window.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for gameState to load
    setTimeout(() => {
        if (window.gameState && window.gameState.notifications) {
            window.notificationManager.requestPermission();
        }
    }, 1000);
});

