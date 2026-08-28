import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
 firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'user' | 'admin',
    isVerified: boolean;
    otp?: string;
    otpExpire?: Date;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    googleId?: string;
}

const userSchema: Schema= new Schema(
    {
        firstName: {
             type: String,
              required: true
             },
        lastName: { 
            type: String,
             required: true
             },
        email: { 
            type: String,
             required: true,
              unique: true
             },
        password: { 
            type: String,
         },
        role: {
             type: String,
              enum: ['user', 'admin'],
               default: 'user' },
        isVerified: { 
            type: Boolean,
             default: false 
            },
        otp: {
             type: String
             },
        otpExpire: {
             type: Date 
            },
        resetPasswordToken: {
             type: String
             },
        resetPasswordExpire: {
             type: Date 
            },
        googleId: {
             type: String
             },


    },{
        timestamps: true
    }
)

export default mongoose.model<IUser>("User", userSchema);