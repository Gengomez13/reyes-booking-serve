const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const db = require('./database');
const { registerUser, loginUser, authMiddleware, adminMiddleware } = require('./auth');
const { sendBookingConfirmation, sendAdminNotification: sendEmailNotification } = require('./email');
const { createCalendarEvent, sendClientConfirmation, sendAdminNotification } = require('./calendar');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// GoHighLevel API Configuration
const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GHL_API_URL = 'https://rest.gohighlevel.com/v1';

// n8n Webhook Configuration
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

// Send booking data to n8n webhook
async function sendToN8n(bookingData) {
    if (!N8N_WEBHOOK_URL) {
        console.warn('⚠️  N8N_WEBHOOK_URL not configured in .env');
        return null;
    }

    try {
        console.log(`\n📤 Sending booking to n8n webhook...`);
        console.log(`🔗 URL: ${N8N_WEBHOOK_URL}`);
        console.log(`📊 Data:`, JSON.stringify(bookingData, null, 2));

        const response = await axios.post(N8N_WEBHOOK_URL, bookingData, {
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log(`✅ n8n webhook response status: ${response.status}`);
        console.log(`✅ n8n response data:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`\n❌ n8n webhook error:`);
        if (error.response) {
            console.error(`   Status: ${error.response.status}`);
            console.error(`   Data: ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
            console.error(`   No response received. Request details:`, error.message);
        } else {
            console.error(`   Error: ${error.message}`);
        }
        console.error(`   Full error:`, error);
        // Don't throw - let bookings succeed even if n8n fails
        return null;
    }
}

// Serve the landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to submit booking
app.post('/api/submit-booking', async (req, res) => {
    try {
        const { name, email, phone, age, service, format, message } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !service || !format) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate API credentials
        if (!GHL_API_KEY || !GHL_LOCATION_ID) {
            console.error('Missing GoHighLevel API credentials');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        // Create contact in GoHighLevel
        const contactData = {
            firstName: name.split(' ')[0],
            lastName: name.split(' ').slice(1).join(' ') || '',
            email: email,
            phone: phone,
            locationId: GHL_LOCATION_ID,
            tags: [service, 'Daymar Service', 'Landing Page Lead'],
            customFields: {
                serviceType: service,
                preferredFormat: format,
                inquiryMessage: message,
                clientAge: age
            }
        };

        // Make API call to GoHighLevel
        const response = await axios.post(
            `${GHL_API_URL}/contacts/`,
            contactData,
            {
                headers: {
                    'Authorization': `Bearer ${GHL_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('Contact created in GoHighLevel:', response.data);

        // Create or update opportunity/task for follow-up
        if (response.data.id) {
            const opportunityData = {
                contactId: response.data.id,
                locationId: GHL_LOCATION_ID,
                pipelineId: 'lead',
                stageId: 'new',
                title: `New ${service} Request - ${name}`,
                description: `Service Type: ${service}\nPreferred Format: ${format}\nAge: ${age}\nMessage: ${message}`
            };

            try {
                await axios.post(
                    `${GHL_API_URL}/opportunities/`,
                    opportunityData,
                    {
                        headers: {
                            'Authorization': `Bearer ${GHL_API_KEY}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
            } catch (oppError) {
                console.warn('Could not create opportunity (this is okay):', oppError.message);
            }
        }

        res.json({
            success: true,
            message: 'Booking request submitted successfully',
            contactId: response.data.id
        });

    } catch (error) {
        console.error('Error submitting booking:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to submit booking',
            details: error.response?.data?.message || error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// ============ AUTHENTICATION ENDPOINTS ============

// Register (for admin account creation only)
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name, role } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Only allow admin registration if proper admin token provided
        if (role === 'admin') {
            const adminToken = req.headers['x-admin-token'];
            if (adminToken !== process.env.ADMIN_REGISTRATION_TOKEN) {
                return res.status(403).json({ error: 'Admin registration not authorized' });
            }
        }

        const user = await registerUser(email, password, name, role || 'client');
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ error: error.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const result = await loginUser(email, password);
        res.json(result);
    } catch (error) {
        console.error('Login error:', error);
        res.status(401).json({ error: error.message });
    }
});

// ============ BOOKING ENDPOINTS ============

// Get available time slots
app.get('/api/bookings/available-slots', (req, res) => {
    try {
        const { date, therapist } = req.query;

        if (!date) {
            return res.status(400).json({ error: 'Date required' });
        }

        // Check if date is blocked
        db.get('SELECT * FROM blocked_dates WHERE blocked_date = ?', [date], (err, blockedDate) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (blockedDate) {
                return res.json({ available: false, message: 'This date is blocked' });
            }

            // Get existing bookings for the date
            db.all(
                `SELECT booking_time, duration_minutes FROM bookings 
                 WHERE booking_date = ? AND status = 'confirmed' 
                 ${therapist ? 'AND therapist = ?' : ''}`,
                therapist ? [date, therapist] : [date],
                (err, bookings) => {
                    if (err) {
                        return res.status(500).json({ error: 'Database error' });
                    }

                    // Generate available slots (9 AM to 5 PM, 30-minute slots)
                    const allSlots = generateTimeSlots('09:00', '17:00', 30);
                    const bookedTimes = bookings.map(b => b.booking_time);
                    const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));

                    res.json({
                        available: availableSlots.length > 0,
                        slots: availableSlots,
                        bookedSlots: bookedTimes
                    });
                }
            );
        });
    } catch (error) {
        console.error('Error getting available slots:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create booking
app.post('/api/bookings/create', async (req, res) => {
    try {
        const { client_name, client_email, client_phone, service_type, booking_date, booking_time, therapist, format, notes } = req.body;

        if (!client_name || !client_email || !client_phone || !service_type || !booking_date || !booking_time) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create guest user if not logged in
        let clientId;
        db.get('SELECT id FROM users WHERE email = ?', [client_email], (err, user) => {
            if (!user) {
                db.run(
                    'INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)',
                    [client_email, '', client_name, 'client'],
                    function (err) {
                        if (err) {
                            return res.status(400).json({ error: 'Failed to create user' });
                        }
                        clientId = this.lastID;
                        completeBooking(clientId);
                    }
                );
            } else {
                clientId = user.id;
                completeBooking(clientId);
            }
        });

        function completeBooking(clientId) {
            db.run(
                `INSERT INTO bookings (client_id, client_name, client_email, client_phone, service_type, booking_date, booking_time, therapist, format, notes, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')`,
                [clientId, client_name, client_email, client_phone, service_type, booking_date, booking_time, therapist, format, notes],
                async function (err) {
                    if (err) {
                        console.error('Booking error:', err);
                        return res.status(400).json({ error: 'Failed to create booking' });
                    }

                    const bookingId = this.lastID;

                    // Send booking to n8n webhook
                    const n8nData = {
                        bookingId,
                        client_name,
                        client_email,
                        client_phone,
                        service_type,
                        booking_date,
                        booking_time,
                        therapist: therapist || 'To be assigned',
                        format,
                        notes,
                        status: 'confirmed',
                        timestamp: new Date().toISOString()
                    };

                    console.log(`\n📝 Booking created (ID: ${bookingId}), sending to n8n...`);
                    await sendToN8n(n8nData);

                    try {
                        // Create Google Calendar event and get Meet link
                        const calendarEvent = await createCalendarEvent({
                            client_name,
                            client_email,
                            service_type,
                            date: booking_date,
                            time: booking_time,
                            duration_minutes: 45,
                            therapist_email: therapist || 'admin@reyescollaborativecounseling.com',
                            client_phone
                        });

                        // Update booking with Google Meet link
                        db.run(
                            'UPDATE bookings SET google_meet_link = ?, calendar_event_id = ? WHERE id = ?',
                            [calendarEvent.meetLink, calendarEvent.eventId, bookingId]
                        );

                        // Send confirmation emails
                        await sendClientConfirmation({
                            client_name,
                            client_email,
                            booking_date,
                            booking_time,
                            service_type,
                            format,
                            google_meet_link: calendarEvent.meetLink
                        });

                        await sendAdminNotification({
                            client_name,
                            client_email,
                            client_phone,
                            service_type,
                            booking_date,
                            booking_time,
                            format,
                            status: 'confirmed',
                            notes
                        });

                    } catch (emailError) {
                        console.error('Email/Calendar error:', emailError);
                        // Fallback: Send emails directly without Google Calendar integration
                        try {
                            await sendBookingConfirmation({
                                bookingId,
                                client_name,
                                client_email,
                                client_phone,
                                service_type,
                                booking_date,
                                booking_time,
                                therapist: therapist || 'To be assigned',
                                format,
                                notes
                            });

                            await sendEmailNotification({
                                client_name,
                                client_email,
                                client_phone,
                                service_type,
                                booking_date,
                                booking_time,
                                therapist: therapist || 'Unassigned',
                                format,
                                notes
                            });
                        } catch (fallbackError) {
                            console.error('Fallback email send also failed:', fallbackError);
                        }
                        // Don't fail the booking if email fails
                    }

                    res.status(201).json({
                        success: true,
                        message: 'Booking confirmed successfully',
                        bookingId,
                        bookingDetails: {
                            date: booking_date,
                            time: booking_time,
                            service: service_type,
                            confirmationEmail: client_email
                        }
                    });
                }
            );
        }

    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ============ ADMIN ENDPOINTS ============

// Get all bookings (admin only)
app.get('/api/admin/bookings', authMiddleware, adminMiddleware, (req, res) => {
    db.all('SELECT * FROM bookings ORDER BY booking_date DESC, booking_time ASC', (err, bookings) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(bookings);
    });
});

// Callback endpoint for n8n to report back the Google Meet link / calendar event
// after it creates the Google Calendar event. Not admin-protected since n8n calls
// this server-to-server, but requires the bookingId to match an existing booking.
app.post('/api/bookings/:id/meet-link', (req, res) => {
    const { id } = req.params;
    const { google_meet_link, calendar_event_id } = req.body;

    if (!google_meet_link && !calendar_event_id) {
        return res.status(400).json({ error: 'google_meet_link or calendar_event_id required' });
    }

    db.run(
        'UPDATE bookings SET google_meet_link = COALESCE(?, google_meet_link), calendar_event_id = COALESCE(?, calendar_event_id) WHERE id = ?',
        [google_meet_link || null, calendar_event_id || null, id],
        function (err) {
            if (err) {
                console.error('Error updating meet link:', err);
                return res.status(400).json({ error: 'Failed to update booking' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Booking not found' });
            }
            console.log(`✅ Meet link saved for booking ${id}: ${google_meet_link}`);
            res.json({ success: true, message: 'Meet link saved' });
        }
    );
});

// Update a booking (admin only)
app.put('/api/admin/bookings/:id', authMiddleware, adminMiddleware, (req, res) => {
    const { id } = req.params;
    const {
        client_name, client_email, client_phone, service_type,
        booking_date, booking_time, therapist, format, notes, status
    } = req.body;

    db.run(
        `UPDATE bookings SET
            client_name = ?, client_email = ?, client_phone = ?, service_type = ?,
            booking_date = ?, booking_time = ?, therapist = ?, format = ?, notes = ?, status = ?
         WHERE id = ?`,
        [client_name, client_email, client_phone, service_type, booking_date, booking_time, therapist, format, notes, status, id],
        function (err) {
            if (err) {
                console.error('Error updating booking:', err);
                return res.status(400).json({ error: 'Failed to update booking' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Booking not found' });
            }
            db.get('SELECT * FROM bookings WHERE id = ?', [id], (err, booking) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }
                res.json({ success: true, message: 'Booking updated successfully', booking });
            });
        }
    );
});

// Delete a booking (admin only)
app.delete('/api/admin/bookings/:id', authMiddleware, adminMiddleware, (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM bookings WHERE id = ?', [id], function (err) {
        if (err) {
            console.error('Error deleting booking:', err);
            return res.status(400).json({ error: 'Failed to delete booking' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.json({ success: true, message: 'Booking deleted successfully' });
    });
});

// Block date (admin only)
app.post('/api/admin/block-date', authMiddleware, adminMiddleware, (req, res) => {
    try {
        const { date, reason } = req.body;

        if (!date) {
            return res.status(400).json({ error: 'Date required' });
        }

        db.run(
            'INSERT OR REPLACE INTO blocked_dates (blocked_date, reason, blocked_by) VALUES (?, ?, ?)',
            [date, reason, req.user.id],
            function (err) {
                if (err) {
                    return res.status(400).json({ error: 'Failed to block date' });
                }
                res.json({ success: true, message: 'Date blocked successfully' });
            }
        );
    } catch (error) {
        console.error('Error blocking date:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Unblock date (admin only)
app.delete('/api/admin/block-date/:date', authMiddleware, adminMiddleware, (req, res) => {
    try {
        const { date } = req.params;

        db.run('DELETE FROM blocked_dates WHERE blocked_date = ?', [date], function (err) {
            if (err) {
                return res.status(400).json({ error: 'Failed to unblock date' });
            }
            res.json({ success: true, message: 'Date unblocked successfully' });
        });
    } catch (error) {
        console.error('Error unblocking date:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get blocked dates
app.get('/api/admin/blocked-dates', authMiddleware, adminMiddleware, (req, res) => {
    db.all('SELECT * FROM blocked_dates ORDER BY blocked_date DESC', (err, dates) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(dates);
    });
});

// ============ LEGACY ENDPOINTS (Keep GoHighLevel integration) ============

app.listen(PORT, () => {
    console.log(`\n🚀 Reyes Collaborative Counseling Server running on http://localhost:${PORT}`);
    console.log('\n📋 Available Features:');
    console.log('   ✓ Landing Page');
    console.log('   ✓ Live Calendar Booking System');
    console.log('   ✓ Admin Dashboard (Login required)');
    console.log('   ✓ Google Calendar Integration');
    console.log('   ✓ Automated Email Notifications');
    console.log('   ✓ Date Blocking/Availability Management');
    console.log('\n🔐 Authentication Endpoints:');
    console.log('   POST /api/auth/login - User login');
    console.log('   POST /api/auth/register - User registration (admin token required for admin)');
    console.log('\n📅 Booking Endpoints:');
    console.log('   GET /api/bookings/available-slots - Get available time slots');
    console.log('   POST /api/bookings/create - Create new booking');
    console.log('\n⚙️  Admin Endpoints (requires auth):');
    console.log('   GET /api/admin/bookings - View all bookings');
    console.log('   POST /api/admin/block-date - Block a date');
    console.log('   DELETE /api/admin/block-date/:date - Unblock a date');
    console.log('   GET /api/admin/blocked-dates - View blocked dates');
    console.log('\n');
});

// Helper function to generate time slots
function generateTimeSlots(startTime, endTime, durationMinutes) {
    const slots = [];
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    let current = new Date(2024, 0, 1, startHour, startMin);
    const end = new Date(2024, 0, 1, endHour, endMin);

    while (current < end) {
        const hours = String(current.getHours()).padStart(2, '0');
        const minutes = String(current.getMinutes()).padStart(2, '0');
        slots.push(`${hours}:${minutes}`);
        current.setMinutes(current.getMinutes() + durationMinutes);
    }

    return slots;
}
