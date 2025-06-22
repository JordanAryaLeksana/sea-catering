import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function createDefaultAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL!;
  const adminPassword = process.env.ADMIN_PASSWORD!;
  const adminName = process.env.ADMIN_NAME || "Admin";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    const res = await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    console.log("✅ Default admin user created:", res);
  } else {
    console.log("ℹ️ Admin user already exists, skipping creation.");
    return;
  }
}
