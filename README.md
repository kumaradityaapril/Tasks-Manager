# TaskPro (MERN Task Management System)

TaskPro is a professional, high-density, corporate-modern task management application. The project is built using the **MERN** stack (MongoDB, Express, React, Node.js) with a custom vanilla CSS design system that targets project managers and power users who require a low-friction data-heavy administrative interface.

---

##  Features

- ** Real-time Dashboard**: Live counters tracking Total, Pending, and Completed tasks with dynamic status indicators.
- ** Quick Add Task**: Create tasks instantly from the home dashboard overview page.
- ** All Tasks Listing**: Advanced filters (Status, Priority, and Due Date) paired with dynamic search, pagination, and a CSV export utility.
- ** Workspace Kanban Board**: Drag-and-drop styled column layout (Pending, In Progress, Completed) to track cards.
- ** Smart Icons**: Tasks are dynamically represented by semantic category icons (documents, servers, UI, SEO, team) depending on title keywords.
- ** Adaptive Theme**: Fully implemented appearance controls supporting Light and Dark modes.
- ** Notifications & Settings**: Toggles for notification configurations and language selection (simulated).

---

##  Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **API Client**: Axios
- **Form Handling**: React Hook Form
- **Notifications**: React Toastify & React Icons
- **Styling**: Vanilla CSS (CSS variables, Custom scrollbars, fluid grids)

### Backend
- **Platform**: Node.js & Express v5
- **Database**: MongoDB Atlas & Mongoose
- **Middlewares**: CORS, JSON Parser, Error Handlers, and validators

---

##  Project Structure

```text
Tasks-Manager/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── assets/        # SVGs & PNG images
│   │   ├── components/    # Navbar, TaskCard, TaskForm, TaskList
│   │   ├── pages/         # Home Orchestrator
│   │   └── services/      # API client config
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express Backend
│   ├── config/            # DB connection
│   ├── controllers/       # Task controllers (CRUD logic)
│   ├── middleware/        # Error handlers and field validators
│   ├── models/            # Mongoose schemas (Task model)
│   ├── routes/            # Express task endpoints
│   └── server.js          # API main entrypoint
└── README.md
```

---

##  Getting Started

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) and [npm](https://www.npmjs.com/) installed.

### 2. Clone the Repository
```bash
git clone https://github.com/kumaradityaapril/Tasks-Manager.git
cd Tasks-Manager
```

### 3. Server Configuration & Setup
1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server/` root:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   ```
4. Start the server in development mode:
   ```bash
   npm run dev
   ```
   *The server will run on `http://localhost:5000`.*

### 4. Client Configuration & Setup
1. Navigate to the `client/` directory:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the client in development mode:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173` (or similar).*

---

##  API Endpoints

The backend exposes the following REST routes under `/api/tasks`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/tasks` | Retrieve all tasks (supports query parameter `search`) |
| **GET** | `/api/tasks/:id` | Retrieve a specific task by ID |
| **POST** | `/api/tasks` | Create a new task (validates min 3 character title) |
| **PUT** | `/api/tasks/:id` | Update an existing task's fields or status |
| **DELETE** | `/api/tasks/:id` | Delete a task |

---

##  Deployment

### Backend (Render)
- **Service Type**: Web Service (Node)
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Environment Variables**:
  - `PORT`: `5000`
  - `MONGODB_URI`: `your_mongodb_connection_string`

### Frontend (Vercel / Netlify / Render)
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: `https://your-backend-app.onrender.com/api`

---

##  Author
- **Kumar Aditya** - *Initial Work & Architecture*
