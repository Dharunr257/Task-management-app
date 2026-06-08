# HCHI Kanban Hub (Task Management Application)

A premium, high-fidelity responsive Kanban board designed for personal task management. The application features a decoupled architecture (React frontend + Node.js/Express backend) that runs concurrently in development and builds into a single lightweight container for production deployment.

Developed in compliance with the **HCHI Deployable Application Standard**.

---

## Technical Stack

*   **Frontend:** React (scaffolded via Vite), Tailwind CSS v4 (native compiler integration), Lucide React (icon library)
*   **Backend:** Node.js, Express (REST API, CORS enabled, static asset serving, built-in health diagnostics)
*   **Database:** Non-persistent, optimized in-memory task database
*   **Orchestration:** Concurrently (dual-service development runner), Multi-stage Docker deployment

---

## Directory Structure

```text
Task Management application/
├── Dockerfile                  # Multi-stage production container build configuration
├── deployment.json             # HCHI Routing and container manifest
├── .dockerignore               # Optimized build context filtering
├── README.md                   # Setup and operations guide (this file)
├── package.json                # Root orchestration package
├── backend/                    # Node.js Express server
│   ├── package.json            # Server dependencies
│   ├── server.js               # API endpoints, health-checks, static file server
│   └── public/                 # Static asset drop-zone (copied from frontend build)
└── frontend/                   # React web application
    ├── package.json            # React & developer dependencies
    ├── index.html              # Core single-page entry layout
    ├── vite.config.js          # Vite configuration with developer proxy redirection
    └── src/
        ├── main.jsx            # React mounting scripts
        ├── App.jsx             # Main dashboard UI component, drag & drop, and CRUD state sync
        ├── App.css             # Layout reset styles
        └── index.css           # Tailwind v4 loading and custom glassmorphism utilities
```

---

## Local Development Setup

To run this application locally, you must have Node.js (v18 or higher) and npm installed.

### 1. Installation
Install root, backend, and frontend dependencies concurrently:
```bash
npm run install:all
```

### 2. Run the Application
Start both the React development server and the Node backend concurrently with a single command:
```bash
npm run dev
```

*   **Frontend dev server** will be available at `http://localhost:5173` (or the next available port like `5174`).
*   **Backend server** will be available at `http://localhost:3031`.
*   All frontend API calls to `/api/*` are dynamically proxied to `http://localhost:3031/api/*` in real-time, preventing CORS errors.

---

## REST API Endpoints

| Method | Endpoint | Description | Payload Schema |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/tasks` | Retrieve all active tasks | *None* |
| **POST** | `/api/tasks` | Create a new task card | `{ title: string, description?: string, column?: string, priority?: string, dueDate?: string }` |
| **PUT** | `/api/tasks/:id` | Update properties/column status of a task | `{ title?, description?, column?, priority?, dueDate? }` |
| **DELETE** | `/api/tasks/:id` | Permanently delete a task card | *None* |
| **GET** | `/api/health` | Service health status check | *None* |

---

## HCHI Platform Containerization

The project is fully pre-configured to build, package, and deploy automatically within the **Hybrid Cloud HomeLab Infrastructure** routing network.

### Docker Build Instructions
For production deployment, build the container image locally:
```bash
docker build -t task-manager .
```

### Deployment Configuration (`deployment.json`)
The HCHI deployment engine processes the app manifest for infrastructure auto-registration:
*   **Domain:** `task-manager.homelab` (routing handled by NGINX Proxy Manager)
*   **Port Mapping:** Exposes port `3031` inside the container and maps to `3031` on the host.
*   **Network:** Connects automatically to `homelab-network`.
*   **Health endpoint:** `/api/health`
