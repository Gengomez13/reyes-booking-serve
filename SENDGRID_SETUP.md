# SendGrid Email Setup Guide

## 📧 Quick Setup (5 minutes)

### Step 1: Create SendGrid Account

1. Go to: https://sendgrid.com/free
2. Sign up with your email (gengomez.hrassistant@gmail.com)
3. Complete verification
4. Confirm your email in SendGrid

### Step 2: Create API Key

1. Log in to SendGrid: https://app.sendgrid.com
2. Go to **Settings** → **API Keys**
3. Click **Create API Key**
4. Name it: `Reyes Counseling Booking`
5. Select permission: **Full Access** (recommended for testing)
6. Click **Create & View**
7. **Copy the API Key** (looks like: `SG.xxxxxxxxxxxxx`)
8. ⚠️ **Save it safely** - you won't see it again!

### Step 3: Update .env File

Open `.env` file and replace:

```
SENDGRID_API_KEY=SG.your_api_key_here
```

With your actual API key:

```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
```

### Step 4: Restart Server

After updating `.env`:

1. Stop the Node.js server (Ctrl+C)
2. Start it again: `node server.js`
3. You're done! 🎉

---

## ✅ What Happens Next

When a client books an appointment:

1. ✅ Booking saved to database
2. ✅ **Email sent via SendGrid** to client (gengomez.hrassistant@gmail.com)
3. ✅ **Admin notification** CC'd to chitamuskul@gmail.com

### Email includes:
- Appointment date & time
- Service type
- Instructions to join
- Contact information

---

## 🔍 Troubleshooting

### "Email not configured" warning
- SendGrid API key missing or invalid
- Check `.env` file has correct API key
- Restart server

### Email still not sending
1. Verify API key is correct (should start with `SG.`)
2. Check SendGrid dashboard → **Email Activity** to see attempts
3. Make sure email addresses are valid

### "Invalid from email"
- Make sure `EMAIL_FROM` in `.env` is a valid email address
- Can be any email (not just verified with SendGrid)

---

## 📊 SendGrid Free Tier

- **100 emails per day**
- Perfect for testing
- Upgrade later if needed

---

## 🚀 Ready to Test?

1. ✅ Create SendGrid account
2. ✅ Get API key
3. ✅ Update .env
4. ✅ Restart server
5. ✅ Make a test booking
6. ✅ Check email!

**Questions?** Check https://docs.sendgrid.com
