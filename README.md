# 📚 Smart Library Management System (SLMS)

A production-grade, full-stack Library Management System built with **React (TypeScript, Vite, Tailwind CSS)**, **Node.js/Express**, **Prisma ORM**, **MySQL**, **JWT Authentication**, and an integrated **Groq-powered AI Library Assistant**.

---

## 🚀 Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript & Vite
- **Styling:** Tailwind CSS with Lucide Icons
- **Routing:** React Router v6 with Role-Based Protected Routes
- **State/Notifications:** Custom Context Providers (Auth, Toast, Modals)

### Backend
- **Runtime:** Node.js (v22+ LTS)
- **Server:** Express.js 5
- **ORM / Database:** Prisma ORM with MySQL (and seamless offline in-memory fallback store)
- **Authentication:** JSON Web Tokens (JWT) & `bcryptjs` password hashing
- **Validation:** Zod schemas
- **AI Engine:** Official Groq Cloud SDK (`groq-sdk`)

---

## 📂 Project Structure

```
Smart-Library-Management-System
├── backend/
│   ├── prisma/             # Prisma schema and database migrations
│   └── src/
│       ├── config/         # Environment configuration (JWT, ports, AI)
│       ├── constants/      # Reusable roles and messages
│       ├── middleware/     # Auth, role authorization, and error handlers
│       ├── modules/        # Modular domains:
│       │   ├── ai/         # Groq AI Assistant controller, service, routes & schema
│       │   ├── auth/       # Registration, login, profile, mapper & repo
│       │   ├── books/      # Book catalogue CRUD and inventory tracking
│       │   ├── categories/ # Category management
│       │   ├── issues/     # Issue, loan limits, return, and fine calculator
│       │   ├── librarians/ # Staff management
│       │   └── students/   # Student profile management
│       ├── prisma/         # Prisma client / mock store fallback
│       ├── utils/          # JWT, password hashing, API envelope response
│       ├── app.js          # Express app registration
│       └── server.js       # Standalone backend server (port 5000)
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI & AI Assistant Chat floating widget
│   │   ├── context/        # Auth Context & Session listeners
│   │   ├── pages/          # Dashboards (Admin, Librarian, Student), Books, Issues
│   │   ├── services/       # Typed apiClient services for each domain
│   │   └── types/          # Domain TypeScript interfaces
│   ├── index.html
│   └── vite.config.ts
├── server.js               # Unified dev & production server on port 3000
├── package.json            # Root workspace config (backend & frontend)
└── .env.example            # Environment variable reference
```

---

## ⚙️ Environment Variables

Create `.env` at root or in `backend/.env`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Authentication
JWT_SECRET=your_long_random_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Database (MySQL via Prisma)
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/library_management_db"

# Optional Email Notification placeholders
EMAIL_USER=
EMAIL_PASS=

# AI Library Assistant (Groq Cloud Developer Tier)
AI_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

---

## 🤖 Groq AI Library Assistant Setup

The SLMS AI Assistant is powered by the GroqCloud API using ultra-fast LPU inference:

1. **Obtain Free API Key:** Sign up at [https://console.groq.com/keys](https://console.groq.com/keys).
2. **Configure Key:** Add `GROQ_API_KEY=gsk_...` to your `.env`.
3. **Supported Models:** Default is `llama-3.3-70b-versatile`. You can also configure `llama-3.1-8b-instant`.
4. **Free-Tier Limits:** Groq's developer tier enforces rate limits (Requests Per Minute / Tokens Per Minute). If a rate limit (HTTP 429) occurs, the assistant cleanly notifies the user, explains that the limit was reached, and offers a retry without breaking any core library operations.
5. **Safe Catalog Grounding:** The assistant strictly answers from the real library catalog (titles, authors, categories, shelf locations, and live availability), enforcing loan limits (14 days, max 3 books) and protecting student privacy.

---

## 🏃 Running the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Development Mode (Unified Port 3000)
```bash
npm run dev
```
Starts the full-stack server on `http://localhost:3000`:
- Express backend APIs: `/api/auth`, `/api/books`, `/api/categories`, `/api/issues`, `/api/students`, `/api/librarians`, `/api/ai`
- Health check: `http://localhost:3000/health`
- Vite React frontend served with hot module reloading.

### 3. Production Build & Start
```bash
npm run build
npm start
```

---

## 🔑 Demo Login Accounts

Pre-seeded accounts are provided for testing all user roles:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Admin** | `admin@smartlibrary.com` | `Admin@123` | Full system access, librarians, categories, books, issues |
| **Librarian** | `librarian@smartlibrary.com` | `Librarian@123` | Issue books, returns, inventory, students, categories |
| **Student** | `rahul@example.com` | `Password@123` | Browse catalog, view personal loans/fines, AI assistant |

*(Quick demo login buttons are also available on the Login page).*

---

## 🧪 Testing and Verification

- **Frontend Typecheck & Build:**
  ```bash
  npm run build
  ```
- **Linter Check:**
  ```bash
  npm run lint
  ```
- **Backend Unit Tests:**
  ```bash
  npm test
  ```
- **AI Chat Endpoint Check (cURL):**
  ```bash
  # 1. Login to get token:
  TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@smartlibrary.com","password":"Admin@123"}' \
    | grep -o '"token":"[^"]*' | cut -d'"' -f4)

  # 2. Query AI Chat endpoint:
  curl -X POST http://localhost:3000/api/ai/chat \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{"message":"Recommend beginner programming books"}'
  ```

---

## 👥 Contributors

- **Pradyum Karale**
- **Aditya Nadimpalli**
- **Vishruth Shetty**
- **Jay Patel**
