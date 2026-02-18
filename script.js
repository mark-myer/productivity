// Time Tracker Application
class TimeTracker {
    constructor() {
        this.currentActivity = null;
        this.startTime = null;
        this.timerInterval = null;
        this.activities = this.loadActivities();
        
        this.initializeElements();
        this.attachEventListeners();
        this.render();
        this.checkForActiveTimer();
    }

    initializeElements() {
        this.activityInput = document.getElementById('activityInput');
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.currentTimer = document.getElementById('currentTimer');
        this.currentActivityEl = document.getElementById('currentActivity');
        this.timerDisplay = document.getElementById('timerDisplay');
        this.activityList = document.getElementById('activityList');
        this.totalTime = document.getElementById('totalTime');
        this.breakdownList = document.getElementById('breakdownList');
        this.clearBtn = document.getElementById('clearBtn');
    }

    attachEventListeners() {
        this.startBtn.addEventListener('click', () => this.startTimer());
        this.stopBtn.addEventListener('click', () => this.stopTimer());
        this.clearBtn.addEventListener('click', () => this.clearAll());
        
        this.activityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.startTimer();
            }
        });
    }

    startTimer() {
        const activity = this.activityInput.value.trim();
        
        if (!activity) {
            alert('Please enter an activity name');
            return;
        }

        this.currentActivity = activity;
        this.startTime = new Date();
        
        // Save active timer to localStorage
        localStorage.setItem('activeTimer', JSON.stringify({
            activity: this.currentActivity,
            startTime: this.startTime.toISOString()
        }));

        this.activityInput.value = '';
        this.activityInput.disabled = true;
        this.startBtn.style.display = 'none';
        this.stopBtn.style.display = 'inline-block';
        this.currentTimer.style.display = 'flex';
        this.currentActivityEl.textContent = this.currentActivity;

        this.updateTimer();
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);
    }

    stopTimer() {
        if (!this.currentActivity || !this.startTime) return;

        const endTime = new Date();
        const duration = Math.floor((endTime - this.startTime) / 1000);

        const activity = {
            name: this.currentActivity,
            startTime: this.startTime.toISOString(),
            endTime: endTime.toISOString(),
            duration: duration
        };

        this.activities.push(activity);
        this.saveActivities();

        // Clear active timer from localStorage
        localStorage.removeItem('activeTimer');

        clearInterval(this.timerInterval);
        this.currentActivity = null;
        this.startTime = null;
        this.timerInterval = null;

        this.activityInput.disabled = false;
        this.startBtn.style.display = 'inline-block';
        this.stopBtn.style.display = 'none';
        this.currentTimer.style.display = 'none';

        this.render();
    }

    updateTimer() {
        if (!this.startTime) return;

        const now = new Date();
        const elapsed = Math.floor((now - this.startTime) / 1000);
        this.timerDisplay.textContent = this.formatDuration(elapsed);
    }

    checkForActiveTimer() {
        const activeTimer = localStorage.getItem('activeTimer');
        if (activeTimer) {
            const { activity, startTime } = JSON.parse(activeTimer);
            this.currentActivity = activity;
            this.startTime = new Date(startTime);
            
            this.activityInput.disabled = true;
            this.startBtn.style.display = 'none';
            this.stopBtn.style.display = 'inline-block';
            this.currentTimer.style.display = 'flex';
            this.currentActivityEl.textContent = this.currentActivity;

            this.updateTimer();
            this.timerInterval = setInterval(() => this.updateTimer(), 1000);
        }
    }

    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    formatDurationShort(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    }

    formatTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    }

    loadActivities() {
        const today = new Date().toDateString();
        const saved = localStorage.getItem('timeTrackerActivities');
        
        if (saved) {
            const data = JSON.parse(saved);
            // Filter to only today's activities
            const todayActivities = data.filter(activity => {
                const activityDate = new Date(activity.startTime).toDateString();
                return activityDate === today;
            });
            return todayActivities;
        }
        
        return [];
    }

    saveActivities() {
        localStorage.setItem('timeTrackerActivities', JSON.stringify(this.activities));
    }

    clearAll() {
        if (confirm('Are you sure you want to clear all activities? This cannot be undone.')) {
            this.activities = [];
            this.saveActivities();
            this.render();
        }
    }

    getTotalTime() {
        return this.activities.reduce((total, activity) => total + activity.duration, 0);
    }

    getBreakdown() {
        const breakdown = {};
        
        this.activities.forEach(activity => {
            if (!breakdown[activity.name]) {
                breakdown[activity.name] = 0;
            }
            breakdown[activity.name] += activity.duration;
        });

        return Object.entries(breakdown)
            .map(([name, duration]) => ({ name, duration }))
            .sort((a, b) => b.duration - a.duration);
    }

    render() {
        this.renderActivityList();
        this.renderTotalTime();
        this.renderBreakdown();
    }

    renderActivityList() {
        if (this.activities.length === 0) {
            this.activityList.innerHTML = '<p class="empty-state">No activities tracked yet. Start tracking to see your time breakdown!</p>';
            return;
        }

        const sortedActivities = [...this.activities].reverse();
        
        this.activityList.innerHTML = sortedActivities.map(activity => `
            <div class="activity-item">
                <div class="activity-info">
                    <div class="activity-name">${this.escapeHtml(activity.name)}</div>
                    <div class="activity-time-range">
                        ${this.formatTime(activity.startTime)} - ${this.formatTime(activity.endTime)}
                    </div>
                </div>
                <div class="activity-duration">
                    ${this.formatDurationShort(activity.duration)}
                </div>
            </div>
        `).join('');
    }

    renderTotalTime() {
        const totalSeconds = this.getTotalTime();
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        
        this.totalTime.innerHTML = `Total tracked: <strong>${hours}h ${minutes}m</strong>`;
    }

    renderBreakdown() {
        const breakdown = this.getBreakdown();
        const totalTime = this.getTotalTime();

        if (breakdown.length === 0) {
            this.breakdownList.innerHTML = '<p class="empty-state">No data to display yet.</p>';
            return;
        }

        this.breakdownList.innerHTML = breakdown.map(item => {
            const percentage = totalTime > 0 ? (item.duration / totalTime) * 100 : 0;
            
            return `
                <div class="breakdown-item">
                    <div class="breakdown-name">${this.escapeHtml(item.name)}</div>
                    <div class="breakdown-stats">
                        <div class="breakdown-time">${this.formatDurationShort(item.duration)}</div>
                        <div class="breakdown-bar-container">
                            <div class="breakdown-bar" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TimeTracker();
});
