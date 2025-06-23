import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || "Admin";

    if (!adminEmail || !adminPassword) {
        console.warn("Missing ADMIN_EMAIL or ADMIN_PASSWORD in env.");
        return;
    }

    const existing = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (!existing) {
        const hashed = await bcrypt.hash(adminPassword, 12);
        await prisma.user.create({
            data: {
                name: adminName,
                email: adminEmail,
                password: hashed,
                role: "ADMIN",
            },
        });
        console.log("✅ Admin user created.");
    } else {
        console.log("ℹ️ Admin already exists. Skipping.");
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
