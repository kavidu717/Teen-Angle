export const generateOtpEmailTemplate = (firstName: string, otp: string): string => {
  const currentYear = new Date().getFullYear();

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
      <div style="background-color: #ffffff; padding: 25px; text-align: center; border-bottom: 4px solid #FFC107;">
        <img src="https://res.cloudinary.com/doujmzgn3/image/upload/v1787933139/Screenshot_2026-08-28_213436_r58hge.png" alt="YouShop Logo" style="max-width: 180px; height: auto;" />
      </div>
      <div style="padding: 30px 40px; color: #333333;">
        <h2 style="color: #111827; margin-top: 0; font-size: 24px;">Hello ${firstName},</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
          Welcome to <strong>Teen Angle</strong>! We are thrilled to have you. Please use the following One-Time Password (OTP) to complete your registration and verify your account.
        </p>
        <div style="background-color: #FFFBEB; border: 2px dashed #F59E0B; padding: 25px; text-align: center; border-radius: 8px; margin: 35px 0;">
          <p style="font-size: 14px; color: #92400E; margin-top: 0; margin-bottom: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
          <h1 style="color: #111827; font-size: 42px; letter-spacing: 10px; margin: 0; font-family: 'Courier New', Courier, monospace;">${otp}</h1>
        </div>
        <p style="font-size: 15px; color: #ef4444; text-align: center; font-weight: 500;">
          &#8987; This code will expire in 10 minutes.
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #6b7280; margin-top: 35px;">
          If you didn't request this verification, you can safely ignore this email. Your account is secure.
        </p>
      </div>
      <div style="background-color: #f9fafb; padding: 25px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 13px; color: #9ca3af; margin: 0;">
          &copy; ${currentYear} YouShop. All rights reserved.
        </p>
        <p style="font-size: 12px; color: #d1d5db; margin: 8px 0 0 0;">
          This is an automated message, please do not reply to this email.
        </p>
      </div>
    </div>
  `;
};