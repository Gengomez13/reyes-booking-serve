# 🎯 Booking System - Quick Start Guide

## ✅ System Ready for Testing!

The booking system is now fully implemented and running. Here's what you can do immediately:

---

## 📋 Access Points

### 1. **Client Booking (Public)**
- **URL:** `http://localhost:3000/calendar-booking.html`
- **Features:**
  - 📅 Interactive calendar
  - ⏰ Real-time time slot availability
  - 📝 Client information form
  - ✉️ Automatic confirmation email (when email is configured)
  - 📞 Google Meet link generation (when Google Calendar is configured)

### 2. **Admin Dashboard (Protected)**
- **URL:** `http://localhost:3000/admin-login.html`
- **Features:**
  - 🔐 Secure login required
  - 📅 Full calendar view
  - 📊 Booking management
  - 🚫 Block/unblock dates
  - 📈 Statistics

### 3. **Landing Page**
- **URL:** `http://localhost:3000/`
- **New Feature:** Two booking options:
  - "Open Calendar" → Live booking system
  - "Show Form" → Traditional inquiry form

---

## 🔑 First Time Setup (IMPORTANT!)

### Step 1: Create Admin Account

Open your terminal and run:

```bash
cd C:\Users\Gen\OneDrive\Desktop\Automation
node setup.js
```

Follow the prompts to:
1. Create `.env` file (if missing)
2. Create admin account with email/password

### Step 2: Configure Environment Variables

Edit `.env` file in the project root:

```env
PORT=3000
NODE_ENV=development

# Change these to random values
JWT_SECRET=your-secret-key-here
ADMIN_REGISTRATION_TOKEN=your-admin-token

# Gmail (optional, for email features)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Google Calendar (optional, for Google Meet links)
GOOGLE_KEY_FILE=./google-credentials.json

# GoHighLevel (existing integration)
GHL_API_KEY=your-existing-key
GHL_LOCATION_ID=your-existing-location
```

### Step 3: Test Admin Login

1. Go to: `http://localhost:3000/admin-login.html`
2. Use credentials created in Step 1
3. You should see the admin dashboard

---

## 🧪 Testing the Full Flow

### Test Booking Creation (Without Email)

```bash
# Make this request in Postman or with curl
POST http://localhost:3000/api/bookings/create
Content-Type: application/json

{
  "client_name": "Test Client",
  "client_email": "test@example.com",
  "client_phone": "(832) 242-2948",
  "service_type": "Adult Counseling",
  "booking_date": "2026-09-15",
  "booking_time": "14:00",
  "format": "Virtual/Online",
  "notes": "Test booking"
}
```

### Test Available Slots

```bash
GET http://localhost:3000/api/bookings/available-slots?date=2026-09-15
```

---

## 📧 Email Configuration (Optional but Recommended)

### To Enable Client Confirmations:

1. **Use Gmail:**
   - Enable 2-Factor Authentication
   - Generate App Password: https://myaccount.google.com/apppasswords
   - Add to `.env`:
     ```
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASSWORD=your-16-char-app-password
     ```

2. **Test Email:**
   ```bash
   node -e "
   const nodemailer = require('nodemailer');
   const transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: { user: 'your-email@gmail.com', pass: 'your-app-password' }
   });
   transporter.sendMail({
     from: 'noreply@reyescollaborativecounseling.com',
     to: 'test@example.com',
     subject: 'Test',
     html: 'Test email'
   }, console.log);
   "
   ```

---

## 🌐 Google Calendar Integration (Optional)

### To Enable Google Meet Links:

1. **Create Google Cloud Project:**
   - https://console.cloud.google.com
   - Create new project
   - Enable "Google Calendar API"
   - Create Service Account
   - Download JSON key

2. **Add to Project:**
   - Save as `google-credentials.json` in project root
   - Update `.env`:
     ```
     GOOGLE_KEY_FILE=./google-credentials.json
     ```

3. **Share Calendar:**
   - Copy service account email from JSON file
   - Share your Google Calendar with this email

---

## 📱 Features by User Type

### Client Features
✅ View calendar for available dates
✅ Select preferred time slot
✅ Enter personal information
✅ Receive confirmation email
✅ Get Google Meet link (when configured)
✅ One-click join to session

### Admin Features
✅ Secure login dashboard
✅ View all bookings
✅ Block specific dates
✅ Unblock dates
✅ View booking statistics
✅ Manage therapist availability
✅ Export booking data (coming soon)

---

## 🚀 Production Deployment Checklist

- [ ] Change `JWT_SECRET` to random value
- [ ] Change `ADMIN_REGISTRATION_TOKEN` 
- [ ] Configure Gmail with app password
- [ ] Set up Google Calendar credentials
- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Enable HTTPS/SSL
- [ ] Backup database regularly
- [ ] Test full booking flow
- [ ] Train staff on admin dashboard
- [ ] Monitor email delivery

---

## 🐛 Troubleshooting

### "Server won't start"
```bash
# Kill existing Node process
Get-Process node | Stop-Process -Force

# Check for port conflicts
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue

# Start fresh
npm start
```

### "Login not working"
- Clear browser localStorage: `localStorage.clear()`
- Verify `.env` has `JWT_SECRET` set
- Check admin account was created successfully
- Try incognito/private browser

### "No available slots"
- Check if date is blocked in admin dashboard
- Verify date is in future
- Check admin dashboard calendar shows events

### "Emails not sending"
- Verify Gmail credentials in `.env`
- Check 2FA is enabled on Gmail account
- Generate new App Password
- Test with curl or Postman

---

## 📊 Database

The system uses SQLite. Data is stored in `bookings.db`:

### View All Bookings
```bash
sqlite3 bookings.db "SELECT * FROM bookings;"
```

### View Blocked Dates
```bash
sqlite3 bookings.db "SELECT * FROM blocked_dates;"
```

### Reset Database (⚠️ WARNING: Deletes all data)
```bash
rm bookings.db
npm start
```

---

## 📞 API Summary

| Endpoint | Method | Purpose | Public |
|----------|--------|---------|--------|
| `/api/auth/login` | POST | User login | Yes |
| `/api/auth/register` | POST | Create account | Yes* |
| `/api/bookings/available-slots` | GET | Get time slots | Yes |
| `/api/bookings/create` | POST | Create booking | Yes |
| `/api/admin/bookings` | GET | View bookings | No† |
| `/api/admin/block-date` | POST | Block date | No† |
| `/api/admin/block-date/:date` | DELETE | Unblock date | No† |
| `/api/admin/blocked-dates` | GET | View blocked dates | No† |

*Requires admin token for admin role
†Requires admin authentication

---

## 📚 Next Steps

1. ✅ Test the booking calendar: `/calendar-booking.html`
2. ✅ Create test booking
3. ✅ Login to admin dashboard: `/admin-login.html`
4. ✅ Block a test date
5. ✅ Configure email (optional)
6. ✅ Configure Google Calendar (optional)
7. ✅ Deploy to production

---

## 🎓 Learning Resources

- **Full Calendar:** https://fullcalendar.io/docs/react
- **Google Calendar API:** https://developers.google.com/calendar
- **Nodemailer:** https://nodemailer.com/
- **SQLite:** https://www.sqlite.org/lang.html

---

## 💡 Pro Tips

- The system auto-generates Google Meet links when Google Calendar is configured
- Blocked dates are excluded from booking
- Admin dashboard refreshes every 30 seconds
- All passwords are hashed with bcryptjs
- JWT tokens expire after 7 days
- Database is automatically created on first run

---

**Ready to book? Open `http://localhost:3000/calendar-booking.html`** 🚀

For detailed setup instructions, see `BOOKING_SYSTEM_SETUP.md`
