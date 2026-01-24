# 📦 Shop Web – Angular Frontend

A Single Page Application (SPA) frontend for an e-commerce system, built with **Angular** and integrated with a **Spring Boot REST API** using **JWT Authentication**.

---

## 🧠 Overview
- **shop-web** is the frontend application of an e-commerce system
- SPA architecture (Single Page Application)
- Role-based access control: **USER / ADMIN**
- Communicates with backend via REST API (`shop-api`)
- Designed following **enterprise-level project structure and best practices**

---

## 🛠️ Tech Stack
- **Angular 21.1.0**
- TypeScript (strict mode enabled)
- Angular Router
- Reactive Forms
- HttpClient + Interceptors
- JWT Authentication
- SCSS
- Node.js 20+

---

## 🧱 Project Structure
```text
src/app
├─ core/
│  ├─ auth/            # Authentication services & token handling
│  ├─ guards/          # AuthGuard, RoleGuard
│  ├─ interceptors/    # JWT & error interceptors
│  └─ services/        # Global/core services
│
├─ features/
│  ├─ auth/            # Login, Register pages
│  ├─ catalog/         # Product list & product detail
│  ├─ cart/            # Shopping cart & checkout
│  └─ admin/           # Admin product & order management
│
├─ shared/
│  ├─ models/          # Shared DTOs / interfaces
│  └─ components/      # Reusable UI components
│
├─ app.routes.ts
└─ app.config.ts
```

---

## 🔐 Authentication & Authorization
- JWT-based authentication
- Access token stored in `localStorage`
- `HttpInterceptor` automatically attaches:
```
Authorization: Bearer <token>
```
- Route protection using:
  - `AuthGuard`: requires authenticated user
  - `RoleGuard`: restricts access to ADMIN-only routes
- Automatically redirects to `/login` on token expiration or HTTP 401 responses

---

## ✨ Key Features

### 👤 User Features
- User registration & login
- Browse product catalog
- View product details
- Add / update / remove items in cart
- Checkout and place orders
- View order history

### 🛠️ Admin Features
- Product management (CRUD)
- Product image upload
- Soft delete / activate products
- Order management
- Role-based access control

---

## 🔗 Backend Integration
- Backend repository: **shop-api (Spring Boot)**
- API Base URL:
```
http://localhost:8080/api
```
- Unified API response format:
```json
{
  "success": true,
  "message": "OK",
  "data": {}
}
```

---

## 🧪 UI State Handling
- Global loading states for API calls
- Centralized error handling with user-friendly messages
- Empty states for no-data scenarios
- Reactive Forms with validation

---

## ⚙️ Installation & Run

### Prerequisites
- Node.js >= 20.19
- Angular CLI

### Install dependencies
```bash
npm install
```

### Run development server
```bash
ng serve
```

Access the application at:
```
http://localhost:4200
```

---

## 🏗️ Production Build
```bash
ng build -c production
```

---

## 📌 Notes
- This project is built for learning and practicing **Angular + Spring Boot** architecture
- Follows best practices: layered structure, separation of concerns, JWT security
- Easily extendable to mobile apps or SSR in the future

---

## 👨‍💻 Author
- **Đặng Quốc Thanh**
- Java Web Fullstack Developer (Angular + Spring Boot)
