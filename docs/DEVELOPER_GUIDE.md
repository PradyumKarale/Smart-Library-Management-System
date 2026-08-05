# 📘 Smart Library Management System – Developer Guide

> This guide explains everything required to set up, run, understand, and contribute to the Smart Library Management System.

---

# Table of Contents

1. Introduction
2. Project Overview
3. Prerequisites
4. Required Software
5. Installation
6. Project Structure
7. Environment Variables
8. Database Setup
9. Running the Backend
10. Authentication Module
11. Development Workflow
12. Git Workflow
13. Coding Standards
14. Troubleshooting
15. Future Modules

---

# 1. Introduction

Welcome to the **Smart Library Management System** project.

This guide is intended for:

- Existing team members
- New developers joining the project
- Faculty reviewing the implementation
- Future contributors
- Anyone who wants to run the project locally

The objective is to ensure that anyone can clone the repository and start contributing without needing additional setup instructions.

---

# 2. Project Overview

The Smart Library Management System is a modern full-stack web application designed to automate and simplify library operations.

Instead of using a monolithic structure, the project follows a modular architecture where every feature is organized into independent modules.

Current completed module:

- ✅ Authentication & Authorization

Upcoming modules:

- 📚 Book Management
- 👨‍🎓 Student Management
- 👨‍💼 Librarian Management
- 📖 Issue & Return
- 📅 Reservations
- 📊 Dashboard & Reports
- 🤖 AI-powered Features

---

# 3. Development Philosophy

The project follows these principles:

- Modular Architecture
- Clean Code
- Separation of Concerns
- Repository Pattern
- Service Layer Pattern
- RESTful API Design
- Secure Authentication
- Reusable Components
- Scalable Folder Structure

Every module follows the same architecture:

```
Routes
    ↓
Controller
    ↓
Service
    ↓
Repository
    ↓
Prisma ORM
    ↓
MySQL
```

This keeps business logic separate from database operations.

---

# 4. Prerequisites

Before running the project, install the following software.

## Node.js

Recommended Version:

```
Node.js 22 LTS or newer
```

Verify installation:

```bash
node -v
npm -v
```

---

## Git

Verify installation:

```bash
git --version
```

---

## MySQL

Install MySQL Server 8.0 or newer.

Verify:

```sql
SELECT VERSION();
```

---

## Visual Studio Code

Recommended extensions:

- Prisma
- ESLint
- Prettier
- Error Lens
- GitLens
- Thunder Client (optional)

---

## Postman

Required for API testing.

The project currently uses Postman to test all backend endpoints.

---

# 5. Required Knowledge

Developers working on this project should be familiar with:

- JavaScript (ES Modules)
- Node.js
- Express.js
- REST APIs
- SQL Basics
- Prisma ORM
- JWT Authentication
- Git & GitHub
- Async/Await

---

# 6. Technology Stack

## Backend

- Node.js
- Express.js
- Prisma ORM
- MySQL
- JWT
- bcrypt
- Zod

---

## Frontend

Planned:

- React.js

---

## Development Tools

- Git
- GitHub
- VS Code
- Postman

---

# 7. Repository Structure

```
Smart-Library-Management-System
│
├── backend
│
├── docs
│
├── frontend
│
├── tests
│
├── README.md
│
└── .gitignore
```

Each directory has a dedicated responsibility and should not contain unrelated files.

---

# 8. Before You Start Development

Always follow this checklist before writing code.

- Pull the latest changes.
- Install dependencies.
- Verify the `.env` file.
- Start MySQL.
- Run Prisma generate.
- Start the backend.
- Test existing APIs.
- Create a new Git branch if working on a feature.

This ensures everyone works from the same stable codebase.

---

# Next Section

The next section explains how to install the project, configure dependencies, create the database, generate the Prisma client, and run the backend locally from scratch.

---

# 9. Cloning the Repository

Clone the project from GitHub.

```bash
git clone https://github.com/<YOUR_GITHUB_USERNAME>/Smart-Library-Management-System.git
```

Navigate into the project directory.

```bash
cd Smart-Library-Management-System
```

Verify the project structure.

```
Smart-Library-Management-System
│
├── backend
├── frontend
├── docs
├── tests
├── README.md
└── package.json
```

---

# 10. Installing Dependencies

The project currently contains a backend application.

Install the backend dependencies.

```bash
cd backend
npm install
```

After installation you should see a new folder.

```
backend/
│
├── node_modules
├── package.json
└── package-lock.json
```

Verify installation.

```bash
npm list --depth=0
```

---

# 11. Environment Variables

Create a file named:

```
backend/.env
```

Paste the following template.

```env
NODE_ENV=development

PORT=5000

JWT_SECRET=replace_this_with_a_long_random_secret_key

JWT_EXPIRES_IN=1d

DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/library_management_db"

EMAIL_USER=

EMAIL_PASS=
```

---

## Environment Variable Explanation

### NODE_ENV

Current environment.

```
development
```

---

### PORT

Backend server port.

Default:

```
5000
```

---

### JWT_SECRET

Secret key used to sign authentication tokens.

Replace with a long random string in production.

Example:

```
library-management-super-secret-key-2026
```

---

### JWT_EXPIRES_IN

Token expiry duration.

Examples:

```
1d

7d

12h

30m
```

---

### DATABASE_URL

Connection string for Prisma.

Example:

```
mysql://root:root123@localhost:3306/library_management_db
```

Replace:

- username
- password
- database name

according to your local MySQL installation.

---

### EMAIL_USER

Reserved for future email notifications.

Leave blank for now.

---

### EMAIL_PASS

Reserved for future SMTP integration.

Leave blank for now.

---

# 12. Database Setup

Start your MySQL Server.

Open MySQL Workbench or terminal.

Create the database if it does not already exist.

```sql
CREATE DATABASE library_management_db;
```

Verify it exists.

```sql
SHOW DATABASES;
```

Expected output should include:

```
library_management_db
```

---

# 13. Prisma Setup

Generate Prisma Client.

```bash
npx prisma generate
```

If database tables have not been created yet, run:

```bash
npx prisma migrate dev
```

If using an existing schema without migrations:

```bash
npx prisma db push
```

---

## Verify Prisma

Open Prisma Studio.

```bash
npx prisma studio
```

The browser should open automatically.

Default:

```
http://localhost:5555
```

You should be able to view:

- Users
- Roles
- Student Profiles
- Librarian Profiles

---

# 14. Running the Backend

Navigate to backend.

```bash
cd backend
```

Start the development server.

```bash
npm run dev
```

Expected output:

```
Server running on port 5000
Database connected
```

If using nodemon:

```
[nodemon] starting node src/server.js
```

---

# 15. Verifying Installation

Open your browser.

```
http://localhost:5000
```

Or use Postman.

Example:

```
GET http://localhost:5000/
```

You should receive a successful response from the server.

---

# 16. First API Test

Use Postman.

### Register Student

```
POST /api/auth/register/student
```

Sample Body

```json
{
    "fullName": "Rahul Sharma",
    "email": "rahul@example.com",
    "password": "Password@123",
    "enrollmentNo": "CSE23001",
    "department": "CSE",
    "semester": 5,
    "year": 3
}
```

Expected:

```
201 Created
```

---

### Login

```
POST /api/auth/login
```

```json
{
    "email": "rahul@example.com",
    "password": "Password@123"
}
```

Expected:

```
200 OK
```

Returns:

- User information
- JWT Token

---

### Current User

```
GET /api/auth/me
```

Header:

```
Authorization

Bearer <JWT_TOKEN>
```

Expected:

```
200 OK
```

---

# 17. Project Verification Checklist

Before starting development ensure all of the following are true.

✅ Repository cloned

✅ Dependencies installed

✅ MySQL running

✅ .env configured

✅ Prisma Client generated

✅ Backend starts successfully

✅ Register API works

✅ Login API works

✅ Protected route (/me) works

If all items above pass, your local development environment is ready.

---

# Next Section

The next section explains the backend architecture, folder organization, coding standards, and how every request flows from the client to the database.

---

# 18. Backend Architecture

The backend follows a **Feature-Based Modular Architecture** with a layered design. Every module is self-contained and follows the same internal structure, making the application easier to understand, maintain, and scale.

## Design Principles

The backend is built around the following principles:

- Feature-Based Modular Architecture
- Repository Pattern
- Service Layer Pattern
- Separation of Concerns
- Reusable Middleware
- Standardized API Responses
- Centralized Error Handling
- Input Validation using Zod
- JWT Authentication
- Role-Based Access Control (RBAC)

Each layer has a single responsibility.

---

# 19. Request Flow

Every API request follows the same execution path.

```
Client

↓

Routes

↓

Validation (Zod)

↓

Controller

↓

Service

↓

Repository

↓

Prisma ORM

↓

MySQL Database

↓

Repository

↓

Service

↓

Controller

↓

Standard API Response

↓

Client
```

This architecture keeps business logic independent from database logic and allows each layer to evolve without affecting the others.

---

# 20. Folder Structure

```
backend/
│
├── prisma/
│
├── src/
│
│   ├── constants/
│   │
│   ├── errors/
│   │
│   ├── middleware/
│   │
│   ├── modules/
│   │
│   ├── prisma/
│   │
│   ├── utils/
│   │
│   ├── app.js
│   │
│   └── server.js
│
└── package.json
```

Each folder has a dedicated responsibility.

---

# 21. Constants

Location

```
src/constants
```

Purpose

Stores reusable project-wide constants.

Examples

```
messages.js
roles.js
```

Advantages

- No duplicated strings
- Easier maintenance
- Consistent error messages

---

# 22. Errors

Location

```
src/errors
```

Contains

```
AppError.js
```

Purpose

Provides a custom error class that standardizes application errors.

Instead of

```javascript
throw new Error("Email already exists");
```

the project uses

```javascript
throw new AppError(
    MESSAGES.AUTH.EMAIL_EXISTS,
    409
);
```

Advantages

- Consistent responses
- HTTP status codes
- Cleaner services

---

# 23. Middleware

Location

```
src/middleware
```

Current middleware

```
auth.middleware.js
role.middleware.js
error.middleware.js
```

Responsibilities

Authentication

- Verify JWT
- Load current user
- Attach user to `req.user`

Authorization

- Verify user roles
- Restrict protected routes

Error Handling

- Catch application errors
- Return standardized responses

---

# 24. Modules

Every feature is implemented as an independent module.

Current module

```
modules/
└── auth/
```

Future modules

```
modules/
│
├── auth
├── book
├── student
├── librarian
├── issue
├── reservation
├── report
```

This allows new features to be added without affecting existing modules.

---

# 25. Standard Module Structure

Every module follows the same architecture.

```
module/
│
├── controller
├── service
├── repository
├── schema
├── mapper
├── routes
└── index
```

---

# 26. Controller Layer

Responsibilities

- Receive HTTP request
- Validate request
- Call service layer
- Return API response

Controllers should never contain business logic.

Example

```
POST /login

↓

loginController()

↓

loginService()
```

---

# 27. Service Layer

The service layer contains all business logic.

Responsibilities

- Authentication
- Validation rules
- Permission checks
- Data transformation
- Token generation

The service should never communicate directly with MySQL.

Instead

```
Service

↓

Repository
```

---

# 28. Repository Layer

Responsibilities

- Database queries
- Prisma interaction
- CRUD operations

The repository isolates Prisma from the business layer.

Example

```
findUserByEmail()

createUser()

findActiveUserByEmail()
```

If Prisma changes in the future, only repositories need modification.

---

# 29. Mapper Layer

Purpose

Convert database entities into safe API responses.

Example

Database object

```
passwordHash
createdAt
updatedAt
```

↓

Mapper

↓

API response

```
id
fullName
email
role
studentProfile
```

Sensitive fields are never returned to clients.

---

# 30. Schema Layer

Validation is performed using Zod.

Current schemas

```
registerStudentSchema

loginSchema
```

Advantages

- Type safety
- Input validation
- Cleaner controllers
- Better error messages

---

# 31. Utility Layer

Location

```
src/utils
```

Utilities include

```
jwt.js

password.js

apiResponse.js

asyncHandler.js
```

These utilities are shared across all modules.

---

# 32. Authentication Flow

```
Client

↓

POST /login

↓

Controller

↓

Service

↓

Repository

↓

Database

↓

Password Comparison

↓

JWT Generation

↓

Client Receives Token
```

Protected routes use

```
Authorization

Bearer TOKEN
```

---

# 33. Authorization Flow

Protected route

↓

Authenticate middleware

↓

Verify JWT

↓

Load user

↓

Attach req.user

↓

Role middleware

↓

Role verification

↓

Controller

This ensures both authentication and authorization are completed before any protected resource is accessed.

---

# 34. API Response Format

Every endpoint follows the same response structure.

Success

```json
{
    "success": true,
    "message": "...",
    "data": {}
}
```

Failure

```json
{
    "success": false,
    "message": "...",
    "errors": []
}
```

This consistency simplifies frontend integration.

---

# 35. Benefits of the Architecture

The current architecture provides:

- High maintainability
- Clear separation of concerns
- Easy testing
- Reusable components
- Better scalability
- Cleaner Git history
- Easier onboarding for new developers
- Simplified debugging

Every future module (Books, Students, Reservations, Reports, etc.) will follow the exact same architecture, ensuring consistency across the entire project.

---

# Next Section

The next section documents the complete Authentication & Authorization module, including registration, login, JWT flow, middleware, RBAC, and protected routes.

---

# 36. Authentication & Authorization Module

The Authentication module is the foundation of the Smart Library Management System.

Every protected feature in the application depends on this module.

Current implementation includes:

- Student Registration
- User Login
- Password Hashing
- JWT Authentication
- Protected Routes
- Current User Endpoint
- Role-Based Access Control (RBAC)

Future modules such as Book Management, Issue & Return, Reservations, and Reports will all reuse this authentication system.

---

# 37. Authentication Architecture

The authentication module follows the same layered architecture as the rest of the application.

```
Client

↓

Routes

↓

Validation (Zod)

↓

Controller

↓

Service

↓

Repository

↓

Prisma ORM

↓

MySQL
```

Each layer has a single responsibility.

---

# 38. Registration Flow

Student Registration Endpoint

```
POST /api/auth/register/student
```

Execution Flow

```
Client

↓

Request Validation

↓

Check Existing Email

↓

Find Student Role

↓

Hash Password

↓

Create User

↓

Create Student Profile

↓

Generate JWT

↓

Return Safe User Object
```

If the email already exists, the request returns:

```
409 Conflict
```

---

# 39. Login Flow

Login Endpoint

```
POST /api/auth/login
```

Execution Flow

```
Client

↓

Validate Request

↓

Find Active User

↓

Compare Password

↓

Generate JWT

↓

Return Safe User Object
```

If authentication fails:

```
401 Unauthorized
```

---

# 40. Password Security

Passwords are **never stored in plain text**.

Before saving a user:

```
Plain Password

↓

bcrypt.hash()

↓

Password Hash

↓

Database
```

During login:

```
Entered Password

↓

bcrypt.compare()

↓

Stored Hash

↓

Authentication Result
```

This protects user credentials even if the database is compromised.

---

# 41. JWT Authentication

After successful login or registration, the server generates a JWT.

Example payload

```json
{
    "id": "user-id",
    "role": "STUDENT"
}
```

The token is signed using:

```
JWT_SECRET
```

defined in the environment variables.

The client stores the token and sends it with every protected request.

Example

```
Authorization

Bearer eyJhbGciOi...
```

---

# 42. Authentication Middleware

Location

```
src/middleware/auth.middleware.js
```

Responsibilities

- Read Authorization header
- Validate Bearer format
- Verify JWT
- Decode payload
- Find current user
- Verify active account
- Attach user to req.user

Execution Flow

```
Incoming Request

↓

Authorization Header

↓

JWT Verification

↓

Database Lookup

↓

req.user

↓

Next Middleware
```

Without a valid token:

```
401 Unauthorized
```

---

# 43. Role-Based Access Control (RBAC)

Location

```
src/middleware/role.middleware.js
```

RBAC determines what an authenticated user is allowed to do.

Authentication answers:

```
Who are you?
```

Authorization answers:

```
What are you allowed to do?
```

---

# 44. Supported Roles

Current roles:

```
ADMIN

LIBRARIAN

STUDENT
```

Future roles can be added without changing the middleware logic.

---

# 45. RBAC Flow

Example

```
GET /api/auth/me

↓

authenticate

↓

authorize("STUDENT")

↓

Controller
```

If the authenticated user has the required role:

```
200 OK
```

Otherwise:

```
403 Forbidden
```

---

# 46. Current User Endpoint

Endpoint

```
GET /api/auth/me
```

Purpose

Returns information about the currently authenticated user.

Required Header

```
Authorization

Bearer TOKEN
```

Example Response

```json
{
    "success": true,
    "message": "Current user fetched successfully.",
    "data": {
        "user": {
            "id": "...",
            "fullName": "Rahul Sharma",
            "email": "rahul@example.com",
            "role": "STUDENT"
        }
    }
}
```

---

# 47. Validation

The project uses **Zod** for request validation.

Current schemas include:

```
registerStudentSchema

loginSchema
```

Benefits

- Cleaner controllers
- Type-safe validation
- Better error messages
- Reusable schemas

---

# 48. Repository Pattern

Database queries are isolated inside repositories.

Example methods

```
findUserByEmail()

findActiveUserByEmail()

findRoleByName()

createUser()
```

Services never communicate directly with Prisma.

---

# 49. Service Layer

The service layer contains all business logic.

Examples

- Password hashing
- JWT generation
- Role lookup
- Authentication
- Registration logic
- Login logic

Controllers remain lightweight because all processing happens inside services.

---

# 50. Mapper Layer

Database entities often contain internal fields.

Example

```
passwordHash

createdAt

updatedAt
```

The mapper converts database objects into safe API responses.

Returned fields include

```
id

fullName

email

role

studentProfile
```

Sensitive information is never exposed to API clients.

---

# 51. Standard API Responses

Success

```json
{
    "success": true,
    "message": "...",
    "data": {}
}
```

Failure

```json
{
    "success": false,
    "message": "...",
    "errors": []
}
```

Every endpoint in the project follows this structure.

---

# 52. Authentication Testing

The Authentication module has been tested using Postman.

Completed tests include:

✅ Student Registration

✅ Duplicate Registration

✅ Login Success

✅ Invalid Password

✅ JWT Generation

✅ Protected Route (/me)

✅ Missing Token

✅ Invalid Token

✅ Role-Based Access Control

---

# 53. Authentication Module Summary

Completed Features

- Student Registration
- Login
- Password Hashing
- JWT Authentication
- Protected Routes
- Current User Endpoint
- Role-Based Access Control
- Repository Pattern
- Service Layer
- Mapper Layer
- Validation
- Centralized Error Handling

Authentication and Authorization now provide the security foundation for every future module in the Smart Library Management System.

---

# Next Section

The next chapter describes the team's development workflow, coding standards, Git conventions, commit message format, and the recommended process for implementing new modules.

---

# 54. Development Workflow

This project follows a standardized development workflow to ensure consistency across all modules.

Every new feature should follow the same implementation process.

Following this workflow keeps the codebase clean, modular, and easy to maintain.

---

# 55. Module Development Lifecycle

Every module should be developed using the following sequence.

```
Planning

↓

Database Design

↓

Prisma Schema

↓

Repository

↓

Service

↓

Controller

↓

Routes

↓

Validation

↓

Middleware

↓

Testing

↓

Refactoring

↓

Git Commit

↓

Documentation
```

Skipping steps often results in inconsistent code and unnecessary refactoring.

---

# 56. Standard Module Structure

Every feature module should follow this folder structure.

```
module/
│
├── index.js
├── module.routes.js
├── module.controller.js
├── module.service.js
├── module.repository.js
├── module.schema.js
└── module.mapper.js
```

Example

```
auth/
│
├── auth.controller.js
├── auth.service.js
├── auth.repository.js
├── auth.schema.js
├── auth.mapper.js
├── auth.routes.js
└── index.js
```

Future modules such as Book, Student, Librarian, Issue, and Reservation should follow the exact same structure.

---

# 57. Responsibilities of Each Layer

## Routes

Responsibilities

- Define API endpoints
- Attach middleware
- Forward requests to controllers

Routes should never contain business logic.

---

## Controller

Responsibilities

- Receive HTTP request
- Validate request using Zod
- Call service layer
- Return standardized response

Controllers should remain lightweight.

---

## Service

Responsibilities

- Business logic
- Authentication
- Authorization
- Calculations
- Data transformation
- Calling repositories

Services should never contain database queries.

---

## Repository

Responsibilities

- Database operations
- Prisma queries
- CRUD operations

Repositories should never contain business logic.

---

## Schema

Responsibilities

- Input validation
- Request validation
- Type validation

The project uses Zod for validation.

---

## Mapper

Responsibilities

- Convert database entities into API responses
- Hide sensitive fields
- Maintain response consistency

---

# 58. Standard API Response Format

Every controller should return responses using the shared `apiResponse` utility.

Success

```json
{
    "success": true,
    "message": "...",
    "data": {}
}
```

Failure

```json
{
    "success": false,
    "message": "...",
    "errors": []
}
```

Avoid returning raw Prisma objects directly.

---

# 59. Error Handling

The project uses a centralized error handling strategy.

Always throw `AppError` for expected application errors.

Example

```javascript
throw new AppError(
    MESSAGES.AUTH.EMAIL_EXISTS,
    409
);
```

Avoid using generic `throw new Error()` for business logic.

Unexpected errors are handled by the global error middleware.

---

# 60. Validation Workflow

Validation is performed before business logic.

Flow

```
Incoming Request

↓

Zod Schema

↓

Controller

↓

Service
```

Benefits

- Cleaner services
- Better error messages
- Consistent validation

---

# 61. Authentication Workflow

Protected routes should always use middleware in the following order.

```
authenticate

↓

authorize

↓

Controller
```

Example

```javascript
router.post(
    "/books",
    authenticate,
    authorize("ADMIN", "LIBRARIAN"),
    createBookController
);
```

Never bypass authentication for protected resources.

---

# 62. Database Access Rules

Only repositories should communicate with Prisma.

Correct

```
Controller

↓

Service

↓

Repository

↓

Prisma
```

Incorrect

```
Controller

↓

Prisma
```

This separation makes the application easier to maintain and test.

---

# 63. Code Style Guidelines

Follow these conventions throughout the project.

### Naming

- camelCase for variables and functions
- PascalCase for classes
- UPPER_CASE for constants

Examples

```
findUserByEmail()

registerStudent()

generateToken()

AppError

MESSAGES

ROLES
```

---

### Imports

Group imports logically.

Example

```
External Libraries

↓

Constants

↓

Utilities

↓

Repositories

↓

Local Files
```

Maintain consistent ordering across files.

---

### Functions

Each function should have one clear responsibility.

Example

Good

```
registerStudent()

login()

getCurrentUser()
```

Avoid creating functions that perform multiple unrelated tasks.

---

# 64. Git Workflow

Before starting new work:

```bash
git pull origin main
```

Create a feature branch.

Example

```bash
git checkout -b feature/book-management
```

After development:

```bash
git add .

git commit -m "feat(book): implement add book API"

git push origin feature/book-management
```

After review, merge into `main`.

---

# 65. Commit Message Convention

Use descriptive commit messages.

Examples

```
feat(auth): implement JWT authentication

feat(book): add book repository

fix(auth): validate duplicate email

refactor(auth): introduce mapper layer

docs: update developer guide

test(auth): add login API tests
```

This keeps the Git history meaningful and easy to navigate.

---

# 66. Testing Workflow

Every feature should be tested before committing.

Recommended order

```
Validation

↓

Success Case

↓

Failure Case

↓

Edge Cases

↓

Security Checks

↓

Git Commit
```

Testing tools

- Postman
- Prisma Studio
- Manual verification

---

# 67. Refactoring Checklist

Before committing a feature, verify the following.

✅ Business logic is inside services

✅ Database queries are inside repositories

✅ Controllers remain lightweight

✅ Validation uses Zod

✅ API responses use `apiResponse`

✅ Errors use `AppError`

✅ Sensitive fields are hidden using mappers

✅ Authentication is applied where required

✅ Code is formatted

✅ Project runs without errors

---

# 68. Development Philosophy

The goal of this project is not only to build a Library Management System but also to follow software engineering practices used in professional backend development.

Every new feature should prioritize:

- Readability
- Maintainability
- Scalability
- Security
- Reusability
- Consistency

By following these principles, the project remains easy to extend and suitable for collaboration across multiple developers.

---

# Next Section

The next chapter covers common troubleshooting scenarios, frequently encountered errors, and solutions collected during development of Module 1.

---

# 69. Troubleshooting & Frequently Asked Questions (FAQ)

This chapter contains the most common issues encountered during the development of the Smart Library Management System and the recommended solutions.

Whenever you encounter an error, identify the category below before attempting random fixes.

---

# 70. Node.js Version Issues

## Problem

The backend fails to start or packages behave unexpectedly.

Example

```
SyntaxError
Unexpected token
Module not found
```

## Solution

Verify your Node.js version.

```bash
node -v
npm -v
```

Recommended version

```
Node.js 22 LTS or newer
```

After changing Node.js versions, reinstall dependencies.

```bash
rm -rf node_modules
rm package-lock.json
npm install
```

---

# 71. Missing Dependencies

## Problem

```
Cannot find package 'dotenv'
```

or

```
Cannot find module
```

## Cause

Dependencies have not been installed.

## Solution

Navigate to the backend directory.

```bash
cd backend
```

Install dependencies.

```bash
npm install
```

Verify installation.

```bash
npm list --depth=0
```

---

# 72. ES Module Errors

## Problem

```
Cannot use import statement outside a module
```

## Cause

The project is configured to use ES Modules but `"type": "module"` is missing from `package.json`.

## Solution

Ensure `package.json` contains:

```json
{
  "type": "module"
}
```

Use `import` / `export` syntax consistently.

---

# 73. Environment Variables Not Loading

## Problem

```
JWT_SECRET is undefined
```

or

```
DATABASE_URL is undefined
```

## Cause

The `.env` file is missing, incorrectly named, or `dotenv.config()` is not loaded.

## Solution

Verify:

```
backend/.env
```

and ensure `dotenv.config()` is executed before environment variables are accessed.

---

# 74. Prisma Client Errors

## Problem

```
Cannot find module '@prisma/client'
```

## Solution

Generate the Prisma client.

```bash
npx prisma generate
```

If necessary:

```bash
npm install
```

---

# 75. Database Connection Errors

## Problem

```
Can't reach database server
```

or

```
Access denied
```

## Checklist

- Is MySQL running?
- Is the username correct?
- Is the password correct?
- Does the database exist?
- Is `DATABASE_URL` correct?

Verify the connection string.

```
mysql://username:password@localhost:3306/library_management_db
```

---

# 76. Migration Issues

## Problem

Tables do not exist.

## Solution

Run

```bash
npx prisma migrate dev
```

If using an existing database without migrations

```bash
npx prisma db push
```

---

# 77. Authentication Errors

## Problem

```
401 Unauthorized
```

Possible causes

- Missing token
- Expired token
- Invalid token
- Incorrect Authorization header

Correct format

```
Authorization

Bearer YOUR_TOKEN
```

There must be a single space after **Bearer**.

---

# 78. Authorization Errors

## Problem

```
403 Forbidden
```

Meaning

The user is authenticated but does not have permission to access the requested resource.

Example

```
Student

↓

Admin Route

↓

403 Forbidden
```

Solution

Verify the required roles in the route.

Example

```javascript
authorize("ADMIN")
```

or

```javascript
authorize(
    "ADMIN",
    "LIBRARIAN"
)
```

---

# 79. Zod Validation Errors

## Problem

```
Validation failed
```

Cause

The request body does not match the schema.

Solution

Verify:

- Required fields
- Data types
- Allowed enum values
- Minimum length
- Maximum length

Always compare your request with the corresponding schema.

---

# 80. Git Ignore Issues

## Problem

Generated files appear in Git.

Examples

```
node_modules

skills-lock.json

.env
```

Solution

Verify `.gitignore`.

Example

```
node_modules/

.env

skills-lock.json

**/skills-lock.json
```

---

# 81. Line Ending Warnings

## Problem

```
LF will be replaced by CRLF
```

Meaning

Git detected different line-ending styles between operating systems.

This is a warning, not an error.

Recommended Git configuration on Windows

```bash
git config --global core.autocrlf true
```

---

# 82. Postman Checklist

Before reporting an API issue, verify:

✅ Backend server is running

✅ Correct URL

✅ Correct HTTP method

✅ Authorization header present

✅ Valid JWT

✅ JSON body is valid

✅ Content-Type = application/json

---

# 83. Debugging Strategy

When an issue occurs, follow this order.

```
Read the Error

↓

Identify the File

↓

Locate the Line Number

↓

Understand the Cause

↓

Apply the Fix

↓

Retest
```

Avoid changing multiple files at once.

Fix one issue, verify it, then continue.

---

# 84. Common Development Commands

Install dependencies

```bash
npm install
```

Start backend

```bash
npm run dev
```

Generate Prisma Client

```bash
npx prisma generate
```

Run migrations

```bash
npx prisma migrate dev
```

Push schema

```bash
npx prisma db push
```

Open Prisma Studio

```bash
npx prisma studio
```

Check Git status

```bash
git status
```

Commit changes

```bash
git add .

git commit -m "message"

git push
```

---

# 85. When to Ask for Help

If the problem persists after checking this guide:

1. Read the full error message.
2. Identify the affected file.
3. Note the line number.
4. Include:
   - Terminal output
   - Relevant code
   - Steps to reproduce

Providing complete information makes debugging significantly faster.

---

# Next Section

The next chapter defines the project's coding standards, naming conventions, formatting rules, and best practices to ensure every contributor writes consistent, maintainable code.

---

# 86. Coding Standards & Best Practices

This chapter defines the coding conventions and best practices that every contributor should follow.

Maintaining consistent coding standards improves readability, reduces bugs, and makes collaboration easier.

---

# 87. General Principles

Always write code that is:

- Readable
- Reusable
- Modular
- Consistent
- Secure
- Easy to maintain

Before writing code, ask yourself:

> "Will another developer understand this six months from now?"

---

# 88. File Naming Conventions

Use **camelCase** for JavaScript files.

Examples

```
auth.controller.js

auth.service.js

book.repository.js

role.middleware.js

password.js
```

Avoid names like:

```
AuthController.js

BookService.js

bookService.js
```

Maintain the same naming pattern across all modules.

---

# 89. Folder Naming Conventions

Folder names should be lowercase.

Examples

```
modules

middleware

constants

errors

utils

prisma
```

Feature folders

```
auth

book

student

issue

reservation
```

---

# 90. Function Naming

Functions should describe **what they do**.

Good

```javascript
registerStudent()

login()

generateToken()

findUserByEmail()

createBook()
```

Avoid vague names.

```javascript
doWork()

test()

run()

abc()
```

Function names should clearly communicate their purpose.

---

# 91. Variable Naming

Use descriptive variable names.

Good

```javascript
hashedPassword

existingUser

studentProfile

accessToken

bookCategory
```

Avoid

```javascript
a

b

temp

x

data1
```

Longer descriptive names are preferred over short ambiguous names.

---

# 92. Constants

Constants should use **UPPER_SNAKE_CASE**.

Examples

```javascript
JWT_SECRET

JWT_EXPIRES_IN

ROLES

MESSAGES
```

Store shared constants inside:

```
src/constants
```

---

# 93. Classes

Use PascalCase.

Example

```javascript
AppError
```

---

# 94. Import Order

Maintain a consistent import order.

Example

```javascript
// External Packages

import bcrypt from "bcrypt";

// Constants

import { MESSAGES } from "../constants/messages.js";

// Utilities

import { generateToken } from "../utils/jwt.js";

// Repository

import {
    findUserByEmail
} from "./auth.repository.js";
```

Grouping imports improves readability.

---

# 95. Comments

Use comments only when they improve understanding.

Good

```javascript
// Hash password before storing in database
```

Avoid comments that repeat the code.

Bad

```javascript
// Create user
createUser();
```

The code already explains itself.

---

# 96. Controller Guidelines

Controllers should:

- Parse requests
- Validate input
- Call services
- Return API responses

Controllers should **not**:

- Query the database
- Hash passwords
- Generate JWTs
- Perform business logic

Keep controllers thin.

---

# 97. Service Guidelines

Services contain all business logic.

Examples

- Registration
- Login
- Password hashing
- JWT generation
- Validation rules
- Permission checks

Services should never directly handle HTTP requests or responses.

---

# 98. Repository Guidelines

Repositories communicate with Prisma.

Examples

```javascript
findUserByEmail()

findRoleByName()

createUser()

findActiveUserByEmail()
```

Repositories should not contain business logic.

---

# 99. Schema Guidelines

All request validation should be implemented using **Zod**.

Example

```javascript
registerStudentSchema

loginSchema
```

Do not manually validate request bodies inside controllers.

---

# 100. Mapper Guidelines

Every API response should be sanitized through a mapper.

Never expose:

```
passwordHash

createdAt

updatedAt

internalIds
```

Return only fields required by the client.

---

# 101. Error Handling

Expected application errors should always use `AppError`.

Example

```javascript
throw new AppError(
    MESSAGES.AUTH.EMAIL_EXISTS,
    409
);
```

Avoid using:

```javascript
throw new Error("Something went wrong");
```

unless the error is truly unexpected.

---

# 102. API Responses

Every endpoint should return the same structure.

Success

```json
{
    "success": true,
    "message": "...",
    "data": {}
}
```

Failure

```json
{
    "success": false,
    "message": "...",
    "errors": []
}
```

Consistency simplifies frontend integration.

---

# 103. Security Guidelines

Always follow these rules.

✅ Hash passwords with bcrypt

✅ Never expose password hashes

✅ Protect sensitive routes

✅ Validate user input

✅ Use JWT authentication

✅ Use RBAC for authorization

✅ Keep secrets in `.env`

Never commit:

```
.env

API Keys

Passwords

JWT Secrets
```

---

# 104. Performance Guidelines

As the project grows:

- Minimize unnecessary database queries.
- Fetch only required fields.
- Reuse utilities.
- Avoid duplicate logic.
- Keep services focused.

These practices improve scalability.

---

# 105. Code Review Checklist

Before opening a Pull Request or committing code, verify:

✅ Project builds successfully

✅ No linting errors (if applicable)

✅ API tested in Postman

✅ Validation implemented

✅ Error handling present

✅ Sensitive data hidden

✅ Documentation updated (if required)

✅ Git history is clean

---

# 106. Documentation Standards

Whenever a new module is added:

Update:

- README.md
- API_REFERENCE.md
- PROJECT_STATUS.md
- DEVELOPER_GUIDE.md (if setup changes)

Documentation should evolve alongside the codebase.

---

# 107. Team Development Rules

Every contributor should:

- Pull the latest changes before starting work.
- Work on a dedicated feature branch.
- Write meaningful commit messages.
- Test thoroughly before merging.
- Keep pull requests focused on a single feature.

This ensures a clean and maintainable Git history.

---

# 108. Summary

Following these coding standards ensures:

- Consistent code quality
- Easier collaboration
- Faster onboarding for new developers
- Better maintainability
- Professional development practices

These standards should be followed across every module in the Smart Library Management System.

---

# Next Section

The final chapter outlines the project roadmap, upcoming modules, future enhancements, and long-term vision for the Smart Library Management System.

---

# 109. Project Roadmap & Future Vision

The Smart Library Management System is designed to be developed in multiple independent modules.

Each module builds upon the previous one while following the same architecture and coding standards.

The roadmap below represents the planned development phases.

---

# 110. Development Roadmap

## ✅ Module 1 – Authentication & Authorization

Status: **Completed**

Features:

- Student Registration
- Secure Login
- Password Hashing (bcrypt)
- JWT Authentication
- Protected Routes
- Current User Endpoint
- Role-Based Access Control (RBAC)
- Repository Pattern
- Service Layer
- Mapper Layer
- Zod Validation
- Centralized Error Handling
- Standard API Responses

---

## 🚧 Module 2 – Book Management

Status: **Next Module**

Planned Features:

- Add Book
- Update Book
- Delete Book
- View Book Details
- Search Books
- Filter by Category
- Filter by Author
- Filter by Availability
- Book Cover Upload
- QR Code Generation
- ISBN Validation

Only **ADMIN** and **LIBRARIAN** roles will be allowed to manage books.

Students will have read-only access.

---

## 📚 Module 3 – Student Management

Planned Features:

- Student CRUD
- Student Profile
- Student Search
- Student Status
- Active / Inactive Accounts
- Borrowing History
- Profile Update

---

## 👨‍💼 Module 4 – Librarian Management

Planned Features:

- Librarian CRUD
- Employee Profiles
- Role Assignment
- Staff Management
- Permissions

Only administrators can manage librarian accounts.

---

## 📖 Module 5 – Issue & Return Management

Planned Features:

- Issue Book
- Return Book
- Due Date Management
- Fine Calculation
- Issue History
- Return History
- Book Availability Update

---

## 📅 Module 6 – Reservation System

Planned Features:

- Reserve Book
- Cancel Reservation
- Reservation Queue
- Reservation Notifications
- Reservation Expiry

---

## 📊 Module 7 – Dashboard & Reports

Planned Features:

Admin Dashboard

- Total Books
- Total Students
- Active Borrowers
- Reserved Books
- Overdue Books
- Monthly Reports

Librarian Dashboard

- Today's Issues
- Today's Returns
- Pending Reservations

Student Dashboard

- Borrowed Books
- Reservation Status
- Due Dates
- Fine Summary

---

## 🤖 Module 8 – AI Features

Future AI integrations include:

- AI Book Recommendation
- Smart Book Search
- AI-powered Library Analytics
- Reading Pattern Analysis
- Personalized Suggestions
- Natural Language Search

---

# 111. Future Improvements

Potential enhancements:

- Email Notifications
- SMS Notifications
- Barcode Integration
- QR Code Scanner
- Mobile Application
- Progressive Web App (PWA)
- Multi-Library Support
- Multi-Language Support
- Dark Mode
- Audit Logs
- Notification Center

---

# 112. Deployment Roadmap

Planned deployment environments:

Development

- Local Machine

Testing

- Internal Team Testing

Production

Possible platforms:

- Railway
- Render
- AWS
- Azure
- DigitalOcean

Database options:

- MySQL
- PlanetScale
- Neon (future evaluation)

---

# 113. Testing Roadmap

Current

- Manual Testing
- Postman API Testing

Future

- Unit Testing
- Integration Testing
- End-to-End Testing
- Load Testing
- Security Testing

Recommended tools:

- Jest
- Supertest
- Postman Collections

---

# 114. Documentation Roadmap

Current Documentation

- README.md
- DEVELOPER_GUIDE.md

Planned Documentation

- API_REFERENCE.md
- DATABASE.md
- ARCHITECTURE.md
- CONTRIBUTING.md
- PROJECT_STATUS.md
- CHANGELOG.md

Documentation should always be updated whenever a new feature is implemented.

---

# 115. Contribution Guidelines

Before contributing:

- Pull the latest changes.
- Create a feature branch.
- Follow coding standards.
- Test all changes.
- Update documentation if necessary.
- Submit a Pull Request for review.

Avoid mixing unrelated features in the same commit.

---

# 116. Project Milestones

| Version | Milestone | Status |
|---------|-----------|--------|
| v0.1.0 | Authentication & Authorization | ✅ Completed |
| v0.2.0 | Book Management | 🚧 Planned |
| v0.3.0 | Student & Librarian Management | ⏳ Planned |
| v0.4.0 | Issue & Return | ⏳ Planned |
| v0.5.0 | Reservation System | ⏳ Planned |
| v0.6.0 | Dashboard & Reports | ⏳ Planned |
| v1.0.0 | Stable Release | 🎯 Target |

---

# 117. Long-Term Vision

The objective of this project is to create a modern, secure, scalable, and maintainable Library Management System that follows professional software engineering practices.

The project emphasizes:

- Clean Architecture
- Modular Design
- Secure Authentication
- Reusable Components
- Scalable Backend
- Comprehensive Documentation
- Collaborative Development

Beyond fulfilling academic requirements, this project is intended to serve as a portfolio-quality application demonstrating backend engineering skills and best practices.

---

# 118. Final Notes

Thank you for contributing to the Smart Library Management System.

By following the standards, workflows, and documentation provided in this guide, every contributor can build new features confidently while maintaining consistency across the project.

Happy Coding! 🚀