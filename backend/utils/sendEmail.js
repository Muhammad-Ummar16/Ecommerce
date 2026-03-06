import nodemailer from 'nodemailer';
import Settings from '../models/settings.js';

const sendEmail = async (options) => {
    try {
        const settings = await Settings.findOne();
        const siteName = settings?.siteName || 'MZ Wear';
        const deliveryDays = settings?.orderDeliveryDays || '5';

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_PORT == 465, // true for 465, false for others
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"${siteName}" <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: `Order Confirmation - ${options.orderId}`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 24px; color: #3D3028;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="font-size: 28px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin: 0;">${siteName}</h1>
                        <p style="font-size: 12px; font-weight: 700; color: #A88B7A; text-transform: uppercase; letter-spacing: 3px; margin-top: 5px;">Premium Collection</p>
                    </div>
                    
                    <div style="background-color: #FAF7F5; padding: 30px; border-radius: 20px; margin-bottom: 30px; text-align: center;">
                        <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 10px;">ORDER CONFIRMED!</h2>
                        <p style="font-size: 15px; font-weight: 500; color: #666; line-height: 1.6; margin: 0;">
                            Hi <strong>${options.userName}</strong>, thank you for shopping with us! Your order has been placed successfully. 
                            You will receive your order within <strong>${deliveryDays} working days</strong>.
                        </p>
                    </div>

                    <div style="border-top: 2px dashed #EBDDD5; padding-top: 30px; margin-bottom: 30px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                            <span style="font-size: 13px; font-weight: 700; color: #A88B7A; text-transform: uppercase;">Order Number</span>
                            <span style="font-size: 13px; font-weight: 800; color: #3D3028;">#${options.orderId}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-size: 13px; font-weight: 700; color: #A88B7A; text-transform: uppercase;">Total Amount</span>
                            <span style="font-size: 13px; font-weight: 800; color: #3D3028;">RS ${options.totalPrice.toLocaleString()}</span>
                        </div>
                    </div>

                    <div style="text-align: center; padding-top: 20px;">
                        <p style="font-size: 12px; font-weight: 500; color: #aaa;">
                            If you have any questions, please contact our support team.<br>
                            &copy; ${new Date().getFullYear()} ${siteName}. All rights reserved.
                        </p>
                    </div>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return { success: true };
    } catch (error) {
        console.error('Email sending failed:', error);
        return { success: false, error: error.message };
    }
};

export default sendEmail;
