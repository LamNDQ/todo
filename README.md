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

```bash
npm run dev
```
