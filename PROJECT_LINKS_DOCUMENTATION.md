# 🚗 ApexDrive Bharat - Complete Project Links & Credentials Documentation

Comprehensive directory of all live deployment links, cloud dashboards, source repositories, container registries, API specifications, and administrative credentials for the **ApexDrive Executive Car Rental Management System**.

---

## 🌐 1. Live Production Deployments

| Resource | Service Provider | Live Production URL | Description |
| :--- | :--- | :--- | :--- |
| **Frontend Application** | **Vercel** | [https://rental-car-app-orpin.vercel.app](https://rental-car-app-orpin.vercel.app) | React 19 + Vite + Tailwind CSS 3 SPA |
| **Backend REST API** | **Render** | [https://apexdrive-backend.onrender.com](https://apexdrive-backend.onrender.com) | Node.js / Express API Engine |
| **Real-Time WebSocket** | **Socket.io on Render** | `wss://apexdrive-backend.onrender.com` | Bi-directional fleet & booking event stream |
| **Backend API Health Check** | **Render** | [https://apexdrive-backend.onrender.com/api/admin/stats](https://apexdrive-backend.onrender.com/api/admin/stats) | Live MongoDB connection status & KPI metrics |

---

## 📂 2. Source Code & Version Control

| Platform | Repository URL | Default Branch | Notes |
| :--- | :--- | :--- | :--- |
| **GitHub** | [https://github.com/samruddh23/Rental_Car_Lab](https://github.com/samruddh23/Rental_Car_Lab) | `main` | Continuous Deployment (CD) enabled to Vercel & Render |

---

## 🐳 3. Container Images & DockerHub Registry

Both microservices are containerized and published on DockerHub:

| Service | DockerHub Repository | Pull Command |
| :--- | :--- | :--- |
| **Backend API Server** | [samruddh23/apexdrive-backend](https://hub.docker.com/r/samruddh23/apexdrive-backend) | `docker pull samruddh23/apexdrive-backend:latest` |
| **Frontend Web App** | [samruddh23/apexdrive-frontend](https://hub.docker.com/r/samruddh23/apexdrive-frontend) | `docker pull samruddh23/apexdrive-frontend:latest` |

### 🛠️ One-Command Local Docker Launch
To spin up MongoDB, the backend, and the frontend locally in one command:
```bash
docker-compose up --build
```

---

## ☁️ 4. Cloud Infrastructure & Service Dashboards

| Service | Dashboard Direct Link | Role in Project |
| :--- | :--- | :--- |
| **Vercel Dashboard** | [vercel.com/sam-cbb2/rental-car-app](https://vercel.com/sam-cbb2/rental-car-app) | Static build hosting, SSL, edge reverse proxy |
| **Render Dashboard** | [dashboard.render.com](https://dashboard.render.com) | Node.js Web Service (`apexdrive-backend`) |
| **MongoDB Atlas** | [cloud.mongodb.com](https://cloud.mongodb.com) | Cloud database cluster (`Cluster0`, AWS Mumbai `ap-south-1`) |
| **Resend Dashboard** | [resend.com/emails](https://resend.com/emails) | Transactional email delivery over HTTPS (Port 443) |

---

## 👥 5. Verified Access Accounts & Credentials

### 🛡️ Administrative Accounts (Full Portal Access)
| Role | Email ID | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `superadmin@apexdrive.in` | `SuperAdmin@123` | **Root Authority**: Create admins, promote/demote users, manage entire fleet & bookings |
| **Admin** | `admin@apexdrive.in` | `Admin@123` | **Fleet Manager**: Add/edit/delete vehicles, ban/delete customers, manage reservations |

### 👤 Customer Accounts (Booking & Reservation Access)
| Name | Email ID | Password | Purpose |
| :--- | :--- | :--- | :--- |
| **Rahul Sharma** | `rahul.sharma@gmail.com` | `Customer@123` | Demo customer account |
| **Priya Patel** | `priya.patel@gmail.com` | `Customer@456` | Demo customer account |
| **Samruddh Jadhav** | `2024.samruddh.jadhav@ves.ac.in` | *(Your password)* | Live Resend email recipient |

---

## 📡 6. Complete REST API Endpoints Reference

Base URL: `https://apexdrive-backend.onrender.com/api`

### 🚗 Vehicle Fleet CRUD
- `GET /api/cars` — Retrieve all vehicles (supports `?category=...&search=...`)
- `POST /api/cars` — Add a new vehicle to MongoDB inventory (*Admin only*)
- `PUT /api/cars/:id` — Update pricing or availability (*Admin only*)
- `DELETE /api/cars/:id` — Remove vehicle from catalog (*Admin only*)

### 📋 Bookings & Lifecycle
- `GET /api/bookings` — Fetch all reservations
- `POST /api/bookings` — Create a new reservation *(Triggers "Booking Confirmed" email)*
- `PUT /api/bookings/:id/status` — Transition status (`Confirmed` ➔ `Ongoing` ➔ `Completed` / `Cancelled`)
- `DELETE /api/bookings/:id` — Cancel booking *(Triggers "Booking Canceled" email)*

### 🔐 Authentication & JWT
- `POST /api/auth/login` — Authenticate user and issue JWT Bearer token
- `POST /api/auth/register` — Create new customer profile in MongoDB
- `GET /api/auth/me` — Retrieve authenticated user profile via Bearer token

### ⚡ Super Admin & RBAC Management
- `GET /api/admin/customers` — List all registered customer accounts (*Admin/Super Admin*)
- `DELETE /api/admin/customers/:id` — Permanently delete customer account (*Admin/Super Admin*)
- `PUT /api/admin/customers/:id/status` — Ban or activate customer account (*Admin/Super Admin*)
- `GET /api/admin/admins` — View administrative hierarchy (*Super Admin only*)
- `POST /api/admin/create-admin` — Provision new administrator (*Super Admin only*)
- `PUT /api/admin/users/:id/promote` — Promote customer to Admin or demote (*Super Admin only*)

### 💳 Payments, Files & Diagnostics
- `POST /api/payment/create-order` — Initialize Razorpay / UPI order
- `POST /api/payment/verify` — Verify transaction signature & issue GST invoice
- `GET /api/payment/invoice/:bookingId` — Fetch GST tax invoice breakdown
- `POST /api/upload/document` — Multer document upload (Driving License / Aadhaar)
- `POST /api/upload/vehicle` — Multer vehicle catalog image upload
- `GET /api/tests/run` — Execute automated 6-step integration test suite
- `POST /api/tests/send-test-email` — Live diagnostic endpoint to test email delivery

---

## ⚙️ 7. Environment Variables Reference

### Backend (`server/.env` & Render Dashboard)
```env
PORT=5000
MONGO_URI=mongodb+srv://samruddh:<password>@cluster0.szh1eea.mongodb.net/rental_car_db?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=apexdrive_bharat_jwt_secret_key_2026

# Resend HTTPS API (Active on Render Free Tier)
RESEND_API_KEY=re_********************************

# SMTP Configuration (Active for local development)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=samruddh.jadhav@gmail.com
SMTP_PASS=****************
SMTP_FROM="ApexDrive Rentals <samruddh.jadhav@gmail.com>"
```

### Frontend (`.env` & Vercel Dashboard)
```env
VITE_API_URL=https://apexdrive-backend.onrender.com/api
```
