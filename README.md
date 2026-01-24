# 📦 Shop Web – Angular Frontend

Frontend SPA cho hệ thống bán hàng, xây dựng bằng **Angular** và giao tiếp với **Spring Boot REST API** thông qua JWT Authentication.

---

## 🧠 Tổng quan
- **shop-web** là frontend của hệ thống e-commerce
- Kiến trúc **SPA (Single Page Application)**
- Phân quyền **USER / ADMIN**
- Giao tiếp backend qua REST API (`shop-api`)
- Áp dụng cấu trúc project **theo chuẩn enterprise**

---

## 🛠️ Công nghệ sử dụng
- **Angular 21.1.0**
- TypeScript (strict mode)
- Angular Router
- Reactive Forms
- HttpClient + Interceptors
- JWT Authentication
- SCSS
- Node.js 20+

---

## 🧱 Cấu trúc thư mục
```text
src/app
├─ core/
│  ├─ auth/            # AuthService, token handling
│  ├─ guards/          # AuthGuard, RoleGuard
│  ├─ interceptors/    # JWT interceptor, error handling
│  └─ services/        # Global services
│
├─ features/
│  ├─ auth/            # Login, Register pages
│  ├─ catalog/         # Product list, product detail
│  ├─ cart/            # Cart & checkout
│  └─ admin/           # Admin product/order management
│
├─ shared/
│  ├─ models/          # Shared DTO / interfaces
│  └─ components/      # Reusable UI components
│
├─ app.routes.ts
└─ app.config.ts
```

---

## 🔐 Authentication & Authorization
- Đăng nhập bằng **JWT**
- Token được lưu trong `localStorage`
- `HttpInterceptor` tự động gắn header:
```
Authorization: Bearer <token>
```
- Route được bảo vệ bằng:
  - `AuthGuard`: yêu cầu đăng nhập
  - `RoleGuard`: yêu cầu quyền ADMIN
- Khi token hết hạn hoặc 401 → tự động redirect về `/login`

---

## ✨ Chức năng chính

### 👤 User
- Đăng ký / đăng nhập
- Xem danh sách sản phẩm
- Xem chi tiết sản phẩm
- Thêm / cập nhật / xoá sản phẩm trong giỏ hàng
- Checkout & tạo đơn hàng
- Xem lịch sử đơn hàng

### 🛠️ Admin
- Quản lý sản phẩm (CRUD)
- Upload ảnh sản phẩm
- Soft delete / active product
- Quản lý đơn hàng
- Phân quyền truy cập theo role

---

## 🔗 Kết nối Backend
- Backend repository: **shop-api (Spring Boot)**
- Base URL:
```
http://localhost:8080/api
```
- Format response thống nhất:
```json
{
  "success": true,
  "message": "OK",
  "data": {}
}
```

---

## 🧪 Xử lý trạng thái UI
- Loading state cho mọi API call
- Hiển thị error message từ backend
- Empty state khi không có dữ liệu
- Form validation (Reactive Forms)

---

## ⚙️ Cài đặt & chạy project

### Yêu cầu
- Node.js >= 20.19
- Angular CLI

### Cài đặt
```bash
npm install
```

### Chạy dev
```bash
ng serve
```

Truy cập:
```
http://localhost:4200
```

---

## 🏗️ Build production
```bash
ng build -c production
```

---

## 📌 Ghi chú
- Project được thiết kế để học tập và thực hành kiến trúc **Angular + Spring Boot**
- Áp dụng best practices: phân tầng, tách trách nhiệm, bảo mật JWT
- Có thể mở rộng thêm mobile app hoặc SSR trong tương lai

---

## 👨‍💻 Tác giả
- **Đặng Quốc Thanh**
- Java Web Fullstack Developer (Angular + Spring Boot)
