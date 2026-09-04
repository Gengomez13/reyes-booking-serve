# 🔐 Admin Login Credentials Setup

**Status:** ✅ No default credentials (secure by design)

---

## 📝 How to Create Admin Account

### Step 1: Run the Setup Script
```bash
node setup.js
```

### Step 2: Follow the Prompts

The script will ask you:
```
🚀 Reyes Collaborative Counseling - Booking System Setup

Would you like to create an admin account now? (yes/no): yes

Admin Email: [Enter your email]
Admin Name: [Enter your name]
Admin Password (min 8 chars): [Enter strong password]
```

### Step 3: Create Your Credentials

**Example:**
```
Admin Email: admin@reyescollaborativecounseling.com
Admin Name: Admin User
Admin Password: YourSecurePassword123!
```

### Step 4: Success!
```
✅ Admin account created successfully!
Email: admin@reyescollaborativecounseling.com
Name: Admin User
Role: admin

🔐 You can now login at: http://localhost:3000/admin-login.html
```

---

## 🔑 Login Page

**URL:** http://localhost:3000/admin-login.html

**Credentials to enter:**
- Email: `admin@reyescollaborativecounseling.com`
- Password: `YourSecurePassword123!`

---

## ✅ What You Need to Do

### Quick Start (5 minutes)

1. **Open Terminal** and navigate to project folder:
   ```bash
   cd C:\Users\Gen\OneDrive\Desktop\Automation
   ```

2. **Run setup script:**
   ```bash
   node setup.js
   ```

3. **Answer the prompts:**
   - Say "yes" to create admin account
   - Enter your email
   - Enter your name
   - Enter a strong password (min 8 characters)

4. **Wait for confirmation:**
   ```
   ✅ Admin account created successfully!
   ```

5. **Login to admin dashboard:**
   - Go to: http://localhost:3000/admin-login.html
   - Use your email and password
   - You'll see the admin dashboard

---

## 💡 Tips for Strong Password

### Good Password Examples:
```
✅ Admin@123Therapy
✅ Houston$Counseling2024
✅ Reyes*Booking#Secure
✅ TherapyAdmin$2024
```

### Requirements:
- Minimum 8 characters
- Mix of uppercase, lowercase, numbers, symbols recommended
- Avoid using easily guessable words

---

## 🎯 Admin Dashboard Features (After Login)

Once logged in, you can:

1. **View All Bookings**
   - See client name, email, phone
   - See booking date and time
   - See service type and format
   - View booking status

2. **Block/Unblock Dates**
   - Click a date to block it
   - No clients can book blocked dates
   - Add reason for blocking

3. **View Statistics**
   - Total bookings
   - Bookings this month
   - Blocked dates count

4. **Real-time Updates**
   - Dashboard refreshes every 30 seconds
   - Always see latest bookings
   - Auto-updates blocked dates

---

## 🔄 Can I Change Admin Password?

**Currently:** Not built-in

To reset password if forgotten:
1. Delete `bookings.db` file
2. Run `node setup.js` again
3. Create new admin account

---

## 🚨 Security Notes

✅ **Password Security:**
- Passwords are hashed with bcryptjs (10 salt rounds)
- Never stored in plain text
- Even we cannot see your password

✅ **Session Security:**
- JWT tokens expire after 7 days
- Must login again after expiration
- Logout clears session

✅ **Admin Access:**
- Only admins can access admin dashboard
- Regular users cannot see admin features
- All requests validated server-side

---

## 📋 First-Time Setup Checklist

- [ ] 1. Open Terminal
- [ ] 2. Navigate to project folder
- [ ] 3. Run `node setup.js`
- [ ] 4. Choose "yes" to create admin account
- [ ] 5. Enter email (e.g., admin@reyescollaborativecounseling.com)
- [ ] 6. Enter name (e.g., Admin User)
- [ ] 7. Enter strong password (min 8 chars)
- [ ] 8. See success confirmation
- [ ] 9. Go to http://localhost:3000/admin-login.html
- [ ] 10. Login with your email and password
- [ ] 11. You're in the admin dashboard!

---

## ✨ What Happens Next?

After you create admin account and login:

### Admin Dashboard Features:
- 📅 View all bookings
- 📍 Block/unblock dates
- 📊 See statistics
- 🔄 Auto-refreshing (every 30 seconds)
- 📧 Send notifications
- 🗑️ Cancel bookings (if implemented)

### Client Experience:
- 📅 Can see all available dates
- ❌ Cannot book blocked dates
- ✅ Can select available times
- 📧 Get confirmation email with Google Meet link
- 📱 Mobile-friendly booking

---

## 🆘 Troubleshooting

### "Error: Command not found"
- Make sure Node.js is installed
- Run `node --version` to check
- Run setup.js from project root folder

### "Password must be at least 8 characters"
- Enter a longer password
- Example: `MyAdminPass123!`

### "Error creating admin account"
- Check if database file exists
- Check if .env file exists
- Run `npm install` first
- Check console for error details

### "Cannot login after creating account"
- Make sure server is running (`npm start`)
- Try refreshing the page
- Clear browser cache
- Use correct email and password

---

## 📚 Related Documentation

- **BOOKING_SYSTEM_SETUP.md** - Complete configuration guide
- **QUICK_START.md** - Fast setup guide
- **IMPLEMENTATION_SUMMARY.md** - Feature overview
- **ARCHITECTURE.md** - System design

---

## 🎯 Summary

**No default admin credentials exist** for security.

**To create admin account:**
1. Run: `node setup.js`
2. Say "yes" to create admin
3. Enter your email, name, password
4. Login at: http://localhost:3000/admin-login.html

**Your credentials:**
```
Email: [Your email]
Password: [Your password]
```

---

**Status:** ✅ **READY TO SET UP**

Follow the steps above to create your admin account.
