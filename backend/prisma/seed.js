/**
 * @file prisma/seed.js
 * @description Enhanced Seeding script with Past/Future bookings, Multiple ranges, and Date Overrides.
 */

require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 STARTING DATABASE SEEDING...");

  try {
    console.log("🧹 Clearing data...");
    await prisma.booking.deleteMany();
    await prisma.dateOverride.deleteMany();
    await prisma.availability.deleteMany();
    await prisma.eventType.deleteMany();

    // --- 1. Create Event Types ---
    const eventTypes = [
      {
        title: "15 Min Quick Sync",
        description: "A fast sync to align our goals.",
        duration: 15,
        slug: "15-min-sync",
        timezone: "Asia/Kolkata",
      },
      {
        title: "30 Min Product Strategy",
        description: "Iterating on product roadmap.",
        duration: 30,
        slug: "30-min-strategy",
        timezone: "Europe/London",
      },
      {
        title: "60 Min Client Consultation",
        description: "Deep dive for new partners and strategy planning.",
        duration: 60,
        slug: "60-min-consult",
        timezone: "America/New_York",
      },
      {
        title: "Internal Tech Review",
        description: "Reviewing code quality and system architecture.",
        duration: 45,
        slug: "tech-review",
        timezone: "UTC",
      },
    ];

    const createdEvents = [];
    for (const eventData of eventTypes) {
      const ev = await prisma.eventType.create({ data: eventData });
      createdEvents.push(ev);
      console.log(`   ✅ Created: ${ev.title}`);
    }

    // --- 2. Map Availability (Multiple Ranges & Weekend Check) ---
    for (const ev of createdEvents) {
      if (ev.slug === "15-min-sync") {
        // Morning and Afternoon slots
        await prisma.availability.create({ data: { day: "Monday", startTime: "09:00", endTime: "12:00", eventId: ev.id } });
        await prisma.availability.create({ data: { day: "Monday", startTime: "14:00", endTime: "18:00", eventId: ev.id } });
        await prisma.availability.create({ data: { day: "Wednesday", startTime: "10:00", endTime: "16:00", eventId: ev.id } });
        await prisma.availability.create({ data: { day: "Friday", startTime: "09:00", endTime: "15:00", eventId: ev.id } });
      } else if (ev.slug === "30-min-strategy") {
        // Evening availability only
        ["Tuesday", "Thursday"].forEach(async (day) => {
          await prisma.availability.create({ data: { day, startTime: "16:00", endTime: "20:00", eventId: ev.id } });
        });
      } else {
        // Standard Mon-Fri 9-5
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        for (const day of days) {
          await prisma.availability.create({
            data: { day, startTime: "09:00", endTime: "17:00", eventId: ev.id }
          });
        }
      }
    }
    console.log("   ✅ Availability mapped (including multiple ranges).");

    // --- 3. Date Overrides (Blocked & Custom) ---
    const today = new Date();
    
    // Override 1: Block a date next week (Holiday)
    const holiday = new Date();
    holiday.setDate(today.getDate() + 7);
    await prisma.dateOverride.create({
      data: { date: holiday, isBlocked: true, eventId: createdEvents[0].id }
    });

    // Override 2: Custom short hours (Doctor's appt)
    const customHours = new Date();
    customHours.setDate(today.getDate() + 3);
    await prisma.dateOverride.create({
      data: { 
        date: customHours, 
        isBlocked: false, 
        startTime: "08:00", 
        endTime: "10:00", 
        eventId: createdEvents[1].id 
      }
    });

    // Override 3: Blocked for tech review
    const techBlock = new Date();
    techBlock.setDate(today.getDate() + 5);
    await prisma.dateOverride.create({
      data: { date: techBlock, isBlocked: true, eventId: createdEvents[3].id }
    });
    console.log("   ✅ Date overrides seeded.");

    // --- 4. Bookings (Upcoming & Past) ---
    
    // Upcoming Booking 1
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 2);
    await prisma.booking.create({
      data: {
        name: "Elon Musk",
        email: "elon@spacex.com",
        date: nextWeek,
        time: "10:00",
        eventId: createdEvents[0].id
      }
    });

    // Upcoming Booking 2
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 4);
    await prisma.booking.create({
      data: {
        name: "Vitalik Buterin",
        email: "vitalik@ethereum.org",
        date: futureDate,
        time: "11:30",
        eventId: createdEvents[2].id
      }
    });

    // Past Booking 1 (Verified column 3)
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 5);
    await prisma.booking.create({
      data: {
        name: "Satoshi Nakamoto",
        email: "satoshi@bitcoin.org",
        date: lastWeek,
        time: "09:00",
        eventId: createdEvents[0].id
      }
    });

    // Past Booking 2
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    await prisma.booking.create({
      data: {
        name: "Jeff Bezos",
        email: "jeff@blueorigin.com",
        date: yesterday,
        time: "14:00",
        eventId: createdEvents[1].id
      }
    });

    console.log("   ✅ Sample bookings (Upcoming & Past) created.");

    // --- 5. Custom Booking Questions ---
    for (const ev of createdEvents) {
      if (ev.slug === "30-min-strategy") {
        await prisma.bookingQuestion.create({ 
          data: { 
            label: "What's the main focus of this session?", 
            type: "textarea", 
            required: true, 
            eventId: ev.id 
          } 
        });
        await prisma.bookingQuestion.create({ 
          data: { 
            label: "Company Website / URL", 
            type: "text", 
            required: false, 
            eventId: ev.id 
          } 
        });
      }
    }
    console.log("   ✅ Custom questions seeded.");

    console.log("\n🎉 SEEDING COMPLETE! Your application is now fully functional.");
  } catch (error) {
    console.error("❌ SEED ERROR:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
