# 🏟️ TurfPro Booking System

A high-performance, real-time sports turf booking management system
built with the MERN stack (MongoDB, Express, Node.js) and Vanilla
JavaScript. Optimized for India Standard Time (IST) with a 7-day booking
window.

## 🚀 Key Features

Real-Time Sync: Admin dashboard updates every 2 seconds; Customer page
updates every 5 seconds.

Smart Slot Logic: Automatically greys out past hours and blocks past
dates (IST).

7-Day Window: Strictly limits bookings to the next 7 days only.

Admin Control: \* One-click Pause/Resume for all online bookings.

Dynamic Pricing Engine (Day vs. Night rates).

Offline Booking grid for manual entries.

Data Export: Download daily/monthly booking reports as CSV (Excel).

Security: Demo OTP verification (123456) and Admin Login protection.

## 🛠️ Technical Stack

Backend: Node.js, Express.js\
Database: MongoDB Atlas\
Frontend: HTML5, CSS3, JavaScript (ES6+)\
Deployment: Render (Backend), GitHub Pages / Vercel (Frontend)

## 📂 Project Structure

    ├── server.js          # Express backend & MongoDB logic
    ├── index.html         # Customer booking interface
    ├── admin.html         # Admin dashboard (Stats, Pricing, Offline)
    ├── login.html         # Admin authentication page
    └── README.md          # Project documentation

## ⚙️ Setup & Installation

### 1. Database Setup

Create a free cluster on MongoDB Atlas.\
Get your connection string.\
Replace the DB_URI in server.js with your own credentials.

### 2. Backend Deployment (Render)

Push server.js to a GitHub repository.\
Create a new Web Service on Render.com.\
Set the Environment Variable PORT to 5000.\
Copy your Render URL (e.g., https://turf-api.onrender.com).

### 3. Frontend Setup

Open index.html and admin.html.\
Change the BASE_URL constant at the top of the
```{=html}
<script>
```
tag to your Render URL:

``` javascript
const BASE_URL = "https://your-app-name.onrender.com";
```

## 🔑 Credentials (Default)

  Type           Username      Password / OTP
  -------------- ------------- ----------------
  Admin Login    JadalZamana   Ayasher123
  Customer OTP   N/A           123456

## 🛡️ Business Rules

Day Hours: 5:00 AM to 6:00 PM (Uses Day Price).\
Night Hours: 6:00 PM to 5:00 AM (Uses Night Price).\
Booking Limit: Max 6 consecutive hours per booking.\
Timezone: All logic is hard-locked to Asia/Kolkata.

## 📈 Future Enhancements

\[ \] Integration with Razorpay for real-time payments.\
\[ \] Automated SMS notifications via Twilio.\
\[ \] Monthly Revenue Analytics charts.
