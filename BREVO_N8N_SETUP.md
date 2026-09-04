# Brevo Email Integration with n8n - Complete Setup Guide

## Part 1: Brevo Account Setup (5 minutes)

### Step 1: Create Brevo Account
1. Go to https://www.brevo.com/
2. Click **"Sign up"** (top right)
3. Enter your email: `hello@gensetgotours.com`
4. Create password
5. Click **Create account**

### Step 2: Verify Your Email
- Check your email inbox for Brevo verification link
- Click the verification link
- Complete the setup wizard

### Step 3: Get Your SMTP Credentials
1. In Brevo dashboard, go to **Settings** → **SMTP & API**
2. Under **SMTP Settings**, you'll see:
   - **SMTP Host:** `smtp-relay.brevo.com`
   - **SMTP Port:** `587` (or 25, 465)
   - **Login (username):** Your Brevo account email
   - **Password:** Will be provided in SMTP settings (click show)
3. **Copy these credentials** - you'll need them for n8n

### Step 4: Verify Your Sender Email (Important!)
1. Go to **Senders & Contacts** → **Senders**
2. Click **Add a sender**
3. Fill in:
   - **Email address:** `hello@gensetgotours.com` (or `noreply@reyescollaborativecounseling.com`)
   - **Sender name:** Reyes Collaborative Counseling
4. Click **Add sender**
5. Check email to verify the sender address
6. Once verified, you can send from this address

---

## Part 2: n8n Workflow Setup (15 minutes)

### Step 1: Create New Workflow
1. Open your n8n account at https://gengomez13.app.n8n.cloud
2. Click **+ New** → **Workflow**
3. Name it: `Booking Confirmation - Brevo`

### Step 2: Add Webhook Trigger Node
1. Click **+** to add first node
2. Search for **Webhook**
3. Select **Webhook** trigger
4. Leave as **POST**
5. Copy the webhook URL (you'll see it at the top)
6. **This is important:** Save this URL - this goes in your server .env

### Step 3: Add Set Variables Node
1. Click **+** to add next node
2. Search for **Set** → select **Set (Variables)**
3. Configure variables:
   - **Variable 1 Name:** `bookingId`
   - **Variable 1 Value:** `{{ $json.bookingId }}`
   - **Variable 2 Name:** `clientEmail`
   - **Variable 2 Value:** `{{ $json.client_email }}`
   - **Variable 3 Name:** `clientName`
   - **Variable 3 Value:** `{{ $json.client_name }}`
4. Click **Add Expression** for each if needed

### Step 4: Add Client Confirmation Email Node
1. Click **+** to add node
2. Search for **Brevo** → select **Brevo**
3. Click **Create new credential** for Brevo
4. In the credential dialog:
   - **Credential name:** Brevo Booking System
   - **API Key:** Get this from Brevo → Settings → SMTP & API → (scroll down to API section)
5. In the node configuration:
   - **Operation:** Send Email
   - **From Email:** `hello@gensetgotours.com`
   - **From Name:** Reyes Collaborative Counseling
   - **To Email:** `{{ $variables.clientEmail }}`
   - **Subject:** `Your Booking Confirmation - Reyes Collaborative Counseling`
   - **Email Type:** HTML
   - **Body (HTML):**

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #0D7A9E; color: white; padding: 20px; border-radius: 5px 5px 0 0;">
    <h2 style="margin: 0;">Booking Confirmation</h2>
    <p style="margin: 5px 0 0 0;">Reyes Collaborative Counseling</p>
  </div>
  
  <div style="background-color: #f5f5f5; padding: 30px; border-radius: 0 0 5px 5px;">
    <p>Dear {{ $variables.clientName }},</p>
    
    <p>Thank you for booking a session with us! Your appointment is confirmed.</p>
    
    <div style="background-color: white; padding: 20px; border-left: 4px solid #0D7A9E; margin: 20px 0;">
      <h3 style="color: #0D7A9E; margin-top: 0;">Booking Details:</h3>
      <p><strong>Booking ID:</strong> #{{ $variables.bookingId }}</p>
      <p><strong>Date:</strong> {{ $json.booking_date }}</p>
      <p><strong>Time:</strong> {{ $json.booking_time }}</p>
      <p><strong>Service:</strong> {{ $json.service_type }}</p>
      <p><strong>Format:</strong> {{ $json.format }}</p>
    </div>
    
    <h4>What to Expect:</h4>
    <ul>
      <li>Please arrive 5-10 minutes early</li>
      <li>Bring any relevant documentation</li>
      <li>We may send you a Google Meet link if virtual</li>
    </ul>
    
    <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
    
    <p>Best regards,<br>
    <strong>Reyes Collaborative Counseling</strong><br>
    Houston, Texas</p>
  </div>
</div>
```

### Step 5: Add Admin Notification Email Node
1. Click **+** to add another node
2. Search for **Brevo** → select **Brevo** again
3. Use the same credential
4. Configure:
   - **Operation:** Send Email
   - **From Email:** `hello@gensetgotours.com`
   - **From Name:** Reyes Collaborative Counseling
   - **To Email:** `admin@reyescollaborativecounseling.com`
   - **Subject:** `NEW BOOKING: {{ $variables.clientName }} - {{ $json.booking_date }}`
   - **Email Type:** HTML
   - **Body (HTML):**

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #d32f2f; color: white; padding: 15px;">
    <h3 style="margin: 0;">⚠️ NEW BOOKING RECEIVED</h3>
  </div>
  
  <div style="padding: 20px; background-color: #f5f5f5;">
    <h4>Client Information:</h4>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Name:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">{{ $variables.clientName }}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">{{ $variables.clientEmail }}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Phone:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">{{ $json.client_phone }}</td>
      </tr>
    </table>
    
    <h4 style="margin-top: 20px;">Appointment Details:</h4>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Booking ID:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">#{{ $variables.bookingId }}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Date:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">{{ $json.booking_date }}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Time:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">{{ $json.booking_time }}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Service:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">{{ $json.service_type }}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Format:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">{{ $json.format }}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Therapist:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">{{ $json.therapist }}</td>
      </tr>
    </table>
    
    <p style="margin-top: 20px;"><strong>Notes:</strong> {{ $json.notes }}</p>
  </div>
</div>
```

### Step 6: Save and Activate
1. Click **Save** (top right)
2. Click **Activate** toggle (top left)
3. Copy the webhook URL from the Webhook node
4. This URL goes in your server `.env` file as `N8N_WEBHOOK_URL`

---

## Part 3: Connect to Your Backend (2 minutes)

### Update Your Server .env
Edit `.env` file:

```env
# n8n Brevo Webhook
N8N_WEBHOOK_URL=https://gengomez13.app.n8n.cloud/webhook/YOUR-WEBHOOK-ID-FROM-STEP-6
```

Replace `YOUR-WEBHOOK-ID-FROM-STEP-6` with the actual ID from your n8n webhook.

**Your server is already configured to send to this webhook!** It happens automatically when bookings are created.

---

## Part 4: Test the Complete Flow

### Test 1: Submit Test Booking
```bash
cd C:\Users\Gen\OneDrive\Desktop\Automation
node test-booking.js
```

### Test 2: Check n8n Logs
1. Open your n8n workflow
2. Click **Executions** (left sidebar)
3. You should see a successful execution with:
   - ✅ Webhook received
   - ✅ Client email sent
   - ✅ Admin email sent

### Test 3: Check Your Inbox
- Look for confirmation email from `hello@gensetgotours.com`
- Subject: "Your Booking Confirmation - Reyes Collaborative Counseling"
- Check admin email at `admin@reyescollaborativecounseling.com`

---

## Brevo Free Plan Features

✅ **300 emails per day** (enough for bookings)
✅ **Unlimited contacts**
✅ **SMTP & API access**
✅ **Email templates**
✅ **Tracking & reporting**
✅ **No credit card required**

---

## Troubleshooting

### Issue: Sender email not verified
**Solution:** Go to Brevo → Senders → verify the email address. Check your inbox for verification link.

### Issue: n8n says "Invalid API Key"
**Solution:** 
1. Go to Brevo → Settings → SMTP & API
2. Scroll to **API Keys** section
3. Generate a new API key if needed
4. Update the Brevo credential in n8n

### Issue: Emails not sending
1. Check n8n execution logs for errors
2. Verify sender email is verified in Brevo
3. Make sure to use port 587 for SMTP

### Issue: Webhook not receiving data
1. Check that server is running: `npm start`
2. Verify webhook URL in .env matches n8n
3. Run: `node test-booking.js` to test

---

## Next Steps

1. ✅ Create Brevo account
2. ✅ Get SMTP credentials
3. ✅ Build n8n workflow
4. ✅ Verify sender email in Brevo
5. ✅ Test with `node test-booking.js`
6. ✅ Go live! (bookings will auto-send emails)

**Your booking system will be fully automated!** 🚀
