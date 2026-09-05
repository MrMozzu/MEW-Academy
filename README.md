# 🎓 MEW Academy

> **Full-Stack Modern Tech Learning Platform** with Interactive Courses, Student Dashboard, UPI Payment Gateway, Automated Certificate Generation, and Real-Time Admin Workflow.

---

## 🌟 Key Features

* **📚 Interactive Course Catalog**: Curated tech courses (Full Stack Development, Generative AI & Prompt Engineering, Python & Data Science, Cloud Computing).
* **👤 Student Authentication**:
  * Secure email & password authentication (salted bcrypt hashing).
  * 6-digit email OTP registration & account verification.
  * 1-Click recovery link and numeric OTP password reset workflow.
  * Google OAuth 2.0 / Identity Services integration.
* **💳 Integrated UPI Payment System**:
  * Real-time dynamic UPI payment QR generation.
  * UTR transaction verification and submission.
  * Admin approval/rejection pipeline with automated admission emails.
* **📜 Verifiable Digital Certificates**:
  * Automated digital certificates with unique Credential IDs and SHA-256 verification hashes.
  * Public credential verification portal (`/api/certificates/:certId`).
  * Downloadable high-resolution certificate views.
* **📊 Student Dashboard & Analytics**: Track enrolled courses, lesson completion, quiz scores, XP points, and learning streaks.
* **🛡️ Admin Management Portal**: Dedicated administrative dashboard to issue/revoke certificates, approve payments, and manage students.
* **📱 WhatsApp Community Integration**: Direct invitation to exclusive student live-batch WhatsApp communities.

---

## 🛠️ Technology Stack

### Frontend
* **React 19** & **TypeScript**
* **Tailwind CSS v4** (Modern utility styling)
* **Lucide React** (Modern iconography)
* **Vite 6** (Blazing-fast build tool & dev server)

### Backend
* **Node.js** & **Express**
* **Better-SQLite3** (High-performance WAL-mode embedded database)
* **JSON Web Tokens (JWT)** & **BcryptJS**
* **Nodemailer** (Gmail SMTP transactional mailer)
* **Helmet** & **Express-Rate-Limit** (Production-grade security & rate limiting)

---

## 🚀 Quick Start (Local Development)

### 1. Clone the Repository
```bash
git clone https://github.com/MrMozzu/MEW-Academy.git
cd MEW-Academy
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in the necessary values:
* `PORT=3001`
* `JWT_SECRET=your_jwt_secret`
* `SMTP_USER` & `SMTP_PASS` (Gmail credentials for sending OTPs)
* `UPI_ID=7070806047@ikwik`

### 4. Run the Full-Stack Application
```bash
npm run dev:full
```
* **Frontend**: `http://localhost:3000`
* **Backend API**: `http://localhost:3001/api`
* **Health Check**: `http://localhost:3001/api/health`

---

## 🧪 Testing & Quality Assurance

Run the comprehensive end-to-end automated test suite:
```bash
npm test
```
* Runs 36 test cases covering auth, OTP verification, payment approvals, and certificate generation via **Vitest**.

Run TypeScript type-checking:
```bash
npm run lint
```

---

## 📦 Production Build & Deployment

1. **Build the Frontend**:
   ```bash
   npm run build
   ```
2. **Start the Production Server**:
   ```bash
   npm start
   ```
   *Express automatically serves the compiled production single-page app (`dist/`) and all backend API endpoints on your specified `PORT`.*

---

## 📄 License
Private & Proprietary — MEW Academy. All rights reserved.
