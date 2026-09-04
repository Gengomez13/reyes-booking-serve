const nodemailer = require("nodemailer");

async function testEmail() {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "gengomez.hrassistant@gmail.com",
                pass: "outreach30RCC"
            }
        });

        const mailOptions = {
            from: "gengomez.hrassistant@gmail.com",
            to: "gengomez.hrassistant@gmail.com",
            cc: "chitamuskul@gmail.com",
            subject: "Test Email - Reyes Counseling",
            html: "<h2>Test Email</h2><p>If you received this, email is working!</p>"
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent:", info.response);
    } catch (error) {
        console.error("❌ Email error:", error.message);
    }
}

testEmail();
