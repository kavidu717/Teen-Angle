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