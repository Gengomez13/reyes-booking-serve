#!/usr/bin/env node

/**
 * Booking System Setup Script
 * This script helps initialize the booking system with required admin account
 */

const readline = require('readline');
const path = require('path');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise(resolve => {
        rl.question(prompt, resolve);
    });
}

async function setup() {
    console.log('\n🚀 Reyes Collaborative Counseling - Booking System Setup\n');
    console.log('This script will help you set up the booking system.\n');

    // Check environment variables
    const envFile = path.join(__dirname, '.env');
    const hasEnvFile = fs.existsSync(envFile);

    if (!hasEnvFile) {
        console.log('⚠️  .env file not found!');
        console.log('Creating .env file with default values...\n');

        const envTemplate = `# Reyes Collaborative Counseling - Environment Configuration

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}

# Admin Registration Token (change this!)
ADMIN_REGISTRATION_TOKEN=${Math.random().toString(36).substring(2, 15)}

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Google Calendar
GOOGLE_KEY_FILE=./google-credentials.json

# GoHighLevel Integration
GHL_API_KEY=your-gohighlevel-api-key
GHL_LOCATION_ID=your-gohighlevel-location-id
`;

        fs.writeFileSync(envFile, envTemplate);
        console.log('✅ .env file created at:', envFile);
        console.log('\n📝 Next steps:');
        console.log('1. Update EMAIL_USER and EMAIL_PASSWORD in .env');
        console.log('2. Add your Google Calendar credentials (GOOGLE_KEY_FILE)');
        console.log('3. Update ADMIN_REGISTRATION_TOKEN if needed');
        console.log('4. Re-run this script to create admin account\n');
    } else {
        console.log('✅ .env file found\n');
    }

    // Check for Google credentials
    const googleCredFile = path.join(__dirname, 'google-credentials.json');
    if (!fs.existsSync(googleCredFile)) {
        console.log('⚠️  Google Calendar credentials not found!');
        console.log('📋 To enable Google Meet links:');
        console.log('1. Go to https://console.cloud.google.com');
        console.log('2. Create a new project');
        console.log('3. Enable "Google Calendar API"');
        console.log('4. Create a Service Account');
        console.log('5. Download the JSON key file');
        console.log('6. Save it as "google-credentials.json" in this directory\n');
    } else {
        console.log('✅ Google Calendar credentials found\n');
    }

    // Check Node modules
    const nodeModulesPath = path.join(__dirname, 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
        console.log('⚠️  Dependencies not installed!');
        console.log('Run: npm install\n');
    } else {
        console.log('✅ Dependencies installed\n');
    }

    // Admin account setup
    const createAdmin = await question('Would you like to create an admin account now? (yes/no): ');

    if (createAdmin.toLowerCase() === 'yes' || createAdmin.toLowerCase() === 'y') {
        try {
            // Load auth module
            require('dotenv').config();
            const { registerUser } = require('./auth');

            const adminEmail = await question('Admin Email: ');
            const adminName = await question('Admin Name: ');
            const adminPassword = await question('Admin Password (min 8 chars): ');

            if (adminPassword.length < 8) {
                console.log('❌ Password must be at least 8 characters');
                rl.close();
                return;
            }

            const user = await registerUser(adminEmail, adminPassword, adminName, 'admin');
            console.log('\n✅ Admin account created successfully!');
            console.log('Email:', user.email);
            console.log('Name:', user.name);
            console.log('Role:', user.role);
            console.log('\n🔐 You can now login at: http://localhost:3000/admin-login.html');
        } catch (error) {
            console.error('❌ Error creating admin account:', error.message);
        }
    }

    console.log('\n📋 Setup Summary:');
    console.log('✅ Database: Will be created automatically on first run');
    console.log('✅ Tables: users, bookings, blocked_dates, therapists');
    console.log('✅ API: Ready for use');
    console.log('\n🚀 To start the server:');
    console.log('npm start');
    console.log('or');
    console.log('npm run dev');
    console.log('\n📚 Documentation: See BOOKING_SYSTEM_SETUP.md\n');

    rl.close();
}

setup().catch(error => {
    console.error('Setup error:', error);
    process.exit(1);
});
