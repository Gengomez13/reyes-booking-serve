const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

// Send booking confirmation email
async function sendBookingConfirmation(booking) {
    try {
        if (!process.env.SENDGRID_API_KEY) {
            console.warn('⚠️  SendGrid API key not configured - skipping email send');
            return;
        }

        const emailContent = `
            <h2>Booking Confirmation</h2>
            <p>Hello ${booking.client_name},</p>
            
            <p>Your therapy session has been successfully booked!</p>
            
            <h3>Appointment Details:</h3>
            <ul>
                <li><strong>Date:</strong> ${new Date(booking.booking_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</li>
                <li><strong>Time:</strong> ${booking.booking_time} (Houston Time - CST/CDT)</li>
                <li><strong>Service:</strong> ${booking.service_type}</li>
                <li><strong>Therapist:</strong> ${booking.therapist || 'To be assigned'}</li>
            </ul>
            
            <h3>How to Join:</h3>
            <p>
                <strong><a href="${booking.google_meet_link || '#'}" style="color: #0D7A9E; text-decoration: none; font-size: 16px; font-weight: bold;">
                    Join Google Meet Session
                </a></strong>
            </p>
            
            <h3>Important Notes:</h3>
            <ul>
                <li>Please join 5-10 minutes before your appointment time</li>
                <li>Test your camera and microphone before the session</li>
                <li>Make sure you're in a private, quiet space</li>
            </ul>
            
            <p>If you need to reschedule or have any questions, please contact us at:</p>
            <p>
                📧 Email: admin@reyescollaborativecounseling.com<br>
                📱 Phone: (832) REYES-CC
            </p>
            
            <p>Looking forward to supporting you on your healing journey!</p>
            
            <p><strong>Reyes Collaborative Counseling</strong><br>
            Professional Therapy & Counseling Services<br>
            Houston, Texas</p>
        `;

        const msg = {
            to: booking.client_email,
            from: process.env.EMAIL_FROM || 'admin@reyescollaborativecounseling.com',
            cc: process.env.EMAIL_CC || 'admin@reyescollaborativecounseling.com',
            subject: `Booking Confirmation - ${new Date(booking.booking_date).toLocaleDateString()}`,
            html: emailContent
        };

        await sgMail.send(msg);
        console.log('✅ Email sent via SendGrid');
        return true;
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        return false;
    }
}

// Send admin notification email
async function sendAdminNotification(booking) {
    try {
        if (!process.env.SENDGRID_API_KEY) {
            console.warn('⚠️  SendGrid API key not configured - skipping admin notification');
            return;
        }

        const adminContent = `
            <h2>New Booking Notification</h2>
            
            <h3>Booking Details:</h3>
            <ul>
                <li><strong>Client Name:</strong> ${booking.client_name}</li>
                <li><strong>Client Email:</strong> ${booking.client_email}</li>
                <li><strong>Client Phone:</strong> ${booking.client_phone}</li>
                <li><strong>Date:</strong> ${new Date(booking.booking_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</li>
                <li><strong>Time:</strong> ${booking.booking_time}</li>
                <li><strong>Service:</strong> ${booking.service_type}</li>
                <li><strong>Format:</strong> ${booking.format || 'Video Call'}</li>
                <li><strong>Notes:</strong> ${booking.notes || 'None'}</li>
            </ul>
            
            <p>Please confirm the booking in your admin dashboard.</p>
        `;

        const msg = {
            to: process.env.ADMIN_EMAIL || 'admin@reyescollaborativecounseling.com',
            cc: process.env.EMAIL_CC || 'admin@reyescollaborativecounseling.com',
            from: process.env.EMAIL_FROM || 'admin@reyescollaborativecounseling.com',
            subject: `New Booking: ${booking.client_name} - ${new Date(booking.booking_date).toLocaleDateString()}`,
            html: adminContent
        };

        await sgMail.send(msg);
        console.log('✅ Admin notification sent via SendGrid');
        return true;
    } catch (error) {
        console.error('❌ Error sending admin notification:', error.message);
        return false;
    }
}

module.exports = {
    sendBookingConfirmation,
    sendAdminNotification
};

