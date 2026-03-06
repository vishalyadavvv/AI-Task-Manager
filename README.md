# TaskFlow – Task Management App with AI Integration

A full-stack task management application built with **Node.js 22 + Express 5** (backend) and **React 19 + Vite 6 + Tailwind CSS v4** (frontend). Features stateless JWT authentication, role-based authorization, and AI-powered task auto-categorization via the Groq API with intelligent fallback.

---

## Technology Stack

| Layer    | Technology                                      |
|----------|-------------------------------------------------|
| Runtime  | Node.js 22                                      |
| Backend  | Express 5, MongoDB, express-validator 7, bcryptjs, JWT |
| Frontend | React 19, Vite 6, Tailwind CSS v4               |
| AI       | Groq `llama-3.3-70b-versatile` with heuristic fallback |

---

## Key Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** – Register, login, and token-based session management
- **Protected routes** – All task endpoints require valid JWT token
- **User isolation** – Users can only access and manage their own tasks (verified on each request)
- **Demo account** – Pre-configured credentials: `demo@taskflow.com` / `demo1234`

### 📝 Complete Task Management (CRUD)
- **Create tasks** → POST `/tasks` with title and description
- **List tasks** → GET `/tasks` with search and filtering capabilities
- **Update tasks** → PUT `/tasks/:id` to modify title, description, status, category, or priority
- **Delete tasks** → DELETE `/tasks/:id` (user ownership verified)
- **Toggle status** → Change tasks between Pending and Completed

### 🔍 Search & Filtering
- **Real-time search** – Filter by keyword in task title and description
- **Filter by category** – Work, Personal, Study, or Health
- **Filter by priority** – High, Medium, or Low
- **Filter by status** – Pending or Completed

### 🤖 AI-Powered Auto-Categorization
When a user creates a task, the AI automatically:
- **Detects category** → Classifies as Work | Personal | Study | Health
- **Suggests priority** → Assigns High | Medium | Low priority  
- **Provides reasoning** → Explains the categorization in one concise sentence
- **Stores source** → Tracks whether categorization came from AI or heuristic fallback

### 🛡️ Graceful Degradation
- **Fallback mechanism** – If AI API is unavailable or no key is provided, the app uses intelligent keyword-based heuristics
- **100% functional** – The app remains fully operational without an API key

---

## Project Structure

```
taskflow/
├── backend/                          # Express 5 + MongoDB API
│   ├── src/
│   │   ├── server.js                # App entry; routes setup; global error handler
│   │   ├── config/
│   │   │   └── db.js                # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js    # login, register, me (user profile)
│   │   │   └── taskController.js    # create, list, update, delete tasks
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT verification & user extraction
│   │   │   └── validate.js          # express-validator schemas
│   │   ├── models/
│   │   │   ├── User.js              # User schema (email, password hashing)
│   │   │   └── Task.js              # Task schema (title, desc, status, category, priority, AI metadata)
│   │   ├── routes/
│   │   │   ├── auth.js              # POST /auth/register, /auth/login; GET /auth/me
│   │   │   └── tasks.js             # CRUD endpoints with auth middleware
│   │   ├── services/
│   │   │   └── aiService.js         # AI categorization: Groq API + keyword heuristic fallback
│   │   └── scripts/
│   │       └── seed.js              # Create demo user for testing
│   ├── .env.example                 # Environment variables template
│   └── package.json
│
└── frontend/                         # React 19 + Vite 6 + Tailwind CSS v4
    ├── index.html
    ├── vite.config.js              # Vite + Tailwind v4 plugin + dev proxy to backend
    ├── src/
    │   ├── App.jsx                 # Router setup (public & protected routes)
    │   ├── main.jsx                # React entry
    │   ├── index.css               # Tailwind v4 imports + custom @theme tokens
    │   ├── components/
    │   │   ├── TaskCard.jsx        # Displays task with status toggle, update, delete
    │   │   └── AddTaskModal.jsx    # Modal to create new task
    │   ├── context/
    │   │   └── AuthContext.jsx     # Global auth state (token, user, login, logout)
    │   ├── hooks/
    │   │   └── useTasks.js         # Fetch, create, update, delete tasks
    │   ├── pages/
    │   │   ├── LoginPage.jsx       # Register / login form
    │   │   ├── Dashboard.jsx       # Task list, search, filters, add task modal
    │   │   └── LandingPage.jsx     # Public landing page
    │   ├── services/
    │   │   └── api.js              # Fetch wrapper with auth headers
    │   └── public/
    │       └── _redirects          # Netlify routing config
    └── package.json
```

---

## Setup & Running

### Prerequisites
- **Node.js ≥ 22** (LTS recommended)
- **npm ≥ 10** or yarn
- **MongoDB** → Either:
  - Local: `mongod` running on `localhost:27017`
  - Cloud: MongoDB Atlas connection string

### 1. Backend Setup

```bash
cd taskflow/backend
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your values:
#   MONGODB_URI=mongodb://localhost:27017/taskflow
#   JWT_SECRET=your-secret-key-here
#   GROQ_API_KEY=<optional, but recommended>   ← from console.groq.com
#
✓ Backend .env file has been configured and pushed for testing purposes

```

**Run the server**:
```bash
npm start          # Production mode (port 5000)
npm run dev        # Development mode with nodemon hot-reload
```

API will be available at **http://localhost:5000**

**Create demo data** (optional):
```bash
npm run seed       # Creates demo user: demo@taskflow.com / demo1234
```

### 2. Frontend Setup

```bash
cd taskflow/frontend
npm install
npm run dev
```

Frontend will be available at **http://localhost:5173** (check console output)

**The Vite dev server automatically proxies**:
- `/auth` → `http://localhost:5000/auth`
- `/tasks` → `http://localhost:5000/tasks`
- `/health` → `http://localhost:5000/health`

### 3. Demo Account

| Email | Password |
|-------|----------|
| demo@taskflow.com | demo1234 |

Use these credentials to log in and test the application without registering.

### Production Deployment

For production, follow these steps:

1. **Backend**: Set environment variables on your hosting platform (Render, Railway, Vercel, etc.)
2. **Frontend**: Build and deploy
   ```bash
   cd frontend
   npm run build
   npm run preview  # Test production build locally
   ```
3. **Database**: Use MongoDB Atlas for managed hosting
4. **API Key**: Set `GROQ_API_KEY` in production environment

---

## API Reference

### Authentication Endpoints (No Auth Required)

| Method | Path | Description | Request Body |
|--------|------|-------------|--------------|
| POST | `/auth/register` | Create a new account | `{ name, email, password }` |
| POST | `/auth/login` | Login and receive JWT token | `{ email, password }` |
| GET | `/auth/me` | Get current user profile (requires Bearer token) | — |

### Task Endpoints (All Require JWT Authentication)

All endpoints below require the HTTP header: `Authorization: Bearer <jwt_token>`

| Method | Path | Description | Query Params |
|--------|------|-------------|--------------|
| POST | `/tasks` | Create a new task (AI categorizes automatically) | — |
| GET | `/tasks` | List user's tasks with search & filters | `search`, `category`, `priority`, `status` |
| PUT | `/tasks/:id` | Update a task (owner only) | — |
| DELETE | `/tasks/:id` | Delete a task (owner only) | — |

#### POST /tasks – Create Task (with AI Auto-Categorization)

**Request Body**:
```json
{
  "title": "Finish Q1 report",
  "description": "Complete the quarterly financial report and send to CFO"
}
```

**Response** (201 Created):
```json
{
  "task": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Finish Q1 report",
    "description": "Complete the quarterly financial report and send to CFO",
    "status": "Pending",
    "category": "Work",          // ← AI-determined
    "priority": "High",          // ← AI-determined
    "aiReasoning": "Quarterly reports are important business deliverables with tight deadlines",  // ← AI explanation
    "aiSource": "ai",            // "ai" or "heuristic"
    "createdAt": "2026-03-06T...",
    "updatedAt": "2026-03-06T..."
  }
}
```

#### GET /tasks – List Tasks with Filters

**Query Parameters**:
- `search` – Search by keyword in title or description
- `category` – Work | Personal | Study | Health
- `priority` – High | Medium | Low
- `status` – Pending | Completed

**Example**: `GET /tasks?search=report&category=Work&priority=High`

**Response** (200 OK):
```json
{
  "tasks": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Finish Q1 report",
      "description": "...",
      "status": "Pending",
      "category": "Work",
      "priority": "High",
      "aiReasoning": "...",
      "aiSource": "ai",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

#### PUT /tasks/:id – Update Task

**How It Works:**
1. Server finds task by ID
2. **Authorization check** – Verifies you own the task (if not, returns `403 Forbidden`)
3. Updates only allowed fields
4. Saves to database
5. Returns updated task object

**Updatable Fields:**

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `title` | string | Task title | "Buy groceries" |
| `description` | string | Task details | "Eggs, milk, bread from Whole Foods" |
| `status` | string | Pending or Completed | "Completed" |
| `category` | string | Work / Personal / Study / Health | "Personal" |
| `priority` | string | High / Medium / Low | "Medium" |

**Protected Fields** (cannot be updated):
- `id` (immutable)
- `user` (ownership cannot be transferred)
- `aiReasoning` (AI reasoning is set only at creation)
- `aiSource` (AI source is set only at creation)
- `createdAt` (timestamp, immutable)
- `updatedAt` (auto-updated on save)

**Request Body** (update one or more fields):
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "Completed",
  "category": "Personal",
  "priority": "Medium"
}
```

**Response** (200 OK):
```json
{
  "task": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Updated title",
    "description": "Updated description",
    "status": "Completed",
    "category": "Personal",
    "priority": "Medium",
    "aiReasoning": "...",         // Original AI reasoning (not updated)
    "aiSource": "ai",              // Original source (not updated)
    "createdAt": "2026-03-06T...",
    "updatedAt": "2026-03-06T10:30:00Z"  // Auto-updated to current time
  }
}
```

**Example Requests:**

**Example 1: Toggle task status to Completed**
```bash
curl -X PUT http://localhost:5000/tasks/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"Completed"}'
```

**Example 2: Update title and priority**
```bash
curl -X PUT http://localhost:5000/tasks/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Urgent: Finish report","priority":"High"}'
```

**Example 3: Update multiple fields**
```bash
curl -X PUT http://localhost:5000/tasks/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status":"Completed",
    "category":"Work",
    "priority":"High",
    "description":"Completed on time with manager approval"
  }'
```

**Error Responses:**

| Status | Error | Reason |
|--------|-------|--------|
| 404 | Task not found | Task ID doesn't exist or belongs to another user |
| 403 | Forbidden: you do not own this task | You're trying to update someone else's task |
| 400 | Validation error | Invalid category/priority value |
| 401 | Unauthorized | Missing or invalid JWT token |

**Example Error Response** (404):
```json
{
  "error": "Task not found"
}
```

**Example Error Response** (403):
```json
{
  "error": "Forbidden: you do not own this task"
}
```

**Common Update Scenarios:**

1. **Toggle Task Status** – Mark a task as done
   ```bash
   {"status": "Completed"}
   ```
   Use case: When you finish a task, update only the status field

2. **Reassign Category** – Move a task to a different category
   ```bash
   {"category": "Work", "priority": "High"}
   ```
   Use case: You realize a task is actually work-related, not personal

3. **Update Priority** – Change urgency without touching other fields
   ```bash
   {"priority": "High"}
   ```
   Use case: Something becomes urgent; only priority changes

4. **Correct Details** – Fix task title or description after creation
   ```bash
   {"title": "Corrected task title", "description": "Fixed description"}
   ```
   Use case: You made a typo when creating the task

5. **Complete Update** – Change almost everything except ownership
   ```bash
   {
     "title": "New title",
     "description": "New details",
     "status": "Completed",
     "category": "Work",
     "priority": "Medium"
   }
   ```
   Use case: Full task revision while keeping the original AI reasoning

**Key Points:**
- ✅ You can update any number of fields (1 or all at once)
- ✅ Fields you don't include are NOT changed
- ✅ String fields are automatically trimmed (whitespace removed)
- ✅ Status changes from Pending → Completed are instant
- ✅ Category and priority can be manually overridden (even if AI set them differently)
- ❌ Cannot update AI metadata (set at creation, reflects AI's original decision)
- ❌ Cannot transfer task ownership to another user

### Frontend-to-Backend: Edit Task Flow

When you click **✎ Edit** on a task in the frontend:

```
1. Frontend: EditTaskModal opens with current task data
   ↓
2. User updates fields (title, description, category, priority, status)
   ↓
3. User clicks "Save Changes"
   ↓
4. Frontend calls: PUT /tasks/:id with updated fields
   (E.g. { title: "...", category: "Work", priority: "High" })
   ↓
5. Backend verifies:
   - Task exists
   - Task belongs to current user (ownership check)
   ↓
6. Backend updates ONLY the provided fields
   ↓
7. Backend returns updated task with:
   - New values for updated fields
   - Original aiReasoning & aiSource (preserved)
   - Updated timestamp
   ↓
8. Frontend updates local state and task card refreshes
```

**Example: Frontend Update Flow**

```
User: Clicks edit on task "Buy milk" (currently Personal/Low)
      Changes to: Category = "Health", Priority = "High"
      Clicks "Save Changes"

Frontend: Sends PUT /tasks/507f1f... with:
{
  "category": "Health",
  "priority": "High"
}

Backend: 
- Finds task ✓
- Verifies ownership ✓
- Updates category & priority, keeps title and description unchanged
- Returns full updated task

Frontend: Dashboard updates instantly
          Task card now shows: 
          ❤️ Health | High priority | Original AI reasoning below
```

#### DELETE /tasks/:id – Delete Task

**Response** (204 No Content) or (200 OK with success message)

### Health Check (No Auth Required)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Server health status |

---

## 🤖 AI Integration – Smart Task Auto-Categorization

### Overview

The AI integration is implemented in [backend/src/services/aiService.js](backend/src/services/aiService.js). When a user creates a task via `POST /tasks`, the backend automatically categorizes it into one of four categories, assigns a priority level, and provides reasoning for the categorization—all without requiring user input.

### How It Works: Dual-Mode System

#### Mode 1: AI-Powered (When GROQ_API_KEY is provided)

1. **API Call** → When a task is created, `aiCategorize(title, description)` sends the task data to Groq's API
2. **Model** → Uses `llama-3.3-70b-versatile`, a powerful open-source LLM
3. **Prompt** → Structured JSON prompt ensures consistent output:
   ```
   "Analyze the task and respond ONLY with valid JSON:
   {
     "category": "<Work | Personal | Study | Health>",
     "priority": "<High | Medium | Low>",
     "reasoning": "<one concise sentence explaining why>"
   }"
   ```
4. **Response** → Parses JSON and validates categories/priorities
5. **Storage** → Saves category, priority, reasoning, and `aiSource: "ai"` in the database

**Example:**
- User creates: "Schedule dentist appointment with notes"
- AI responds: `{ category: "Health", priority: "Medium", reasoning: "Medical appointments require advance scheduling and should be tracked regularly" }`

#### Mode 2: Heuristic Fallback (When API unavailable or no key)

If the Groq API is unavailable or `GROQ_API_KEY` is not set, the system automatically falls back to intelligent keyword-based heuristics:

**Category Detection** – Scans task title and description for keywords:
- **Work**: meeting, deadline, report, client, project, email, presentation, sprint, deploy, invoice, etc.
- **Personal**: buy, shop, call, visit, clean, cook, family, friend, pay, bill, travel, hobby, etc.
- **Study**: read, learn, course, exam, assignment, research, book, lecture, homework, quiz, etc.
- **Health**: gym, workout, doctor, medicine, exercise, yoga, diet, sleep, appointment, etc.

**Priority Detection** – Looks for urgency keywords:
- **High**: urgent, asap, critical, immediately, deadline, emergency, overdue, priority, must, today
- **Low**: someday, maybe, eventually, optional, nice to have, whenever

**Default**: If no keywords match, defaults to `category: "Personal"` and `priority: "Medium"`

### Data Flow

```
User creates task
    ↓
POST /tasks with { title, description }
    ↓
Server calls aiCategorize(title, description)
    ├─ If GROQ_API_KEY exists
    │   └─ Call Groq API (llama-3.3-70b-versatile)
    │       └─ Validate & parse JSON response
    │           └─ Return { category, priority, reasoning, source: "ai" }
    │
    └─ If API fails or no key
        └─ Call heuristicCategorize(title, description)
            └─ Match keywords → determine category & priority
                └─ Return { category, priority, reasoning: null, source: "heuristic" }
    ↓
Task saved with category, priority, aiReasoning, and aiSource
    ↓
Frontend receives task with AI metadata
    └─ Displays `✦ AI` badge if aiSource is "ai"
```

### Configuration

#### Environment Variables

In `.env` (backend root):
```bash
# MongoDB connection
MONGODB_URI=mongodb://localhost:27017/taskflow
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/taskflow

# JWT configuration
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES_IN=7d

# Groq API (optional — app works without it)
GROQ_API_KEY=your-groq-api-key

# Frontend
CORS_ORIGIN=http://localhost:3000
```

**To get a Groq API key**: Visit [console.groq.com](https://console.groq.com) and create a free account (includes generous free tier).

### Error Handling & Resilience

- **API timeout** → Falls back to heuristic
- **Invalid JSON response** → Uses heuristic
- **Network error** → Uses heuristic
- **User never sees errors** → Task is created successfully with heuristic categorization
- **Logging** → Failed API calls are logged to console for debugging

---

## Architecture & Design Decisions

### Backend Architecture

| Concern | Implementation | Rationale |
|---------|---|---|
| **Authentication** | JWT (JSON Web Tokens) | Stateless, scalable; no session management required |
| **Authorization** | User ID verification on task operations | Every task query filters by `user: req.user.id`; prevents cross-user access |
| **Error Handling** | Express 5 global error handler + async/await | Express 5 automatically forwards async errors; no try/catch wrapping needed |
| **Validation** | express-validator with middleware | Centralized validation; reusable schemas before reaching controllers |
| **Database** | MongoDB with Mongoose | Flexible schema; scales well; easy integration |
| **AI Integration** | Dual-mode (API + heuristic fallback) | Ensures app works offline; graceful degradation |

### Frontend Architecture

| Concern | Implementation | Rationale |
|---------|---|---|
| **State Management** | React Context API (AuthContext) | Simple, no external dependencies; sufficient for auth state |
| **Data Fetching** | Custom `api.js` fetch wrapper | Automatic Auth header injection; centralized error handling |
| **Styling** | Tailwind CSS v4 with @theme tokens | Utility-first; fast; small bundle; no CSS framework overhead |
| **Build Tool** | Vite 6 | Fast dev server; modern ES modules; excellent HMR |
| **HTTP Proxying** | Vite dev server config | Local dev simplicity; avoids CORS during development |

### Security Considerations

1. **Password Storage** → `bcryptjs` for hashing (pre-save hook in User model)
2. **Token Expiry** → JWT tokens expire after 7 days (configurable)
3. **User Isolation** → `authenticate` middleware injects `req.user`; task controllers verify ownership before modifications
4. **Input Validation** → express-validator sanitizes and validates all inputs
5. **CORS** → Whitelist allowed origins in `.env`
6. **Environment Variables** → Never commit `.env`; use `.env.example` as template

---

## Assumptions & Implementation Notes

1. **MongoDB** – Production-ready database; uses Mongoose for schema definition and validation
2. **JWT Tokens** – Stored in localStorage on client; no server-side session management
3. **Groq API is optional** – The app remains 100% functional with the heuristic fallback; no API key required to test
4. **Single environment** – One `CORS_ORIGIN` in `.env`; use environment-specific configs for multi-environment deployments
5. **No role-based access control** – All authenticated users have equal permissions; extend with roles in User model if needed
6. **Task ownership is enforced** – Every task operation verifies `task.user === req.user.id`
7. **Timestamps on tasks** – `createdAt` and `updatedAt` tracked automatically by Mongoose
8. **AI categorization is not re-run** – Once stored, category/priority are not modified unless user explicitly updates them

---

## Testing the Application

### Using cURL (or Postman)

**1. Register a user**
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"securepass123"}'
```

**2. Login**
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"securepass123"}'
```
Response includes `token`.

**3. Create a task** (replace TOKEN with the JWT from login)
```bash
curl -X POST http://localhost:5000/tasks \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Finish project report","description":"Complete quarterly financial analysis"}'
```

**4. List tasks**
```bash
curl -X GET "http://localhost:5000/tasks?category=Work" \
  -H "Authorization: Bearer TOKEN"
```

**5. Update a task** (replace TASK_ID)
```bash
curl -X PUT http://localhost:5000/tasks/TASK_ID \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"Completed"}'
```

**6. Delete a task**
```bash
curl -X DELETE http://localhost:5000/tasks/TASK_ID \
  -H "Authorization: Bearer TOKEN"
```

### Using the Frontend

1. Open **http://localhost:5173** (or **http://localhost:3000**)
2. Click **"Sign Up"** or use demo credentials
3. After login, you'll see the **Dashboard**
4. Click **"+ Add Task"** and enter title/description
5. Watch as AI categorizes the task automatically
6. Search, filter, toggle status, update, and delete tasks

---

## 📝 Frontend User Guide

### Creating a Task

1. Click **"+ New Task"** button (top-right) or press **`N`**
2. Enter **Task Title** (required)
3. Enter **Description** (optional, helps AI categorize better)
4. Click **"Create Task"**
5. AI analyzes and assigns category/priority automatically
6. Task appears at top of dashboard

### Editing a Task**

Click the **✎ (edit)** icon on any task card to:
- Update **Title** and **Description**
- Change **Category** (Work / Personal / Study / Health)
- Adjust **Priority** (High / Medium / Low)
- Toggle **Status** (Pending ↔ Completed)
- View original **AI reasoning** (preserved, not editable)

**Note**: Original AI categorization is always stored and displayed for reference.

### Marking Tasks Complete

- Click the **checkbox** on the left of any task to toggle between Pending and Completed
- Completed tasks appear faded (visual indicator)

### Deleting a Task

- Click the **✕ (delete)** icon on the right side of a task card
- Task is removed immediately (cannot be undone)

### Search & Filtering

**Keyword Search** (top navbar):
- Press `/` to focus the search box
- Type to search task titles and descriptions in real-time

**Filter by Category** (sidebar):
- Click any category (Work, Personal, Study, Health)
- Click again to clear the filter
- View all categories or single category at a time

**Filter by Priority** (top navbar):
- Click: High, Medium, or Low priority
- Click again to toggle off

**Filter by Status** (top navbar):
- Click: Pending or Completed
- Click again to toggle off

**Clear All Filters**:
- Click "Clear ✕" button (appears when any filters active)

### Dashboard Statistics

Real-time stats displayed at top of dashboard:
- **📋 Total Tasks** – Count of all tasks
- **⏳ Pending** – Tasks still to do
- **✅ Completed** – Finished tasks
- **✦ AI Sorted** – Tasks auto-categorized by Groq AI

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **N** | Open "New Task" modal |
| **/** | Focus search box |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **CORS error** | Ensure `CORS_ORIGIN` in `.env` matches your frontend URL |
| **MongoDB connection fails** | Verify MongoDB is running; check `MONGODB_URI` in `.env` |
| **AI categorization not working** | This is expected if no `GROQ_API_KEY` is set; heuristic falls back automatically |
| **Token expired** | Log in again to get a new token |
| **Port 5000 already in use** | Modify `server.js` to use a different port or kill the process using the port |

---

## Future Enhancements

- [ ] Add recurring task support
- [ ] Implement task notifications/reminders
- [ ] Add collaboration (share tasks with other users)
- [ ] Multi-language support
- [ ] Export/import tasks
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] OAuth2 social login (Google, GitHub)
- [ ] Task scheduling and calendar view
- [ ] WebSocket real-time updates
