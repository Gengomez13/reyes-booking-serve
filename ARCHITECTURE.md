# 🏗️ System Architecture & Data Flow

## System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                    REYES COLLABORATIVE COUNSELING               │
│                    Booking System Architecture                  │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Landing Page (index.html)                                       │
│  ├─ Services Overview                                            │
│  ├─ Treatment Conditions                                         │
│  ├─ Meet Our Therapists                                          │
│  └─ Booking Options ─────────┐                                  │
│                              │                                   │
│  Calendar Booking (calendar-booking.html)                        │
│  ├─ FullCalendar Integration                                     │
│  ├─ Time Slot Selection                                          │
│  ├─ Client Info Form                                             │
│  └─ Confirmation Message ────────┐                              │
│                                  │                               │
│  Admin Login (admin-login.html)                                  │
│  └─ Secure Authentication ───────┐                              │
│                                  │                               │
│  Admin Dashboard (admin-dashboard.html)                          │
│  ├─ Calendar View                                                │
│  ├─ Bookings Table                                               │
│  ├─ Date Blocking                                                │
│  └─ Statistics ──────────────────┐                              │
│                                  │                               │
└──────────────────────────────────┼──────────────────────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
┌───────────────────▼──────────────▼──────────────▼────────────────┐
│                         API LAYER (Express.js)                   │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─ PUBLIC ENDPOINTS ─────────────────────────────────────┐   │
│  │ POST  /api/auth/login              [Authenticate]      │   │
│  │ POST  /api/auth/register           [Create Account]    │   │
│  │ GET   /api/bookings/available-slots [Check Times]      │   │
│  │ POST  /api/bookings/create         [Book Session]      │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─ ADMIN ENDPOINTS (Auth Required) ──────────────────────┐   │
│  │ GET   /api/admin/bookings          [View All]          │   │
│  │ POST  /api/admin/block-date        [Block Date]        │   │
│  │ DELETE /api/admin/block-date/:date [Unblock Date]      │   │
│  │ GET   /api/admin/blocked-dates     [View Blocked]      │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─ MIDDLEWARE ───────────────────────────────────────────┐   │
│  │ ✓ JWT Token Verification                               │   │
│  │ ✓ Role-Based Access Control (Admin/Client)             │   │
│  │ ✓ Input Validation                                     │   │
│  │ ✓ Error Handling                                       │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────┬──────────────────────────────────────────────┘
                  │
        ┌─────────┼─────────┬────────────────┬────────────────┐
        │         │         │                │                │
┌───────▼──┐ ┌───▼──────┐ ┌▼─────────┐ ┌───▼──────┐ ┌──────▼──┐
│ Database │ │   Auth   │ │ Calendar │ │  Email   │ │   GHL   │
│  Layer   │ │  Module  │ │  Module  │ │  Module  │ │  Legacy │
└──────────┘ └──────────┘ └──────────┘ └──────────┘ └─────────┘
```

---

## Data Flow Diagram

### Booking Creation Flow
```
CLIENT SUBMITS BOOKING REQUEST
         │
         ▼
┌─────────────────────────┐
│ API: /bookings/create   │
├─────────────────────────┤
│ 1. Validate Data        │
│ 2. Check Availability   │
│ 3. Create User (if new) │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ Database: Insert Booking│
├─────────────────────────┤
│ - Store booking details │
│ - Set status = confirmed│
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ Google Calendar Module  │
├─────────────────────────┤
│ 1. Create Event         │
│ 2. Generate Meet Link   │
│ 3. Add Attendees        │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ Email Module            │
├─────────────────────────┤
│ 1. Send Client Confirm  │
│ 2. Send Admin Alert     │
│ 3. Include Meet Link    │
└──────────┬──────────────┘
           │
           ▼
       CLIENT RECEIVES
     CONFIRMATION EMAIL
     + GOOGLE MEET LINK
```

### Admin Date Blocking Flow
```
ADMIN SUBMITS BLOCK REQUEST
         │
         ▼
┌─────────────────────────┐
│ Verify Admin Auth       │
│ ✓ JWT Token Valid?      │
│ ✓ Admin Role?           │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ API: /admin/block-date  │
├─────────────────────────┤
│ Validate date format    │
│ Check date in future    │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ Database: Insert        │
│ blocked_dates Table     │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ Update Calendar View    │
│ Refresh Client Slots    │
│ (Exclude blocked date)  │
└──────────┬──────────────┘
           │
           ▼
     ADMIN DASHBOARD
     UPDATED WITH
     BLOCKED DATE
```

---

## Authentication Flow

```
┌─────────────────────────────────────────┐
│  User Enters Credentials                │
│  (email, password)                      │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  POST /api/auth/login                   │
│  1. Query users table by email          │
│  2. Compare password with hash          │
│     (bcryptjs.compareSync)              │
└────────────┬────────────────────────────┘
             │
      ┌──────┴──────┐
      │             │
   ✓ Match      ✗ No Match
      │             │
      ▼             ▼
  ┌────────┐   ┌─────────────┐
  │ Generate│   │Return Error │
  │ JWT Token   │ 401 Unauth  │
  └───┬────┘   └─────────────┘
      │
      ▼
┌─────────────────────────────────────────┐
│  JWT Token Created                      │
│  ├─ user.id                             │
│  ├─ user.email                          │
│  ├─ user.role (admin/client)            │
│  ├─ expiresIn: 7d                       │
│  └─ signed with JWT_SECRET              │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Return Token to Client                 │
│  ├─ Store in localStorage               │
│  ├─ Send in Authorization Header        │
│  └─ Redirect to Dashboard               │
└─────────────────────────────────────────┘

SUBSEQUENT REQUESTS:
│
├─ Header: "Authorization: Bearer <TOKEN>"
│
▼
┌─────────────────────────────────────────┐
│  authMiddleware                         │
│  ├─ Extract token from header           │
│  ├─ Verify JWT signature                │
│  ├─ Check expiration                    │
│  └─ Attach user to req.user             │
└────────────┬────────────────────────────┘
             │
      ┌──────┴──────┐
      │             │
   ✓ Valid    ✗ Invalid/Expired
      │             │
      ▼             ▼
   PROCEED      RETURN 401
   WITH REQUEST
```

---

## Database Schema Relationships

```
┌──────────────┐
│   USERS      │
├──────────────┤
│ id (PK)      │◄─────────┐
│ email        │          │
│ password_hash│          │
│ name         │          │
│ role         │          │  ┌──────────────────┐
│ created_at   │          └──┤   BOOKINGS       │
└──────────────┘             ├──────────────────┤
                             │ id (PK)          │
                             │ client_id (FK)   │
                             │ client_name      │
                             │ client_email     │
                             │ client_phone     │
                             │ service_type     │
                             │ booking_date     │
                             │ booking_time     │
                             │ format           │
                             │ therapist        │
                             │ status           │
                             │ google_meet_link │
                             │ calendar_event_id│
                             │ notes            │
                             │ created_at       │
                             └──────────────────┘

┌──────────────────┐      ┌──────────────────┐
│ BLOCKED_DATES    │      │   THERAPISTS     │
├──────────────────┤      ├──────────────────┤
│ id (PK)          │      │ id (PK)          │
│ blocked_date     │      │ name             │
│ reason           │      │ email            │
│ blocked_by (FK)  │◄─────│ specializations  │
│ created_at       │      │ availability_*   │
└──────────────────┘      │ working_days     │
                          │ created_at       │
                          └──────────────────┘
```

---

## Security & Authentication

```
┌────────────────────────────────────────┐
│     PASSWORD SECURITY                  │
├────────────────────────────────────────┤
│                                        │
│  User Password Input                   │
│       │                                │
│       ▼                                │
│  bcryptjs.hashSync(password, 10)       │
│  (Salt rounds: 10 - 2^10 iterations)   │
│       │                                │
│       ▼                                │
│  Hashed Password Stored in DB          │
│  (Never store plain passwords!)        │
│                                        │
│  On Login:                             │
│  bcryptjs.compareSync(input, hash)     │
│  ✓ Always returns true or false        │
│  ✓ One-way function                    │
│  ✓ Brute-force resistant               │
│                                        │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│     JWT TOKEN SECURITY                 │
├────────────────────────────────────────┤
│                                        │
│  Payload:                              │
│  {                                     │
│    id: 1,                              │
│    email: "admin@...",                 │
│    role: "admin",                      │
│    iat: 1234567890,                    │
│    exp: 1234654290 (7 days)            │
│  }                                     │
│                                        │
│  Signed with: JWT_SECRET               │
│  Algorithm: HS256                      │
│                                        │
│  Verification:                         │
│  ✓ Signature valid?                    │
│  ✓ Token expired?                      │
│  ✓ Claims present?                     │
│                                        │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│     ROLE-BASED ACCESS CONTROL          │
├────────────────────────────────────────┤
│                                        │
│  adminMiddleware:                      │
│  1. Verify JWT token                   │
│  2. Check req.user.role === 'admin'    │
│  3. Allow or deny access               │
│                                        │
│  Endpoints Protected:                  │
│  • /api/admin/* (all admin routes)     │
│  • /admin-dashboard.html               │
│  • /api/auth/register (for admins)     │
│                                        │
└────────────────────────────────────────┘
```

---

## Email Integration Flow

```
BOOKING CREATED
       │
       ▼
┌─────────────────────────────────────┐
│  Nodemailer Configuration           │
├─────────────────────────────────────┤
│  Service: Gmail                     │
│  Auth: App Password (2FA enabled)   │
│  From: noreply@reyes...             │
└────────────┬────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌─────────────┐ ┌──────────────────┐
│ CLIENT EMAIL│ │  ADMIN EMAIL     │
├─────────────┤ ├──────────────────┤
│             │ │                  │
│To:          │ │To: admin@reyes...│
│client@...   │ │CC: daymar@reyes..│
│             │ │                  │
│Subject:     │ │Subject: New      │
│"Booking     │ │Booking: [Name]   │
│Confirmed"   │ │                  │
│             │ │Content:          │
│Content:     │ │- Client Details  │
│- Session    │ │- Booking Details │
│  Details    │ │- Dashboard Link  │
│- Google     │ │- Action Items    │
│  Meet Link  │ │                  │
│- Join       │ │Status: [Pending] │
│  Instruc.   │ │                  │
│- Contact    │ │                  │
│  Info       │ │                  │
│             │ │                  │
└─────────────┘ └──────────────────┘
```

---

## Google Calendar Integration

```
BOOKING CONFIRMED
       │
       ▼
┌─────────────────────────────────────┐
│  Google Calendar Initialization     │
├─────────────────────────────────────┤
│  Service Account: credentials.json  │
│  Scopes: Calendar API               │
│  Auth Type: OAuth2 (SA)             │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  Create Calendar Event              │
├─────────────────────────────────────┤
│  Summary: "Therapy Session - [Name]"│
│  Start: booking_date + booking_time │
│  End: start + 45 minutes            │
│  Attendees:                         │
│    • client@email.com               │
│    • therapist@email.com            │
│  Description: Session details       │
│  TimeZone: America/Chicago          │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  Generate Google Meet Link          │
├─────────────────────────────────────┤
│  Conference Type: hangoutsMeet      │
│  RequestId: meeting-[timestamp]     │
│  API Version: v3                    │
│  conferenceDataVersion: 1           │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  Response                           │
├─────────────────────────────────────┤
│  eventId: cal-event-uuid            │
│  meetLink: meet.google.com/xxx      │
│  htmlLink: calendar.google.com/...  │
│  Status: inserted                   │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  Update Database                    │
├─────────────────────────────────────┤
│  bookings.google_meet_link = meetLink
│  bookings.calendar_event_id = eventId
└─────────────────────────────────────┘
```

---

## Deployment Architecture

```
PRODUCTION ENVIRONMENT
┌───────────────────────────────────────────┐
│                                           │
│  ┌─ Load Balancer / Reverse Proxy ──┐   │
│  │ (nginx or similar)                 │   │
│  │ ├─ HTTPS/SSL Termination           │   │
│  │ ├─ Static File Serving             │   │
│  │ └─ Request Routing                 │   │
│  └───────────┬─────────────────────────┘   │
│              │                             │
│         ┌────┴────┐                        │
│         │          │                       │
│    ┌────▼──┐  ┌───▼────┐                  │
│    │Node.js│  │Node.js  │                 │
│    │Cluster │  │Cluster │ (Horizontal    │
│    │Instance│  │Instance │ Scaling)       │
│    └────┬──┘  └───┬────┘                  │
│         │         │                       │
│    ┌────▼─────────▼────┐                  │
│    │  SQLite Database  │                  │
│    │ (or PostgreSQL)   │                  │
│    │ bookings.db       │                  │
│    └───────────────────┘                  │
│                                           │
│  ┌─ External Services ─────────────┐    │
│  │ ├─ Gmail (Email)                 │    │
│  │ ├─ Google Calendar API           │    │
│  │ ├─ GoHighLevel API               │    │
│  │ └─ (Optional) CDN (static files) │    │
│  └─────────────────────────────────┘    │
│                                           │
└───────────────────────────────────────────┘
```

---

## File Organization

```
C:\Users\Gen\OneDrive\Desktop\Automation\
│
├─ public/                           # Client-facing files
│  ├─ index.html                     # Landing page
│  ├─ calendar-booking.html          # Booking calendar
│  ├─ admin-login.html               # Admin login
│  ├─ admin-dashboard.html           # Admin control panel
│  ├─ *.png                          # Service images
│  └─ (CSS embedded in HTML)
│
├─ database.js                       # SQLite initialization
├─ auth.js                           # Authentication logic
├─ calendar.js                       # Google & Email
├─ server.js                         # Express server & routes
├─ setup.js                          # Setup wizard
│
├─ .env                              # Environment secrets
├─ bookings.db                       # SQLite database (auto-created)
├─ google-credentials.json           # Google OAuth (optional)
│
├─ package.json                      # Dependencies
├─ package-lock.json
│
├─ QUICK_START.md                    # Quick start guide
├─ BOOKING_SYSTEM_SETUP.md           # Detailed setup
├─ IMPLEMENTATION_SUMMARY.md         # This document
└─ README.md                         # Project overview
```

---

## Key Metrics

```
┌─────────────────────────────────────────┐
│  PERFORMANCE TARGETS                    │
├─────────────────────────────────────────┤
│                                         │
│  Response Times:                        │
│  • API endpoints: < 100ms               │
│  • Page load: < 2s                      │
│  • Calendar render: < 500ms             │
│                                         │
│  Capacity:                              │
│  • Concurrent users: 100+               │
│  • Bookings per day: 50+                │
│  • Database size: ~1MB per 1000 bookings│
│                                         │
│  Availability:                          │
│  • Server uptime: 99.9%                 │
│  • Email delivery: 99%+                 │
│  • Calendar sync: 99%+                  │
│                                         │
└─────────────────────────────────────────┘
```

---

**Architecture Document Complete** ✅
All components documented and ready for reference.
