const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');

if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found!');
    process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        env[match[1].trim()] = match[2].trim();
    }
});

const errors = [];
const warnings = [];

if (!env.DATABASE_URL) {
    errors.push('DATABASE_URL is missing.');
} else {
    // Basic check for pooled connection string pattern (often has -pooler or pgbouncer)
    if (env.DATABASE_URL.includes('-pooler')) {
        warnings.push('DATABASE_URL looks like a pooled connection string (contains "-pooler"). Recommended to use Direct Connection for migrations/dev.');
    }
    if (!env.DATABASE_URL.startsWith('postgres://') && !env.DATABASE_URL.startsWith('postgresql://')) {
        errors.push('DATABASE_URL must start with postgres:// or postgresql://');
    }

    // Check for special chars in password if not quoted
    // This is a heuristic check.
    const dbUrlLine = envContent.split('\n').find(l => l.startsWith('DATABASE_URL'));
    if (dbUrlLine && (dbUrlLine.includes('&') || dbUrlLine.includes('%')) && !dbUrlLine.includes('"')) {
        warnings.push('DATABASE_URL contains special characters (& or %) and is NOT quoted. Enclose the value in double quotes ("...").');
    }
}

if (!env.AUTH_SECRET) {
    errors.push('AUTH_SECRET is missing. Required for NextAuth v5.');
}

if (!env.AUTH_GOOGLE_ID && !env.GOOGLE_CLIENT_ID) warnings.push('AUTH_GOOGLE_ID (or GOOGLE_CLIENT_ID) is missing.');
if (!env.AUTH_GOOGLE_SECRET && !env.GOOGLE_CLIENT_SECRET) warnings.push('AUTH_GOOGLE_SECRET (or GOOGLE_CLIENT_SECRET) is missing.');

if (errors.length > 0) {
    console.error('❌ Critical Issues Found:');
    errors.forEach(e => console.error(`- ${e}`));
}

if (warnings.length > 0) {
    console.warn('⚠️ Potential Issues:');
    warnings.forEach(w => console.warn(`- ${w}`));
}

if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ Environment variables look okay (format-wise). If connection fails, check IP Restrictions on Neon.');
}
