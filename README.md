# Productivity Tools

Web-based productivity tools to help you use your time more wisely.

## ⏱️ Time Tracker

A simple, web-based time tracking application that helps you understand where your minutes go throughout the day.

### Features

- **Real-time Timer**: Start and stop timers for different activities
- **Activity Log**: View all tracked activities with start/end times and durations
- **Daily Summary**: See total time tracked for the day
- **Time Breakdown**: Visual breakdown showing how your time is distributed across different activities
- **Local Storage**: All data is stored locally in your browser and persists across sessions
- **Daily Reset**: Activities are automatically filtered to show only today's entries

### How to Use

1. **Open the app**: Open `index.html` in your web browser, or serve it with a local web server
2. **Start tracking**: Enter what you're working on and click "Start Timer"
3. **Stop when done**: Click "Stop Timer" when you finish the activity
4. **View insights**: Check the Activity Log and Time Breakdown sections to see where your time went

### Running Locally

You can open `index.html` directly in your browser, or use a simple HTTP server:

```bash
# Using Python
python3 -m http.server 8000

# Then open http://localhost:8000 in your browser
```

### Technologies Used

- Pure HTML, CSS, and JavaScript (no frameworks required)
- localStorage API for data persistence
- Responsive design that works on desktop and mobile
