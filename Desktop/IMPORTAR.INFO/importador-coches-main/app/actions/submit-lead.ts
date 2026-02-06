'use server';

import nodemailer from 'nodemailer';
import dns from 'dns';

// Force IPv4 if available
if (dns && dns.setDefaultResultOrder) {
    try {
        dns.setDefaultResultOrder('ipv4first');
    } catch (e) {
        // Ignore if not available
    }
}

interface LeadData {
    name: string;
    email: string;
    phone: string;
    carUrl?: string;
    budget?: string;
    message?: string;
    contactPreference?: string;
}

export async function submitLead(data: LeadData) {
    console.log("📨 Submitting lead...", data);

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/"/g, '').trim() : '';
    const adminEmail = process.env.ADMIN_EMAIL || smtpUser;

    // Validate credentials
    if (!smtpUser || !smtpPass) {
        console.error("❌ SMTP credentials missing in .env");
        return { success: false, error: "Server configuration error (SMTP missing)." };
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: `"Importar.info Bot" <${smtpUser}>`,
            to: adminEmail,
            subject: `🚀 Nuevo Lead: ${data.name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #2563EB;">¡Nueva Solicitud de Información! 🚗</h2>
                    <p style="color: #555;">Has recibido un nuevo contacto desde la web.</p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 30%;">Nombre:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${data.email}">${data.email}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Teléfono:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="tel:${data.phone}">${data.phone}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Preferencia:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.contactPreference}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Presupuesto:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.budget || 'No especificado'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">URL Coche:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">
                                ${data.carUrl ? `<a href="${data.carUrl}" style="color: #2563EB; text-decoration: none; word-break: break-all;">Ver Coche</a>` : 'N/A'}
                            </td>
                        </tr>
                    </table>

                    <div style="background-color: #f9f9f9; padding: 15px; margin-top: 20px; border-radius: 8px;">
                        <p style="margin: 0; font-weight: bold; color: #555;">Mensaje:</p>
                        <p style="margin-top: 5px; color: #333; white-space: pre-wrap;">${data.message || 'Sin mensaje adicional.'}</p>
                    </div>

                    <p style="margin-top: 30px; font-size: 12px; color: #999; text-align: center;">
                        Enviado automáticamente desde Importar.info
                    </p>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent:", info.messageId);

        return { success: true };

    } catch (error: any) {
        console.error("❌ Error sending email:", error);
        return { success: false, error: "Failed to send email." };
    }
}
