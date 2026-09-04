# Sending the Google Meet Link Back to the Booking System

## Why the Admin Dashboard Showed "N/A" for Google Meet Link

Your n8n workflow creates the Google Calendar event (with the Meet link) directly in
Google/Brevo/your Sheet — but it never told **our booking server** what that link was.
The admin dashboard reads `google_meet_link` from our own database, and that column
was empty for every booking, so it correctly displayed "N/A".

## The Fix

The server now has a new endpoint your n8n workflow can call right after the
**"Create an event"** node runs, to save the Meet link back into our database:

```
POST http://YOUR_PUBLIC_SERVER_URL/api/bookings/:id/meet-link
Content-Type: application/json

{
  "google_meet_link": "https://meet.google.com/xxx-xxxx-xxx",
  "calendar_event_id": "abc123..."
}
```

- `:id` = the `bookingId` field from the original webhook payload (already flowing
  through your workflow).
- This endpoint is public (no auth) since it's called server-to-server from n8n, but
  it only updates a booking if the ID exists.

## How to Add This to Your Existing n8n Workflow

Looking at your workflow screenshot (Webhook → Code in JavaScript → Create an event →
HTTP Request nodes for Brevo emails + Append row in sheet):

1. After the **"Create an event"** node (Google Calendar), add one more **HTTP Request** node.
2. Configure it:
   - **Method:** POST
   - **URL:** `https://YOUR_SERVER_URL/api/bookings/{{ $('Webhook').item.json.body.bookingId }}/meet-link`
     (adjust the expression to match wherever `bookingId` lives in your webhook payload —
     check the "Code in JavaScript" node's output to confirm the exact path)
   - **Body (JSON):**
     ```json
     {
       "google_meet_link": "{{ $json.hangoutLink }}",
       "calendar_event_id": "{{ $json.id }}"
     }
     ```
     (`hangoutLink` and `id` are the standard fields Google Calendar's "Create an event"
     node returns — check your node's output panel to confirm exact field names.)
3. Connect it: **Create an event → (new node) → your existing Brevo/Sheet branches**
   (or run it in parallel, doesn't matter — it just needs to fire after the event is created).
4. Save & test — resubmit a test booking and check:
   - n8n execution log shows the new HTTP Request succeeded (status 200)
   - Server terminal logs: `✅ Meet link saved for booking <id>: <link>`
   - Admin dashboard now shows a clickable **"Join Meeting"** link for that booking

## If You're Using localtunnel / Public URL

Use whatever public URL currently points at your server (e.g. the localtunnel URL) as
`YOUR_SERVER_URL` above — same one your booking form/admin dashboard use.

## Verified Working

This was tested end-to-end on this server:
1. Created a booking → got `bookingId`
2. Called `/api/bookings/:id/meet-link` with a sample Meet link
3. Confirmed via `/api/admin/bookings` that `google_meet_link` was saved and returned correctly

Once you add the HTTP Request node in n8n as described above, this will happen
automatically for every real booking.
