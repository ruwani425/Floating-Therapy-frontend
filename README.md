# 🌿 Theta Lounge – Therapy Center Frontend

A modern **frontend application** for the Theta Lounge wellness management system, built using **React + TypeScript**.  
This application provides a smooth, responsive user experience for clients booking therapy sessions and for admins managing schedules, users, and permissions.

---

## 🧩 Overview

The Theta Lounge frontend focuses on performance, aesthetics, and usability, delivering a premium wellness experience through a clean UI and secure role-based access.

### Key Highlights
- Client-friendly booking & package management UI
- Secure admin dashboard with protected routes
- Responsive, mobile-first design
- Seamless integration with MERN backend APIs
- Deployed on **Vercel**

---

## ✨ Features

### 🌟 User Experience
- 🎨 Elegant UI with custom typography  
  *(Playfair Display, Poppins, Inter)*
- 📱 Fully responsive, mobile-first design
- 🎥 Video backgrounds with overlay effects
- 🎯 Custom Tailwind CSS theme (Theta-blue palette)

### 🔐 Security & Routing
- Firebase Authentication
- Protected admin routes
- Role-based UI rendering

### ⚡ Performance
- Vite-powered fast development
- Hot Module Replacement (HMR)
- Optimized production builds

---

## 🛠 Technologies & Tools

### Frontend Stack
- **React.js** (TypeScript)
- **Vite**
- **Tailwind CSS**
- **React Router DOM**
- **Firebase Authentication**
- **Lucide React** – Icon library

### Backend Integration
- Node.js & Express
- MongoDB & Mongoose
- Nodemailer (Email notifications)
- Node-Cron (Automated tasks)

### Deployment & DevOps
- **Vercel** – Frontend hosting
- **GitHub** – Version control
- **Postman** – API testing

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js **v18+**
- Backend API running
- Firebase project configured

---

### 📦 Frontend Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/           # Admin-specific components
│   ├── layout/          # Layout components (Navbar, Footer)
│   └── shared/          # Shared UI components
├── core/                # Core configs (Axios, API handlers)
├── firebase/            # Firebase configuration
├── pages/               # Application pages
│   ├── admin/           # Admin pages
│   └── client/          # Public/client pages
├── types/               # TypeScript type definitions
└── utils/               # Utility functions (cookies, helpers)

```

## License

All rights reserved.
