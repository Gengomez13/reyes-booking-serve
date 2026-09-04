# Genset Go Tours - Custom Domain Setup

## Your Domain: gensetgotours.com

You have provided: **hello@gensetgotours.com**

This is perfect for both:
1. Email confirmations (FROM: hello@gensetgotours.com)
2. Website URL (bookings.gensetgotours.com or schedule.gensetgotours.com)

---

## Option 1: Use Email Address (hello@gensetgotours.com)

### Step 1: In n8n Email Send Nodes

Change the **FROM** field in your email templates:

**Client Confirmation Email:**
```
FROM: hello@gensetgotours.com
TO: {{ $json.clientEmail }}
SUBJECT: Your Booking Confirmation - Genset Go Tours
```

**Admin Notification Email:**
```
FROM: hello@gensetgotours.com
TO: hello@gensetgotours.com
SUBJECT: New Booking: {{ $json.clientName }}
```

### Step 2: Configure Email Provider

You need to verify hello@gensetgotours.com with your email provider:

**If using Gmail/Google Workspace:**
1. Add hello@gensetgotours.com to your Google account
2. Generate App Password
3. Use in n8n

**If using SendGrid:**
1. Go to sendgrid.com
2. Add hello@gensetgotours.com as verified sender
3. Use API key in n8n

**If using Brevo (Recommended):**
1. Go to brevo.com
2. Add hello@gensetgotours.com as sender
3. Use SMTP credentials in n8n

### Step 3: Update Server Config

Edit `.env`:
```
EMAIL_FROM=hello@gensetgotours.com
```

### Step 4: Restart Server
```bash
npm start
```

---

## Option 2: Use Website Domain (gensetgotours.com)

### Step 1: DNS Configuration

Go to your domain provider (GoDaddy, Namecheap, etc.) and add:

**For main site:**
```
gensetgotours.com → Your Server IP
```

**For booking subdomain:**
```
bookings.gensetgotours.com → Your Server IP
```

Or:
```
schedule.gensetgotours.com → Your Server IP
```

### Step 2: Update Server Config

Edit `server.js`:
```javascript
app.use(cors({
  origin: ['https://gensetgotours.com', 'https://bookings.gensetgotours.com']
}));
```

### Step 3: Get SSL Certificate

```bash
npm install -g certbot
certbot certonly --standalone -d gensetgotours.com -d bookings.gensetgotours.com
```

### Step 4: Update Server for HTTPS

Edit `server.js`:
```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/gensetgotours.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/gensetgotours.com/fullchain.pem')
};

https.createServer(options, app).listen(443);
```

### Step 5: Restart Server
```bash
npm start
```

---

## Option 3: Both Email and Website (RECOMMENDED)

**Email:** hello@gensetgotours.com  
**Website:** https://bookings.gensetgotours.com

**Result:**
- Professional email confirmations from your domain
- Professional booking URL
- Full brand consistency

---

## Quick Setup Summary

### What You Get:

**Email Setup (5 minutes):**
- ✅ Confirmations sent from hello@gensetgotours.com
- ✅ Professional branding
- ✅ Ready for n8n workflow

**Website Setup (30 minutes):**
- ✅ Booking page at https://bookings.gensetgotours.com
- ✅ Professional URL
- ✅ SSL certificate (HTTPS)

**Both (30-45 minutes total):**
- ✅ Professional emails
- ✅ Professional URL
- ✅ Full brand consistency

---

## Which Setup Do You Want?

Reply with:
```
1. Just setup email: hello@gensetgotours.com
2. Just setup website: bookings.gensetgotours.com  
3. Both (recommended)
```

---

## Current Status

**Without Domain Setup:**
- ✅ Public URL: https://dry-hotels-join.loca.lt (works now)
- ✅ Email: admin@reyescollaborativecounseling.com (temporary)

**With Your Domain:**
- 🚀 Professional booking site
- 🚀 Professional email branding
- 🚀 Full brand consistency
- 🚀 Client confidence

---

**Let me know which option and I'll configure it!** 👍
