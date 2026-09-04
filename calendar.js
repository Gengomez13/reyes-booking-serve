const { google } = require('googleapis');
const nodemailer = require('nodemailer');

// Google Calendar API Configuration
let googleAuth = null;
let calendar = null;

// Initialize Google Calendar
function initializeGoogleCalendar(credentials) {
    try {
        googleAuth = new google.auth.GoogleAuth({
            keyFile: credentials.keyFile,
            scopes: ['https://www.googleapis.com/auth/calendar']
        });

        calendar = google.calendar({ version: 'v3', auth: googleAuth });
        console.log('Google Calendar initialized');
        return true;
    } catch (error) {
        console.error('Google Calendar initialization error:', error);
        return false;
    }
}

// Create calendar event with Google Meet
async function createCalendarEvent(eventData) {
    try {
        if (!calendar) {
            throw new Error('Google Calendar not initialized');
        }

        const startTime = new Date(`${eventData.date}T${eventData.time}`);
        const endTime = new Date(startTime.getTime() + eventData.duration_minutes * 60000);

        const event = {
            summary: `Therapy Session - ${eventData.client_name}`,
            description: `Service: ${eventData.service_type}\nClient: ${eventData.client_name}\nPhone: ${eventData.client_phone}\nEmail: ${eventData.client_email}`,
            start: {
                dateTime: startTime.toISOString(),
                timeZone: 'America/Chicago'
            },
            end: {
                dateTime: endTime.toISOString(),
                timeZone: 'America/Chicago'
            },
            attendees: [
                { email: eventData.client_email },
                { email: eventData.therapist_email }
            ],
            conferenceData: {
                createRequest: {
                    requestId: `meeting-${Date.now()}`,
                    conferenceSolution: {
                        key: { type: 'hangoutsMeet' }
                    }
                }
            }
        };

        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
            conferenceDataVersion: 1,
            sendNotifications: true
        });

        return {
            eventId: response.data.id,
            meetLink: response.data.conferenceData?.entryPoints?.[0]?.uri || null,
            htmlLink: response.data.htmlLink
        };
    } catch (error) {
        console.error('Error creating calendar event:', error);
        throw error;
    }
}

// Send booking confirmation email to client
async function sendClientConfirmation(clientData) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: 'noreply@reyescollaborativecounseling.com',
            to: clientData.client_email,
            subject: 'Your Therapy Session Booking Confirmed - Reyes Collaborative Counseling',
            html: `
                <h2>Session Confirmed!</h2>
                <p>Dear ${clientData.client_name},</p>
                <p>We're excited to support you on your healing journey! Your therapy session has been confirmed.</p>
                
                <h3>Session Details:</h3>
                <ul>
                    <li><strong>Date:</strong> ${formatDate(clientData.booking_date)}</li>
                    <li><strong>Time:</strong> ${clientData.booking_time}</li>
                    <li><strong>Duration:</strong> 45 minutes</li>
                    <li><strong>Service:</strong> ${clientData.service_type}</li>
                    <li><strong>Format:</strong> ${clientData.format}</li>
                </ul>

                ${clientData.google_meet_link ? `
                <h3>Join Your Session:</h3>
                <p><a href="${clientData.google_meet_link}" style="background-color: #0D7A9E; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Join Google Meet</a></p>
                <p>Or copy this link: <code>${clientData.google_meet_link}</code></p>
                ` : ''}

                <h3>Important Information:</h3>
                <ul>
                    <li>Please join 5 minutes early</li>
                    <li>Ensure you have a quiet, private space for your session</li>
                    <li>Test your camera and microphone beforehand</li>
                </ul>

                <p>If you need to reschedule or have any questions, please contact us:</p>
                <p>
                    📞 Phone: <a href="tel:+18322422948">(832) 242-2948</a><br>
                    📧 Email: admin@reyescollaborativecounseling.com<br>
                    🕐 Hours: Monday - Friday: 9:00 AM - 5:00 PM
                </p>

                <p>We're here to support you every step of the way.</p>
                <p>With compassion and care,<br>
                <strong>Reyes Collaborative Counseling Team</strong></p>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Client confirmation email sent:', result.messageId);
        return result;
    } catch (error) {
        console.error('Error sending client confirmation:', error);
        throw error;
    }
}

// Send booking notification to admin
async function sendAdminNotification(bookingData) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: 'noreply@reyescollaborativecounseling.com',
            to: 'admin@reyescollaborativecounseling.com',
            cc: 'daymar@reyescollaborativecounseling.com',
            subject: `New Booking: ${bookingData.client_name} - ${bookingData.service_type}`,
            html: `
                <h2>New Booking Received</h2>
                
                <h3>Client Information:</h3>
                <ul>
                    <li><strong>Name:</strong> ${bookingData.client_name}</li>
                    <li><strong>Email:</strong> ${bookingData.client_email}</li>
                    <li><strong>Phone:</strong> ${bookingData.client_phone}</li>
                </ul>

                <h3>Session Details:</h3>
                <ul>
                    <li><strong>Date:</strong> ${formatDate(bookingData.booking_date)}</li>
                    <li><strong>Time:</strong> ${bookingData.booking_time}</li>
                    <li><strong>Service Type:</strong> ${bookingData.service_type}</li>
                    <li><strong>Format:</strong> ${bookingData.format}</li>
                    <li><strong>Status:</strong> ${bookingData.status}</li>
                </ul>

                ${bookingData.notes ? `
                <h3>Notes:</h3>
                <p>${bookingData.notes}</p>
                ` : ''}

                <p><a href="http://localhost:3000/admin/bookings" style="background-color: #0D7A9E; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Admin Dashboard</a></p>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Admin notification email sent:', result.messageId);
        return result;
    } catch (error) {
        console.error('Error sending admin notification:', error);
        throw error;
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

module.exports = {
    initializeGoogleCalendar,
    createCalendarEvent,
    sendClientConfirmation,
    sendAdminNotification
};
