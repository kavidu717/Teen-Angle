import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { sendEmail } from '../utils/sendEmail';
import { generateOtpEmailTemplate } from '../utils/emailTemplates';

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