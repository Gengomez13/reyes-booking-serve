# Reyes Collaborative Counseling - Booking System Setup Guide

## 🚀 New Features Implemented

### 1. **Live Calendar Booking System**
- Interactive calendar for clients to select dates
- Real-time availability checking
- Automatic time slot generation (45-minute sessions)
- Google Meet link generation
- Email confirmations with booking details

### 2. **Admin Dashboard**
- Secure login for administrators
- Full calendar view of all bookings
- Date blocking/unblocking capabilities
- Booking management
- Statistics and analytics

### 3. **Authentication System**
- JWT-based user authentication
- Admin and client roles
- Secure password hashing with bcryptjs
- Session management

### 4. **Google Calendar Integration**
- Automatic event creation
- Google Meet link generation
- Attendee management
- Calendar notifications

### 5. **Email Notifications**
- Client confirmation emails with Google Meet links
- Admin notifications with booking details
- CC to daymar@reyescollaborativecounseling.com
- Professional email templates

---

## 📋 Setup Instructions

### Step 1: Environment Variables

Update your `.env` file with:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# JWT Configuration
JWT_SECRET=your-super-secret-key-here-change-this

# Admin Registration Token (use this once to create admin account)
ADMIN_REGISTRATION_TOKEN=your-admin-token-here

# Email Configuration (Gmail)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Google Calendar API
GOOGLE_KEY_FILE=path/to/your/google-credentials.json

# GoHighLevel (existing integration)
GHL_API_KEY=your-ghl-api-key
GHL_LOCATION_ID=your-ghl-location-id
```

### Step 2: Google Calendar Setup

1. **Create a Google Cloud Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project
   - Enable "Google Calendar API"
   - Create a Service Account
   - Download the JSON key file
   - Place it in your project root (e.g., `google-credentials.json`)

2. **Share Calendar with Service Account:**
   - Copy the service account email
   - Share your Google Calendar with this email

### Step 3: Gmail Configuration

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account → Security
   - Find "App passwords"
   - Select Mail and Windows Computer
   - Copy the generated password
   - Use this in `EMAIL_PASSWORD` in .env

### Step 4: Create Admin Account

Make a POST request to create your admin account:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "x-admin-token: your-admin-token-here" \
  -d '{
    "email": "admin@reyescollaborativecounseling.com",
    "password": "your-secure-password",
    "name": "Admin Name",
    "role": "admin"
  }'
```

---

## 🔐 Accessing the System

### For Clients:
1. **Landing Page:** `http://localhost:3000/`
2. **Book Online:** Click "Open Calendar" button or go to `/calendar-booking.html`
3. Select date → Select time → Enter details → Receive confirmation email with Google Meet link

### For Admins:
1. **Admin Login:** `http://localhost:3000/admin-login.html`
2. **Credentials:** Use the admin account created in Step 4
3. **Dashboard:** View bookings, block dates, manage calendar

---

## 📁 File Structure

```
/
├── public/
│   ├── index.html                    # Main landing page
│   ├── calendar-booking.html         # Client booking calendar
│   ├── admin-login.html              # Admin login page
│   └── admin-dashboard.html          # Admin control panel
├── database.js                       # SQLite database setup
├── auth.js                           # Authentication module
├── calendar.js                       # Google Calendar & Email integration
├── server.js                         # Express server & API routes
├── .env                              # Environment variables
└── bookings.db                       # SQLite database (auto-created)
```

---

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/register              # Register new user (requires admin token for admin role)
POST /api/auth/login                 # User login
```

### Bookings (Public)
```
GET /api/bookings/available-slots    # Get available time slots for a date
POST /api/bookings/create            # Create new booking
```

### Admin Only
```
GET /api/admin/bookings              # View all bookings (requires auth)
POST /api/admin/block-date           # Block a date (requires admin role)
DELETE /api/admin/block-date/:date   # Unblock a date (requires admin role)
GET /api/admin/blocked-dates         # View all blocked dates (requires admin role)
```

---

## 📧 Email Templates

### Client Confirmation Email
- Session date and time
- Service type and format
- Google Meet link (clickable button + URL)
- Important instructions
- Contact information

### Admin Notification Email
- Client name, email, phone
- Service type and format
- Session date and time
- Notes (if any)
- Link to admin dashboard

**Recipients:**
- To: `admin@reyescollaborativecounseling.com`
- CC: `daymar@reyescollaborativecounseling.com`

---

## 🛠️ Database Schema

### users
```sql
id, email, password_hash, name, role, created_at
```

### bookings
```sql
id, client_id, client_name, client_email, client_phone, 
service_type, booking_date, booking_time, duration_minutes, 
therapist, format, status, google_meet_link, calendar_event_id, notes, created_at
```

### blocked_dates
```sql
id, blocked_date, reason, blocked_by, created_at
```

### therapists
```sql
id, name, email, specializations, availability_start, 
availability_end, working_days, created_at
```

---

## 🚨 Important Notes

1. **Database:** Uses SQLite by default. First run creates `bookings.db` automatically.
2. **Session Duration:** Default is 45 minutes (matches your existing services)
3. **Time Slots:** Generated from 9 AM to 5 PM daily
4. **Timezone:** America/Chicago (adjust in `calendar.js` if needed)
5. **Google Meet:** Links are auto-generated with 1-hour buffer after sessions

---

## 🐛 Troubleshooting

### Google Calendar Not Working
- Verify `google-credentials.json` exists
- Check service account has calendar access
- Ensure Calendar API is enabled in Google Cloud Console

### Emails Not Sending
- Verify Gmail app password (not regular password)
- Check 2FA is enabled
- Test credentials with: `node -e "const nodemailer = require('nodemailer'); ..."`

### Database Lock Error
- Ensure only one Node process is running
- Delete `bookings.db` to reset (data will be lost)
- Restart server

### Admin Login Not Working
- Verify admin account was created successfully
- Check `.env` JWT_SECRET matches what server is using
- Clear browser localStorage and try again

---

## 🔄 Database Migration (From Old System)

If migrating from the old form-based system:

1. **Backup** existing GoHighLevel leads
2. **Keep** the old `/api/submit-booking` endpoint (still available)
3. **Test** both systems in parallel
4. **Migrate** existing leads manually to new system if needed

---

## 📊 Monitoring

Check server logs for:
- `Calendar initialized` - Google Calendar connected
- `Connected to SQLite database` - Database ready
- `Booking confirmed successfully` - Successful bookings
- `Email sent` - Email delivery confirmation

---

## 🔐 Security Best Practices

1. **Change JWT_SECRET** before production
2. **Use Strong Passwords** for admin accounts
3. **Rotate ADMIN_REGISTRATION_TOKEN** after creating accounts
4. **Enable HTTPS** in production
5. **Use Environment Variables** for all secrets
6. **Backup Database** regularly
7. **Monitor Email Account** for suspicious activity

---

## 📞 Support

If you encounter issues:

1. Check server console for error messages
2. Verify all `.env` variables are set
3. Test API endpoints with Postman/Insomnia
4. Check browser console for client-side errors
5. Review database with: `sqlite3 bookings.db ".schema"`

---

## 🎯 Next Steps

1. ✅ Deploy to production
2. ✅ Create admin account
3. ✅ Test full booking flow
4. ✅ Train staff on admin dashboard
5. ✅ Monitor first bookings
6. ✅ Adjust availability as needed

---

**Built with ❤️ for Reyes Collaborative Counseling**
