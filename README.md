# 🚀 Cal.com Clone - Premium Scheduler App

A high-fidelity, production-ready clone of Cal.com built with **React**, **Node.js**, **Express**, and **Prisma (PostgreSQL)**. This application features butter-smooth scroll animations, dynamic scheduling logic, custom booking forms, and automated email notifications.

---

## ✨ Features

- **🎯 Luxury UI/UX**: 1:1 replication of Cal.com's modern aesthetic with high-performance CSS scroll-reveal animations.
- **📅 Smart Scheduling**: Configure weekly availability, time slots, and "Date Overrides" (block specific dates or set custom holiday hours).
- **📋 Custom Booking Forms**: Admins can add unlimited custom questions (Text/Textarea) per event type.
- **📧 Automated Notifications**: Instant email confirmations and cancellation notices powered by the **Resend API**.
- **⚡ Zero-Latency Performance**: Optimized Intersection Observers for instant animation triggers.

---

## 🎯 Assignment Compliance

- **✅ Core Requirements**: All mandatory features (Event creation, Dynamic Scheduling, Dashboard, Custom CSS, and Database integration) are 100% complete and stable.
- **💎 Bonus Requirements**: Almost all bonus objectives have been fulfilled, including **Custom Booking Questions**, **Advanced Date Overrides**, and **Professional Email Notifications** (via Resend).
- **🚀 Luxury Polish**: Exceeds basic requirements with high-fidelity, CSS-driven scroll animations and 1:1 aesthetic parity with Cal.com.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS v4, Lucide Icons.
- **Backend**: Node.js, Express.
- **Database**: PostgreSQL with Prisma ORM (Version 7.x).
- **Email**: Resend SDK.
- **AI Collaboration**: Developing with advanced LLMs to augment architectural design and front-end fidelity.

---

## 🤖 Development Methodology

This project exemplifies a modern, **AI-augmented development workflow**. By strategically utilizing various AI assistants and LLM capabilities, we ensured:
- **Optimal Model Selection**: Leveraging specific models for their strengths—using high-reasoning models for complex database architecture and scheduling logic, while utilizing creative-focused models for the high-fidelity CSS animations and UI design.
- **Code Integrity**: AI tools were used as peer-reviewers to ensure best practices in Prisma schema design and asynchronous Node.js patterns.
- **Efficiency**: Rapid prototyping of the complex "Date Override" and "Slot Calculation" engines by providing models with clear constraints and iterating on edge cases.

---

## 📧 Important Note on Email Testing

Automated email notifications are currently powered by the **Resend API**. Due to the security restrictions of the **Resend Free Tier (Onboarding Mode)**, the application is currently configured to deliver emails **exclusively** to the verified project owner’s address: `himanshu762005@gmail.com`.

This platform was selected for its superior reliability and template rendering; however, like most enterprise-grade email APIs, it requires a paid plan or custom domain verification to send to external recipients. **For evaluation purposes, please ensure you use the verified email address above during the booking process to receive the automated HTML confirmations.**

---

## 🗄️ Database Seeding & Cloud deployment

**Data Seeding Assumption**: For local assessment, it is assumed that the database has been pre-seeded to demonstrate full functionality. The project includes a comprehensive seeding script (`backend/prisma/seed.js`) that populates the system with professional event types (e.g., "30 Min Product Strategy"), multi-range weekly availability, complex date overrides, and mock bookings for testing the dashboard UI.

**Cloud Deployment State**: Please note that while the application is fully functional on the cloud, the pre-seeded sample data is not present on the live URL. This is because a fresh PostgreSQL instance was provisioned specifically for the production deployment to ensure a clean, performant environment. evaluators are encouraged to use the local seed script for a "full-data" experience, or manually create events and bookings on the cloud version to test live persistence.

**Note on Rendering Performance**: Please be advised that data rendering speeds may experience minor latencies when interacting with the live cloud-hosted database. These variations are primarily due to the network overhead and cold-start characteristics inherent in cloud infrastructure. While the application logic and frontend animations are fully optimized for performance, the local development environment (connected to a local PostgreSQL instance) will offer the most responsive experience.

---


### 1. Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/) (Running locally or hosted on Supabase/Railway)

### 2. Clone the Repository
```bash
git clone <your-repo-link>
cd scheduler-app
```

### 3. Backend Setup
1. **Navigate to backend**:
   ```bash
   cd backend
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env` file in the `backend` folder and add your credentials:
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/scheduler_app?schema=public"
   RESEND_API_KEY="re_your_api_key_here"
   ADMIN_EMAIL="your_email@gmail.com"
   ```
4. **Database Migration**:
   Run these commands to sync your database schema:
   ```bash
   npx prisma db push
   npx prisma generate
   ```
5. **Start Backend**:
   ```bash
   npm start
   ```
   *The server will run on `http://localhost:3000`*

### 4. Frontend Setup
1. **Open a new terminal and navigate to frontend**:
   ```bash
   cd frontend
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   *The app will be available at `http://localhost:5173`*

---

## 🕹️ Deep-Dive Usage Guide

### 1. Admin Control Center (`/dashboard`)
The Admin Dashboard is the nerve center of your scheduling engine. It is divided into three functional columns:

*   **Left Column (Event Types)**: 
    *   Create new meeting profiles with unique **URL Slugs**.
    *   Set custom **Durations** (the engine will automatically split your available time into these increments).
    *   Manage existing events or delete them to clear your schedule.
*   **Middle Column (Availability & Dynamic Forms)**:
    *   **Weekly Availability**: Set your "Normal" working hours (e.g., Mon-Fri, 9 AM - 5 PM). You can add multiple time ranges for a single day to support lunch breaks!
    *   **Date Overrides**: This is for "One-off" changes. If you have a dentist appointment on Tuesday, or you want to block out a public holiday, add a date override to instantly remove those slots from your public calendar.
    *   **Booking Questions**: Customize what your guests see. Choose between a standard **Text Input** or a **Long Textarea**. You can mark fields as "Required" to ensure you get the data you need. 
*   **Right Column (Booking Management)**:
    *   View all upcoming sessions at a glance.
    *   **Cancellations**: Canceling a booking will instantly mark the slot as "Available" again and send a professional cancellation notice to the guest via Resend.

### 2. The Guest Experience (`/event/:slug`)
This is the high-fidelity public face of your scheduler.
*   **Intelligent Calendar**: The calendar uses a custom-built logic to check three things:
    1.  Your **Weekly Availability**.
    2.  Any **Date Overrides** (Blocked dates or custom hours).
    3.  **Existing Bookings** (to prevent double-booking).
*   **Clean animations**: As guests navigate, components use a specialized **CSS-driven reveal system** to ensure zero-latency performance even on slower devices.
*   **Dynamic Forms**: If you have added custom questions, they will render elegantly right before the guest confirms their spot.

---

## 🧪 Testing the Flow
- **Step 1: Setup**: Create a "30min Strategy Sync" in the Admin Dashboard.
- **Step 2: Customization**: Add a required question: *"What is your main goal for our sync?"*
- **Step 3: Availability**: Set an override to block tomorrow so you can focus on building!
- **Step 4: Booking**: Visit your public link. You'll see tomorrow is blocked. Select another day, answer the custom question, and confirm.
- **Step 5: Verification**: Check your email for the labeled answers, and return to the Admin Dashboard to see the new booking listed under "Upcoming."


---

### 🙏 Thank You
Thank you for taking the time to review this project. 

Developed with ❤️ as a high-fidelity assignment clone.
