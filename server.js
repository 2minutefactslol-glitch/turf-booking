const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/* CLOUD DATABASE CONNECTION */
const DB_URI = "mongodb://Admin:Nihalreddy123@ac-ktmpoty-shard-00-00.d0nniyi.mongodb.net:27017,ac-ktmpoty-shard-00-01.d0nniyi.mongodb.net:27017,ac-ktmpoty-shard-00-02.d0nniyi.mongodb.net:27017/turf?ssl=true&replicaSet=atlas-14f8at-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(DB_URI)
    .then(() => console.log("✅ Cloud MongoDB Connected"))
    .catch(err => console.log("❌ DB Connection Error:", err));

/* SCHEMAS & MODELS */
const Booking = mongoose.model("Booking", new mongoose.Schema({
    name: String, phone: String, sport: String, date: String,
    startHour: Number, duration: Number, players: Number, totalPrice: Number
}));
const Price = mongoose.model("Price", new mongoose.Schema({ dayPrice: Number, nightPrice: Number }));
const Setting = mongoose.model("Setting", new mongoose.Schema({ bookingPaused: Boolean }));

/* INITIALIZE DEFAULTS */
async function init() {
    try {
        if (!await Price.findOne()) await Price.create({ dayPrice: 800, nightPrice: 1200 });
        if (!await Setting.findOne()) await Setting.create({ bookingPaused: false });
    } catch (e) { console.log("Init error:", e); }
}
init();

/* --- AUTHENTICATION ROUTES --- */

// 1. Admin Login (Manual)
app.post("/admin-login", (req, res) => {
    const { username, password } = req.body;
    if (username === "Jadalzamana" && password === "Ayasher123") {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: "Invalid Credentials" });
    }
});

// 2. Customer OTP Verification (Demo: 123456)
app.post("/verify-otp", (req, res) => {
    // Ensure the incoming OTP is checked as a string "123456"
    if (String(req.body.otp) === "123456") {
        res.json({ success: true });
    } else {
        res.status(400).json({ success: false, message: "Invalid OTP" });
    }
});

/* --- BOOKING & PRICING ROUTES --- */

app.post("/book", async (req, res) => {
    const { date, startHour, duration } = req.body;
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    if (date < todayStr) return res.status(400).json({ message: "Cannot book a past date." });
    if (date === todayStr && startHour <= now.getHours()) return res.status(400).json({ message: "Cannot book a past slot." });

    const s = await Setting.findOne();
    if (s.bookingPaused) return res.status(403).json({ message: "Bookings are paused." });
    
    const existing = await Booking.find({ date });
    const isOverlap = existing.some(b => (startHour < (b.startHour + b.duration) && (startHour + duration) > b.startHour));
    if (isOverlap) return res.status(400).json({ message: "Slot already taken!" });

    await new Booking(req.body).save();
    res.json({ message: "Booking Confirmed!" });
});

app.get("/bookings", async (req, res) => res.json(await Booking.find()));
app.delete("/booking/:id", async (req, res) => { 
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});
app.get("/current-price", async (req, res) => res.json(await Price.findOne()));
app.post("/set-price", async (req, res) => {
    await Price.updateOne({}, { dayPrice: Number(req.body.dayPrice), nightPrice: Number(req.body.nightPrice) });
    res.json({ message: "Prices Updated" });
});
app.get("/booking-status", async (req, res) => res.json({ paused: (await Setting.findOne()).bookingPaused }));
app.post("/toggle-booking", async (req, res) => {
    await Setting.updateOne({}, { bookingPaused: req.body.status });
    res.json({ message: "Status Updated" });
});

app.get("/dashboard", async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const bookings = await Booking.find({ date: today });
    const p = await Price.findOne();
    let rev = 0;
    bookings.forEach(b => { 
        for(let i=0; i<b.duration; i++) {
            let h = (b.startHour + i) % 24;
            rev += (h >= 5 && h < 18) ? p.dayPrice : p.nightPrice;
        }
    });
    res.json({ revenue: rev, bookings: bookings.length });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
