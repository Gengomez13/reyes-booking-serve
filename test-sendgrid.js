const sgMail = require("@sendgrid/mail");

async function testSendGrid() {
    try {
        sgMail.setApiKey("SG.FZBU46L7N14CPVQ9PVFLD1T6");
        
        const msg = {
            to: "gengomez.hrassistant@gmail.com",
            from: "admin@reyescollaborativecounseling.com",
            cc: "chitamuskul@gmail.com",
            subject: "Test Email from SendGrid",
            html: "<h2>Test</h2><p>If you see this, SendGrid is working!</p>"
        };

        const result = await sgMail.send(msg);
        console.log("✅ Email sent successfully");
        console.log("Response:", result[0].statusCode);
    } catch (error) {
        console.error("❌ SendGrid Error:", error.message);
    }
}

testSendGrid();
