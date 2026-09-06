const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set. Set it to your Postgres connection string.');
}

function needsSSL(connectionString) {
    if (!connectionString) return false;
    return !/localhost|127\.0\.0\.1/.test(connectionString);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: needsSSL(process.env.DATABASE_URL) ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
    console.error('Unexpected Postgres pool error:', err);
});

// sqlite3 used `?` placeholders; Postgres uses positional $1, $2, ... — convert automatically
// so existing call sites (auth.js, server.js) don't need to be rewritten one by one.
function toPositionalParams(sql) {
    let i = 0;
    return sql.replace(/\?/g, () => `$${++i}`);
}

// Thin sqlite3-compatible wrapper (run/get/all with the same callback shapes,
// including `this.lastID` / `this.changes` inside db.run callbacks) so the rest
// of the app can keep using the same query style against Postgres.
const db = {
    run(sql, params, callback) {
        if (typeof params === 'function') {
            callback = params;
            params = [];
        }
        params = params || [];

        pool.query(toPositionalParams(sql), params)
            .then((result) => {
                const context = {
                    changes: result.rowCount,
                    lastID: result.rows && result.rows[0] && result.rows[0].id !== undefined
                        ? result.rows[0].id
                        : undefined
                };
                if (callback) callback.call(context, null);
            })
            .catch((err) => {
                if (callback) callback.call({}, err);
                else console.error('Database error (run):', err);
            });
    },

    get(sql, params, callback) {
        if (typeof params === 'function') {
            callback = params;
            params = [];
        }
        params = params || [];

        pool.query(toPositionalParams(sql), params)
            .then((result) => callback(null, result.rows[0]))
            .catch((err) => callback(err));
    },

    all(sql, params, callback) {
        if (typeof params === 'function') {
            callback = params;
            params = [];
        }
        params = params || [];

        pool.query(toPositionalParams(sql), params)
            .then((result) => callback(null, result.rows))
            .catch((err) => callback(err));
    }
};

async function initializeDatabase() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                name TEXT NOT NULL,
                role TEXT DEFAULT 'client',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS bookings (
                id SERIAL PRIMARY KEY,
                client_id INTEGER NOT NULL REFERENCES users(id),
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
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS blocked_dates (
                id SERIAL PRIMARY KEY,
                blocked_date TEXT NOT NULL UNIQUE,
                reason TEXT,
                blocked_by INTEGER REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS therapists (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                specializations TEXT,
                availability_start TEXT DEFAULT '09:00',
                availability_end TEXT DEFAULT '17:00',
                working_days TEXT DEFAULT 'Monday,Tuesday,Wednesday,Thursday,Friday',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            INSERT INTO therapists (name, email, specializations)
            VALUES
            ('Daymar Blanco-Gracia', 'daymar@reyescollaborativecounseling.com', 'Individual Therapy, Couples Counseling'),
            ('Geraldine Blanco', 'geraldine@reyescollaborativecounseling.com', 'Child Counseling, Family Therapy'),
            ('Grace Nguyen', 'grace@reyescollaborativecounseling.com', 'Teen Counseling, EMDR Therapy'),
            ('Samantha Wong', 'samantha@reyescollaborativecounseling.com', 'Anxiety Treatment, Depression'),
            ('Vanessa Turcios', 'vanessa@reyescollaborativecounseling.com', 'Trauma & PTSD, Emotional Regulation')
            ON CONFLICT (email) DO NOTHING
        `);

        console.log(`Connected to Postgres. DATABASE_URL env=${process.env.DATABASE_URL ? 'set' : 'NOT SET'}`);
    } catch (err) {
        console.error('Database initialization error:', err);
    }
}

initializeDatabase();

module.exports = db;
