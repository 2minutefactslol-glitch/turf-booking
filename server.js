// --- UPDATED MODEL ---
const Booking = mongoose.model("Booking", new mongoose.Schema({
    name: String, 
    phone: String, 
    date: String, 
    startHour: Number, 
    duration: Number, 
    sport: String,
    totalAmount: Number,   // Total price of slot
    advancePaid: Number,   // 10% paid online
    isCollected: { type: Boolean, default: false } // Status of 90% balance
}));

// --- UPDATED BOOKING ROUTE ---
app.post("/book", async (req, res) => {
    const { name, phone, date, startHour, duration, sport } = req.body;
    
    // Existing IST Date/Time validation logic remains here...
    
    const p = await Price.findOne();
    let total = 0;
    for(let i=0; i<duration; i++) {
        let h = (startHour + i) % 24;
        total += (h >= 5 && h < 18) ? p.dayPrice : p.nightPrice;
    }

    const advance = (sport === "Offline") ? 0 : Math.ceil(total * 0.10);
    
    const newBooking = new Booking({
        ...req.body,
        totalAmount: total,
        advancePaid: advance,
        isCollected: (sport === "Offline") // Offline bookings usually paid upfront
    });

    await newBooking.save();
    res.json({ message: "Success" });
});

// --- NEW ROUTE: MARK AS COLLECTED ---
app.post("/collect-payment/:id", async (req, res) => {
    await Booking.findByIdAndUpdate(req.params.id, { isCollected: true });
    res.json({ success: true });
});

// --- UPDATED DASHBOARD REVENUE ---
app.get("/dashboard", async (req, res) => {
    const indiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
    const today = new Date(indiaTime).toISOString().split('T')[0];
    const bookings = await Booking.find({ date: today });
    
    let rev = 0;
    bookings.forEach(b => {
        // Revenue = Advance (always) + Remaining Balance (if collected)
        rev += b.advancePaid;
        if(b.isCollected) {
            rev += (b.totalAmount - b.advancePaid);
        }
    });
    res.json({ revenue: rev });
});
