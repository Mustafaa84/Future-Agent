import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const envPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found!');
    process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');
const lines = envContent.split('\n');

console.log('🚀 Syncing environment variables to Vercel...');

lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const [key, ...values] = trimmed.split('=');
    const value = values.join('=');

    if (key && value) {
        try {
            // Remove quotes if present
            const cleanValue = value.replace(/^["'](.*)["']$/, '$1');

            console.log(`Setting ${key}...`);
            execSync(`echo "${cleanValue}" | vercel env add ${key} production`, { stdio: 'inherit' });
        } catch (error) {
            console.error(`⚠️ Failed to set ${key}`, error);
        }
    }
});

console.log('✅ Environment sync complete!');
