const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');
const newDbUrl = "postgresql://neondb_owner:npg_4rw5sFeIuUTo@ep-steep-bread-a1kd2vgj.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const newAuthSecret = "d0e9c8b7a6f5e4d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8";

let content = '';
if (fs.existsSync(envPath)) {
    content = fs.readFileSync(envPath, 'utf-8');
}

const lines = content.split('\n');
const envMap = {};

lines.forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join('=').trim();
        if (key) envMap[key] = val.replace(/^"|"$/g, ''); // Strip existing quotes for cleanliness
    }
});

// Update without quotes
envMap['DATABASE_URL'] = newDbUrl;
envMap['AUTH_SECRET'] = newAuthSecret;
envMap['NEXTAUTH_SECRET'] = newAuthSecret;

let newContent = '';
for (const [key, val] of Object.entries(envMap)) {
    newContent += `${key}=${val}\n`;
}

fs.writeFileSync(envPath, newContent.trim());
console.log("✅ .env corrected (no quotes).");
