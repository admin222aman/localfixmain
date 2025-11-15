// seed.ts

import dotenv from "dotenv";
dotenv.config();

import { db } from "./server/db";
import {
  users,
  serviceCategories
} from "./shared/schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Starting database seed...");

  // ---- SEED CATEGORIES ----
  const defaultCategories = [
    { name: "Electrical", description: "Wiring, repairs, installations", icon: "zap", color: "blue" },
    { name: "Plumbing", description: "Pipes, fixtures, emergency repairs", icon: "wrench", color: "green" },
    { name: "Carpentry", description: "Custom work, repairs, installations", icon: "hammer", color: "amber" },
    { name: "HVAC", description: "Heating, cooling, ventilation", icon: "thermometer", color: "purple" },
    { name: "General Contracting", description: "Home improvements, renovations", icon: "building", color: "red" },
    { name: "Landscaping", description: "Garden design, lawn care", icon: "leaf", color: "teal" },
    { name: "Painting", description: "Interior, exterior, touch-ups", icon: "paintbrush", color: "orange" },
    { name: "Cleaning Services", description: "House cleaning, deep cleaning", icon: "spray", color: "gray" }
  ];

  console.log("➕ Inserting service categories...");

  for (const cat of defaultCategories) {
    await db.insert(serviceCategories)
      .values(cat)
      .catch(() => {});
  }

  console.log("✔ Categories inserted!");

  // ---- SEED ADMIN USER ----
  console.log("➕ Creating admin user...");

  const adminPassword = await bcrypt.hash("admin123", 10);

  await db.insert(users)
    .values({
      email: "admin@localfix.com",
      password: adminPassword,
      firstName: "Admin",
      lastName: "User",
      role: "admin",
    })
    .catch(() => {});

  console.log("✔ Admin user created!");

  console.log("🌱 SEED COMPLETE!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Error while seeding:", err);
  process.exit(1);
});
