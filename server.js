const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const DB_URI = "mongodb://Admin:Nihalreddy123@ac-ktmpoty-shard-00-00.d0nniyi.mongodb.net:27017,ac-ktmpoty-shard-00-01.d0nniyi.mongodb.net:27017,ac-ktmpoty-shard-00-02.d0nniyi.mongodb.net:27017/turf?ssl=true&replicaSet=atlas-14f8at-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(DB_URI).then(() => console.log("✅ DB Connected")).catch(err => console.log(err));

const Booking = mongoose.model("Booking", new mongoose.Schema({
    name: String, phone: String, sport: String, date: String,
    startHour: Number, duration: Number, players: Number, totalPrice: Number
}));
const Price = mongoose.model("Price", new mongoose.Schema({ dayPrice: Number, nightPrice: Number }));
const Setting = mongoose.model("Setting", new mongoose.Schema({ bookingPaused: Boolean }));

/* FIX FOR MOBILE OTP */
app.post("/verify-otp", (req, res) => {
    // Force convert to string and remove spaces
    const receivedOTP = String(req.body.otp).trim(); 
    if (receivedOTP === "123456") res.json({ success: true });
    else res.status(400).json({ success: false });
});

app.post("/admin-login", (req, res) => {
    if (req.body.username === "Jadalzamana" && req.body.password === "Ayasher123") res.json({ success: true });
    else res.status(401).json({ success: false });
});

app.post("/book", async (req, res) => {
    const { date, startHour, duration } = req.body;
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    if (date < todayStr) return res.status(400).json({ message: "Past Date!" });
    if (date === todayStr && startHour <= now.getHours()) return res.status(400).json({ message: "Past Time!" });
    
    await new Booking(req.body).save();
    res.json({ message: "Success" });
});

app.get("/bookings", async (req, res) => res.json(await Booking.find()));
app.get("/current-price", async (req, res) => res.json(await Price.findOne()));
app.get("/booking-status", async (req, res) => res.json({ paused: (await Setting.findOne()).bookingPaused }));
app.post("/toggle-booking", async (req, res) => {
    await Setting.updateOne({}, { bookingPaused: req.body.status });
    res.json({ message: "Updated" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server: ${PORT}`));
