# **OAuth MERN + TypeScript Template**

A production-grade starter template for building secure full-stack applications with **MERN**, **TypeScript**, **Redux Toolkit**, and **JWT Authentication** using **Access Token + Refresh Token (HttpOnly cookie)**.
Includes OAuth provider login, token rotation, and clean project structure for real-world applications.

---

## Features

### **Authentication**

- Email/Password login
- OAuth providers (Google/Facebook-ready)
- **Access Token (JWT)** — short-lived
- **Refresh Token** stored in **HttpOnly Secure Cookie**
- Automatic token refresh & rotation
- Logout with server-side revocation

### **Frontend**

- React + TypeScript
- Redux Toolkit + Redux Thunk
- Axios interceptor auto-refresh logic
- Protected + role-based routes
- Typed API services and hooks

### **Backend**

- Node.js + Express + TypeScript
- Passport.js (Local & OAuth strategies)
- Strong JWT token system
- Refresh Token stored in DB for validation
- Centralized error handler
- CORS with credentials support
- MongoDB + Mongoose with TS interfaces
