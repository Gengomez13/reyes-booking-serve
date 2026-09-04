const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'bookings.db'), (err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

function initializeDatabase() {
    // Users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            name TEXT NOT NULL,
            role TEXT DEFAULT 'client',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Bookings table
    db.run(`
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id INTEGER NOT NULL,
            client_name TEXT NOT NULL,
            client_email TEXT NOT NULL,
            client_phone TEXT,
            service_type TEXT NOT NULL,
            booking_date TEXT NOT NULL,
            booking_time TEXT NOT NULL,
            duration_minutes INTEGER DEFAULT 45,
            therapist TEXT,
            format TEXT,
            status TEXT DEFAULT 'confirmed',
            google_meet_link TEXT,
            calendar_event_id TEXT,
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(client_id) REFERENCES users(id)
        )
    `);

    // Blocked dates table
    db.run(`
        CREATE TABLE IF NOT EXISTS blocked_dates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            blocked_date TEXT NOT NULL UNIQUE,
            reason TEXT,
            blocked_by INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(blocked_by) REFERENCES users(id)
        )
    `);

    // Therapists table
    db.run(`
        CREATE TABLE IF NOT EXISTS therapists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            specializations TEXT,
            availability_start TEXT DEFAULT '09:00',
            availability_end TEXT DEFAULT '17:00',
            working_days TEXT DEFAULT 'Monday,Tuesday,Wednesday,Thursday,Friday',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (!err) {
            // Insert default therapists
            db.run(`
                INSERT OR IGNORE INTO therapists (name, email, specializations)
                VALUES 
                ('Daymar Blanco-Gracia', 'daymar@reyescollaborativecounseling.com', 'Individual Therapy, Couples Counseling'),
                ('Geraldine Blanco', 'geraldine@reyescollaborativecounseling.com', 'Child Counseling, Family Therapy'),
                ('Grace Nguyen', 'grace@reyescollaborativecounseling.com', 'Teen Counseling, EMDR Therapy'),
                ('Samantha Wong', 'samantha@reyescollaborativecounseling.com', 'Anxiety Treatment, Depression'),
                ('Vanessa Turcios', 'vanessa@reyescollaborativecounseling.com', 'Trauma & PTSD, Emotional Regulation')
            `);
        }
    });
}

module.exports = db;
