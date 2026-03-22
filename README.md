# Task Management Web Application

A production-like full-stack task management system built with React, Node.js, Express, MongoDB, Mongoose, and JWT authentication.

## Core Features

- Secure user registration and login using JWT
- Protected task routes for authenticated users only
- Full CRUD operations for tasks
- Task status management with `pending` and `completed`
- Task priority and due date support
- Task categories with category-based filtering
- Search by title, description, and category
- Sorting by newest, oldest, priority, due date, and board order
- Drag-and-drop Kanban board for realtime task movement
- Live analytics dashboard with completion and priority insights
- In-app notification center for task activity
- Realtime updates across sessions with Socket.IO
- Calendar view for due-date planning
- AI-style daily task suggestions based on urgency and priority
- Role field support for `user` and `admin`
- Clean responsive SaaS-style UI with glassmorphism, motion, icons, and loading skeletons

## Tech Stack

- Frontend: React, React Router, Axios, Framer Motion, Lucide React, Chart.js, React Chart.js 2, @hello-pangea/dnd, Socket.IO Client, Vite
- Backend: Node.js, Express, JWT, Mongoose, Socket.IO
- Database: MongoDB / MongoDB Atlas

## Project Structure

```text
Task Management System/
|-- client/
|   |-- public/
|   |-- src/
|   |   |-- api/
|   |   |   `-- axiosInstance.js
|   |   |-- components/
|   |   |   |-- AuthForm.jsx
|   |   |   |-- ProtectedRoute.jsx
|   |   |   |-- TaskForm.jsx
|   |   |   `-- TaskList.jsx
|   |   |-- context/
|   |   |   `-- AuthContext.jsx
|   |   |-- pages/
|   |   |   |-- DashboardPage.jsx
|   |   |   |-- LoginPage.jsx
|   |   |   `-- RegisterPage.jsx
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |   `-- styles.css
|   |-- .env.example
|   |-- index.html
|   |-- package.json
|   `-- vite.config.js
|-- screenshots/
|-- server/
|   |-- config/
|   |   `-- db.js
|   |-- controllers/
|   |   |-- authController.js
|   |   `-- taskController.js
|   |-- middleware/
|   |   `-- authMiddleware.js
|   |-- models/
|   |   |-- Task.js
|   |   `-- User.js
|   |-- routes/
|   |   |-- authRoutes.js
|   |   `-- taskRoutes.js
|   |-- .env.example
|   |-- package.json
|   `-- server.js
|-- .gitignore
|-- package.json
`-- README.md
```

## API Endpoints

### Authentication

- `POST /api/auth/register` create a user account
- `POST /api/auth/login` authenticate a user and return a JWT
- `GET /api/auth/me` get the authenticated user profile

### Tasks

- `GET /api/tasks` get all tasks for the logged-in user
- `POST /api/tasks` create a task
- `PUT /api/tasks/:id` update a task
- `DELETE /api/tasks/:id` delete a task

## Environment Variables

### Backend `server/.env`

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task-manager
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
```

### Frontend `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

## Step-by-Step Setup

### 1. Install dependencies

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

### 2. Configure environment variables

Copy the provided samples:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

On Windows PowerShell:

```powershell
Copy-Item server\.env.example server\.env
Copy-Item client\.env.example client\.env
```

### 3. Start MongoDB

If you use local MongoDB, start your MongoDB service.

If you do not have MongoDB installed, use MongoDB Atlas and replace `MONGO_URI` in `server/.env` with your Atlas connection string.

### 4. Run the backend

```bash
cd server
npm run dev
```

### 5. Run the frontend

In a new terminal:

```bash
cd client
npm run dev
```

### 6. Open the app

Visit:

```text
http://localhost:5173
```

## Production-Like Implementation Notes

- Passwords are hashed using `bcryptjs`
- JWT tokens are validated through middleware before task access
- Mongoose models define schema validation, ownership, categories, deadlines, and roles
- Axios automatically attaches the auth token to API requests
- The dashboard supports editing, deleting, searching, drag-and-drop ordering, and live status updates
- Socket.IO broadcasts task creation, updates, deletes, and board reordering in real time
- Notifications and analytics update immediately as task data changes
- Chart.js powers completion and weekly activity charts
- The calendar view and AI focus panel make the app feel closer to a real productivity product
- The codebase is split into reusable frontend and backend modules

## Interview Pitch

You can present it like this:

> I built a full-stack task management system with JWT authentication, realtime task sync using Socket.IO, drag-and-drop Kanban workflows, deadline intelligence, categories, analytics dashboards, calendar planning, and AI-style daily task suggestions. I focused on product-quality UX, modular architecture, and real-world usability.

## Optional Root Scripts

From the project root you can run:

```bash
npm run server:dev
npm run client:dev
npm run client:build
```

## Future Improvements

- Add pagination and task sorting at API level
- Add refresh tokens and secure cookie auth
- Add form validation with a schema library
- Add automated tests for API routes and UI flows
- Add deployment pipelines for Vercel and Render

## License

MIT
