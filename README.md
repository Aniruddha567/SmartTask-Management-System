# Smart Task Management System

A full-stack task management application developed as part of the Python Development Internship Assignment. The system includes Authentication, REST APIs, PostgreSQL integration, Real-time WebSockets, and Pandas/NumPy analytics.

## Features
- **User Authentication**: Secure registration and login system.
- **REST APIs**: Full CRUD operations for task management (Title, Description, Priority, Status, Created Date).
- **PostgreSQL Integration**: Data is structured and stored efficiently using PostgreSQL (via Docker) with a fallback to SQLite.
- **Real-Time WebSockets**: Live updates! When a task is modified, the dashboard dynamically updates without refreshing the page.
- **Analytics Dashboard**: Uses Pandas and NumPy to compute and display real-time statistics (Total Tasks, Completed, Pending, and Completion Percentage).
- **Modern Minimalist UI**: Built natively using HTML, CSS, and Vanilla JavaScript with a responsive, glassmorphic light theme design.

## Tech Stack
- **Backend**: Python, Flask, Flask-SQLAlchemy, Flask-SocketIO
- **Data Analytics**: Pandas, NumPy
- **Database**: PostgreSQL (Docker), SQLite (Local fallback)
- **Frontend**: HTML5, Vanilla CSS, Vanilla JavaScript

## Project Structure
```text
.
├── app/
│   ├── routes/
│   │   ├── auth.py          # Registration & Login
│   │   ├── tasks_api.py     # CRUD REST API
│   │   ├── analytics_api.py # Pandas/NumPy data processing
│   │   └── views.py         # Frontend HTML rendering
│   ├── static/
│   │   ├── css/style.css    # Minimalist Light Theme Styles
│   │   └── js/app.js        # Socket.io & REST API fetching
│   ├── templates/           # HTML Pages
│   ├── models.py            # Database Schema Models
│   └── __init__.py          # Flask App Factory setup
├── instance/                # SQLite database (if used locally)
├── docker-compose.yml       # PostgreSQL database setup
├── requirements.txt         # Project dependencies
└── run.py                   # Application entry point
```

## Setup Instructions

### 1. Prerequisites
Ensure you have Python 3.10+ installed on your machine.

### 2. Clone the Repository
```bash
git clone <YOUR_GITHUB_REPO_URL>
cd Python-Development-Internship-Assignment
```

### 3. Setup Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

### 5. Run the Application
You can run the application directly using the local SQLite database for quick testing:
```bash
python run.py
```
The server will start on `http://localhost:5000`.

*(Optional)* If you wish to use PostgreSQL as required, start the docker container:
```bash
docker-compose up -d
```
Then update your `.env` configuration to use the Postgres connection string before running the app.

## Database Schema
The database contains two main tables:
1. **User**: `id`, `username`, `password_hash`
2. **Task**: `id`, `title`, `description`, `priority` (Low, Medium, High), `status` (Pending, Completed), `created_at`, `user_id`

## Testing WebSockets
Open the app in two separate browser windows logged into the same account. Add or update a task in window A, and you will see the changes and analytics instantly update in window B!
