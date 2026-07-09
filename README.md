# 📝 Task Board by Rakkesh

A realtime collaborative task board built with **Next.js**, **Express.js**, **PostgreSQL (Neon)**, **Prisma**, and **WebSockets**.

Every card creation, update, deletion, and drag-and-drop movement is synchronized instantly across all connected clients without requiring a page refresh.

---
# Live URL - https://task-borad-woad.vercel.app/cards

# 🚀 Tech Stack

## Frontend
- Next.js 15
- TypeScript
- Tailwind CSS
- Axios
- React Hook Form
- Zod
- @hello-pangea/dnd

## Backend
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)
- WebSocket (`ws`)

---

# 📁 Project Structure

```
task_board_by_rakkesh/
│
├── frontend/
│
└── backend/
```

This project is a **Monorepo**, so both frontend and backend must be installed and started separately.

---

# ⚙️ Prerequisites

Make sure you have installed:

- Node.js (v20+ recommended)
- npm
- Git

---

# 📥 Clone Repository

```bash
git clone <repository-url>
cd task_board_by_rakkesh
```

---

# 🖥️ Frontend Setup

Open a new terminal.

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Create a `.env.local`

```env
 Inside FrontEnd Readme
```

Run frontend

```bash
npm run dev
```

Frontend will start at

```
http://localhost:3000
```

---

# ⚙️ Backend Setup

Open another terminal.

```bash
cd backend
```

Install dependencies

```bash
npm install
```

Create `.env`

```env
    Inside Backend ReadMe
```

Generate Prisma Client

```bash
npx prisma generate
```

Run database migrations

```bash
npx prisma migrate dev
```

Start backend

```bash
npm run dev
```

Backend will start at

```
http://localhost:5000
```

---

# 🌐 Production

Frontend

```
Vercel
```

Backend

```
Render
```

Database

```
Neon PostgreSQL
```

---

# ✨ Features

- Realtime synchronization using WebSockets
- Drag & Drop cards
- Create Task
- Edit Task
- Delete Task
- Automatic reconnect
- Connected users counter
- Responsive UI
- PostgreSQL with Prisma ORM

---

# 📡 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/create-card | Create Card |
| POST | /api/getall-card | Get All Cards |
| PUT | /api/update-card/:id | Update Card |
| DELETE | /api/delete-card/:id | Delete Card |

---

# 📌 Notes

- Start the backend before running the frontend.
- Make sure PostgreSQL is accessible.
- Run `npx prisma generate` whenever the Prisma schema changes.
- Run `npx prisma migrate dev` after modifying the Prisma schema.

---

# 👨‍💻 Author

**Rakkesh Kumar**

Built as a realtime collaborative task board assignment demonstrating full-stack development, Prisma ORM, PostgreSQL, and WebSocket-based live synchronization.