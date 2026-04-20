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

POST   /api/auth/register    — register (Zod validated)
POST   /api/auth/login       — login (Zod validated)
POST   /api/auth/refresh     — refresh access token
POST   /api/auth/logout      — logout + blacklist token
GET    /api/auth/me          — get current user

GET    /api/tasks            — get MY tasks (cached in Redis)
POST   /api/tasks            — create task (Zod validated, cache invalidated)
PUT    /api/tasks/:id        — update MY task (Zod validated, cache invalidated)
DELETE /api/tasks/:id        — delete MY task (cache invalidated)

GET    /api/admin/stats      — app-wide stats [admin only]
GET    /api/admin/users      — list all users [admin only]
PATCH  /api/admin/users/:id/role    — change role [admin only]
PATCH  /api/admin/users/:id/status  — activate/deactivate [admin only]
DELETE /api/admin/users/:id         — delete user + their tasks [admin only]
