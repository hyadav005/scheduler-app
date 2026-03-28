require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sendBookingConfirmation, sendCancellationNotice } = require("./emailService");

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const app = express();

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ 
  connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('⚠️ Unexpected error on idle database client', err);
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Global Error Catching (Prevents complete node crash)
process.on('uncaughtException', (err) => {
  console.error('🚨 UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 UNHANDLED REJECTION at:', promise, 'reason:', reason);
});

app.use(cors({
  origin: "https://scheduler-app-beryl.vercel.app/"
}));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.post("/events", async (req, res) => {
  try {
    const { title, description, duration, slug, timezone } = req.body;

    const event = await prisma.eventType.create({
      data: {
        title,
        description,
        duration,
        slug,
        timezone: timezone || 'UTC',
      },
    });

    res.json(event);
  } catch (error) {
    console.error(error);
    if (error.code === "P2002" && error.meta && error.meta.target.includes("slug")) {
      return res.status(400).json({ error: "The slug must be unique. Please choose a different slug." });
    }
    res.status(500).json({ error: "Something went wrong" });
  }
}); 

app.get("/events", async (req, res) => {
  try {
    const events = await prisma.eventType.findMany({
      include: {
        availabilities: true,
        bookings: true,
        dateOverrides: true,
        questions: true,
      },
    });

    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.delete("/events/:id", async (req, res) => {
  try {
    await prisma.eventType.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: "Event not found" });
    } else {
      res.status(500).json({ error: "Failed to delete event" });
    }
  }
});

app.put("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, duration, slug, timezone } = req.body;

    const updatedEvent = await prisma.eventType.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        description,
        duration,
        slug,
        timezone,
      },
    });

    res.json(updatedEvent);
  } catch (error) {
    console.error(error);

    if (error.code === "P2002" && error.meta && error.meta.target.includes("slug")) {
      return res.status(400).json({ error: "The slug must be unique. Please choose a different slug." });
    }

    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/availability", async (req, res) => {
  try {
    const { day, startTime, endTime, eventId } = req.body;

    const availability = await prisma.availability.create({
      data: {
        day,
        startTime,
        endTime,
        eventId,
      },
    });

    res.json(availability);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.delete("/availability/:id", async (req, res) => {
  try {
    await prisma.availability.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: "Availability deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

app.get("/slots/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { date } = req.query;

    const event = await prisma.eventType.findUnique({
      where: { id: Number(eventId) },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // --- DATE OVERRIDE CHECK ---
    const overrides = await prisma.dateOverride.findMany({
      where: {
        eventId: Number(eventId),
        date: new Date(date),
      },
    });

    let timeRanges = [];

    if (overrides.length > 0) {
      // Check if any override blocks the entire day
      const blocked = overrides.some((o) => o.isBlocked);
      if (blocked) {
        return res.json([]);
      }
      // Use override time ranges instead of weekly availability
      timeRanges = overrides
        .filter((o) => o.startTime && o.endTime)
        .map((o) => ({ startTime: o.startTime, endTime: o.endTime }));
    } else {
      // --- FALLBACK: WEEKLY AVAILABILITY ---
      const day = new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
      });

      const availability = await prisma.availability.findMany({
        where: { eventId: Number(eventId) },
      });

      timeRanges = availability
        .filter((a) => a.day === day)
        .map((a) => ({ startTime: a.startTime, endTime: a.endTime }));
    }

    if (timeRanges.length === 0) {
      return res.json([]);
    }

    // --- GENERATE SLOTS FROM TIME RANGES ---
    const allSlots = [];

    timeRanges.forEach((range) => {
      let [startHour, startMin] = range.startTime.split(":").map(Number);
      let [endHour, endMin] = range.endTime.split(":").map(Number);

      let start = startHour * 60 + startMin;
      let end = endHour * 60 + endMin;

      while (start + event.duration <= end) {
        let hours = Math.floor(start / 60);
        let minutes = start % 60;
        let formatted = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

        if (!allSlots.includes(formatted)) {
          allSlots.push(formatted);
        }
        start += event.duration;
      }
    });

    const slots = allSlots.sort();

    // --- FILTER OUT BOOKED SLOTS ---
    const bookings = await prisma.booking.findMany({
      where: {
        eventId: Number(eventId),
        date: new Date(date),
      },
    });

    const bookedTimes = bookings.map((b) => b.time);
    const availableSlots = slots.filter((slot) => !bookedTimes.includes(slot));

    // --- FILTER OUT PAST TIMES (if date is today) ---
    const today = new Date();
    const selectedDate = new Date(date);
    let finalSlots = availableSlots;

    if (
      selectedDate.getFullYear() === today.getFullYear() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getDate() === today.getDate()
    ) {
      const nowMinutes = today.getHours() * 60 + today.getMinutes();
      finalSlots = availableSlots.filter((slot) => {
        const [h, m] = slot.split(":").map(Number);
        return h * 60 + m > nowMinutes;
      });
    }

    res.json(finalSlots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// --- DATE OVERRIDE CRUD ROUTES ---
app.post("/date-overrides", async (req, res) => {
  try {
    const { date, isBlocked, startTime, endTime, eventId } = req.body;

    const override = await prisma.dateOverride.create({
      data: {
        date: new Date(date),
        isBlocked: isBlocked || false,
        startTime: isBlocked ? null : startTime,
        endTime: isBlocked ? null : endTime,
        eventId,
      },
    });

    res.json(override);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create date override" });
  }
});

app.delete("/date-overrides/:id", async (req, res) => {
  try {
    await prisma.dateOverride.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: "Date override deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete date override" });
  }
});

app.get("/date-overrides/event/:eventId", async (req, res) => {
  try {
    const overrides = await prisma.dateOverride.findMany({
      where: { eventId: parseInt(req.params.eventId) },
      orderBy: { date: "asc" },
    });
    res.json(overrides);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch date overrides" });
  }
});

// --- BOOKING QUESTIONS CRUD ---
app.post("/events/:eventId/questions", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { label, type, placeholder, required } = req.body;

    console.log(`[Adding Question] eventId: ${eventId}, label: ${label}`);

    const question = await prisma.bookingQuestion.create({
      data: {
        label,
        type: type || 'text',
        placeholder: placeholder || '',
        required: required !== undefined ? required : true,
        eventId: parseInt(eventId),
      },
    });

    res.json(question);
  } catch (error) {
    console.error("[Question Creation Error]:", error);
    res.status(500).json({ error: error.message || "Failed to create question" });
  }
});

app.delete("/questions/:id", async (req, res) => {
  try {
    await prisma.bookingQuestion.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: "Question deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete question" });
  }
});

app.post("/book", async (req, res) => {
  try {
    const { name, email, date, time, eventId, timezone, answers } = req.body;

    // Prevent double booking at the time of creation
    const existing = await prisma.booking.findFirst({
      where: {
        eventId: parseInt(eventId),
        date: new Date(date),
        time: time
      }
    });

    if (existing) {
      return res.status(400).json({ error: "This slot is already booked." });
    }

    const booking = await prisma.booking.create({
      data: {
        name,
        email,
        date: new Date(date),
        time,
        timezone: timezone || 'UTC',
        eventId: parseInt(eventId),
        answers: answers || {},
      },
      include: { event: true } // Include event details for the email
    });

    // Send Confirmation Email (Async - don't block response)
    sendBookingConfirmation(booking, booking.event).catch(err => console.error("Email Error:", err));

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/bookings", async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        event: true,
      },
    });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.delete("/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch booking details before deletion for the email
    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
      include: { event: true }
    });

    if (booking) {
      await prisma.booking.delete({
        where: { id: Number(id) },
      });

      // Send Cancellation Email
      sendCancellationNotice(booking, booking.event).catch(err => console.error("Email Error:", err));
    }

    res.json({ message: "Booking cancelled" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
