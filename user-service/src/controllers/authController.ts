import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { sendEmail } from '../utils/sendEmail';
import { generateOtpEmailTemplate, generateResetPasswordEmailTemplate } from '../utils/emailTemplates';
import jwt from 'jsonwebtoken';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'This email is already registered.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      otp,
      otpExpire
    });

    const emailSubject = 'Verify Your Account - YouShop';
    const emailBody = generateOtpEmailTemplate(firstName, otp);
    
    await sendEmail(user.email, emailSubject, emailBody);

    res.status(201).json({
      message: 'Registration successful! Please check your email for the OTP to verify your account.',
      userId: user._id
    });
    
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {

  try {

    const {email, otp} = req.body;

    const user = await User.findOne({ email });


    if (!user) {
      res
      .status(404).
      json
      ({
         message: 'User not found.'
         }
        );
      return;
    }

    if (user.isVerified) {
      res.
      status(400)
      .json(
        {
         message: 'User is already verified.' 
        }
      );
    }

    if (user.otp !== otp) {
      res.
      status(400).
      json(
        {
           message: 'Invalid OTP.'
           }
          );
    }
     
    if (user.otpExpire && user.otpExpire.getTime() < Date.now()) {
      res.
      status(400).
      json({
         message: 'OTP has expired. Please request a new one.' 
        });
      return;
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    res.
    status(200).
    json({
       message: 'OTP verified successfully. Your account is now verified.'
    });

  }catch (error) {
    console.error('OTP Verification Error:', error);
    res.
    status(500).
    json(
      {
       message: 'Internal server error.'
       }
      );
  }
}

export const loginUser = async (req: Request, res: Response): Promise<void> => {

  try{

    const { email, password } = req.body;

    const user = await User.findOne({ email})

    if (!user) {
      res.
      status(404).
      json(
        {
         message: 'invalid email or password.' 
        }
      );
      return;
    }

    if (!user.isVerified) {
      res.
      status(403).
      json(
        {
          message: 'User is not verified. Please verify your account first.'
    }
    );
  }

   const isMatch = await bcrypt.compare(password, user.password as string);

   if (!isMatch) {
    res.
    status(401).
    json(
      {
         message: 'invalid email or password.' 
        }
      );
    return;
   }

   const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '30d' }
    );

    res.
    status(200).
    json(
      {
        _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token
      }
    );

  }catch (error) {
    console.error('Login Error:', error);
    res.
    status(500).
    json(
      {
       message: 'Internal server error.'
       }
      );
  }
}

export const resendOtp = async (req: Request, res: Response): Promise<void> => {

  try{

    const { email } = req.body;

    const user = await User.findOne({ email})

    if (!user) {
      res.
      status(404).
      json(
        {
         message: 'User not found.' 
        }
      );
      return;
    }

    if (user.isVerified) {
      res.
      status(400).
      json(
        {
          message: 'User is already verified.'
        }
      );
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpire = otpExpire;

    await user.save();

    const emailSubject = 'Resend OTP - teen angle';
    const emailBody = generateOtpEmailTemplate(user.firstName, otp);

    await sendEmail(user.email, emailSubject, emailBody);

    res.
    status(200).
    json(
      {
        message: 'OTP resent successfully. Please check your email for the new OTP.'
      }
    );


  }catch (error) {
    console.error('Resend OTP Error:', error);
    res.
    status(500).
    json(
      {
       message: 'Internal server error.'
       }
      );
  }
}

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try{

      const { email } = req.body;

      const user = await User.findOne({ email})

      if (!user) {
        res.
        status(404).
        json(
          {
           message: 'User not found.' 
          }
        );
        return;
      }

      const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

      const resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpire = resetPasswordExpire;

      await user.save();

      const emailSubject = 'Reset Your Password - teen angle';

      const emailBody = generateResetPasswordEmailTemplate(user.firstName, resetToken);

      await sendEmail(user.email, emailSubject, emailBody);

      res.status(200)
      .json({ 
        message: 'Password reset code has been sent to your email.' 
      });


    }catch (error) {
        console.error('Forgot Password Error:', error);
        res.
        status(500).
        json(
          {
           message: 'Internal server error.'
           }
          );
      }
}

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try{

    const {email,otp, newPassword}= req.body;

    const user = await User.findOne({ email});

    if (!user) {
      res.
      status(404).
      json({ message: 'User not found.' });
      return;
    }

    if (user.resetPasswordToken !== otp) {
      res.
      status(400).
      json({ message: 'Invalid reset code.' });
      return;
    }

    if (user.resetPasswordExpire && user.resetPasswordExpire.getTime() < Date.now()) {

      res.
      status(400).
      json({ 
        message: 'Reset code has expired. Please request a new one.' 
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(newPassword, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.
    status(200).
    json({ 
      message: 'Password reset successful. You can now login with your new password.' 
    });

  }catch (error) {
    console.error('Reset Password Error:', error);
    res.
    status(500).
    json(
      {
        message: 'Internal server error.'
      }
      );
  }
}




