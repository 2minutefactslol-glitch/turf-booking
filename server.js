const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(cors()); app.use(express.json());

const DB_URI = "mongodb://Admin:Nihalreddy123@ac-ktmpoty-shard-00-00.d0nniyi.mongodb.net:27017,ac-ktmpoty-shard-00-01.d0nniyi.mongodb.net:27017,ac-ktmpoty-shard-00-02.d0nniyi.mongodb.net:27017/turf?ssl=true&replicaSet=atlas-14f8at-shard-0&authSource=admin&retryWrites=true&w=majority";
mongoose.connect(DB_URI).then(() => console.log("DB Connected"));

const Booking = mongoose.model("Booking", new mongoose.Schema({
    name: String, phone: String, date: String, startHour: Number, duration: Number, sport: String
}));
const Price = mongoose.model("Price", new mongoose.Schema({ dayPrice: Number, nightPrice: Number }));
const Setting = mongoose.model("Setting", new mongoose.Schema({ bookingPaused: Boolean }));

// Admin Login
app.post("/admin-login", (req, res) => {
    if (req.body.username === "Jadalzamana" && req.body.password === "Ayasher123") res.json({ success: true });
    else res.status(401).json({ success: false });
});

// OTP Logic
app.post("/verify-otp", (req, res) => {
    if (String(req.body.otp).trim() === "123456") res.json({ success: true });
    else res.status(400).json({ success: false });
});

// Snappy Booking Logic
app.post("/book", async (req, res) => {
    const { date, startHour, duration } = req.body;
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    if (date < todayStr || (date === todayStr && startHour <= now.getHours())) return res.status(400).json({ message: "Invalid Time" });
    
    await new Booking(req.body).save();
    res.json({ message: "Success" });
});

app.get("/bookings", async (req, res) => res.json(await Booking.find().lean())); // .lean() makes it faster
app.delete("/booking/:id", async (req, res) => { 
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

app.get("/current-price", async (req, res) => res.json(await Price.findOne()));
app.get("/booking-status", async (req, res) => res.json({ paused: (await Setting.findOne()).bookingPaused }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("🚀 Live on " + PORT));
