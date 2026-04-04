# 🏟️ TurfPro Booking System

A high-performance, real-time sports turf booking management system built with the **MERN stack** (MongoDB, Express, Node.js) and Vanilla JavaScript. Optimized for **India Standard Time (IST)** with a 7-day booking window.

---

## 🌐 Live Demo

| Page | URL |
|---|---|
| 🏟️ Customer Booking | [https://2minutefactslol-glitch.github.io/turf-booking/](https://2minutefactslol-glitch.github.io/turf-booking/) |
| 🖥️ Admin Dashboard | [https://2minutefactslol-glitch.github.io/turf-booking/admin.html](https://2minutefactslol-glitch.github.io/turf-booking/admin.html) |

> 🔑 Use the default credentials from the [Credentials](#-default-credentials) section to log in.

---

## 🚀 Key Features

### ⚡ Real-Time Sync
- Admin dashboard refreshes every **2 seconds**; Customer page refreshes every **5 seconds**
- Live booking status reflects instantly across all sessions

### 🕐 Smart Slot Logic
- Automatically greys out past hours and blocks past dates (IST)
- Visual slot grid shows available (green) and unavailable (grey) slots at a glance

### 📅 7-Day Booking Window
- Strictly limits bookings to the next **7 days only**
- Prevents stale or far-future reservations

### 💰 Dynamic Pricing Engine
- **Day Rate** (5:00 AM – 6:00 PM): configurable day price (default ₹900/hr)
- **Night Rate** (6:00 PM – 5:00 AM): configurable night price (default ₹1400/hr)
- Admin can update prices live from the dashboard
- Warning prompt enforces pausing bookings before any price change

### 💳 Advance Payment System
- Customers pay a **10% advance** online at the time of booking
- Remaining balance is collected at the turf
- Payment breakdown shown per booking: Advance Paid + Balance Due + Total

### 📋 Live Bookings & Payments Dashboard
- Full table of all bookings showing:
  - Customer name and booking type (Online / Offline)
  - Phone number
  - Slot date, time, and duration
  - Detailed payment breakdown (Adv / Paid / Total)
  - Per-booking **Cancel** action button
- Entries update in real-time — no manual refresh needed

### 🖥️ Admin Control Panel
- **Pause / Resume** toggle to instantly halt or restore all online bookings
- System status displayed live (ACTIVE / PAUSED)
- Prevents new customer bookings during maintenance or price changes

### 📝 Quick Offline Booking
- Walk-in customer booking directly from the admin dashboard
- Fields: Customer Name, Phone Number, Date, Duration (hours)
- Same slot grid as the customer view — select start slot with one click
- Offline bookings are tagged separately in the live bookings table

### 📊 Data Export
- One-click **Download CSV Report** for daily or monthly booking data
- Export-ready for Excel analysis and record-keeping
- Tracks total revenue (Advance + Collected Balance)

### 🔐 Security & Authentication
- **Admin Login** protected with username and password credentials
- **Customer OTP verification** before booking confirmation (Demo OTP: `123456`)
- Session-based access control to separate admin and customer flows

---

## 🛠️ Technical Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Frontend | HTML5, CSS3, JavaScript (ES6+) |
| Deployment | Render (Backend), GitHub Pages / Vercel (Frontend) |

---

## 📂 Project Structure

```
├── server.js          # Express backend & MongoDB logic
├── index.html         # Customer booking interface
├── admin.html         # Admin dashboard (Stats, Pricing, Offline Booking, Live Table)
├── login.html         # Admin authentication page
└── README.md          # Project documentation
```

---

## ⚙️ Setup & Installation

### 1. Database Setup

- Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)
- Get your connection string
- Replace `DB_URI` in `server.js` with your own credentials

### 2. Backend Deployment (Render)

- Push `server.js` to a GitHub repository
- Create a new **Web Service** on [Render.com](https://render.com)
- Set the Environment Variable `PORT` to `5000`
- Copy your Render URL (e.g., `https://turf-api.onrender.com`)

### 3. Frontend Setup

Open `index.html` and `admin.html` and update the `BASE_URL` constant at the top of the `<script>` tag:

```javascript
const BASE_URL = "https://your-app-name.onrender.com";
```

---

## 🔑 Default Credentials

| Type | Username | Password / OTP |
|---|---|---|
| Admin Login | JadalZamana | Ayasher123 |
| Customer OTP | N/A | 123456 |

> ⚠️ Change admin credentials before deploying to production.

---

## 🛡️ Business Rules

| Rule | Detail |
|---|---|
| Day Hours | 5:00 AM – 6:00 PM (Day Price applies) |
| Night Hours | 6:00 PM – 5:00 AM (Night Price applies) |
| Booking Limit | Max **6 consecutive hours** per booking |
| Advance Payment | 10% of total amount collected online |
| Timezone | All logic hard-locked to **Asia/Kolkata (IST)** |
| Booking Window | Next **7 days** only |

---

## 📈 Future Enhancements

- [ ] Integration with **Razorpay** for real-time payments
- [ ] Automated **SMS notifications** via Twilio
- [ ] Monthly **Revenue Analytics** charts
- [ ] Customer booking history and profile page
- [ ] Multi-turf / multi-ground support
