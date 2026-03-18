const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(cors()); 
app.use(express.json());

// --- 1. CLOUD DATABASE CONNECTION ---
const DB_URI = "mongodb://Admin:Nihalreddy123@ac-ktmpoty-shard-00-00.d0nniyi.mongodb.net:27017,ac-ktmpoty-shard-00-01.d0nniyi.mongodb.net:27017,ac-ktmpoty-shard-00-02.d0nniyi.mongodb.net:27017/turf?ssl=true&replicaSet=atlas-14f8at-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(DB_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => console.log("❌ DB Connection Error:", err));

// --- 2. SCHEMAS & MODELS ---
const Booking = mongoose.model("Booking", new mongoose.Schema({
    name: String, 
    phone: String, 
    date: String, 
    startHour: Number, 
    duration: Number, 
    sport: String // 'Online' or 'Offline'
}));

const Price = mongoose.model("Price", new mongoose.Schema({ dayPrice: Number, nightPrice: Number }));
const Setting = mongoose.model("Setting", new mongoose.Schema({ bookingPaused: Boolean }));

// Initialize Default Settings if Database is empty
async function initDefaults() {
    try {
        if (!await Price.findOne()) await Price.create({ dayPrice: 800, nightPrice: 1200 });
        if (!await Setting.findOne()) await Setting.create({ bookingPaused: false });
    } catch (e) { console.log("Init error:", e); }
}
initDefaults();

// --- 3. AUTHENTICATION ---
app.post("/admin-login", (req, res) => {
    const { username, password } = req.body;
    if (username === "Jadalzamana" && password === "Ayasher123") {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});

app.post("/verify-otp", (req, res) => {
    if (String(req.body.otp).trim() === "123456") res.json({ success: true });
    else res.status(400).json({ success: false });
});

// --- 4. BOOKING LOGIC (7-DAY LIMIT & PAST-TIME BLOCK) ---
app.post("/book", async (req, res) => {
    const { name, phone, date, startHour, duration } = req.body;
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    // Calculate 7-day limit
    const maxDate = new Date();
    maxDate.setDate(now.getDate() + 7);
    const maxDateStr = maxDate.toISOString().split('T')[0];

    // Security Checks
    if (date < todayStr) return res.status(400).json({ message: "Cannot book past dates." });
    if (date > maxDateStr) return res.status(400).json({ message: "Limit: 7 Days ahead only." });
    if (date === todayStr && startHour <= now.getHours()) return res.status(400).json({ message: "This hour has already passed." });

    const settings = await Setting.findOne();
    if (settings.bookingPaused) return res.status(403).json({ message: "Bookings are currently paused." });

    // Overlap Check
    const existing = await Booking.find({ date });
    const isOverlap = existing.some(b => (startHour < (b.startHour + b.duration) && (startHour + duration) > b.startHour));
    
    if (isOverlap) return res.status(400).json({ message: "Slot already taken!" });

    await new Booking(req.body).save();
    res.json({ message: "Success" });
});

// --- 5. ADMIN DATA ROUTES ---
app.get("/bookings", async (req, res) => res.json(await Booking.find().sort({date: 1, startHour: 1}).lean()));

app.delete("/booking/:id", async (req, res) => { 
    await Booking.findByIdAndDelete(req.params.id); 
    res.json({ success: true }); 
});

app.get("/current-price", async (req, res) => res.json(await Price.findOne()));

app.post("/set-price", async (req, res) => {
    const { dayPrice, nightPrice } = req.body;
    await Price.updateOne({}, { dayPrice: Number(dayPrice), nightPrice: Number(nightPrice) });
    res.json({ message: "Prices Updated" });
});

app.get("/booking-status", async (req, res) => res.json({ paused: (await Setting.findOne()).bookingPaused }));

app.post("/toggle-booking", async (req, res) => {
    await Setting.updateOne({}, { bookingPaused: req.body.status });
    res.json({ message: "System Status Updated" });
});

app.get("/dashboard", async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const bookingsToday = await Booking.find({ date: today });
    const p = await Price.findOne();
    let revenue = 0;
    
    bookingsToday.forEach(b => { 
        for(let i=0; i<b.duration; i++) {
            let hour = (b.startHour + i) % 24;
            revenue += (hour >= 5 && hour < 18) ? p.dayPrice : p.nightPrice;
        }
    });
    res.json({ revenue, bookingsCount: bookingsToday.length });
});

// --- 6. START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
