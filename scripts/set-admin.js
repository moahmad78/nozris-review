const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🔍 Checking for users...");
    const user = await prisma.user.findFirst();

    if (!user) {
        console.log("❌ No users found. Please login first.");
        return;
    }

    console.log(`👤 Found user: ${user.email} (${user.id})`);

    let org = await prisma.organization.findFirst({
        where: { users: { some: { id: user.id } } }
    });

    if (!org) {
        console.log("⚠️ No organization found for user. Creating one...");
        org = await prisma.organization.create({
            data: {
                name: "Demo Organization",
                users: { connect: { id: user.id } }
            }
        });
        console.log(`✅ Created organization: ${org.name}`);
    } else {
        console.log(`🏢 User already belongs to: ${org.name}`);
    }

    // Update user role and orgId explicitly if needed
    await prisma.user.update({
        where: { id: user.id },
        data: {
            role: "SUPER_ADMIN",
            organizationId: org.id
        }
    });

    console.log("✅ User promoted to SUPER_ADMIN and linked to Organization.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
