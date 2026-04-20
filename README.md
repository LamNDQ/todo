# Các bước để cài và chạy project

## Yêu cầu
- Node.js (>= 16)
- MongoDB (đã cài và đang chạy)

---

## 1. Cài dependencies

Tại thư mục root (chứa package.json):

```bash
npm run install:all

```
---

## 2. Cấu hình môi trường

backend/.env

```bash
PORT
MONGODB_CONNECTIONSTRING
```

frontend/.env

```bash
VITE_API_URL
```
---

## 3. Chạy project

### Install root (concurrently)
```bash
npm install
```

### Install backend + frontend
```bash
npm run install:all
```

### Run project
 
```bash
npm run dev
```

---

## API Endpoints Summary

### Authentication
- **POST** `/api/auth/register`     — Register a new user (Zod validated)  
- **POST** `/api/auth/login`        — Login user (Zod validated)  
- **POST** `/api/auth/refresh`      — Refresh access token  
- **POST** `/api/auth/logout`       — Logout user & blacklist token (Redis)  
- **GET**  `/api/auth/me`           — Get current authenticated user  

---

### Tasks (User)
- **GET**    `/api/tasks`           — Get current user's tasks (cached in Redis)  
- **POST**   `/api/tasks`           — Create new task (Zod validated, cache invalidated)  
- **PUT**    `/api/tasks/:id`       — Update task (Zod validated, cache invalidated)  
- **DELETE** `/api/tasks/:id`       — Delete task (cache invalidated)  

---

### Admin (Protected)
- **GET**    `/api/admin/stats`               — Get app-wide statistics (admin only)  
- **GET**    `/api/admin/users`               — Get all users (admin only)  
- **PATCH**  `/api/admin/users/:id/role`      — Change user role (admin only)  
- **PATCH**  `/api/admin/users/:id/status`    — Activate / deactivate user (admin only)  
- **DELETE** `/api/admin/users/:id`           — Delete user & their tasks (admin only)  
### Authentication Notes
- Access Token expires in 15 minutes
- Refresh Token expires in 7 days
- Redis is used for token blacklisting on logout
⚡ Caching Strategy
- Task list is cached in Redis
- Cache is invalidated on create/update/delete
