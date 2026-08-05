# 📚 Smart Library Management System

A modern Library Management System built using **Node.js, Express.js, Prisma ORM, MySQL, and JWT Authentication**.

---

# 🚀 Tech Stack

### Backend

- Node.js
- Express.js
- Prisma ORM
- MySQL
- JWT
- bcrypt
- Zod

### Tools

- Git
- Postman
- VS Code

---

# 📂 Project Structure

```
Smart-Library-Management-System
│
├── backend
│
├── frontend (Coming Soon)
│
├── tests
│
├── docs
│
└── README.md
```

---

# 📦 Prerequisites

Install the following before running the project.

- Node.js (v22+ recommended)
- MySQL
- Git
- VS Code
- Postman (for API testing)

Check installation:

```bash
node -v
npm -v
git --version
```

---

# 📥 Clone Repository

```bash
git clone https://github.com/PradyumKarale/Smart-Library-Management-System.git
```

```bash
cd Smart-Library-Management-System
```

---

# 📦 Install Dependencies

## Root

```bash
npm install
```

## Backend

```bash
cd backend
npm install
```

---

# 📚 Backend Packages

These packages are required for the backend.

### Production Dependencies

```bash
npm install express
npm install prisma
npm install @prisma/client
npm install jsonwebtoken
npm install bcrypt
npm install dotenv
npm install zod
npm install cors
npm install morgan
```

### Development Dependencies

```bash
npm install -D nodemon
```

---

# ⚙ Environment Variables

Create:

```
backend/.env
```

Paste:

```env
NODE_ENV=development

PORT=5000

JWT_SECRET=replace_this_with_a_long_random_secret_key

JWT_EXPIRES_IN=1d

DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/library_management_db"

EMAIL_USER=

EMAIL_PASS=
```

Replace:

```
YOUR_PASSWORD
```

with your local MySQL password.

---

# 🗄 Database Setup

Create the database.

```sql
CREATE DATABASE library_management_db;
```

Generate Prisma Client.

```bash
npx prisma generate
```

Create tables.

```bash
npx prisma migrate dev
```

If using an existing schema:

```bash
npx prisma db push
```

Open Prisma Studio.

```bash
npx prisma studio
```

---

# ▶ Running the Backend

Go to backend.

```bash
cd backend
```

Start the server.

```bash
npm run dev
```

Expected:

```
Server running on port 5000
```

---

# 🧪 API Testing

Current APIs

### Register Student

```
POST /api/auth/register/student
```

### Login

```
POST /api/auth/login
```

### Current User

```
GET /api/auth/me
```

Header

```
Authorization

Bearer <JWT_TOKEN>
```

---

# 📁 .gitignore

The following files should NOT be committed.

```
node_modules/
.env
.env.*
dist/
build/
coverage/

*.log

.vscode/
.idea/

skills-lock.json
**/skills-lock.json

.postman/

.DS_Store
Thumbs.db
```

---

# ✅ Completed Features

- Student Registration
- Login
- Password Hashing
- JWT Authentication
- Protected Routes
- Current User API
- Role-Based Access Control (RBAC)
- Repository Pattern
- Service Layer
- Zod Validation
- Centralized Error Handling

---

# 🚧 Upcoming Features

- Book Management
- Student Management
- Librarian Management
- Issue & Return
- Reservation System
- Dashboard
- Reports
- AI Features

---

# 👨‍💻 Development Workflow

After pulling the latest code:

```bash
git pull
```

Install dependencies if needed.

```bash
npm install
```

Start backend.

```bash
cd backend

npm run dev
```

Test APIs using Postman.

Commit changes.

```bash
git add .

git commit -m "your message"

git push
```

---

# 👥 Contributors

- Pradyum Karale

---

Happy Coding! 🚀