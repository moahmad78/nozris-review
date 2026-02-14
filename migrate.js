
const { execSync } = require('child_process');
require('dotenv').config();

console.log("Starting DB Push...");
try {
    // Push schema directly (accept data loss is fine for dev reset)
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit', env: process.env });

    // Generate client to ensure types are updated
    console.log("Generating client...");
    execSync('npx prisma generate', { stdio: 'inherit', env: process.env });

    console.log("Schema synced successfully!");
} catch (e) {
    console.error("DB Push failed:", e.message);
    process.exit(1);
}
