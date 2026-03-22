# TaskFlow Pro

A polished full-stack task management platform built with React, Node.js, Express, MongoDB, and JWT authentication.

It goes beyond basic CRUD and feels like a modern product: secure auth, protected routes, drag-and-drop task management, analytics, calendar planning, realtime updates, notifications, and a clean SaaS-style interface.

## Highlights

- JWT-based authentication with protected routes
- Task CRUD with priority, category, due date, and status
- Drag-and-drop Kanban workflow
- Realtime task sync with Socket.IO
- Search, filtering, and sorting
- Calendar view for due-date planning
- Analytics dashboard with charts and completion insights
- Notification toasts and activity-style feedback
- AI-style task suggestions for the day
- Responsive, modern UI with motion and glassmorphism-inspired styling

## Screenshots

### Login

![Login Screen](./screenshots/screenshotslogin.png)

### Register

![Register Screen](./screenshots/screenshotsregister.png)

### Dashboard

![Dashboard](./screenshots/screenshotsdashboard.png)

## Tech Stack

### Frontend

- React
- React Router
- Axios
- Framer Motion
- Lucide React
- Chart.js
- React Chart.js 2
- `@hello-pangea/dnd`
- Socket.IO Client
- Vite

### Backend

- Node.js
- Express
- JWT
- Mongoose
- Socket.IO
- bcryptjs

### Database

- MongoDB
- MongoDB Atlas

## Feature Breakdown

### Authentication

- User registration and login
- JWT token generation and validation
- Protected dashboard routes
- Persistent session handling on the frontend

### Task Management

- Create, edit, delete, and view tasks
- Mark tasks as `pending` or `completed`
- Set `low`, `medium`, or `high` priority
- Assign categories like `Work`, `Personal`, and `Study`
- Add due dates with overdue and due-today awareness

### Productivity Features

- Drag tasks between columns
- Search by title, description, and category
- Filter by status and category
- Sort by board order, due date, priority, and status
- AI-style suggestions for which tasks to focus on today

### Product-Like UI

- Sidebar-based workspace layout
- Analytics cards and charts
- Calendar task view
- Loading skeletons
- Notification toasts
- Smooth motion and modern card styling

### Realtime

- Live task updates across active sessions
- Instant sync for create, update, delete, and reorder actions

## Project Structure

```text
Task Management System/
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── screenshots/
├── .gitignore
├── package.json
└── README.md
```

## API Overview

### Auth Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Task Routes

- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

## Environment Variables

### Backend

Create [server/.env](C:\Users\anshikad\Desktop\Task Management System\server\.env) with:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task-manager
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
```

If you are using MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

### Frontend

Create [client/.env](C:\Users\anshikad\Desktop\Task Management System\client\.env) with:

```env
VITE_API_URL=http://localhost:5000/api
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/AnshDwi/task-management-system.git
cd task-management-system
```

### 2. Install dependencies

Backend:

```bash
cd server
npm install
```

Frontend:

```bash
cd client
npm install
```

### 3. Configure environment files

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

On Windows PowerShell:

```powershell
Copy-Item server\.env.example server\.env
Copy-Item client\.env.example client\.env
```

### 4. Start MongoDB

- Use local MongoDB, or
- use MongoDB Atlas if MongoDB is not installed locally

### 5. Start the backend

```bash
cd server
npm run dev
```

### 6. Start the frontend

Open a second terminal:

```bash
cd client
npm run dev
```

### 7. Open the app

```text
http://localhost:5173
```

## Root Scripts

From the project root:

```bash
npm run server:dev
npm run client:dev
npm run client:build
```

## Deployment

### Frontend on Vercel

This project is set up to deploy the frontend from the [client](C:\Users\anshikad\Desktop\Task Management System\client) folder.

Use these settings in Vercel:

- Framework Preset: `Vite`
- Root Directory: `client`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

Environment variable:

```env
VITE_API_URL=https://YOUR-RENDER-BACKEND.onrender.com/api
```

The [client/vercel.json](C:\Users\anshikad\Desktop\Task Management System\client\vercel.json) file handles SPA route rewrites so routes like `/dashboard` work after refresh.

### Backend on Render

This project includes a Render blueprint in [render.yaml](C:\Users\anshikad\Desktop\Task Management System\render.yaml).

Use these Render settings if you deploy manually:

- Service Type: `Web Service`
- Runtime: `Node`
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/api`

Environment variables:

```env
PORT=10000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_secret
CLIENT_URL=https://YOUR-VERCEL-FRONTEND.vercel.app
```

### Deployment Order

1. Deploy the backend to Render first
2. Copy the Render backend URL
3. Add that URL to Vercel as `VITE_API_URL`
4. Deploy the frontend to Vercel
5. Copy the Vercel frontend URL
6. Add that URL in Render as `CLIENT_URL`
7. Redeploy the backend once so CORS uses the final frontend URL

## Architecture Notes

- The frontend uses Axios interceptors to automatically attach JWT tokens.
- The backend protects task routes through authentication middleware.
- Mongoose models enforce schema structure for users and tasks.
- Socket.IO keeps task changes synced in realtime.
- The dashboard is split into reusable UI modules for analytics, calendar, board, notifications, and suggestions.

## Why This Project Stands Out

- It solves a real-world productivity workflow, not just a tutorial-level CRUD demo.
- It includes both UX polish and engineering depth.
- It demonstrates frontend state management, backend API design, authentication, database modeling, and realtime communication in one project.

## Interview Pitch

Use this in interviews:

> I built a full-stack task management application with JWT authentication, realtime updates using Socket.IO, drag-and-drop workflows, deadline tracking, analytics dashboards, calendar planning, and smart task suggestions. I focused on modular architecture, production-like patterns, and a polished user experience.

## Possible Next Improvements

- Add team collaboration and shared workspaces
- Add file attachments and comments per task
- Add refresh tokens and secure cookie auth
- Add unit and integration tests
- Deploy frontend on Vercel and backend on Render
- Add dark mode and command palette support

## License

MIT
