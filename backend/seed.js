import bcryptjs from "bcryptjs";
import { db } from "./src/models/index.js";
import dotenv from "dotenv";

dotenv.config();

async function seedDatabase() {
  try {
    // Sync database (create tables if not exist)
    // Note: If tables already created via migration.sql, this is safe to run
    await db.sequelize.sync({ alter: false });
    console.log("✓ Database synced");

    // Check if admin exists
    const adminExists = await db.User.findOne({ where: { nik: "0000000000000001" } });

    if (!adminExists) {
      // Create default admin
      const hashedPassword = await bcryptjs.hash("admin123", 10);
      await db.User.create({
        nik: "0000000000000001",
        password: hashedPassword,
        nama: "Admin Desa",
        role: "admin",
      });
      console.log("✓ Default admin created (NIK: 0000000000000001, Password: admin123)");
    } else {
      console.log("✓ Admin already exists");
    }

    // Create test warga
    const wargaExists = await db.User.findOne({ where: { nik: "1234567890123456" } });

    if (!wargaExists) {
      const hashedPassword = await bcryptjs.hash("warga123", 10);
      await db.User.create({
        nik: "1234567890123456",
        password: hashedPassword,
        nama: "Budi Santoso",
        role: "warga",
      });
      console.log("✓ Test warga created (NIK: 1234567890123456, Password: warga123)");
    } else {
      console.log("✓ Test warga already exists");
    }

    console.log("\n✓✓✓ Seeding completed successfully!");
    console.log("\n📝 You can now login with:");
    console.log("   Admin - NIK: 0000000000000001 / Password: admin123");
    console.log("   Warga - NIK: 1234567890123456 / Password: warga123");
    
    process.exit(0);
  } catch (error) {
    console.error("✗ Seeding error:", error.message);
    console.error("\n⚠️  Make sure MySQL is running and database exists!");
    console.error("   Run: mysql -u root -p < migration.sql");
    process.exit(1);
  }
}

seedDatabase();
