export const generateOtpEmailTemplate = (firstName: string, otp: string): string => {
  const currentYear = new Date().getFullYear();

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
      <div style="background-color: #ffffff; padding: 25px; text-align: center; border-bottom: 4px solid #FFC107;">
        <img src="https://res.cloudinary.com/doujmzgn3/image/upload/v1788105918/ChatGPT_Image_Aug_30_2026_09_33_38_PM_iskos8.png" alt="YouShop Logo" style="max-width: 180px; height: auto;" />
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


export const generateResetPasswordEmailTemplate = (firstName: string, otp: string): string => {
  const currentYear = new Date().getFullYear();

  return `
    <div style="background-color: #f8f9fa; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
        
        <div style="text-align: center; padding: 35px 20px 25px 20px; border-bottom: 4px solid #F59E0B;">
          <img src="https://res.cloudinary.com/doujmzgn3/image/upload/v1788105918/ChatGPT_Image_Aug_30_2026_09_33_38_PM_iskos8.png" alt="Teen Angle" style="max-width: 160px; height: auto; display: block; margin: 0 auto;" />
        </div>
        
        <div style="padding: 40px 35px; color: #374151;">
          <h2 style="color: #111827; font-size: 24px; font-weight: 700; margin: 0 0 20px 0;">Hello ${firstName},</h2>
          
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 35px 0;">
            We received a request to reset your <strong>Teen Angle</strong> account password. Please use the verification code below to set up a new password.
          </p>
          
          <div style="background-color: #FEF3C7; border: 1px solid #F59E0B; border-radius: 12px; padding: 30px; text-align: center; margin: 0 0 25px 0;">
            <span style="display: block; font-size: 12px; font-weight: 700; color: #B45309; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px;">
              Password Reset Code
            </span>
            <span style="display: block; font-size: 46px; font-weight: 800; color: #111827; letter-spacing: 12px; margin-left: 12px;">
              ${otp}
            </span>
          </div>
          
          <p style="font-size: 14px; color: #EF4444; text-align: center; font-weight: 600; margin: 0 0 35px 0;">
            &#8987; This code expires in 10 minutes.
          </p>
          
          <p style="font-size: 14px; line-height: 1.6; color: #6B7280; margin: 0; border-top: 1px solid #F3F4F6; padding-top: 25px;">
            If you did not request a password reset, please ignore this email or contact support if you have concerns. Your password will remain unchanged.
          </p>
        </div>
        
        <div style="background-color: #F9FAFB; padding: 24px 35px; text-align: center;">
          <p style="font-size: 13px; color: #9CA3AF; margin: 0 0 8px 0;">
            &copy; ${currentYear} Teen Angle. All rights reserved.
          </p>
          <p style="font-size: 12px; color: #D1D5DB; margin: 0;">
            This is an automated message, please do not reply.
          </p>
        </div>
        
      </div>
    </div>
  `;
};