# Email & Google Calendar Setup Guide

## Part 1: Gmail Configuration (Email Sending)

### Step 1: Create Gmail App Password

1. Go to your Google Account: https://myaccount.google.com
2. Click **Security** (left sidebar)
3. Enable **2-Step Verification** if not already enabled
4. After 2-Step is enabled, you'll see "App passwords"
5. Click **App passwords**
6. Select:
   - App: **Mail**
   - Device: **Windows Computer** (or your device)
7. Google will generate a 16-character password
8. **Copy this password** - you'll need it!

### Step 2: Update .env File

Open `.env` file and update:

```
EMAIL_USER=admin@reyescollaborativecounseling.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_FROM=admin@reyescollaborativecounseling.com
EMAIL_CC=daymar@reyescollaborativecounseling.com
```

Replace `xxxx xxxx xxxx xxxx` with the 16-character App Password from Step 1 (remove spaces or keep them - both work).

### Step 3: Test Email Configuration

The email system will automatically try to send:
- **Client Confirmation Email** - sent to the booking client
- **Admin Notification Email** - sent to admin@reyescollaborativecounseling.com and CC'd to daymar@reyescollaborativecounseling.com

---

## Part 2: Google Calendar Integration (Google Meet Links)

### Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com
2. Click **Select a Project** (top of page)
3. Click **NEW PROJECT**
4. Enter Project Name: `Reyes Counseling`
5. Click **CREATE**
6. Wait for project to be created

### Step 2: Enable Google Calendar API

1. In the top search bar, search for `Google Calendar API`
2. Click the result
3. Click **ENABLE**
4. Wait for it to be enabled

### Step 3: Create OAuth 2.0 Credentials

1. Click **Create Credentials** (button at top)
2. Choose: **OAuth client ID**
3. Choose Application Type: **Web application**
4. Under "Authorized JavaScript origins" add:
   ```
   http://localhost:3000
   https://your-domain.com  (add your production domain later)
   ```
5. Under "Authorized redirect URIs" add:
   ```
   http://localhost:3000/auth/google/callback
   https://your-domain.com/auth/google/callback
   ```
6. Click **CREATE**
7. A dialog will show your credentials:
   - **Client ID**
   - **Client Secret**
8. Click **Download** to save as JSON

### Step 4: Update .env File

Add these to your `.env` file:

```
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
GOOGLE_CALENDAR_ID=your_calendar_id@gmail.com
```

### Step 5: Find Your Google Calendar ID

1. Go to https://calendar.google.com
2. Click **Settings** (gear icon)
3. Click **Settings**
4. Find **Calendar** section on left
5. Click your calendar name
6. Scroll to **Calendar ID** - copy it (looks like: `abcd123@gmail.com`)
7. Paste into `.env` as `GOOGLE_CALENDAR_ID`

---

## Step 6: Restart Server

After updating `.env`:

1. Stop the Node.js server (Ctrl+C in terminal)
2. Start it again:
   ```
   node server.js
   ```
3. The server will now:
   - ✅ Send booking confirmation emails
   - ✅ Generate Google Meet links automatically
   - ✅ Send admin notifications

---

## What Happens After Setup

### When a Client Books an Appointment:

1. ✅ Booking is created in database
2. ✅ Google Calendar event is created with Meet link
3. ✅ Client receives confirmation email with:
   - Appointment details
   - Google Meet link (clickable button)
   - Instructions to join early
4. ✅ Admin receives notification email with:
   - Client details
   - Appointment info
   - Link to admin dashboard

### Email Template Includes:

- **Appointment date & time** (in Houston timezone)
- **Google Meet join link**
- **Service type & therapist name**
- **Instructions** for joining
- **Contact information**

---

## Troubleshooting

### "Email not configured" Warning

- ✅ Normal if `EMAIL_PASSWORD` is empty
- Add Gmail App Password to `.env` to enable emails

### Google Calendar Error

- ❌ Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`
- ❌ Make sure Google Calendar API is enabled
- ❌ Check redirect URIs match your domain

### Email Sending Failed

- ❌ Verify Gmail App Password (16 characters, no spaces)
- ❌ Make sure 2-Step Verification is enabled in Google Account
- ❌ Check email is not in spam folder

---

## Next Steps

1. ✅ Get Gmail App Password
2. ✅ Update `.env` with email credentials
3. ✅ Create Google Cloud Project
4. ✅ Enable Google Calendar API
5. ✅ Create OAuth credentials
6. ✅ Update `.env` with Google credentials
7. ✅ Restart server
8. ✅ Test by making a booking

---

**When complete, your system will:**
- 📧 Send automated confirmation emails
- 📅 Create Google Calendar events
- 🎥 Generate Google Meet links automatically
- 👨‍💼 Notify admins of new bookings
