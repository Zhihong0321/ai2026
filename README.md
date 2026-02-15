# 2026 Digitalization Plan - Daily Report App

This is an "ultra simple" mobile-first web app to track work progress for the IT Department and other company departments.

## Features
- **Dashboard**: Quick access to all departments and recent work reports.
- **Department Page**: View HOD remarks, plans, and detailed work reports.
- **Admin Page**: Securely submit daily work reports (Password: `01121000099`).

## Tech Stack
- **Frontend**: Vue.js 3 + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL

## Setup Instructions

### 1. Database Setup
Ensure you have PostgreSQL installed and running.
Create a database named `daily_report` (or update `.env` later).
Run the `schema.sql` script to create tables and initial data:
```bash
psql -U postgres -d daily_report -f schema.sql
```

### 2. Environment Variables
Create a `.env` file in the root directory if you need to customize the database connection:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/daily_report
PORT=3000
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Application
You need to run both the backend server and the frontend development server.

**Terminal 1 (Backend):**
```bash
npm run server
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

## Project Structure
- `src/views/`: Vue components for Dashboard, Dept Detail, and Admin.
- `server.js`: Backend API server.
- `schema.sql`: Database schema.
- `_raw_assets/`: Original HTML mockups provided.
