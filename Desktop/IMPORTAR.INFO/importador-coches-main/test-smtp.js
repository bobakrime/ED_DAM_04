require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');
const dns = require('dns');

if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

async function test() {
    console.log("📧 Testing SMTP (Final Fix)...");

    // Explicitly clean password
    const pass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/"/g, '').trim() : '';

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: pass,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.ADMIN_EMAIL,
            subject: "Test Email (Final Check)",
            text: "It works with DNS + TLS fix!",
        });
        console.log("✅ Success! Message ID:", info.messageId);
    } catch (error) {
        console.error("❌ Error:", error);
    }
}

test();
