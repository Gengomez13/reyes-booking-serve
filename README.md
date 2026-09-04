# Daymar Landing Page with GoHighLevel Integration

Professional landing page for Daymar's therapy services, with automatic lead capture and integration with GoHighLevel CRM.

## 📋 Setup Instructions

### Prerequisites
- Node.js installed (download from https://nodejs.org/)
- GoHighLevel account with API access
- Your GoHighLevel API Key and Location ID

### Step 1: Get Your GoHighLevel Credentials

1. **Log in** to your GoHighLevel account at https://gohighlevel.com
2. Navigate to **Settings** → **Integrations** → **API** (or look for API settings)
3. Find and copy your:
   - **API Key** (long string of characters)
   - **Location ID** (UUID-like format)

### Step 2: Install Dependencies

Open your terminal/command prompt in this folder and run:

```bash
npm install
```

This will install all required packages (Express, Axios, CORS, dotenv).

### Step 3: Configure Environment Variables

Edit the `.env` file in this folder and add your credentials:

```
GHL_API_KEY=your_actual_api_key_here
GHL_LOCATION_ID=your_actual_location_id_here
PORT=3000
```

**⚠️ IMPORTANT:** Keep this file private. Do NOT commit it to GitHub or share it.

### Step 4: Run the Server

```bash
npm start
```

You should see:
```
Daymar Landing Page Server running on http://localhost:3000
GoHighLevel API Key: Configured ✓
GoHighLevel Location ID: Configured ✓
```

### Step 5: Access Your Landing Page

Open your browser and go to:
```
http://localhost:3000
```

You should see your landing page with the booking form!

## 🔄 How It Works

1. **User fills out the form** on the landing page
2. **Form submits to** `/api/submit-booking` endpoint
3. **Backend sends data** to GoHighLevel API
4. **GoHighLevel creates:**
   - A new Contact with the user's info
   - Tags for the service type
   - An Opportunity/Lead for follow-up

## 📱 Features

✅ Professional, mobile-responsive design
✅ Service selection dropdown
✅ Form validation
✅ Automatic lead capture to GoHighLevel
✅ Success/error messaging
✅ Easy customization

## 🎨 Customization

### Change Colors/Style
Edit the `<style>` section in `daymar-landing.html`

### Change Services List
Edit the services grid in the HTML file

### Change Form Fields
Modify the form fields in `daymar-landing.html` and update `server.js` accordingly

## 🚀 Deployment Options

### Option 1: Local Development Only
Just run `npm start` whenever you need the server running.

### Option 2: Keep Running 24/7
- **Heroku**: Deploy for free (with limitations)
- **Render**: Simple deployment platform
- **Railway**: Fast and easy deployment
- **Your own VPS/Server**: Full control

### Option 3: Use GoHighLevel's Built-In Landing Pages
If you just want a simple form without customization, GoHighLevel has built-in landing page templates.

## 📞 Support

If the form doesn't work:
1. Check `.env` file has correct API key and location ID
2. Check GoHighLevel API is enabled in your account
3. Check server is running (look for "Configured ✓" messages)
4. Check browser console for error messages (F12 → Console tab)

## 📝 Files Included

- `server.js` - Backend server that handles form submissions
- `daymar-landing.html` - The landing page (view in browser)
- `package.json` - Project dependencies
- `.env` - Environment variables (YOUR CREDENTIALS GO HERE)
- `README.md` - This file

## ⚙️ Advanced

### Webhook Automation in GoHighLevel
After a contact is created, you can set up automation in GoHighLevel to:
- Send welcome email
- Send SMS confirmation
- Create calendar event
- Assign to team member
- Trigger workflow

### Environment Variables Explained
```
GHL_API_KEY=your_api_key
  ↳ Authenticates requests to GoHighLevel API

GHL_LOCATION_ID=your_location_id
  ↳ Specifies which GoHighLevel location receives the leads

PORT=3000
  ↳ Server port (change if 3000 is already in use)
```

## 🔐 Security Notes

- Never share your `.env` file
- Never commit `.env` to version control
- API keys should be treated like passwords
- Use HTTPS in production (not just HTTP)

---

**Created for Daymar - Reyes Collaborative Counseling** 🌟
