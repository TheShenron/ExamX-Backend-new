# Kanshi Core — Backend for the Kanshi Suite

**Kanshi Core** is the backend service powering the Kanshi ecosystem.

It handles authentication, user management, session control, routing, and secure storage of proctoring activity — acting as the central command layer between the Kanshi extension and the Kanshi Console dashboard.

Built to be reliable, structured, and audit-friendly.

---

## ✨ What Kanshi Core Does

Kanshi Core is responsible for:

- 🔐 Authentication and authorization
- 👤 User and role management (admin / examiner / candidate)
- 🧾 Session creation and control
- 📦 Receiving and validating activity events from the extension
- 🗂️ Storing structured logs for later review
- 🔎 Serving APIs for Kanshi Console (dashboard)

---

## ⚔️ Features

- 🧠 Clean REST API architecture
- 🔐 Secure authentication (JWT/session based)
- 👥 Role-based access control (RBAC)
- 📋 Exam session lifecycle management
- 🧾 Proctoring log ingestion + validation
- 📊 Dashboard-ready endpoints for analytics & review
- 🧩 Designed for scalability (future microservices friendly)

---

## 🧩 Requirements

> Update these based on your stack.

- Node.js 18+ (recommended)
- Database (MongoDB)
- Environment variables configured

---

## ⚙️ Environment Variables

Create a `.env` file in the root:

```env
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:3000
