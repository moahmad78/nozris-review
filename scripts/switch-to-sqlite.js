const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');
const newDbUrl = "file:./dev.db";

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
        if (key) envMap[key] = val;
    }
});

// Update to SQLite
envMap['DATABASE_URL'] = `"${newDbUrl}"`;

let newContent = '';
for (const [key, val] of Object.entries(envMap)) {
    newContent += `${key}=${val}\n`;
}

fs.writeFileSync(envPath, newContent.trim());
console.log("✅ .env updated to SQLite (file:./dev.db).");
