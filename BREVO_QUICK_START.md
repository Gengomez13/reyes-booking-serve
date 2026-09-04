# Brevo + n8n Quick Reference Card

## 🚀 Quick Start (15 minutes)

### 1. Brevo Setup
```
✓ Sign up: https://www.brevo.com/
✓ Email: hello@gensetgotours.com
✓ Verify email in inbox
✓ Get SMTP credentials from Settings → SMTP & API
✓ Verify sender: hello@gensetgotours.com
```

**SMTP Details (for reference):**
- Host: `smtp-relay.brevo.com`
- Port: `587`
- Username: Your Brevo email
- Password: From SMTP settings

---

### 2. n8n Workflow
```
Step 1: Create new workflow called "Booking Confirmation - Brevo"
Step 2: Add Webhook trigger (POST) → Copy webhook URL
Step 3: Add Set Variables node with: bookingId, clientEmail, clientName
Step 4: Add Brevo Email node → Send to CLIENT
Step 5: Add Brevo Email node → Send to ADMIN
Step 6: Save & Activate workflow
Step 7: Copy webhook URL into .env as N8N_WEBHOOK_URL
```

---

### 3. Test It
```powershell
cd C:\Users\Gen\OneDrive\Desktop\Automation
node test-booking.js
```

---

## 📧 Email Template Quick Copy

### Client Email Subject:
```
Your Booking Confirmation - Reyes Collaborative Counseling
```

### Admin Email Subject:
```
NEW BOOKING: {{ $variables.clientName }} - {{ $json.booking_date }}
```

---

## ✅ Free Plan Limits
- **300 emails/day** (9,000/month)
- **Unlimited contacts**
- **No credit card needed**

---

## 🔗 Webhook Flow

```
User submits booking
    ↓
Your server receives: /api/bookings/create
    ↓
Server saves to database
    ↓
Server sends to n8n webhook: 
   POST https://gengomez13.app.n8n.cloud/webhook/YOUR-ID
    ↓
n8n receives booking data
    ↓
Brevo sends 2 emails:
   1) Confirmation to client
   2) Notification to admin
```

---

## 🐛 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Sender not verified" | Go to Brevo → Senders → verify email |
| "Invalid API Key" | Get new API key from Brevo → Settings → SMTP & API |
| "Emails not sending" | Check n8n execution logs, verify sender in Brevo |
| "Webhook not receiving" | Ensure server running: `npm start` |

---

## 📌 Important: Update Your .env File

After getting webhook URL from n8n, update:

```env
N8N_WEBHOOK_URL=https://gengomez13.app.n8n.cloud/webhook/[YOUR-WEBHOOK-ID]
```

Then restart server:
```powershell
npm start
```

---

## 🎯 Success Checklist

- [ ] Brevo account created
- [ ] Sender email verified (hello@gensetgotours.com)
- [ ] n8n workflow created & activated
- [ ] Webhook URL copied to .env
- [ ] Server restarted
- [ ] Test booking submitted
- [ ] Confirmation email received
- [ ] Admin email received

**Once all checked: Your system is LIVE!** 🎉

---

## More Information

See **BREVO_N8N_SETUP.md** for complete detailed guide with screenshots steps.
