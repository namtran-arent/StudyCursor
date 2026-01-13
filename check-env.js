#!/usr/bin/env node

/**
 * Script to check and generate missing NextAuth environment variables
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const envPath = path.join(__dirname, '.env.local');
const requiredVars = {
  GOOGLE_CLIENT_ID: 'Your Google OAuth Client ID from Google Cloud Console',
  GOOGLE_CLIENT_SECRET: 'Your Google OAuth Client Secret from Google Cloud Console',
  NEXTAUTH_SECRET: 'A random secret for encrypting JWT tokens (will be generated if missing)',
  NEXTAUTH_URL: 'Your application URL (defaults to http://localhost:3000)',
};

function generateSecret() {
  return crypto.randomBytes(32).toString('base64');
}

function checkEnvFile() {
  console.log('🔍 Checking environment variables...\n');

  let envContent = '';
  let envVars = {};

  // Read existing .env.local if it exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          envVars[key.trim()] = valueParts.join('=').trim();
        }
      }
    });
  }

  let needsUpdate = false;
  const missing = [];
  const present = [];

  // Check each required variable
  Object.keys(requiredVars).forEach((key) => {
    if (!envVars[key] || envVars[key].length === 0) {
      missing.push(key);
      console.log(`❌ ${key}: MISSING`);
      console.log(`   ${requiredVars[key]}\n`);

      // Generate NEXTAUTH_SECRET if missing
      if (key === 'NEXTAUTH_SECRET') {
        const newSecret = generateSecret();
        envVars[key] = newSecret;
        needsUpdate = true;
        console.log(`   ✅ Generated new secret: ${newSecret.substring(0, 20)}...\n`);
      } else if (key === 'NEXTAUTH_URL' && !envVars[key]) {
        envVars[key] = 'http://localhost:3000';
        needsUpdate = true;
        console.log(`   ✅ Set default URL: http://localhost:3000\n`);
      }
    } else {
      present.push(key);
      const value = envVars[key];
      const displayValue = value.length > 30 ? `${value.substring(0, 30)}...` : value;
      console.log(`✅ ${key}: ${displayValue}`);
    }
  });

  // Update .env.local if needed
  if (needsUpdate) {
    let newContent = envContent;

    // Add or update variables
    Object.keys(envVars).forEach((key) => {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      const newLine = `${key}=${envVars[key]}`;
      
      if (regex.test(newContent)) {
        newContent = newContent.replace(regex, newLine);
      } else {
        // Add new variable
        if (newContent && !newContent.endsWith('\n')) {
          newContent += '\n';
        }
        newContent += `${newLine}\n`;
      }
    });

    fs.writeFileSync(envPath, newContent, 'utf8');
    console.log('\n📝 Updated .env.local file\n');
  }

  // Summary
  console.log('\n📊 Summary:');
  console.log(`   ✅ Present: ${present.length}/${Object.keys(requiredVars).length}`);
  console.log(`   ❌ Missing: ${missing.length}/${Object.keys(requiredVars).length}`);

  if (missing.length > 0 && !needsUpdate) {
    console.log('\n⚠️  Action Required:');
    missing.forEach((key) => {
      if (key !== 'NEXTAUTH_SECRET' && key !== 'NEXTAUTH_URL') {
        console.log(`   - Add ${key} to .env.local`);
        console.log(`     ${requiredVars[key]}\n`);
      }
    });
  }

  if (present.length === Object.keys(requiredVars).length) {
    console.log('\n🎉 All environment variables are configured!');
    console.log('   Restart your development server to apply changes.\n');
  }
}

// Run the check
checkEnvFile();
