const axios = require('axios');

const testBooking = {
    client_name: 'Test User',
    client_email: 'test@example.com',
    client_phone: '713-555-0123',
    service_type: 'Individual Therapy',
    booking_date: '2026-09-10',
    booking_time: '14:00',
    therapist: 'Sarah Martinez',
    format: 'In-Person',
    notes: 'This is a test booking to verify n8n webhook integration'
};

async function submitTestBooking() {
    try {
        console.log('\n═══════════════════════════════════════════════════════════════');
        console.log('📝 SUBMITTING TEST BOOKING TO LOCALHOST:3000');
        console.log('═══════════════════════════════════════════════════════════════\n');
        
        console.log('📤 Request Data:');
        console.log(JSON.stringify(testBooking, null, 2));
        console.log('\n');

        const response = await axios.post('http://localhost:3000/api/bookings/create', testBooking, {
            timeout: 15000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('\n═══════════════════════════════════════════════════════════════');
        console.log('✅ BOOKING SUBMISSION SUCCESSFUL');
        console.log('═══════════════════════════════════════════════════════════════\n');
        
        console.log('Response Status:', response.status);
        console.log('Response Data:');
        console.log(JSON.stringify(response.data, null, 2));
        
    } catch (error) {
        console.log('\n═══════════════════════════════════════════════════════════════');
        console.log('❌ BOOKING SUBMISSION FAILED');
        console.log('═══════════════════════════════════════════════════════════════\n');
        
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Response:', error.response.data);
        } else if (error.request) {
            console.error('No response received:', error.message);
        } else {
            console.error('Error:', error.message);
        }
    }
    
    // Keep process alive for 5 seconds to capture async logs
    console.log('\n⏳ Waiting 5 seconds for server logs...\n');
    await new Promise(resolve => setTimeout(resolve, 5000));
    process.exit(0);
}

submitTestBooking();
