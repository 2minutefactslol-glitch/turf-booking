const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(cors()); app.use(express.json());

const DB_URI = "mongodb://Admin:Nihalreddy123@ac-ktmpoty-shard-00-00.d0nniyi.mongodb.net:27017,ac-ktmpoty-shard-00-01.d0nniyi.mongodb.net:27017,ac-ktmpoty-shard-00-02.d0nniyi.mongodb.net:27017/turf?ssl=true&replicaSet=atlas-14f8at-shard-0&authSource=admin&retryWrites=true&w=majority";
mongoose.connect(DB_URI).then(() => console.log("✅ MongoDB Connected (IST Mode)"));

const Booking = mongoose.model("Booking", new mongoose.Schema({
    name: String, phone: String, date: String, startHour: Number, duration: Number, sport: String
}));
const Price = mongoose.model("Price", new mongoose.Schema({ dayPrice: Number, nightPrice: Number }));
const Setting = mongoose.model("Setting", new mongoose.Schema({ bookingPaused: Boolean }));

async function init() {
    try {
        if (!await Price.findOne()) await Price.create({ dayPrice: 800, nightPrice: 1200 });
        if (!await Setting.findOne()) await Setting.create({ bookingPaused: false });
    } catch (e) { console.log("Init error:", e); }
}
init();

app.post("/admin-login", (req, res) => {
    if (req.body.username === "Jadalzamana" && req.body.password === "Ayasher123") res.json({ success: true });
    else res.status(401).json({ success: false });
});

app.post("/verify-otp", (req, res) => {
    if (String(req.body.otp).trim() === "123456") res.json({ success: true });
    else res.status(400).json({ success: false });
});

app.post("/book", async (req, res) => {
    const { name, phone, date, startHour, duration, sport } = req.body;
    
    // --- FORCE INDIA TIMEZONE ---
    const indiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
    const now = new Date(indiaTime);
    const todayStr = now.toISOString().split('T')[0];
    const currentHour = now.getHours();

    const maxDate = new Date(now);
    maxDate.setDate(now.getDate() + 7);
    const maxDateStr = maxDate.toISOString().split('T')[0];

    if (date < todayStr) return res.status(400).json({ message: "This date has already passed (IST)." });
    if (date > maxDateStr) return res.status(400).json({ message: "Bookings only allowed for next 7 days." });
    if (date === todayStr && startHour <= currentHour) return res.status(400).json({ message: "This time has already passed." });

    const s = await Setting.findOne();
    if (s.bookingPaused) return res.status(403).json({ message: "Bookings are currently paused." });

    const existing = await Booking.find({ date });
    const isOverlap = existing.some(b => (startHour < (b.startHour + b.duration) && (startHour + duration) > b.startHour));
    if (isOverlap) return res.status(400).json({ message: "Slot already taken!" });

    await new Booking(req.body).save();
    res.json({ message: "Success" });
});

app.get("/bookings", async (req, res) => res.json(await Booking.find().sort({date: 1, startHour: 1}).lean()));
app.delete("/booking/:id", async (req, res) => { await Booking.findByIdAndDelete(req.params.id); res.json({ success: true }); });
app.get("/current-price", async (req, res) => res.json(await Price.findOne()));
app.post("/set-price", async (req, res) => {
    await Price.updateOne({}, { dayPrice: Number(req.body.dayPrice), nightPrice: Number(req.body.nightPrice) });
    res.json({ message: "Updated" });
});
app.get("/booking-status", async (req, res) => res.json({ paused: (await Setting.findOne()).bookingPaused }));
app.post("/toggle-booking", async (req, res) => {
    await Setting.updateOne({}, { bookingPaused: req.body.status });
    res.json({ message: "Updated" });
});

app.get("/dashboard", async (req, res) => {
    const indiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
    const today = new Date(indiaTime).toISOString().split('T')[0];
    const bookings = await Booking.find({ date: today });
    const p = await Price.findOne();
    let rev = 0;
    bookings.forEach(b => { 
        for(let i=0; i<b.duration; i++) {
            let h = (b.startHour + i) % 24;
            rev += (h >= 5 && h < 18) ? p.dayPrice : p.nightPrice;
        }
    });
    res.json({ revenue: rev });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("🚀 Server Live (IST)"));
