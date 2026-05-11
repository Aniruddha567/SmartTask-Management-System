# Demo Video Walkthrough Script
*Target Length: 2 to 3 minutes*

### 1. Preparation
- Start the server (`python run.py`).
- Open your browser to `http://localhost:5000`.
- Have a second browser window ready to demonstrate WebSockets later.

### 2. Introduction & Auth (0:00 - 0:30)
- **Action:** Show the login screen. Click register, create an account, and log in.
- **Talking Point:** "Hi, this is my submission for the Smart Task Management System assignment. It's built with Flask and Python. Let's start by registering a new user and logging in, which securely stores user data."

### 3. Task REST APIs (0:30 - 1:15)
- **Action:** Add a new task with a title, description, and high priority. Then edit the task.
- **Talking Point:** "Here is the minimalist dashboard. It uses a REST API backend to handle CRUD operations. I can Add a new task, Update its details, and change its priority seamlessly."

### 4. Pandas & NumPy Analytics (1:15 - 1:45)
- **Action:** Point out the top 4 statistic cards. Mark a task as "Completed" and watch the numbers change.
- **Talking Point:** "At the top is the Analytics Dashboard. I used Pandas DataFrames to process the user's tasks, and NumPy to calculate the total counts and completion percentages in real-time."

### 5. WebSocket Integration (1:45 - 2:30)
- **Action:** Open the second browser window side-by-side. Log into the same account. Add a task on the left window, and point out how it instantly appears on the right window.
- **Talking Point:** "To meet the WebSocket requirement, I integrated Flask-SocketIO. If I open two sessions side-by-side, any task created, updated, or deleted is instantly broadcasted to all active clients without needing to refresh the page."

### 6. Conclusion (2:30 - 2:45)
- **Action:** Open your code editor and briefly show `models.py` or `analytics_api.py`.
- **Talking Point:** "Finally, all data is structured using robust Database models, and the code follows clean architecture practices using Flask Blueprints. Thank you!"
