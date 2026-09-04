# 🔑 ADMIN LOGIN - CREDENTIALS SETUP GUIDE

## ⚠️ Important: No Default Credentials

**There are NO pre-set admin login credentials.**

For security, you must create your own admin account using the setup script.

---

## 🚀 Quick Start (3 Steps)

### Step 1: Run Setup Script
```bash
cd C:\Users\Gen\OneDrive\Desktop\Automation
node setup.js
```

### Step 2: Follow Prompts
```
Would you like to create an admin account now? (yes/no): yes

Admin Email: admin@reyescollaborativecounseling.com
Admin Name: Admin
Admin Password (min 8 chars): YourSecurePass123!
```

### Step 3: Login
```
URL: http://localhost:3000/admin-login.html
Email: admin@reyescollaborativecounseling.com
Password: YourSecurePass123!
```

---

## 📋 Full Walkthrough

### Open Terminal
```powershell
# PowerShell or Command Prompt
cd C:\Users\Gen\OneDrive\Desktop\Automation
```

### Run Setup Script
```bash
node setup.js
```

### You'll See:
```
🚀 Reyes Collaborative Counseling - Booking System Setup

This script will help you set up the booking system.

✅ .env file found
✅ Dependencies installed

Would you like to create an admin account now? (yes/no):
```

### Type: `yes`

### Enter Admin Email
```
Admin Email: admin@reyescollaborativecounseling.com
```

### Enter Admin Name
```
Admin Name: Admin
```

### Enter Strong Password
```
Admin Password (min 8 chars): MyStrongPassword123!
```

### Success!
```
✅ Admin account created successfully!
Email: admin@reyescollaborativecounseling.com
Name: Admin
Role: admin

🔐 You can now login at: http://localhost:3000/admin-login.html
```

---

## 🔐 Login Credentials Template

Save these for your records:

```
Admin Dashboard URL: http://localhost:3000/admin-login.html

Email: ___________________________________
Password: ___________________________________
Name: ___________________________________
```

---

## 📌 Password Requirements

- **Minimum length:** 8 characters
- **Recommended:** Mix of:
  - Uppercase letters (A-Z)
  - Lowercase letters (a-z)
  - Numbers (0-9)
  - Symbols (!@#$%^&*)

### Strong Password Examples:
```
✅ Admin@Houston2024
✅ Therapy$Booking123
✅ Reyes#Counseling9
✅ LoginSecure$Pass8
```

### Weak Password Examples:
```
❌ password (too simple)
❌ 12345678 (only numbers)
❌ admin123 (too predictable)
❌ qwerty (keyboard pattern)
```

---

## 🔒 Security Features

### Password Storage
- ✅ Hashed with bcryptjs
- ✅ 10 salt rounds (industry standard)
- ✅ Never stored in plain text
- ✅ Cannot be recovered by us

### Session Management
- ✅ JWT tokens (JSON Web Tokens)
- ✅ Token expires after 7 days
- ✅ Must login again after expiration
- ✅ Logout clears session immediately

### Access Control
- ✅ Only admins see admin dashboard
- ✅ Clients cannot access admin features
- ✅ All requests validated server-side
- ✅ Database prevents unauthorized access

---

## 🎯 After Creating Admin Account

### Access Admin Dashboard
1. Go to: http://localhost:3000/admin-login.html
2. Enter your email
3. Enter your password
4. Click "Login"

### Admin Dashboard Features
- 📅 View all bookings
- 👥 See client information
- 🕐 View booking times
- 📍 Block/unblock dates
- 📊 View statistics
- 🔄 Auto-refresh every 30 seconds

### Available Actions
```
✅ View all bookings in real-time
✅ See client details (name, email, phone)
✅ Block specific dates (clients can't book)
✅ Unblock dates
✅ See booking statistics
✅ Monitor admin activity
```

---

## 🆘 Troubleshooting

### "node: command not found"
**Solution:** Install Node.js from https://nodejs.org

### "Cannot find module setup.js"
**Solution:** Make sure you're in the correct folder:
```bash
cd C:\Users\Gen\OneDrive\Desktop\Automation
```

### "Password must be at least 8 characters"
**Solution:** Enter a password with 8+ characters:
```
MyAdmin123 (✅ 9 characters)
```

### "Error creating admin account"
**Solution:** 
1. Make sure server is NOT running (close npm start)
2. Check if .env file exists
3. Run `npm install` first
4. Try again: `node setup.js`

### "Cannot login after creating account"
**Solution:**
1. Make sure server is running: `npm start`
2. Check email and password are correct
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try in incognito/private mode

### "Forgot my admin password"
**Solution:**
1. Delete `bookings.db` file (this deletes all data)
2. Run `node setup.js` again
3. Create new admin account with new password

---

## 📧 Email-Based Admin Accounts

### Recommended Setup:
```
Email: admin@reyescollaborativecounseling.com
Password: CompanyName$AdminPass2024
```

### Alternative Setup:
```
Email: daymar@reyescollaborativecounseling.com
Password: StrongPassword123!
```

### Multiple Admins (Future Feature):
```
Currently: One admin account
Future: Could add multiple admins
        (Not currently implemented)
```

---

## 🔄 Admin Account Management

### Current Capabilities:
- ✅ Create admin account (via setup.js)
- ✅ Login to admin dashboard
- ✅ Manage bookings
- ✅ Block/unblock dates
- ✅ View statistics

### Coming Soon:
- ⏳ Change password
- ⏳ Add more admin accounts
- ⏳ Admin user management
- ⏳ Audit logs
- ⏳ Multi-location support

---

## ✅ Checklist: Getting Started

- [ ] Node.js installed
- [ ] Server running (`npm start`)
- [ ] Navigate to project folder
- [ ] Run `node setup.js`
- [ ] Create admin account
- [ ] Login to dashboard
- [ ] Test blocking dates
- [ ] Test viewing bookings
- [ ] Familiarize with features

---

## 📞 Admin Login Page

### URL
```
http://localhost:3000/admin-login.html
```

### Form Fields
```
Email: [_____________________]
Password: [_____________________]

[Login Button]
```

### After Login
```
You'll see the Admin Dashboard with:
- Calendar view
- Bookings table
- Date blocking form
- Statistics panel
```

---

## 🎯 Next Steps

1. **Create admin account:**
   ```bash
   node setup.js
   ```

2. **Start server:**
   ```bash
   npm start
   ```

3. **Login to admin:**
   ```
   http://localhost:3000/admin-login.html
   ```

4. **Start managing bookings:**
   - View all bookings
   - Block/unblock dates
   - Monitor statistics

---

## 📚 Related Files

- **setup.js** - Script to create admin account
- **auth.js** - Authentication system
- **database.js** - Database with user table
- **public/admin-login.html** - Login page
- **public/admin-dashboard.html** - Dashboard page

---

## 🚀 Status

✅ Admin system is fully functional  
✅ Setup script ready to use  
✅ Security implemented  
✅ Waiting for you to create credentials  

**Next action:** Run `node setup.js` to create your admin account!

---

## 💡 Pro Tips

### Tip 1: Save Your Credentials
Write down your admin email and password somewhere safe.

### Tip 2: Strong Password
Use a mix of uppercase, lowercase, numbers, and symbols.

### Tip 3: Unique Email
Use your work email or company email for the admin account.

### Tip 4: Remember the URL
Bookmark: http://localhost:3000/admin-login.html

### Tip 5: Logout After Use
Click logout button in admin dashboard when done.

---

**Status:** ✅ **READY TO SET UP ADMIN CREDENTIALS**

Create your admin account now by running:
```bash
node setup.js
```
